import { PlannerOutput } from './agents/planner';
import { ExplanationOutput } from './agents/explainer';

export interface GenerationVersion {
  id: string;
  timestamp: number;
  userIntent: string;
  plan: PlannerOutput;
  code: string;
  explanation?: ExplanationOutput;
  isModification: boolean;
  parentId?: string;
}

/**
 * In-memory version store
 * Stores all generations and modifications with their history
 */
class VersionStore {
  private versions: Map<string, GenerationVersion> = new Map();
  private sessionHistory: string[] = []; // Ordered list of version IDs

  /**
   * Add a new version
   */
  addVersion(
    userIntent: string,
    plan: PlannerOutput,
    code: string,
    explanation?: ExplanationOutput,
    isModification: boolean = false,
    parentId?: string
  ): GenerationVersion {
    const id = this.generateId();
    const version: GenerationVersion = {
      id,
      timestamp: Date.now(),
      userIntent,
      plan,
      code,
      explanation,
      isModification,
      parentId,
    };

    this.versions.set(id, version);
    this.sessionHistory.push(id);

    return version;
  }

  /**
   * Get a specific version by ID
   */
  getVersion(id: string): GenerationVersion | undefined {
    return this.versions.get(id);
  }

  /**
   * Get the latest version
   */
  getLatestVersion(): GenerationVersion | undefined {
    if (this.sessionHistory.length === 0) return undefined;
    const latestId = this.sessionHistory[this.sessionHistory.length - 1];
    return this.versions.get(latestId);
  }

  /**
   * Get all versions in chronological order
   */
  getAllVersions(): GenerationVersion[] {
    return this.sessionHistory.map(id => this.versions.get(id)!).filter(Boolean);
  }

  /**
   * Get version history with metadata
   */
  getHistory(): Array<{
    id: string;
    timestamp: number;
    userIntent: string;
    isModification: boolean;
  }> {
    return this.sessionHistory.map(id => {
      const version = this.versions.get(id)!;
      return {
        id: version.id,
        timestamp: version.timestamp,
        userIntent: version.userIntent,
        isModification: version.isModification,
      };
    });
  }

  /**
   * Rollback to a specific version
   * Returns the version and removes all versions after it
   */
  rollbackToVersion(id: string): GenerationVersion | undefined {
    const index = this.sessionHistory.indexOf(id);
    if (index === -1) return undefined;

    // Remove versions after the target
    const removedIds = this.sessionHistory.splice(index + 1);
    removedIds.forEach(removedId => this.versions.delete(removedId));

    return this.versions.get(id);
  }

  /**
   * Clear all versions
   */
  clear(): void {
    this.versions.clear();
    this.sessionHistory = [];
  }

  /**
   * Get the count of versions
   */
  getCount(): number {
    return this.sessionHistory.length;
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const versionStore = new VersionStore();
