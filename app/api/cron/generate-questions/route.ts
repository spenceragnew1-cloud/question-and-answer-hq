import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateQuestionAnswer } from '@/lib/openai';
import { getCategoryById } from '@/lib/categories';

function normalizeCategory(raw?: string): string | undefined {
  if (!raw) return undefined;
  const normalized = raw.trim().toLowerCase();
  const mapping: Record<string, string> = {
    'productivity & work': 'productivity',
    productivity: 'productivity',
    'fitness & exercise': 'fitness_exercise',
    fitness: 'fitness_exercise',
    'relationships': 'relationships',
    'health & wellness': 'general_health',
    'general health': 'general_health',
    'nutrition & diet': 'nutrition',
    sleep: 'sleep',
    'home & cleaning': 'home_cleaning',
    cooking: 'cooking_food',
    'cooking & food': 'cooking_food',
    'money & finance': 'money_finance',
    mental: 'mental_health',
    'mental health & mindset': 'mental_health',
    'mental health': 'mental_health',
    'animals & wildlife': 'animals_wildlife',
    'education & learning': 'education_learning',
    geography: 'geography',
    history: 'history',
    'hobbies & diy': 'hobbies_diy',
    hobbies: 'hobbies_diy',
    miscellaneous: 'miscellaneous',
    'outdoor & nature': 'outdoor_nature',
    outdoor: 'outdoor_nature',
    nature: 'outdoor_nature',
    science: 'science',
    technology: 'science',
    travel: 'science',
  };

  return mapping[normalized] || normalized;
}

async function buildRelatedQuestionsBlock(
  categoryId: string,
  excludeSlug: string
): Promise<string> {
  const { data: candidates } = await supabaseAdmin
    .from('questions')
    .select('title, slug')
    .eq('category', categoryId)
    .neq('slug', excludeSlug)
    .order('created_at', { ascending: false })
    .limit(20);

  if (!candidates || candidates.length < 3) {
    return '';
  }

  const links = candidates.slice(0, 6);
  return [
    '\n\n## Related Questions',
    ...links.map((q) => `- [${q.title}](/questions/${q.slug})`),
  ].join('\n');
}
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

// Process questions asynchronously (called after returning 202)
async function processQuestions(
  selectedIdeas: any[],
  remaining: number,
  publishedToday: number
) {
  const results = [];
  let successfulCount = 0;
  const targetSuccessCount = remaining;

  // Step 4: Process each idea (stop early if we hit target)
  for (const idea of selectedIdeas) {
      // Early exit if we've reached today's target
      if (successfulCount >= targetSuccessCount) {
        console.log(
          `Reached target of ${targetSuccessCount} successful publishes. Stopping early.`
        );
        break;
      }
      try {
        console.log(`Processing idea ${idea.id}: ${idea.proposed_question}`);

        const normalizedCategory = normalizeCategory(idea.category);
        // Validate category ID
        const category = getCategoryById(normalizedCategory);
        if (!category) {
          console.error(`Invalid category "${idea.category}" for idea ${idea.id}. Marking as error.`);
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
            error: `Invalid category: ${idea.category}. Must be one of the valid category IDs.`,
          });
          continue;
        }

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
            category.id,
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

        // Check for duplicate question text (case-insensitive, exact match)
        const normalizedGeneratedQuestion = generated.question.toLowerCase().trim();
        const { data: allQuestions, error: duplicateError } = await supabaseAdmin
          .from('questions')
          .select('id, question');

        if (duplicateError) {
          console.error(
            `Error checking for duplicate question for idea ${idea.id}:`,
            duplicateError
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
            error: `Error checking duplicate: ${duplicateError instanceof Error ? duplicateError.message : String(duplicateError)}`,
          });
          continue;
        }

        const duplicateQuestion = (allQuestions || []).find(
          (q) => q.question.toLowerCase().trim() === normalizedGeneratedQuestion
        );

        if (duplicateQuestion) {
          console.log(
            `Duplicate question text detected for idea ${idea.id}. Question already exists. Marking as duplicate.`
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
            error: 'Duplicate question text detected',
            skipped: true,
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

        // Build related questions block and append to body
        const relatedQuestionsBlock = await buildRelatedQuestionsBlock(
          category.id,
          generated.slug
        );
        const baseBody = generated.body_markdown || '';
        const combinedBody = [baseBody, relatedQuestionsBlock]
          .filter(Boolean)
          .join('\n\n');

        // Prepare question data - use validated category ID
        const questionData = {
          slug: generated.slug,
          question: generated.question,
          short_answer: generated.short_answer || null,
          verdict: generated.verdict || null,
          category: category.id, // Use validated category ID
          summary: generated.summary || null,
          body_markdown: combinedBody || null,
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

        successfulCount++;
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
    const totalPublishedToday = publishedToday + successful;

    console.log(
      `Background processing complete: Processed ${results.length} ideas (${successful} successful, ${failed} failed). Total published today: ${totalPublishedToday}/${batchSize}`
    );
  } catch (error: any) {
    console.error('Background processing error:', error);
  }
}

export async function POST(request: NextRequest) {
  // Verify cron secret
  const cronSecret = request.headers.get('x-cron-secret');
  if (cronSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Step 0: Check how many questions were published today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { count: todayCount, error: countError } = await supabaseAdmin
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .gte('published_at', today.toISOString())
      .lt('published_at', tomorrow.toISOString());

    if (countError) {
      throw countError;
    }

    const publishedToday = todayCount || 0;
    const remaining = Math.max(0, batchSize - publishedToday);

    if (remaining === 0) {
      return NextResponse.json({
        message: `Already published ${publishedToday} questions today. Target of ${batchSize} reached.`,
        processed: 0,
        publishedToday,
        target: batchSize,
        skipped: true,
      });
    }

    console.log(
      `Published today: ${publishedToday}, Remaining to publish: ${remaining}`
    );

    // Step 1: Fetch a pool of new ideas
    const { data: pool, error: poolError } = await supabaseAdmin
      .from('ideas')
      .select('*')
      .eq('status', 'new')
      .limit(poolSize);

    if (poolError) {
      throw poolError;
    }

    if (!pool || pool.length === 0) {
      return NextResponse.json({
        message: 'No new ideas to process.',
        processed: 0,
        publishedToday,
        target: batchSize,
      });
    }

    // Step 2: Get all existing question texts and slugs for duplicate checking
    const { data: existingQuestions, error: existingError } = await supabaseAdmin
      .from('questions')
      .select('question, slug');

    if (existingError) {
      throw existingError;
    }

    const existingQuestionTexts = new Set(
      (existingQuestions || []).map((q) => q.question.toLowerCase().trim())
    );
    const existingSlugs = new Set((existingQuestions || []).map((q) => q.slug));

    // Step 3: Filter out ideas that would create duplicates
    const uniqueIdeas = pool.filter((idea) => {
      const normalizedText = idea.proposed_question.toLowerCase().trim();
      return !existingQuestionTexts.has(normalizedText);
    });

    if (uniqueIdeas.length === 0) {
      return NextResponse.json({
        message: 'No unique ideas available (all would be duplicates).',
        processed: 0,
        publishedToday,
        target: batchSize,
      });
    }

    // Step 4: Randomly shuffle and select only the remaining needed
    const shuffled = shuffle(uniqueIdeas);
    const selectedIdeas = shuffled.slice(0, remaining);

    if (selectedIdeas.length === 0) {
      return NextResponse.json({
        message: 'No new ideas to process.',
        processed: 0,
        batchSize,
      });
    }

    // Step 5: Immediately mark selected ideas as processing (bulk update)
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

    // Return 202 Accepted immediately and process in background
    // Don't await - let it run asynchronously
    processQuestions(selectedIdeas, remaining, publishedToday).catch((error) => {
      console.error('Background processing failed:', error);
    });

    return NextResponse.json(
      {
        message: `Started processing ${selectedIdeas.length} ideas. This will run in the background.`,
        processing: selectedIdeas.length,
        publishedToday,
        target: batchSize,
        status: 'accepted',
      },
      { status: 202 }
    );
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
