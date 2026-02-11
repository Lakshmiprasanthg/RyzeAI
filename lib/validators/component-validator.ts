import { ALLOWED_COMPONENTS, COMPONENT_SCHEMAS } from '../component-whitelist';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates generated code against component whitelist
 * Ensures no prohibited patterns exist
 */
export function validateGeneratedCode(code: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check that code has the required wrapper function
  if (!code.includes('export default function GeneratedUI')) {
    errors.push('Code must have: export default function GeneratedUI() { return (...) }');
  }

  // Extract the function body (everything after the function declaration)
  const functionMatch = code.match(/export default function GeneratedUI\s*\(\s*\)\s*\{([\s\S]*)\}/);
  
  if (functionMatch) {
    const functionBody = functionMatch[1];

    // Check for prohibited patterns inside the function body
    if (functionBody.includes('useState') || functionBody.includes('useEffect') || functionBody.includes('useCallback') || functionBody.includes('useMemo') || functionBody.includes('useRef')) {
      errors.push('React hooks are prohibited inside the component. Only static JSX is allowed.');
    }

    if (functionBody.includes('=>') || functionBody.includes('function ')) {
      errors.push('Functions and arrow functions are prohibited inside the component. Only static JSX is allowed.');
    }

    if (functionBody.includes('onClick') || functionBody.includes('onChange') || functionBody.includes('onSubmit') || functionBody.includes('onFocus') || functionBody.includes('onBlur')) {
      errors.push('Event handlers are prohibited. Only static JSX is allowed.');
    }

    if (functionBody.includes('const ') || functionBody.includes('let ') || functionBody.includes('var ')) {
      errors.push('Variable declarations are prohibited inside the component. Only static JSX is allowed.');
    }

    if (functionBody.includes('console.')) {
      errors.push('Console statements are prohibited. Only static JSX is allowed.');
    }
  }

  // Check for prohibited React import
  if (code.includes('import React') || code.includes("import * as React")) {
    errors.push('Importing React is prohibited. Only import UI components.');
  }

  // Check for prohibited inline styles
  if (code.includes('style={{') || code.includes('style: {')) {
    errors.push('Inline styles are prohibited. Use only the fixed component library with predefined styling.');
  }

  // Check for prohibited CSS generation
  if (code.includes('className={`') && code.match(/\$\{[^}]*\}/)) {
    warnings.push('Dynamic className generation detected. Ensure only fixed Tailwind classes from components are used.');
  }

  // Check for attempts to create new components
  if (code.match(/const\s+\w+Component\s*=/i) || code.match(/function\s+\w+Component\s*\(/i)) {
    errors.push('Creating new components is prohibited. Use only the allowed component library.');
  }

  // Check for external UI library imports
  const prohibitedImports = ['@mui', '@chakra', 'antd', 'react-bootstrap', 'semantic-ui'];
  prohibitedImports.forEach(lib => {
    if (code.includes(`from '${lib}`) || code.includes(`from "${lib}`)) {
      errors.push(`External UI library '${lib}' is prohibited. Use only the fixed component library.`);
    }
  });

  // Validate that only allowed components are used in JSX
  // Match JSX opening tags: <ComponentName or <ComponentName>
  const componentPattern = /<([A-Z]\w+)(?:\s|>|\/)/g;
  const matchesArray = Array.from(code.matchAll(componentPattern));
  
  for (const match of matchesArray) {
    const componentName = match[1];
    
    // Skip React fragments and common React types
    if (componentName === 'Fragment' || componentName === 'React') continue;
    
    // Check if it's in whitelist
    if (!(ALLOWED_COMPONENTS as readonly string[]).includes(componentName)) {
      errors.push(`Component '${componentName}' is not in the allowed component list. Only ${ALLOWED_COMPONENTS.join(', ')} are permitted.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates component props against schema
 */
export function validateComponentProps(componentName: string, props: Record<string, any>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const schema = COMPONENT_SCHEMAS[componentName as keyof typeof COMPONENT_SCHEMAS];
  
  if (!schema) {
    errors.push(`Component '${componentName}' not found in schema.`);
    return { isValid: false, errors, warnings };
  }

  // Check required props
  schema.required.forEach(requiredProp => {
    if (!(requiredProp in props)) {
      errors.push(`Required prop '${requiredProp}' missing for component '${componentName}'.`);
    }
  });

  // Check for invalid props
  Object.keys(props).forEach(prop => {
    if (!(schema.props as readonly string[]).includes(prop)) {
      warnings.push(`Prop '${prop}' is not a valid prop for component '${componentName}'.`);
    }
  });

  // Validate variant values
  Object.entries(schema.variants).forEach(([variantProp, allowedValues]) => {
    if (props[variantProp] && !allowedValues.includes(props[variantProp])) {
      errors.push(`Invalid value '${props[variantProp]}' for prop '${variantProp}' in component '${componentName}'. Allowed values: ${allowedValues.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Sanitizes user input to prevent prompt injection
 */
export function sanitizeUserInput(input: string): string {
  // Remove potential prompt injection patterns
  let sanitized = input;
  
  // Remove system/instruction manipulation attempts
  const dangerousPatterns = [
    /ignore\s+(all\s+)?previous\s+instructions?/gi,
    /disregard\s+(all\s+)?previous\s+instructions?/gi,
    /forget\s+(all\s+)?previous\s+instructions?/gi,
    /system\s*:/gi,
    /assistant\s*:/gi,
    /<\|.*?\|>/g,
  ];
  
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[FILTERED]');
  });
  
  return sanitized;
}
