import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { id } = await params;

    // If status is being changed to published, set published_at
    if (data.status === 'published' && !data.published_at) {
      // Check if it was already published
      const { data: existing } = await supabaseAdmin
        .from('questions')
        .select('published_at')
        .eq('id', id)
        .single();

      if (!existing?.published_at) {
        data.published_at = new Date().toISOString();
      }
    }

    const { data: question, error } = await supabaseAdmin
      .from('questions')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ question });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

