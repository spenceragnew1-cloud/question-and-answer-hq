import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Normalize text for comparison (same as in cron job)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Check if two texts are similar (same logic as cron job)
 */
function areQuestionsSimilar(question1: string, question2: string): boolean {
  const normalized1 = normalizeText(question1);
  const normalized2 = normalizeText(question2);
  
  if (normalized1 === normalized2) {
    return true;
  }
  
  const words1 = new Set(normalized1.split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(normalized2.split(/\s+/).filter(w => w.length > 2));
  
  if (words1.size === 0 || words2.size === 0) {
    return false;
  }
  
  let overlap = 0;
  for (const word of words1) {
    if (words2.has(word)) {
      overlap++;
    }
  }
  
  const similarity = overlap / Math.max(words1.size, words2.size);
  return similarity >= 0.8;
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all ideas with status 'new' or 'pending'
    const { data: ideas, error: ideasError } = await supabaseAdmin
      .from('ideas')
      .select('*')
      .in('status', ['new', 'pending'])
      .order('created_at', { ascending: true });

    if (ideasError) {
      throw ideasError;
    }

    if (!ideas || ideas.length === 0) {
      return NextResponse.json({
        message: 'No ideas with status "new" or "pending" found',
        updated: 0,
      });
    }

    // Get all published questions
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from('questions')
      .select('id, question, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: true });

    if (questionsError) {
      throw questionsError;
    }

    const results = [];
    let updatedCount = 0;

    // For each idea, check if a similar question exists
    for (const idea of ideas) {
      let matchedQuestion = null;
      
      // Check if any question matches this idea's proposed question
      if (questions && questions.length > 0) {
        for (const question of questions) {
          // Compare idea's proposed_question to question's question text
          if (areQuestionsSimilar(idea.proposed_question, question.question)) {
            matchedQuestion = question;
            break;
          }
        }
      }

      if (matchedQuestion) {
        // This idea has been processed - mark it as generated
        const updateData: any = {
          status: 'generated',
          processed_at: matchedQuestion.created_at || new Date().toISOString(),
        };

        // Try to include generated_question_id if column exists
        try {
          updateData.generated_question_id = matchedQuestion.id;
        } catch (e) {
          // Column doesn't exist - continue without it
        }

        const { error: updateError } = await supabaseAdmin
          .from('ideas')
          .update(updateData)
          .eq('id', idea.id);

        if (updateError) {
          // If error is about missing column, try without it
          if (updateError.message?.includes('does not exist') || updateError.message?.includes('column')) {
            const { error: fallbackError } = await supabaseAdmin
              .from('ideas')
              .update({
                status: 'generated',
                processed_at: matchedQuestion.created_at || new Date().toISOString(),
              })
              .eq('id', idea.id);

            if (!fallbackError) {
              updatedCount++;
              results.push({
                ideaId: idea.id,
                proposedQuestion: idea.proposed_question,
                matchedQuestion: matchedQuestion.question,
                matchedQuestionId: matchedQuestion.id,
                status: 'updated',
              });
            } else {
              results.push({
                ideaId: idea.id,
                proposedQuestion: idea.proposed_question,
                status: 'error',
                error: fallbackError.message,
              });
            }
          } else {
            results.push({
              ideaId: idea.id,
              proposedQuestion: idea.proposed_question,
              status: 'error',
              error: updateError.message,
            });
          }
        } else {
          updatedCount++;
          results.push({
            ideaId: idea.id,
            proposedQuestion: idea.proposed_question,
            matchedQuestion: matchedQuestion.question,
            matchedQuestionId: matchedQuestion.id,
            status: 'updated',
          });
        }
      } else {
        // No match found - idea hasn't been processed yet
        results.push({
          ideaId: idea.id,
          proposedQuestion: idea.proposed_question,
          status: 'no_match',
          message: 'No matching question found - idea not yet processed',
        });
      }
    }

    return NextResponse.json({
      message: `Cleanup complete. Updated ${updatedCount} of ${ideas.length} ideas.`,
      total: ideas.length,
      updated: updatedCount,
      notFound: ideas.length - updatedCount,
      results,
    });
  } catch (error: any) {
    console.error('Error in cleanup:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

