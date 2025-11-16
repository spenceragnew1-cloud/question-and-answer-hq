import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.proposed_question || !data.proposed_question.trim()) {
      return NextResponse.json(
        { error: 'Proposed question is required' },
        { status: 400 }
      );
    }

    if (!data.category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    const { data: idea, error } = await supabaseAdmin
      .from('hack_ideas')
      .insert({
        proposed_question: data.proposed_question.trim(),
        category: data.category,
        tags: data.tags || [],
        notes: data.notes?.trim() || null,
        priority: data.priority || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating idea:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create idea' },
        { status: 400 }
      );
    }

    return NextResponse.json({ idea });
  } catch (error: any) {
    console.error('Error in /api/ideas/create:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

