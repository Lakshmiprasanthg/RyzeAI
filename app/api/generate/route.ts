import { NextRequest, NextResponse } from 'next/server';
import { orchestrateGeneration } from '@/lib/agents/orchestrator';
import { versionStore } from '@/lib/version-store';
import { sanitizeUserInput } from '@/lib/validators/component-validator';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userIntent } = body;

    if (!userIntent || typeof userIntent !== 'string') {
      return NextResponse.json(
        { error: 'User intent is required' },
        { status: 400 }
      );
    }

    // Sanitize input to prevent prompt injection
    const sanitizedIntent = sanitizeUserInput(userIntent);

    // Orchestrate the generation through all three agents
    const result = await orchestrateGeneration(sanitizedIntent);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Generation failed',
          details: result.errors,
        },
        { status: 500 }
      );
    }

    // Store the version
    const version = versionStore.addVersion(
      sanitizedIntent,
      result.plan!,
      result.code!,
      result.explanation,
      false
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
    console.error('Generate API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
