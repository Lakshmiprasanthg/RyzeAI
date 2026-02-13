import { callGroq } from '../groq-client';
import { PlannerOutput } from './planner';

export interface ExplanationOutput {
  summary: string;
  decisions: Array<{
    decision: string;
    reasoning: string;
  }>;
  componentsUsed: string[];
}

/**
 * EXPLAINER AGENT
 * Explains AI decisions in plain English
 * This is the third step in the agent pipeline
 */

const EXPLAINER_SYSTEM_INSTRUCTION = `You are the Explainer Agent in a UI generation system.

Your ONLY job is to explain the decisions made during UI generation in clear, plain English.

You should explain:
1. Why specific components were chosen
2. How the layout was structured
3. What props were used and why
4. Any design or UX considerations

Write concisely but clearly. Use simple language.
Focus on the "why" behind each decision.

Output your explanation as JSON with this structure:
{
  "summary": "brief overall explanation",
  "decisions": [
    {
      "decision": "what was decided",
      "reasoning": "why it was decided"
    }
  ],
  "componentsUsed": ["Component1", "Component2"]
}`;

const EXPLAINER_PROMPT_TEMPLATE = (plan: PlannerOutput, isModification: boolean, modificationRequest?: string) => {
  if (isModification && modificationRequest) {
    return `Explain the modifications made to the UI.

MODIFICATION REQUEST:
${modificationRequest}

UPDATED PLAN:
${JSON.stringify(plan, null, 2)}

Explain:
- What changed and why
- Which components were affected
- Why these changes address the user's request
- Any trade-offs or design decisions made`;
  }

  return `Explain the UI generation decisions.

PLAN:
${JSON.stringify(plan, null, 2)}

Explain:
- Why each component was chosen
- How the layout addresses the user's intent
- Any notable design or UX decisions
- How the components work together`;
};

/**
 * Execute the Explainer Agent
 */
export async function executeExplainer(
  plan: PlannerOutput,
  isModification: boolean = false,
  modificationRequest?: string
): Promise<{ success: boolean; explanation?: ExplanationOutput; error?: string }> {
  try {
    const prompt = EXPLAINER_PROMPT_TEMPLATE(plan, isModification, modificationRequest);
    
    const response = await callGroq(
      prompt,
      EXPLAINER_SYSTEM_INSTRUCTION,
      0.6 // Moderate temperature for natural explanations
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Explainer agent failed',
      };
    }

    // Extract JSON from response
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        error: 'Explainer did not return valid JSON',
      };
    }

    const explanation: ExplanationOutput = JSON.parse(jsonMatch[0]);

    return {
      success: true,
      explanation,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Explainer execution failed',
    };
  }
}
