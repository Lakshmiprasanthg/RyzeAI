'use client';

import React from 'react';
import { ExplanationOutput } from '@/lib/agents/explainer';

interface ExplanationPanelProps {
  explanation?: ExplanationOutput;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ explanation }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  if (!explanation) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-t border-blue-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">AI Explanation</h3>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          {/* Summary */}
          <div className="bg-white rounded-lg p-4 mb-3">
            <p className="text-sm text-gray-700">{explanation.summary}</p>
          </div>

          {/* Decisions */}
          {explanation.decisions && explanation.decisions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-600 uppercase">Design Decisions</h4>
              {explanation.decisions.map((decision, index) => (
                <div key={index} className="bg-white rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">{decision.decision}</p>
                  <p className="text-xs text-gray-600">{decision.reasoning}</p>
                </div>
              ))}
            </div>
          )}

          {/* Components Used */}
          {explanation.componentsUsed && explanation.componentsUsed.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">Components Used</h4>
              <div className="flex flex-wrap gap-2">
                {explanation.componentsUsed.map((component, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                  >
                    {component}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplanationPanel;
