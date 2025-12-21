import { supabaseAdmin } from '../supabase';
import { generateQuestionAnswer } from '../openai';
import { getCategoryById } from '../categories';

function normalizeCategory(raw?: string): string | undefined {
  if (!raw) return undefined;
  const normalized = raw.trim().toLowerCase();
  const mapping: Record<string, string> = {
    'productivity & work': 'productivity',
    productivity: 'productivity',
    'fitness & exercise': 'fitness_exercise',
    fitness: 'fitness_exercise',
    relationships: 'relationships',
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
    .select('question, slug')
    .eq('category', categoryId)
    .neq('slug', excludeSlug)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(20);

  if (!candidates || candidates.length < 3) {
    return '';
  }

  const links = candidates.slice(0, 6);
  return [
    '\n\n## Related Questions',
    ...links.map((q) => `- [${q.question}](/questions/${q.slug})`),
  ].join('\n');
}

/**
 * Shuffle array using random sort
 */
function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export interface GenerateDailyQuestionsOptions {
  batchSize?: number;
  poolSize?: number;
  dryRun?: boolean;
}

export interface GenerateDailyQuestionsResult {
  publishedToday: number;
  remaining: number;
  attempted: number;
  successful: number;
  failed: number;
  duplicates: number;
  errors: number;
  createdSlugs: string[];
  summary: string;
}

/**
 * Generate daily questions from ideas pool
 */
export async function generateDailyQuestions(
  options: GenerateDailyQuestionsOptions = {}
): Promise<GenerateDailyQuestionsResult> {
  const { batchSize = 5, poolSize = 50, dryRun = false } = options;

  console.log(
    `Starting daily question generation (batchSize=${batchSize}, poolSize=${poolSize}, dryRun=${dryRun})`
  );

  // Step 0: Check how many questions were published today (using UTC for consistency)
  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
      0
    )
  );
  const tomorrowUTC = new Date(todayUTC);
  tomorrowUTC.setUTCDate(tomorrowUTC.getUTCDate() + 1);

  const { count: todayCount, error: countError } = await supabaseAdmin
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .gte('published_at', todayUTC.toISOString())
    .lt('published_at', tomorrowUTC.toISOString());

  if (countError) {
    throw new Error(`Failed to count published questions: ${countError.message}`);
  }

  const publishedToday = todayCount || 0;
  const remaining = Math.max(0, batchSize - publishedToday);

  console.log(
    `Published today: ${publishedToday}, Remaining to publish: ${remaining}`
  );

  if (remaining === 0) {
    return {
      publishedToday,
      remaining: 0,
      attempted: 0,
      successful: 0,
      failed: 0,
      duplicates: 0,
      errors: 0,
      createdSlugs: [],
      summary: `Already published ${publishedToday} questions today. Target of ${batchSize} reached.`,
    };
  }

  // Step 1: Fetch a pool of new ideas
  const { data: pool, error: poolError } = await supabaseAdmin
    .from('ideas')
    .select('*')
    .eq('status', 'new')
    .limit(poolSize);

  if (poolError) {
    throw new Error(`Failed to fetch ideas pool: ${poolError.message}`);
  }

  if (!pool || pool.length === 0) {
    return {
      publishedToday,
      remaining,
      attempted: 0,
      successful: 0,
      failed: 0,
      duplicates: 0,
      errors: 0,
      createdSlugs: [],
      summary: 'No new ideas to process.',
    };
  }

  console.log(`Found ${pool.length} ideas with status 'new'`);

  // Step 2: Get all existing question texts for duplicate checking (only fetch question field)
  const { data: existingQuestions, error: existingError } = await supabaseAdmin
    .from('questions')
    .select('question, slug');

  if (existingError) {
    throw new Error(
      `Failed to fetch existing questions: ${existingError.message}`
    );
  }

  const existingQuestionTexts = new Set(
    (existingQuestions || []).map((q) => q.question.toLowerCase().trim())
  );
  const existingSlugs = new Set((existingQuestions || []).map((q) => q.slug));

  // Step 3: Filter out ideas that would create duplicates based on proposed_question
  const uniqueIdeas = pool.filter((idea) => {
    const normalizedText = idea.proposed_question.toLowerCase().trim();
    return !existingQuestionTexts.has(normalizedText);
  });

  if (uniqueIdeas.length === 0) {
    return {
      publishedToday,
      remaining,
      attempted: 0,
      successful: 0,
      failed: 0,
      duplicates: 0,
      errors: 0,
      createdSlugs: [],
      summary: 'No unique ideas available (all would be duplicates).',
    };
  }

  console.log(
    `Filtered to ${uniqueIdeas.length} unique ideas (excluded ${
      pool.length - uniqueIdeas.length
    } duplicates)`
  );

  // Step 4: Randomly shuffle and select only the remaining needed
  const shuffled = shuffle(uniqueIdeas);
  const selectedIdeas = shuffled.slice(0, remaining);

  if (selectedIdeas.length === 0) {
    return {
      publishedToday,
      remaining,
      attempted: 0,
      successful: 0,
      failed: 0,
      duplicates: 0,
      errors: 0,
      createdSlugs: [],
      summary: 'No new ideas to process.',
    };
  }

  console.log(`Selected ${selectedIdeas.length} ideas to process`);

  if (dryRun) {
    return {
      publishedToday,
      remaining,
      attempted: selectedIdeas.length,
      successful: 0,
      failed: 0,
      duplicates: 0,
      errors: 0,
      createdSlugs: [],
      summary: `DRY RUN: Would process ${selectedIdeas.length} ideas.`,
    };
  }

  // Step 5: Mark selected ideas as processing (bulk update)
  const selectedIds = selectedIdeas.map((idea) => idea.id);

  const { error: updateError } = await supabaseAdmin
    .from('ideas')
    .update({
      status: 'processing',
      processing_started_at: new Date().toISOString(),
    })
    .in('id', selectedIds);

  if (updateError) {
    throw new Error(
      `Failed to mark ideas as processing: ${updateError.message}`
    );
  }

  console.log(`Marked ${selectedIds.length} ideas as processing`);

  // Step 6: Process each idea
  const results: Array<{
    ideaId: string;
    success: boolean;
    slug?: string;
    error?: string;
    skipped?: boolean;
  }> = [];

  let successfulCount = 0;
  const targetSuccessCount = remaining;

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
        console.error(
          `Invalid category "${idea.category}" for idea ${idea.id}. Marking as error.`
        );
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
      // Use ilike for case-insensitive pattern matching (exact match when no wildcards)
      const normalizedGeneratedQuestion = generated.question.toLowerCase().trim();
      // Escape special LIKE characters and use for exact match
      const escapedQuestion = normalizedGeneratedQuestion.replace(
        /[%_\\]/g,
        '\\$&'
      );
      const { data: duplicateQuestions, error: duplicateError } =
        await supabaseAdmin
          .from('questions')
          .select('id, question')
          .ilike('question', escapedQuestion);

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

        const errorMessage =
          typeof duplicateError === 'object' && 'message' in duplicateError
            ? duplicateError.message
            : String(duplicateError);
        results.push({
          ideaId: idea.id,
          success: false,
          error: `Error checking duplicate: ${errorMessage}`,
        });
        continue;
      }

      // Filter for exact match (ilike does case-insensitive, but we need exact trim match)
      const duplicateQuestion = (duplicateQuestions || []).find(
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
        status: 'published' as const,
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
        success: true,
        slug: question.slug,
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
  const failed = results.filter((r) => !r.success && !r.skipped).length;
  const duplicates = results.filter((r) => r.skipped).length;
  const errors = results.filter((r) => !r.success && !r.skipped).length;
  const createdSlugs = results
    .filter((r) => r.success && r.slug)
    .map((r) => r.slug!);

  const totalPublishedToday = publishedToday + successful;

  const summary = `Processed ${results.length} ideas (${successful} successful, ${failed} failed, ${duplicates} duplicates). Total published today: ${totalPublishedToday}/${batchSize}`;

  console.log(summary);

  return {
    publishedToday,
    remaining,
    attempted: results.length,
    successful,
    failed,
    duplicates,
    errors,
    createdSlugs,
    summary,
  };
}

