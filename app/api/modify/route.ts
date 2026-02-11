import { NextRequest, NextResponse } from 'next/server';
import { orchestrateModification } from '@/lib/agents/orchestrator';
import { versionStore } from '@/lib/version-store';
import { sanitizeUserInput } from '@/lib/validators/component-validator';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userIntent, currentVersionId } = body;

    if (!userIntent || typeof userIntent !== 'string') {
      return NextResponse.json(
        { error: 'User intent is required' },
        { status: 400 }
      );
    }

    // Get the current version
    const currentVersion = currentVersionId
      ? versionStore.getVersion(currentVersionId)
      : versionStore.getLatestVersion();

    if (!currentVersion) {
      return NextResponse.json(
        { error: 'No existing version found to modify' },
        { status: 404 }
      );
    }

    // Sanitize input
    const sanitizedIntent = sanitizeUserInput(userIntent);

    // Orchestrate the modification
    const result = await orchestrateModification(
      sanitizedIntent,
      currentVersion.code,
      currentVersion.plan
    );

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Modification failed',
          details: result.errors,
        },
        { status: 500 }
      );
    }

    // Store the modified version
    const version = versionStore.addVersion(
      sanitizedIntent,
      result.plan!,
      result.code!,
      result.explanation,
      true,
      currentVersion.id
    );

    return NextResponse.json({
      success: true,
      version: {
        id: version.id,
        code: version.code,
        explanation: version.explanation,
        plan: version.plan,
      },
      warnings: result.warnings,
    });
  } catch (error: any) {
    console.error('Modify API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
