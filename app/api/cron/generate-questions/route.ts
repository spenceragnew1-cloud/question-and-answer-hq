import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateQuestionAnswer } from '@/lib/openai';
import { slugify } from '@/lib/slugify';

const CRON_SECRET = process.env.CRON_SECRET!;

export async function POST(request: NextRequest) {
  // Verify cron secret
  const cronSecret = request.headers.get('x-cron-secret');
  if (cronSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch up to 5 hack_ideas with status == 'new'
    const { data: ideas, error: ideasError } = await supabaseAdmin
      .from('hack_ideas')
      .select('*')
      .eq('status', 'new')
      .limit(5);

    if (ideasError) {
      throw ideasError;
    }

    if (!ideas || ideas.length === 0) {
      return NextResponse.json({
        message: 'No new ideas to process',
        processed: 0,
      });
    }

    const results = [];

    // Process each idea
    for (const idea of ideas) {
      try {
        // Generate answer using OpenAI
        const generated = await generateQuestionAnswer(
          idea.proposed_question,
          idea.category
        );

        // Create slug
        const slug = slugify(idea.proposed_question);

        // Insert into questions table
        const { data: question, error: questionError } = await supabaseAdmin
          .from('questions')
          .insert({
            slug,
            question: idea.proposed_question,
            short_answer: generated.short_answer,
            verdict: generated.verdict,
            category: idea.category,
            summary: generated.summary,
            body_markdown: generated.body_markdown,
            evidence_json: generated.evidence,
            tags: idea.tags || [],
            status: 'draft',
          })
          .select()
          .single();

        if (questionError) {
          console.error(`Error creating question for idea ${idea.id}:`, questionError);
          results.push({
            ideaId: idea.id,
            success: false,
            error: questionError.message,
          });
          continue;
        }

        // Update hack_ideas status to 'draft_generated'
        const { error: updateError } = await supabaseAdmin
          .from('hack_ideas')
          .update({ status: 'draft_generated' })
          .eq('id', idea.id);

        if (updateError) {
          console.error(`Error updating idea ${idea.id}:`, updateError);
        }

        results.push({
          ideaId: idea.id,
          questionId: question.id,
          success: true,
        });
      } catch (error: any) {
        console.error(`Error processing idea ${idea.id}:`, error);
        results.push({
          ideaId: idea.id,
          success: false,
          error: error.message || 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      message: `Processed ${results.length} ideas`,
      processed: results.filter((r) => r.success).length,
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

