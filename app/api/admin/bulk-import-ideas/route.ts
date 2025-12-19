import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ideas } = await request.json();

    if (!Array.isArray(ideas)) {
      return NextResponse.json(
        { error: 'ideas must be an array' },
        { status: 400 }
      );
    }

    // Validate and prepare ideas
    const validIdeas = ideas.map((idea: any) => ({
      proposed_question: idea.proposed_question?.trim() || '',
      category: idea.category || 'general_health',
      tags: Array.isArray(idea.tags) ? idea.tags : (idea.tags ? [idea.tags] : []),
      notes: idea.notes?.trim() || null,
      priority: idea.priority || null,
      status: 'pending',
    })).filter((idea: any) => idea.proposed_question.length > 0);

    if (validIdeas.length === 0) {
      return NextResponse.json(
        { error: 'No valid ideas to import' },
        { status: 400 }
      );
    }

    // Insert in batches to avoid overwhelming the database
    const batchSize = 50;
    const results = [];
    
    for (let i = 0; i < validIdeas.length; i += batchSize) {
      const batch = validIdeas.slice(i, i + batchSize);
      const { data, error } = await supabaseAdmin
        .from('ideas')
        .insert(batch)
        .select();

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        results.push({ batch: i / batchSize + 1, error: error.message });
      } else {
        results.push({ batch: i / batchSize + 1, inserted: data?.length || 0 });
      }
    }

    const totalInserted = results.reduce((sum, r) => sum + (r.inserted || 0), 0);

    return NextResponse.json({
      message: `Imported ${totalInserted} ideas`,
      total: validIdeas.length,
      inserted: totalInserted,
      results,
    });
  } catch (error: any) {
    console.error('Error in bulk import:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

