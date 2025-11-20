import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateQuestionAnswer } from '@/lib/openai';

const CRON_SECRET = process.env.CRON_SECRET!;
const poolSize = 50;
const batchSize = 5;

/**
 * Shuffle array using random sort
 */
function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export async function POST(request: NextRequest) {
  // Verify cron secret
  const cronSecret = request.headers.get('x-cron-secret');
  if (cronSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Step 1: Fetch a pool of new ideas
    const { data: pool, error: poolError } = await supabaseAdmin
      .from('ideas')
      .select('*')
      .eq('status', 'new')
      .limit(poolSize);

    if (poolError) {
      throw poolError;
    }

    // Step 2: Randomly shuffle and select batchSize ideas
    const shuffled = shuffle(pool || []);
    const selectedIdeas = shuffled.slice(0, batchSize);

    if (selectedIdeas.length === 0) {
      return NextResponse.json({
        message: 'No new ideas to process.',
        processed: 0,
        batchSize,
      });
    }

    // Step 3: Immediately mark selected ideas as processing (bulk update)
    const selectedIds = selectedIdeas.map((idea) => idea.id);

    const { error: updateError } = await supabaseAdmin
      .from('ideas')
      .update({
        status: 'processing',
        processing_started_at: new Date().toISOString(),
      })
      .in('id', selectedIds);

    if (updateError) {
      console.error('Error marking ideas as processing:', updateError);
      return NextResponse.json(
        {
          error: 'Failed to mark ideas as processing',
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    console.log(`Marked ${selectedIds.length} ideas as processing`);

    const results = [];

    // Step 4: Process each idea
    for (const idea of selectedIdeas) {
      try {
        console.log(`Processing idea ${idea.id}: ${idea.proposed_question}`);

        // Parse tags from comma-separated string to array
        const ideaTags =
          typeof idea.tags === 'string'
            ? idea.tags
                .split(',')
                .map((t: string) => t.trim())
                .filter((t: string) => t.length > 0)
            : Array.isArray(idea.tags)
              ? idea.tags
              : [];

        // Generate full question content using OpenAI
        console.log(`Calling OpenAI for idea ${idea.id}...`);
        let generated;
        try {
          generated = await generateQuestionAnswer(
            idea.proposed_question,
            idea.category,
            ideaTags,
            idea.notes || undefined
          );
          console.log(
            `OpenAI response received for idea ${idea.id}. Generated question: ${generated.question}`
          );
        } catch (openaiError: any) {
          console.error(`OpenAI error for idea ${idea.id}:`, openaiError);
          // Mark as error and continue
          await supabaseAdmin
            .from('ideas')
            .update({
              status: 'error',
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

        // Check for slug collision in questions table
        const { data: existing, error: existingError } = await supabaseAdmin
          .from('questions')
          .select('id')
          .eq('slug', generated.slug)
          .maybeSingle();

        if (existingError) {
          console.error(
            `Error checking for existing slug for idea ${idea.id}:`,
            existingError
          );
          // Mark as error and continue
          await supabaseAdmin
            .from('ideas')
            .update({
              status: 'error',
              processed_at: new Date().toISOString(),
            })
            .eq('id', idea.id);

          results.push({
            ideaId: idea.id,
            success: false,
            error: `Error checking slug: ${existingError.message}`,
          });
          continue;
        }

        if (existing) {
          console.log(
            `Slug collision detected for idea ${idea.id}. Slug ${generated.slug} already exists. Marking as duplicate.`
          );
          // Mark as duplicate and skip
          await supabaseAdmin
            .from('ideas')
            .update({
              status: 'duplicate',
              processed_at: new Date().toISOString(),
            })
            .eq('id', idea.id);

          results.push({
            ideaId: idea.id,
            success: false,
            error: 'Duplicate slug detected',
            skipped: true,
          });
          continue;
        }

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
          tags: generated.tags.length > 0 ? generated.tags : ideaTags,
          sources: generated.sources || [],
          status: 'published',
          published_at: new Date().toISOString(),
        };

        console.log(
          `Inserting question for idea ${idea.id} with slug: ${questionData.slug}`
        );

        // Insert into questions table (auto-publish)
        const { data: question, error: questionError } = await supabaseAdmin
          .from('questions')
          .insert(questionData)
          .select()
          .single();

        if (questionError) {
          console.error(
            `Error creating question for idea ${idea.id}:`,
            questionError
          );
          console.error(
            `Question data that failed:`,
            JSON.stringify(questionData, null, 2)
          );

          // Mark as error
          await supabaseAdmin
            .from('ideas')
            .update({
              status: 'error',
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

        console.log(
          `Successfully created question ${question.id} for idea ${idea.id}`
        );

        // Update idea status to 'generated' with generated_question_id
        const { error: updateError } = await supabaseAdmin
          .from('ideas')
          .update({
            status: 'generated',
            generated_question_id: question.id,
            processed_at: new Date().toISOString(),
          })
          .eq('id', idea.id);

        if (updateError) {
          console.error(
            `Error updating idea ${idea.id} to generated:`,
            updateError
          );
          // Try one more time with just status to ensure it's marked
          await supabaseAdmin
            .from('ideas')
            .update({
              status: 'generated',
              processed_at: new Date().toISOString(),
            })
            .eq('id', idea.id);
        } else {
          console.log(
            `Successfully marked idea ${idea.id} as generated with question ${question.id}`
          );
        }

        results.push({
          ideaId: idea.id,
          questionId: question.id,
          slug: question.slug,
          success: true,
        });
      } catch (error: any) {
        console.error(`Error processing idea ${idea.id}:`, error);

        // Mark as error
        const { error: updateErr } = await supabaseAdmin
          .from('ideas')
          .update({
            status: 'error',
            processed_at: new Date().toISOString(),
          })
          .eq('id', idea.id);

        if (updateErr) {
          console.error(`Error marking idea ${idea.id} as error:`, updateErr);
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
