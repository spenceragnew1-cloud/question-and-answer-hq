import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateQuestionAnswer } from '@/lib/openai';

const CRON_SECRET = process.env.CRON_SECRET!;
const batchSize = 5;

export async function POST(request: NextRequest) {
  // Verify cron secret
  const cronSecret = request.headers.get('x-cron-secret');
  if (cronSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Query ideas table with proper queue logic
    // Status = 'pending' OR 'new' (support both for backward compatibility)
    // Order by created_at (oldest first)
    const { data: ideas, error: ideasError } = await supabaseAdmin
      .from('ideas')
      .select('*')
      .in('status', ['pending', 'new'])
      .order('created_at', { ascending: true })
      .limit(batchSize);

    if (ideasError) {
      throw ideasError;
    }

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
        
        // Mark as processing
        await supabaseAdmin
          .from('ideas')
          .update({ status: 'processing' })
          .eq('id', idea.id);

        // Generate full question content using OpenAI
        console.log(`Calling OpenAI for idea ${idea.id}...`);
        const generated = await generateQuestionAnswer(
          idea.proposed_question,
          idea.category,
          idea.tags || [],
          idea.notes || undefined
        );
        console.log(`OpenAI response received for idea ${idea.id}. Generated question: ${generated.question}`);

        // Prepare question data
        const questionData = {
          slug: generated.slug,
          question: generated.question,
          short_answer: generated.short_answer || null,
          verdict: generated.verdict || null,
          category: idea.category,
          summary: generated.summary || null,
          body_markdown: generated.body_markdown || null,
          evidence_json: generated.evidence || null,
          tags: generated.tags.length > 0 ? generated.tags : (idea.tags || []),
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

        // Update ideas status to 'generated'
        const { error: updateError } = await supabaseAdmin
          .from('ideas')
          .update({
            status: 'generated',
            processed_at: new Date().toISOString(),
            generated_question_id: question.id,
          })
          .eq('id', idea.id);

        if (updateError) {
          console.error(`Error updating idea ${idea.id}:`, updateError);
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
