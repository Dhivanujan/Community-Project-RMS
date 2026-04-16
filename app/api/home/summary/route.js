import { NextResponse } from 'next/server';
import { getHomepageSummary } from '@/lib/home/summary';

export async function GET() {
  try {
    const summary = await getHomepageSummary();
    return NextResponse.json({ success: true, data: summary }, { status: 200 });
  } catch (error) {
    console.error('Homepage summary API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to load homepage summary data.',
      },
      { status: 503 }
    );
  }
}
