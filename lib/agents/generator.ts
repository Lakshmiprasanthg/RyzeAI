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

Your ONLY job is to convert a structured plan into valid React/TypeScript code.

CRITICAL RULES:
1. You MUST use ONLY the provided component library
2. You CANNOT create new components
3. You CANNOT use inline styles (no style={{ }})
4. You CANNOT use external UI libraries
5. You CANNOT generate custom CSS or arbitrary Tailwind classes
6. All components already have fixed styling - just use their props

The component library is already imported. Use these imports:
${COMPONENT_IMPORTS}

Your output MUST be:
1. A valid React functional component
2. Using TypeScript
3. Using ONLY the allowed components
4. Properly formatted and readable
5. Starting with 'use client' directive if needed for interactivity

Output ONLY the component code, nothing else. No explanations, no markdown, just the code.`;

const GENERATOR_PROMPT_TEMPLATE = (plan: PlannerOutput) => {
  return `Generate a React component based on this plan:

INTENT: ${plan.intent}
LAYOUT: ${plan.layout}

COMPONENTS TO USE:
${plan.components.map((c, i) => `${i + 1}. ${c.name} - ${c.purpose}
   Props: ${JSON.stringify(c.props, null, 2)}`).join('\n\n')}

STRUCTURE:
${plan.structure}

Generate the complete React component code. Make it functional and well-structured.
The component should be named "GeneratedUI".

Remember:
- Use 'use client' at the top if there's any interactivity
- Import React
- Use proper TypeScript types
- Handle state if needed with useState
- Make it responsive where appropriate`;
};

const MODIFICATION_PROMPT_TEMPLATE = (existingCode: string, modificationRequest: string, plan: PlannerOutput) => {
  return `You need to MODIFY existing React code based on a user's request.

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
3. Do NOT rewrite the entire component unless explicitly requested
4. Maintain the same structure and component hierarchy where possible
5. Use ONLY the allowed component library
6. NO inline styles or custom CSS

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
