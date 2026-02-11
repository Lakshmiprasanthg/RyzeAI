import { executePlanner, PlannerOutput } from './planner';
import { executeGenerator, executeGeneratorForModification, GeneratorOutput } from './generator';
import { executeExplainer, ExplanationOutput } from './explainer';
import { validateGeneratedCode } from '../validators/component-validator';

export interface GenerationResult {
  success: boolean;
  plan?: PlannerOutput;
  code?: string;
  explanation?: ExplanationOutput;
  errors?: string[];
  warnings?: string[];
}

/**
 * ORCHESTRATOR
 * Coordinates the execution of all three agents in sequence
 * Planner → Generator → Explainer
 */

/**
 * Orchestrate full UI generation from user intent
 */
export async function orchestrateGeneration(
  userIntent: string
): Promise<GenerationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Step 1: Execute Planner
    console.log('🎯 Executing Planner Agent...');
    const plannerResult = await executePlanner(userIntent, false);
    
    if (!plannerResult.success || !plannerResult.plan) {
      errors.push(`Planner failed: ${plannerResult.error}`);
      return { success: false, errors };
    }

    const plan = plannerResult.plan;
    console.log('✅ Planner completed');

    // Step 2: Execute Generator
    console.log('⚙️ Executing Generator Agent...');
    const generatorResult = await executeGenerator(plan);
    
    if (!generatorResult.success || !generatorResult.output) {
      errors.push(`Generator failed: ${generatorResult.error}`);
      return { success: false, plan, errors };
    }

    const code = generatorResult.output.code;
    console.log('✅ Generator completed');

    // Step 3: Validate generated code
    console.log('🔍 Validating generated code...');
    const validation = validateGeneratedCode(code);
    
    if (!validation.isValid) {
      errors.push(...validation.errors);
      return { success: false, plan, code, errors, warnings: validation.warnings };
    }
    
    warnings.push(...validation.warnings);
    console.log('✅ Validation passed');

    // Step 4: Execute Explainer
    console.log('📝 Executing Explainer Agent...');
    const explainerResult = await executeExplainer(plan, false);
    
    if (!explainerResult.success || !explainerResult.explanation) {
      // Explainer failure is not critical, continue with warning
      warnings.push(`Explainer failed: ${explainerResult.error}`);
    }

    console.log('✅ Explainer completed');

    return {
      success: true,
      plan,
      code,
      explanation: explainerResult.explanation,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error: any) {
    errors.push(`Orchestration failed: ${error.message}`);
    return { success: false, errors };
  }
}

/**
 * Orchestrate UI modification from user request
 */
export async function orchestrateModification(
  userIntent: string,
  existingCode: string,
  existingPlan: PlannerOutput
): Promise<GenerationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Step 1: Execute Planner for modification
    console.log('🎯 Executing Planner Agent for modification...');
    const plannerResult = await executePlanner(
      userIntent,
      true,
      JSON.stringify(existingPlan)
    );
    
    if (!plannerResult.success || !plannerResult.plan) {
      errors.push(`Planner failed: ${plannerResult.error}`);
      return { success: false, errors };
    }

    const plan = plannerResult.plan;
    console.log('✅ Planner completed');

    // Step 2: Execute Generator for modification
    console.log('⚙️ Executing Generator Agent for modification...');
    const generatorResult = await executeGeneratorForModification(
      existingCode,
      userIntent,
      plan
    );
    
    if (!generatorResult.success || !generatorResult.output) {
      errors.push(`Generator failed: ${generatorResult.error}`);
      return { success: false, plan, errors };
    }

    const code = generatorResult.output.code;
    console.log('✅ Generator completed');

    // Step 3: Validate modified code
    console.log('🔍 Validating modified code...');
    const validation = validateGeneratedCode(code);
    
    if (!validation.isValid) {
      errors.push(...validation.errors);
      return { success: false, plan, code, errors, warnings: validation.warnings };
    }
    
    warnings.push(...validation.warnings);
    console.log('✅ Validation passed');

    // Step 4: Execute Explainer for modification
    console.log('📝 Executing Explainer Agent for modification...');
    const explainerResult = await executeExplainer(plan, true, userIntent);
    
    if (!explainerResult.success || !explainerResult.explanation) {
      warnings.push(`Explainer failed: ${explainerResult.error}`);
    }

    console.log('✅ Explainer completed');

    return {
      success: true,
      plan,
      code,
      explanation: explainerResult.explanation,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error: any) {
    errors.push(`Orchestration failed: ${error.message}`);
    return { success: false, errors };
  }
}
