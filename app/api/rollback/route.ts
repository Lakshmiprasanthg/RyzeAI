import { NextRequest, NextResponse } from 'next/server';
import { versionStore } from '@/lib/version-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { versionId } = body;

    console.log('🔄 Rollback requested for version:', versionId);

    if (!versionId || typeof versionId !== 'string') {
      console.error('❌ Invalid version ID');
      return NextResponse.json(
        { error: 'Version ID is required' },
        { status: 400 }
      );
    }

    // Check if version exists before rollback
    const currentVersions = versionStore.getAllVersions();
    console.log('📚 Current versions count:', currentVersions.length);
    console.log('📋 Version IDs:', currentVersions.map(v => v.id));

    const version = versionStore.rollbackToVersion(versionId);

    if (!version) {
      console.error('❌ Version not found:', versionId);
      return NextResponse.json(
        { error: 'Version not found. The version history may have been cleared.' },
        { status: 404 }
      );
    }

    console.log('✅ Rolled back to version:', version.id);

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
