import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Insert email into subscribers table
    const { error } = await supabase
      .from('subscribers')
      .insert({ email: email.toLowerCase().trim() });

    if (error) {
      // If email already exists, that's okay
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Already subscribed' });
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Subscribed successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

