import { callGemini } from '../gemini-client';
import { ALLOWED_COMPONENTS, COMPONENT_SCHEMAS } from '../component-whitelist';

export interface PlannerOutput {
  intent: string;
  layout: string;
  components: Array<{
    name: string;
    purpose: string;
    props: Record<string, any>;
  }>;
  structure: string;
}

/**
 * PLANNER AGENT
 * Interprets user intent and creates a structured plan
 * This is the first step in the agent pipeline
 */

const PLANNER_SYSTEM_INSTRUCTION = `You are the Planner Agent in a UI generation system.

Your ONLY job is to interpret user intent and create a structured plan for building a UI.

CRITICAL CONSTRAINTS:
1. You can ONLY use these components: ${ALLOWED_COMPONENTS.join(', ')}
2. You CANNOT create new components
3. You CANNOT use external libraries
4. You CANNOT suggest inline styles or custom CSS

Available Components and Their Props:
${Object.entries(COMPONENT_SCHEMAS).map(([name, schema]) => 
  `${name}: ${schema.props.join(', ')}`
).join('\n')}

Your output MUST be valid JSON with this exact structure:
{
  "intent": "brief summary of what user wants",
  "layout": "description of the layout structure",
  "components": [
    {
      "name": "ComponentName",
      "purpose": "why this component is needed",
      "props": { "propName": "value" }
    }
  ],
  "structure": "hierarchical description of component arrangement"
}

Be specific about which components to use and their props.
Always think about responsive design and good UX.`;

const PLANNER_PROMPT_TEMPLATE = (userIntent: string, isModification: boolean, existingPlan?: string) => {
  if (isModification && existingPlan) {
    return `User wants to modify an existing UI.

EXISTING PLAN:
${existingPlan}

USER'S MODIFICATION REQUEST:
${userIntent}

Create an UPDATED plan that incorporates the requested changes while preserving unaffected parts.
Output the complete plan as JSON.`;
  }

  return `User's UI Request:
${userIntent}

Create a detailed plan for building this UI using ONLY the allowed components.
Output your plan as JSON.`;
};

/**
 * Execute the Planner Agent
 */
export async function executePlanner(
  userIntent: string,
  isModification: boolean = false,
  existingPlan?: string
): Promise<{ success: boolean; plan?: PlannerOutput; error?: string }> {
  try {
    const prompt = PLANNER_PROMPT_TEMPLATE(userIntent, isModification, existingPlan);
    
    const response = await callGemini(
      prompt,
      PLANNER_SYSTEM_INSTRUCTION,
      0.5 // Lower temperature for more deterministic planning
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Planner agent failed',
      };
    }

    // Extract JSON from response
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        error: 'Planner did not return valid JSON',
      };
    }

    const plan: PlannerOutput = JSON.parse(jsonMatch[0]);

    // Validate that only allowed components are used
    const invalidComponents = plan.components.filter(
      c => !ALLOWED_COMPONENTS.includes(c.name as any)
    );

    if (invalidComponents.length > 0) {
      return {
        success: false,
        error: `Planner used invalid components: ${invalidComponents.map(c => c.name).join(', ')}`,
      };
    }

    return {
      success: true,
      plan,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Planner execution failed',
    };
  }
}
