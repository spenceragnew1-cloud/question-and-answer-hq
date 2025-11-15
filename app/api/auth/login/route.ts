import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, setAdminSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (verifyAdminPassword(password)) {
      const response = NextResponse.json({ success: true });
      response.headers.set('Set-Cookie', setAdminSessionCookie());
      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

