import { callGemini } from '../gemini-client';
import { COMPONENT_IMPORTS } from '../component-whitelist';
import { PlannerOutput } from './planner';

export interface GeneratorOutput {
  code: string;
  componentName: string;
}

/**
 * GENERATOR AGENT
 * Converts a plan into valid React code using ONLY allowed components
 * This is the second step in the agent pipeline
 */

const GENERATOR_SYSTEM_INSTRUCTION = `You are the Generator Agent in a UI generation system.

Your ONLY job is to convert a structured plan into STATIC JSX layout code.

CRITICAL RULES:
1. Output ONLY static JSX layout using provided components
2. Do NOT use useState, useEffect, or any React hooks
3. Do NOT use functions, handlers, or onClick events
4. Do NOT use inline styles (no style={{ }})
5. Do NOT import React
6. Only import allowed UI components
7. You CANNOT create new components
8. You CANNOT use external UI libraries
9. All components already have fixed styling - just use their props

The component library is already imported. Use these imports:
${COMPONENT_IMPORTS}

Your output MUST be a simple function that returns JSX:

export default function GeneratedUI() {
  return (
    <>
      {/* Your components here */}
    </>
  );
}

Output ONLY the component code, nothing else. No explanations, no markdown, just the code.
The UI should be PURELY PRESENTATIONAL - no interactivity, no state, no logic.`;

const GENERATOR_PROMPT_TEMPLATE = (plan: PlannerOutput) => {
  return `Generate a STATIC JSX layout based on this plan:

INTENT: ${plan.intent}
LAYOUT: ${plan.layout}

COMPONENTS TO USE:
${plan.components.map((c, i) => `${i + 1}. ${c.name} - ${c.purpose}
   Props: ${JSON.stringify(c.props, null, 2)}`).join('\n\n')}

STRUCTURE:
${plan.structure}

Generate ONLY a static JSX layout. The output must be:

export default function GeneratedUI() {
  return (
    <>
      {/* components arranged according to plan */}
    </>
  );
}

CRITICAL:
- NO useState, useEffect, or any hooks
- NO onClick, onChange, or any handlers
- NO functions or logic inside the component
- NO "import React"
- Only import the UI components you need
- Static props only (strings, numbers, arrays of static data)
- Make it visually structured and well-arranged`;
};

const MODIFICATION_PROMPT_TEMPLATE = (existingCode: string, modificationRequest: string, plan: PlannerOutput) => {
  return `You need to MODIFY existing STATIC JSX code based on a user's request.

EXISTING CODE:
\`\`\`tsx
${existingCode}
\`\`\`

USER'S MODIFICATION REQUEST:
${modificationRequest}

UPDATED PLAN:
${JSON.stringify(plan, null, 2)}

CRITICAL INSTRUCTIONS:
1. Modify ONLY the parts that need to change
2. Preserve all unaffected code exactly as is
3. Keep the same export default function GeneratedUI() format
4. Maintain STATIC JSX - NO hooks, NO handlers, NO functions
5. Use ONLY the allowed component library
6. NO inline styles or custom CSS
7. NO "import React"

Output the COMPLETE modified component code (including unchanged parts).`;
};

/**
 * Execute the Generator Agent for initial generation
 */
export async function executeGenerator(
  plan: PlannerOutput
): Promise<{ success: boolean; output?: GeneratorOutput; error?: string }> {
  try {
    const prompt = GENERATOR_PROMPT_TEMPLATE(plan);
    
    const response = await callGemini(
      prompt,
      GENERATOR_SYSTEM_INSTRUCTION,
      0.3 // Very low temperature for consistent code generation
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Generator agent failed',
      };
    }

    // Extract code from response (remove markdown code blocks if present)
    let code = response.text.trim();
    code = code.replace(/```tsx?\n?/g, '').replace(/```\n?/g, '');

    return {
      success: true,
      output: {
        code,
        componentName: 'GeneratedUI',
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Generator execution failed',
    };
  }
}

/**
 * Execute the Generator Agent for code modification
 */
export async function executeGeneratorForModification(
  existingCode: string,
  modificationRequest: string,
  plan: PlannerOutput
): Promise<{ success: boolean; output?: GeneratorOutput; error?: string }> {
  try {
    const prompt = MODIFICATION_PROMPT_TEMPLATE(existingCode, modificationRequest, plan);
    
    const response = await callGemini(
      prompt,
      GENERATOR_SYSTEM_INSTRUCTION,
      0.2 // Even lower temperature for modifications to maintain consistency
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Generator modification failed',
      };
    }

    // Extract code from response
    let code = response.text.trim();
    code = code.replace(/```tsx?\n?/g, '').replace(/```\n?/g, '');

    return {
      success: true,
      output: {
        code,
        componentName: 'GeneratedUI',
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Generator modification failed',
    };
  }
}
