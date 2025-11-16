import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { enhanceMarkdown } from '@/lib/enhance-markdown';

export async function POST(request: NextRequest) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { questionId, dryRun = false } = body;

    // If specific question ID provided, enhance just that one
    if (questionId) {
      const { data: question, error: fetchError } = await supabaseAdmin
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .eq('status', 'published')
        .single();

      if (fetchError || !question) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        );
      }

      if (!question.body_markdown) {
        return NextResponse.json(
          { error: 'Question has no body_markdown content' },
          { status: 400 }
        );
      }

      const evidence = (question.evidence_json as
        | Array<{ title: string; url: string; explanation: string }>
        | null) || [];
      const sources = (question.sources as string[]) || [];

      const enhanced = await enhanceMarkdown({
        currentMarkdown: question.body_markdown,
        question: question.question,
        evidence,
        sources,
      });

      if (dryRun) {
        return NextResponse.json({
          success: true,
          dryRun: true,
          questionId: question.id,
          original: question.body_markdown,
          enhanced,
        });
      }

      const { error: updateError } = await supabaseAdmin
        .from('questions')
        .update({ body_markdown: enhanced })
        .eq('id', questionId);

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        questionId: question.id,
        message: 'Article enhanced successfully',
      });
    }

    // Otherwise, enhance all published questions
    const { data: questions, error: fetchError } = await supabaseAdmin
      .from('questions')
      .select('*')
      .eq('status', 'published')
      .not('body_markdown', 'is', null);

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({
        message: 'No published questions found',
        processed: 0,
      });
    }

    const results = [];
    let processed = 0;
    let errors = 0;

    // Process questions in batches to avoid rate limits
    for (const question of questions) {
      try {
        if (!question.body_markdown) {
          results.push({
            questionId: question.id,
            slug: question.slug,
            success: false,
            error: 'No body_markdown content',
          });
          errors++;
          continue;
        }

        const evidence = (question.evidence_json as
          | Array<{ title: string; url: string; explanation: string }>
          | null) || [];
        const sources = (question.sources as string[]) || [];

        const enhanced = await enhanceMarkdown({
          currentMarkdown: question.body_markdown,
          question: question.question,
          evidence,
          sources,
        });

        if (dryRun) {
          results.push({
            questionId: question.id,
            slug: question.slug,
            success: true,
            dryRun: true,
            originalLength: question.body_markdown.length,
            enhancedLength: enhanced.length,
          });
        } else {
          const { error: updateError } = await supabaseAdmin
            .from('questions')
            .update({ body_markdown: enhanced })
            .eq('id', question.id);

          if (updateError) {
            results.push({
              questionId: question.id,
              slug: question.slug,
              success: false,
              error: updateError.message,
            });
            errors++;
          } else {
            results.push({
              questionId: question.id,
              slug: question.slug,
              success: true,
            });
            processed++;
          }
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`Error enhancing question ${question.id}:`, error);
        results.push({
          questionId: question.id,
          slug: question.slug,
          success: false,
          error: error.message || 'Unknown error',
        });
        errors++;
      }
    }

    return NextResponse.json({
      message: dryRun
        ? `Dry run completed for ${questions.length} questions`
        : `Enhanced ${processed} questions${errors > 0 ? `, ${errors} errors` : ''}`,
      total: questions.length,
      processed: dryRun ? questions.length : processed,
      errors,
      results,
    });
  } catch (error: any) {
    console.error('Enhance articles error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

