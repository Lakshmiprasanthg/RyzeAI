import { NextRequest, NextResponse } from 'next/server';
import { versionStore } from '@/lib/version-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { versionId } = body;

    if (!versionId || typeof versionId !== 'string') {
      return NextResponse.json(
        { error: 'Version ID is required' },
        { status: 400 }
      );
    }

    const version = versionStore.rollbackToVersion(versionId);

    if (!version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      version: {
        id: version.id,
        code: version.code,
        explanation: version.explanation,
        plan: version.plan,
      },
    });
  } catch (error: any) {
    console.error('Rollback API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
