'use client';

import React, { useState, useEffect } from 'react';

interface VersionHistoryItem {
  id: string;
  timestamp: number;
  userIntent: string;
  isModification: boolean;
}

interface VersionHistoryProps {
  currentVersionId?: string;
  onRollback: (versionId: string) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ currentVersionId, onRollback }) => {
  const [history, setHistory] = useState<VersionHistoryItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentVersionId]);

  const handleRollback = async (versionId: string) => {
    if (confirm('Are you sure you want to rollback to this version? All versions after this will be removed.')) {
      setIsLoading(true);
      try {
        onRollback(versionId);
        await fetchHistory();
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-t border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">Version History</h3>
          <span className="text-xs text-gray-500">({history.length})</span>
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
        <div className="px-4 pb-4 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border-2 ${
                  item.id === currentVersionId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-semibold text-gray-900">
                        Version {history.length - index}
                      </span>
                      {item.isModification && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Modified
                        </span>
                      )}
                      {item.id === currentVersionId && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{item.userIntent}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  
                  {item.id !== currentVersionId && (
                    <button
                      onClick={() => handleRollback(item.id)}
                      disabled={isLoading}
                      className="ml-2 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 transition-colors"
                    >
                      Rollback
                    </button>
                  )}
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
