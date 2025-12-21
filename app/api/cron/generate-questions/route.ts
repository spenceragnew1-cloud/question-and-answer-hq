import { NextRequest, NextResponse } from 'next/server';
import { generateDailyQuestions } from '@/lib/generator/generateDailyQuestions';

const CRON_SECRET = process.env.CRON_SECRET!;

export async function POST(request: NextRequest) {
  // Verify cron secret
  const cronSecret = request.headers.get('x-cron-secret');
  if (cronSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await generateDailyQuestions({
      batchSize: 5,
      poolSize: 50,
      dryRun: false,
    });

    // Return 200 with results instead of 202 for background processing
    return NextResponse.json({
      message: result.summary,
      ...result,
      status: 'completed',
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
