import { COMPONENT_IMPORTS } from '../component-whitelist';
import { PlannerOutput, LayoutNode } from './planner';

export interface GeneratorOutput {
  code: string;
  componentName: string;
}

/**
 * GENERATOR - Pure Recursive Renderer
 * Converts layoutTree to JSX code deterministically
 * No AI, no interpretation, just tree traversal
 */

/**
 * Convert props object to JSX prop string
 */
function propsToJSX(props?: Record<string, any>): string {
  if (!props || Object.keys(props).length === 0) return '';
  
  return Object.entries(props)
    .map(([key, value]) => {
      // Handle different value types
      if (typeof value === 'string') {
        // Handle special case for 'children' prop as text
        if (key === 'children') {
          return null; // Children will be handled separately
        }
        return `${key}="${value}"`;
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        return `${key}={${value}}`;
      } else if (Array.isArray(value) || typeof value === 'object') {
        return `${key}={${JSON.stringify(value)}}`;
      }
      return null;
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Pure recursive renderer: converts tree node to JSX string
 */
function renderNode(node: LayoutNode, indent: string = '    '): string {
  const { type, props, children } = node;
  
  // Get text content from children prop if it exists
  const textChild = props?.children;
  const hasTextChild = typeof textChild === 'string';
  
  // Get props string (excluding children if it's text)
  const propsWithoutTextChildren = props ? { ...props } : {};
  if (hasTextChild) delete propsWithoutTextChildren.children;
  const propsStr = propsToJSX(propsWithoutTextChildren);
  
  // Self-closing tag if no children and no text content
  if (!children && !hasTextChild) {
    return `<${type}${propsStr ? ' ' + propsStr : ''} />`;
  }
  
  // Opening tag
  let jsx = `<${type}${propsStr ? ' ' + propsStr : ''}>`;
  
  // Add text content if exists
  if (hasTextChild) {
    jsx += textChild;
  }
  
  // Recursively render children nodes
  if (children && children.length > 0) {
    jsx += '\n';
    children.forEach(child => {
      jsx += indent + '  ' + renderNode(child, indent + '  ') + '\n';
    });
    jsx += indent;
  }
  
  // Closing tag
  jsx += `</${type}>`;
  
  return jsx;
}

/**
 * Generate component imports based on components used in tree
 */
function getUsedComponents(node: LayoutNode): Set<string> {
  const components = new Set<string>();
  
  function traverse(n: LayoutNode) {
    components.add(n.type);
    if (n.children) {
      n.children.forEach(traverse);
    }
  }
  
  traverse(node);
  return components;
}

/**
 * Execute the Generator - Pure deterministic tree to code conversion
 */
export async function executeGenerator(
  plan: PlannerOutput
): Promise<{ success: boolean; output?: GeneratorOutput; error?: string }> {
  try {
    // Get used components
    const usedComponents = getUsedComponents(plan.layoutTree);
    
    // Generate imports for used components only
    const imports = Array.from(usedComponents)
      .map(comp => `import ${comp} from '@/components/ui/${comp}';`)
      .join('\n');
    
    // Render the tree
    const jsxBody = renderNode(plan.layoutTree, '    ');
    
    // Generate complete component code
    const code = `${imports}

export default function GeneratedUI() {
  return (
    ${jsxBody}
  );
}`;
    
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
 * Execute the Generator for modification
 * For tree-based approach, we just regenerate from the new plan
 */
export async function executeGeneratorForModification(
  existingCode: string,
  modificationRequest: string,
  plan: PlannerOutput
): Promise<{ success: boolean; output?: GeneratorOutput; error?: string }> {
  // With tree-based approach, modification is just regeneration
  return executeGenerator(plan);
}
