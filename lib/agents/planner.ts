import { callGroq } from '../groq-client';
import { ALLOWED_COMPONENTS, COMPONENT_SCHEMAS } from '../component-whitelist';

export interface LayoutNode {
  type: string;
  props?: Record<string, any>;
  children?: LayoutNode[];
}

export interface PlannerOutput {
  intent: string;
  layoutTree: LayoutNode;
}

/**
 * PLANNER AGENT
 * Interprets user intent and creates a structured plan
 * This is the first step in the agent pipeline
 */

const PLANNER_SYSTEM_INSTRUCTION = `You are the Planner Agent in a UI generation system.

Your ONLY job is to output a tree-based layout structure.

CRITICAL CONSTRAINTS:
1. You can ONLY use these components: ${ALLOWED_COMPONENTS.join(', ')}
2. NO event handlers: no onClick, onChange, onClose
3. NO function references
4. Output pure tree structure in JSON
5. NO English descriptions - pure data structure only

Available Components (without event handlers):
${Object.entries(COMPONENT_SCHEMAS).map(([name, schema]) => 
  `${name}: ${schema.props.filter(p => !p.includes('on') && !p.includes('On')).join(', ')}`
).join('\n')}

Your output MUST be valid JSON with this exact structure:
{
  "intent": "brief summary",
  "layoutTree": {
    "type": "ComponentName",
    "props": { "propName": "value" },
    "children": [
      { "type": "ChildComponent", "props": {...} }
    ]
  }
}

Tree structure rules:
- Root is always a layout component (Stack, Center, Container)
- Each node has: type, props (optional), children (optional)
- Leaf nodes are UI components (Button, Card, Input, etc.)
- NO onClick, onChange, onClose in props
- Props are static values only (strings, numbers, booleans, arrays of data)
- For Table: columns array MUST have objects with "key", "header", and optional "width"
- For Table: data array should have objects with properties matching column keys
- For Navbar/Sidebar: items array MUST have objects with "label" property
- For Modal: AVOID using Modal in static previews OR set "isOpen": false (Modal cannot be closed without event handlers)

Example:
{
  "intent": "user dashboard",
  "layoutTree": {
    "type": "Center",
    "children": [{
      "type": "Card",
      "props": { "title": "Dashboard" },
      "children": [{
        "type": "Stack",
        "props": { "gap": "md" },
        "children": [
          { "type": "Button", "props": { "children": "Click" } },
          { "type": "Input", "props": { "placeholder": "Enter text" } }
        ]
      }]
    }]
  }
}

Table example (CRITICAL - columns MUST have key property):
{
  "intent": "user list",
  "layoutTree": {
    "type": "Container",
    "children": [{
      "type": "Table",
      "props": {
        "columns": [
          {"key": "name", "header": "Name"},
          {"key": "email", "header": "Email"},
          {"key": "role", "header": "Role"}
        ],
        "data": [
          {"name": "John", "email": "john@example.com", "role": "Admin"},
          {"name": "Jane", "email": "jane@example.com", "role": "User"}
        ]
      }
    }]
  }
}`;

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
    
    const response = await callGroq(
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

    // Validate that only allowed components are used in tree
    function validateTree(node: LayoutNode): string[] {
      const invalid: string[] = [];
      if (!ALLOWED_COMPONENTS.includes(node.type as any)) {
        invalid.push(node.type);
      }
      if (node.children) {
        node.children.forEach(child => {
          invalid.push(...validateTree(child));
        });
      }
      return invalid;
    }

    const invalidComponents = validateTree(plan.layoutTree);

    if (invalidComponents.length > 0) {
      return {
        success: false,
        error: `Planner used invalid components: ${invalidComponents.join(', ')}`,
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
