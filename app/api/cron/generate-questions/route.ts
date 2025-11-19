import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateQuestionAnswer } from '@/lib/openai';

const CRON_SECRET = process.env.CRON_SECRET!;
const batchSize = 5;

/**
 * Normalize text for comparison (lowercase, remove punctuation, trim)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Check if two question texts are similar (content-based duplicate detection)
 * Returns true if questions are very similar (80%+ word overlap)
 */
function areQuestionsSimilar(question1: string, question2: string): boolean {
  const normalized1 = normalizeText(question1);
  const normalized2 = normalizeText(question2);
  
  // Exact match after normalization
  if (normalized1 === normalized2) {
    return true;
  }
  
  // Check word overlap
  const words1 = new Set(normalized1.split(/\s+/).filter(w => w.length > 2)); // Ignore short words
  const words2 = new Set(normalized2.split(/\s+/).filter(w => w.length > 2));
  
  if (words1.size === 0 || words2.size === 0) {
    return false;
  }
  
  // Count overlapping words
  let overlap = 0;
  for (const word of words1) {
    if (words2.has(word)) {
      overlap++;
    }
  }
  
  // Calculate similarity percentage
  const similarity = overlap / Math.max(words1.size, words2.size);
  
  // Consider similar if 80%+ word overlap
  return similarity >= 0.8;
}

/**
 * Check if a similar question already exists in the database
 */
async function checkForDuplicateQuestion(questionText: string): Promise<{ exists: boolean; existingQuestionId?: string }> {
  // Get all published questions
  const { data: existingQuestions, error } = await supabaseAdmin
    .from('questions')
    .select('id, question')
    .eq('status', 'published');
  
  if (error || !existingQuestions) {
    console.error('Error checking for duplicate questions:', error);
    return { exists: false };
  }
  
  // Check each existing question for similarity
  for (const existing of existingQuestions) {
    if (areQuestionsSimilar(questionText, existing.question)) {
      console.log(`Found similar question: "${existing.question}" (ID: ${existing.id})`);
      return { exists: true, existingQuestionId: existing.id };
    }
  }
  
  return { exists: false };
}

export async function POST(request: NextRequest) {
  // Verify cron secret
  const cronSecret = request.headers.get('x-cron-secret');
  if (cronSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // First, cleanup: Update ideas that have generated_question_id but wrong status
    // This fixes ideas that were processed but status wasn't updated properly
    // Note: This will fail silently if the column doesn't exist yet
    try {
      const { error: cleanupError } = await supabaseAdmin
        .from('ideas')
        .update({ status: 'generated' })
        .not('generated_question_id', 'is', null)
        .neq('status', 'generated');
      
      if (cleanupError) {
        // Column might not exist yet - log but continue
        if (cleanupError.message?.includes('does not exist') || cleanupError.message?.includes('column')) {
          console.warn('generated_question_id column does not exist yet. Please run the migration: database/migrations/add_generated_question_id.sql');
        } else {
          console.error('Error cleaning up idea statuses:', cleanupError);
        }
      } else {
        console.log('Cleaned up idea statuses for ideas with generated_question_id');
      }
    } catch (cleanupErr: any) {
      console.warn('Cleanup step skipped (column may not exist):', cleanupErr.message);
    }
    
    // Query ideas table with proper queue logic
    // Status = 'pending' OR 'new' (support both for backward compatibility)
    // Also include 'processing' that are older than 1 hour (stuck processing)
    // Exclude ideas that already have generated_question_id
    // Order by RANDOM() to ensure variety each day
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    // First, try to query with generated_question_id filter if column exists
    // We'll use a raw SQL query to handle the random ordering and null check properly
    let ideasQuery = supabaseAdmin
      .from('ideas')
      .select('*')
      .or(`status.in.(pending,new),and(status.eq.processing,updated_at.lt.${oneHourAgo})`)
      .is('generated_question_id', null)
      .limit(batchSize * 3); // Get more candidates for randomization
    
    const { data: allIdeas, error: ideasError } = await ideasQuery;
    
    // If the query failed due to missing column, fall back to code-based filtering
    let ideas = allIdeas || [];
    if (ideasError && (ideasError.message?.includes('does not exist') || ideasError.message?.includes('column'))) {
      console.warn('generated_question_id column does not exist. Using code-based filtering.');
      const { data: fallbackIdeas, error: fallbackError } = await supabaseAdmin
        .from('ideas')
        .select('*')
        .or(`status.in.(pending,new),and(status.eq.processing,updated_at.lt.${oneHourAgo})`)
        .limit(batchSize * 3);
      
      if (fallbackError) {
        throw fallbackError;
      }
      
      // Filter out ideas that already have generated_question_id
      ideas = (fallbackIdeas || []).filter((idea: any) => {
        return idea.generated_question_id === undefined || idea.generated_question_id === null;
      });
    } else if (ideasError) {
      throw ideasError;
    }
    
    // Randomize the selection to ensure variety each day
    // Shuffle array using Fisher-Yates algorithm
    for (let i = ideas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ideas[i], ideas[j]] = [ideas[j], ideas[i]];
    }
    
    // Take only the batchSize number of ideas
    ideas = ideas.slice(0, batchSize);

    if (!ideas || ideas.length === 0) {
      return NextResponse.json({
        message: 'No pending ideas to process',
        processed: 0,
        batchSize,
      });
    }

    const results = [];

    // Process each idea
    for (const idea of ideas) {
      try {
        console.log(`Processing idea ${idea.id}: ${idea.proposed_question}`);
        
        // Skip if this idea already has a generated question
        // Check if the property exists (column may not exist in DB yet)
        if (idea.generated_question_id !== undefined && idea.generated_question_id !== null) {
          console.log(`Idea ${idea.id} already has generated_question_id: ${idea.generated_question_id}. Skipping.`);
          
          // Update status to 'generated' if it's not already
          if (idea.status !== 'generated') {
            try {
              await supabaseAdmin
                .from('ideas')
                .update({ status: 'generated' })
                .eq('id', idea.id);
            } catch (updateErr: any) {
              console.warn('Could not update idea status (column may not exist):', updateErr.message);
            }
          }
          
          results.push({
            ideaId: idea.id,
            success: false,
            error: 'Idea already has a generated question',
            skipped: true,
          });
          continue;
        }
        
        // Mark as processing FIRST - this ensures the idea is marked as used immediately
        const { error: processingError } = await supabaseAdmin
          .from('ideas')
          .update({ status: 'processing' })
          .eq('id', idea.id);
        
        if (processingError) {
          console.error(`Error marking idea ${idea.id} as processing:`, processingError);
          // Continue anyway - we'll mark it as generated at the end
        }

        // Generate full question content using OpenAI
        console.log(`Calling OpenAI for idea ${idea.id}...`);
        // Parse tags from comma-separated string to array
        const ideaTags = typeof idea.tags === 'string' 
          ? idea.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
          : Array.isArray(idea.tags) 
            ? idea.tags 
            : [];
        
        let generated;
        try {
          generated = await generateQuestionAnswer(
            idea.proposed_question,
            idea.category,
            ideaTags,
            idea.notes || undefined
          );
          console.log(`OpenAI response received for idea ${idea.id}. Generated question: ${generated.question}`);
        } catch (openaiError: any) {
          console.error(`OpenAI error for idea ${idea.id}:`, openaiError);
          // Mark as failed and continue
          await supabaseAdmin
            .from('ideas')
            .update({
              status: 'failed',
              processed_at: new Date().toISOString(),
            })
            .eq('id', idea.id);
          
          results.push({
            ideaId: idea.id,
            success: false,
            error: `OpenAI error: ${openaiError.message || 'Unknown error'}`,
          });
          continue;
        }

        // Content-based duplicate detection: Check if a similar question already exists
        const duplicateCheck = await checkForDuplicateQuestion(generated.question);
        if (duplicateCheck.exists) {
          console.log(`Duplicate question detected for idea ${idea.id}. Similar question already exists (ID: ${duplicateCheck.existingQuestionId}). Marking as generated.`);
          
          // ALWAYS mark idea as generated when duplicate is found - this marks it as used
          const duplicateUpdateData: any = {
            status: 'generated',
            processed_at: new Date().toISOString(),
          };
          
          if (duplicateCheck.existingQuestionId) {
            duplicateUpdateData.generated_question_id = duplicateCheck.existingQuestionId;
          }
          
          const { error: duplicateUpdateError } = await supabaseAdmin
            .from('ideas')
            .update(duplicateUpdateData)
            .eq('id', idea.id);
          
          // If error is about missing column, try update without it
          if (duplicateUpdateError && (duplicateUpdateError.message?.includes('does not exist') || duplicateUpdateError.message?.includes('column'))) {
            console.warn(`generated_question_id column doesn't exist. Updating status only for duplicate idea ${idea.id}`);
            const { error: fallbackError } = await supabaseAdmin
              .from('ideas')
              .update({
                status: 'generated',
                processed_at: new Date().toISOString(),
              })
              .eq('id', idea.id);
            
            if (fallbackError) {
              console.error(`Failed to update duplicate idea ${idea.id} even without column:`, fallbackError);
            } else {
              console.log(`Successfully marked duplicate idea ${idea.id} as generated`);
            }
          } else if (duplicateUpdateError) {
            console.error(`Error updating duplicate idea ${idea.id}:`, duplicateUpdateError);
            // Try one more time with just status
            await supabaseAdmin
              .from('ideas')
              .update({
                status: 'generated',
                processed_at: new Date().toISOString(),
              })
              .eq('id', idea.id);
          } else {
            console.log(`Successfully marked duplicate idea ${idea.id} as generated`);
          }
          
          results.push({
            ideaId: idea.id,
            success: false,
            error: 'Duplicate question detected - similar question already exists',
            skipped: true,
            duplicateOf: duplicateCheck.existingQuestionId,
            markedAsUsed: true,
          });
          continue;
        }

        // Check if a question with this slug already exists
        let finalSlug = generated.slug;
        const { data: existingQuestion } = await supabaseAdmin
          .from('questions')
          .select('id, slug')
          .eq('slug', finalSlug)
          .maybeSingle(); // Use maybeSingle() to return null if not found instead of throwing
        
        // If slug exists, append a number to make it unique
        if (existingQuestion) {
          console.log(`Slug ${finalSlug} already exists. Generating unique slug...`);
          let counter = 2; // Start at 2 since the original slug is "1"
          let uniqueSlug = `${finalSlug}-${counter}`;
          
          while (true) {
            const { data: check } = await supabaseAdmin
              .from('questions')
              .select('id')
              .eq('slug', uniqueSlug)
              .maybeSingle();
            
            if (!check) {
              finalSlug = uniqueSlug;
              break;
            }
            
            counter++;
            // Use the original slug as base, not the modified one
            uniqueSlug = `${generated.slug}-${counter}`;
            
            // Safety check to prevent infinite loop
            if (counter > 100) {
              throw new Error('Could not generate unique slug after 100 attempts');
            }
          }
          
          console.log(`Using unique slug: ${finalSlug}`);
        }

        // Prepare question data
        const questionData = {
          slug: finalSlug,
          question: generated.question,
          short_answer: generated.short_answer || null,
          verdict: generated.verdict || null,
          category: idea.category,
          summary: generated.summary || null,
          body_markdown: generated.body_markdown || null,
          evidence_json: generated.evidence || null,
          tags: generated.tags.length > 0 ? generated.tags : ideaTags,
          sources: generated.sources || [],
          status: 'published',
          published_at: new Date().toISOString(),
        };

        console.log(`Inserting question for idea ${idea.id} with slug: ${questionData.slug}`);

        // Insert into questions table (auto-publish)
        const { data: question, error: questionError } = await supabaseAdmin
          .from('questions')
          .insert(questionData)
          .select()
          .single();

        if (questionError) {
          console.error(`Error creating question for idea ${idea.id}:`, questionError);
          console.error(`Question data that failed:`, JSON.stringify(questionData, null, 2));
          
          // Mark as failed
          await supabaseAdmin
            .from('ideas')
            .update({
              status: 'failed',
              processed_at: new Date().toISOString(),
            })
            .eq('id', idea.id);

          results.push({
            ideaId: idea.id,
            success: false,
            error: questionError.message,
            details: questionError,
          });
          continue;
        }

        console.log(`Successfully created question ${question.id} for idea ${idea.id}`);

        // ALWAYS update ideas status to 'generated' - this marks it as used
        // Try to update with generated_question_id, fallback to status only if column doesn't exist
        const updateData: any = {
          status: 'generated',
          processed_at: new Date().toISOString(),
        };
        
        // Only include generated_question_id if we can (column might not exist)
        try {
          updateData.generated_question_id = question.id;
        } catch (e) {
          // Column doesn't exist - continue without it
        }
        
        const { error: updateError } = await supabaseAdmin
          .from('ideas')
          .update(updateData)
          .eq('id', idea.id);

        if (updateError) {
          // If error is about missing column, try update without it
          if (updateError.message?.includes('does not exist') || updateError.message?.includes('column')) {
            console.warn(`generated_question_id column doesn't exist. Updating status only for idea ${idea.id}`);
            const { error: fallbackError } = await supabaseAdmin
              .from('ideas')
              .update({
                status: 'generated',
                processed_at: new Date().toISOString(),
              })
              .eq('id', idea.id);
            
            if (fallbackError) {
              console.error(`Failed to update idea ${idea.id} even without column:`, fallbackError);
            } else {
              console.log(`Successfully marked idea ${idea.id} as generated (without column)`);
            }
          } else {
            console.error(`Error updating idea ${idea.id}:`, updateError);
            // Try one more time with just status to ensure it's marked
            await supabaseAdmin
              .from('ideas')
              .update({
                status: 'generated',
                processed_at: new Date().toISOString(),
              })
              .eq('id', idea.id);
          }
        } else {
          console.log(`Successfully marked idea ${idea.id} as generated with question ${question.id}`);
        }

        results.push({
          ideaId: idea.id,
          questionId: question.id,
          slug: question.slug,
          success: true,
        });
      } catch (error: any) {
        console.error(`Error processing idea ${idea.id}:`, error);
        
        // Mark as failed
        const { error: updateErr } = await supabaseAdmin
          .from('ideas')
          .update({
            status: 'failed',
            processed_at: new Date().toISOString(),
          })
          .eq('id', idea.id);
        
        if (updateErr) {
          console.error(`Error marking idea ${idea.id} as failed:`, updateErr);
        }

        results.push({
          ideaId: idea.id,
          success: false,
          error: error.message || 'Unknown error',
        });
      }
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      message: `Processed ${results.length} ideas (${successful} successful, ${failed} failed)`,
      processed: successful,
      failed,
      batchSize,
      results,
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

