/**
 * Simple code differ to detect changes between versions
 */

export interface DiffResult {
  hasChanges: boolean;
  additions: number;
  deletions: number;
  changes: Array<{
    type: 'add' | 'remove' | 'modify';
    line: number;
    content: string;
  }>;
}

/**
 * Compare two code strings and return differences
 */
export function diffCode(oldCode: string, newCode: string): DiffResult {
  const oldLines = oldCode.split('\n');
  const newLines = newCode.split('\n');
  
  const changes: DiffResult['changes'] = [];
  let additions = 0;
  let deletions = 0;

  const maxLines = Math.max(oldLines.length, newLines.length);

  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === undefined && newLine !== undefined) {
      // Addition
      changes.push({
        type: 'add',
        line: i + 1,
        content: newLine,
      });
      additions++;
    } else if (oldLine !== undefined && newLine === undefined) {
      // Deletion
      changes.push({
        type: 'remove',
        line: i + 1,
        content: oldLine,
      });
      deletions++;
    } else if (oldLine !== newLine) {
      // Modification
      changes.push({
        type: 'modify',
        line: i + 1,
        content: newLine,
      });
    }
  }

  return {
    hasChanges: changes.length > 0,
    additions,
    deletions,
    changes,
  };
}

/**
 * Get a summary of what changed between versions
 */
export function getChangeSummary(oldCode: string, newCode: string): string {
  const diff = diffCode(oldCode, newCode);

  if (!diff.hasChanges) {
    return 'No changes detected';
  }

  const parts: string[] = [];

  if (diff.additions > 0) {
    parts.push(`${diff.additions} line${diff.additions > 1 ? 's' : ''} added`);
  }

  if (diff.deletions > 0) {
    parts.push(`${diff.deletions} line${diff.deletions > 1 ? 's' : ''} removed`);
  }

  const modifications = diff.changes.filter(c => c.type === 'modify').length;
  if (modifications > 0) {
    parts.push(`${modifications} line${modifications > 1 ? 's' : ''} modified`);
  }

  return parts.join(', ');
}
