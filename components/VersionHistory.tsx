'use client';

import React, { useState } from 'react';

interface VersionHistoryItem {
  id: string;
  timestamp: number;
  userIntent: string;
}

interface VersionHistoryProps {
  versions: VersionHistoryItem[];
  currentVersionId?: string;
  onRollback: (versionId: string) => void;
  onDelete: (versionId: string) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ versions, currentVersionId, onRollback, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRollback = (versionId: string) => {
    if (confirm('Rollback to this version?')) {
      setIsLoading(true);
      onRollback(versionId);
      setIsLoading(false);
    }
  };

  const handleDelete = (versionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Delete this version? This cannot be undone.')) {
      setIsLoading(true);
      onDelete(versionId);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">Versions ({versions.length})</h3>
        </div>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && versions.length > 0 && (
        <div className="px-3 pb-3 max-h-48 overflow-y-auto">
          <div className="space-y-2">
            {versions.map((item, index) => (
              <div
                key={item.id}
                className={`p-2 rounded border ${
                  item.id === currentVersionId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs font-semibold text-gray-900">
                        V{versions.length - index}
                      </span>
                      {item.id === currentVersionId && (
                        <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{item.userIntent}</p>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    {item.id !== currentVersionId && (
                      <button
                        onClick={() => handleRollback(item.id)}
                        disabled={isLoading}
                        className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300"
                        title="Rollback to this version"
                      >
                        ↩
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      disabled={isLoading}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
                      title="Delete this version"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionHistory;
