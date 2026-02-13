import React from 'react';
import { PlannerOutput, LayoutNode } from '@/lib/agents/planner';

interface PlannerPanelProps {
  plan?: PlannerOutput;
}

/**
 * Recursively render tree structure
 */
const TreeNode: React.FC<{ node: LayoutNode; depth: number }> = ({ node, depth }) => {
  const indent = depth * 16;
  
  return (
    <div style={{ marginLeft: `${indent}px` }} className="my-1">
      <div className="bg-green-50 border border-green-200 rounded p-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-green-900">{node.type}</span>
          {Object.keys(node.props || {}).length > 0 && (
            <span className="text-xs text-gray-500">
              ({Object.keys(node.props || {}).length} props)
            </span>
          )}
        </div>
        
        {/* Show props */}
        {node.props && Object.keys(node.props).length > 0 && (
          <details className="mt-1">
            <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
              Props
            </summary>
            <pre className="text-xs bg-white rounded p-1 mt-1 overflow-x-auto border border-green-100">
              {JSON.stringify(node.props, null, 2)}
            </pre>
          </details>
        )}
      </div>
      
      {/* Render children recursively */}
      {node.children && node.children.length > 0 && (
        <div className="mt-1">
          {node.children.map((child, idx) => (
            <TreeNode key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const PlannerPanel: React.FC<PlannerPanelProps> = ({ plan }) => {
  if (!plan) {
    return (
      <div className="h-full bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">No plan generated yet</p>
          <p className="text-xs mt-1">Send a message to see the planner output</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Planner Output
        </h2>
        <p className="text-xs text-gray-600 mt-1">Structured plan from Planner Agent</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Intent */}
        <div>
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Intent</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-gray-800">{plan.intent}</p>
          </div>
        </div>

        {/* Layout Tree */}
        <div>
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Layout Tree
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <TreeNode node={plan.layoutTree} depth={0} />
          </div>
        </div>

        {/* Raw JSON */}
        <details className="group">
          <summary className="text-xs font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:text-gray-900">
            Raw JSON
            <span className="ml-2 text-gray-400 group-open:rotate-90 inline-block transition-transform">▶</span>
          </summary>
          <div className="mt-2 bg-gray-900 rounded-lg p-3 overflow-x-auto">
            <pre className="text-xs text-green-400 font-mono">
              {JSON.stringify(plan, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
};

export default PlannerPanel;
