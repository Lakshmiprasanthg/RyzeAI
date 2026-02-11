import { NextRequest, NextResponse } from 'next/server';
import { versionStore } from '@/lib/version-store';

export async function GET(request: NextRequest) {
  try {
    const history = versionStore.getHistory();

    return NextResponse.json({
      success: true,
      history,
      count: history.length,
    });
  } catch (error: any) {
    console.error('History API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
