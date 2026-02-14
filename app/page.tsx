'use client';

import React, { useState, useEffect } from 'react';
import ChatPanel from '@/components/ChatPanel';
import CodeEditor from '@/components/CodeEditor';
import PreviewSandbox from '@/components/PreviewSandbox';
import ExplanationPanel from '@/components/ExplanationPanel';
import VersionHistory from '@/components/VersionHistory';
import ErrorBoundary from '@/components/ErrorBoundary';
import PlannerPanel from '@/components/PlannerPanel';
import { ExplanationOutput } from '@/lib/agents/explainer';
import { PlannerOutput } from '@/lib/agents/planner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface StoredVersion {
  id: string;
  timestamp: number;
  userIntent: string;
  plan: PlannerOutput;
  code: string;
  explanation?: ExplanationOutput;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentCode, setCurrentCode] = useState<string>('');
  const [currentPlan, setCurrentPlan] = useState<PlannerOutput | undefined>();
  const [currentExplanation, setCurrentExplanation] = useState<ExplanationOutput | undefined>();
  const [currentVersionId, setCurrentVersionId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [versionHistory, setVersionHistory] = useState<StoredVersion[]>([]);

  // Load versions from localStorage on mount (but don't auto-load latest)
  useEffect(() => {
    const saved = localStorage.getItem('ryzeai-versions');
    if (saved) {
      try {
        const versions = JSON.parse(saved);
        setVersionHistory(versions);
        // Don't auto-load latest - start fresh
      } catch (e) {
        console.error('Failed to load versions:', e);
      }
    }
  }, []);

  // Save to localStorage whenever versions change
  useEffect(() => {
    if (versionHistory.length > 0) {
      localStorage.setItem('ryzeai-versions', JSON.stringify(versionHistory));
    }
  }, [versionHistory]);

  const handleSendMessage = async (userMessage: string) => {
    // Add user message
    const userMsg: Message = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Always use generate - simpler and no 404 errors
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIntent: userMessage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Create new version
        const newVersion: StoredVersion = {
          id: `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          userIntent: userMessage,
          plan: data.version.plan,
          code: data.version.code,
          explanation: data.version.explanation,
        };

        // Add to history
        setVersionHistory(prev => [...prev, newVersion]);
        
        // Update current state
        setCurrentCode(newVersion.code);
        setCurrentPlan(newVersion.plan);
        setCurrentExplanation(newVersion.explanation);
        setCurrentVersionId(newVersion.id);

        // Add success message
        const assistantMsg: Message = {
          role: 'assistant',
          content: `✅ ${data.version.explanation?.summary || 'UI generated successfully'}`,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMsg]);

        // Show warnings if any
        if (data.warnings && data.warnings.length > 0) {
          const warningMsg: Message = {
            role: 'assistant',
            content: `⚠️ Warnings:\n${data.warnings.join('\n')}`,
            timestamp: Date.now(),
          };
          setMessages(prev => [...prev, warningMsg]);
        }
      } else {
        // Show error
        const errorMsg: Message = {
          role: 'assistant',
          content: `❌ Error: ${data.error}\n${data.details ? data.details.join('\n') : ''}`,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (error: any) {
      console.error('Request failed:', error);
      const errorMsg: Message = {
        role: 'assistant',
        content: `❌ Failed to generate UI: ${error.message}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRollback = (versionId: string) => {
    const version = versionHistory.find(v => v.id === versionId);
    if (!version) {
      alert('Version not found');
      return;
    }

    // Remove all versions after this one
    const index = versionHistory.findIndex(v => v.id === versionId);
    const newHistory = versionHistory.slice(0, index + 1);
    
    setVersionHistory(newHistory);
    setCurrentCode(version.code);
    setCurrentPlan(version.plan);
    setCurrentExplanation(version.explanation);
    setCurrentVersionId(version.id);

    // Add system message
    const systemMsg: Message = {
      role: 'assistant',
      content: '⏮️ Rolled back to previous version',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, systemMsg]);
  };

  const handleDeleteVersion = (versionId: string) => {
    // Filter out the deleted version
    const newHistory = versionHistory.filter(v => v.id !== versionId);
    setVersionHistory(newHistory);

    // If we deleted the current version, reset current state
    if (versionId === currentVersionId) {
      setCurrentCode('');
      setCurrentPlan(undefined);
      setCurrentExplanation(undefined);
      setCurrentVersionId(undefined);

      // Add system message
      const systemMsg: Message = {
        role: 'assistant',
        content: '🗑️ Deleted current version',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, systemMsg]);
    } else {
      // Add system message
      const systemMsg: Message = {
        role: 'assistant',
        content: '🗑️ Version deleted',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, systemMsg]);
    }
  };

  const handleRegenerate = async () => {
    if (messages.length === 0) return;

    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  return (
    <ErrorBoundary>
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI UI Generator</h1>
            <p className="text-sm text-gray-600">Deterministic Component System</p>
          </div>
          <div className="flex items-center space-x-3">
            {currentCode && (
              <button
                onClick={handleRegenerate}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 transition-colors"
              >
                🔄 Regenerate
              </button>
            )}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              📚 GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content - 4 Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-1/5 min-w-[280px] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ChatPanel
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              messages={messages}
            />
          </div>
          <div className="flex-shrink-0">
            <VersionHistory
              versions={versionHistory}
              currentVersionId={currentVersionId}
              onRollback={handleRollback}
              onDelete={handleDeleteVersion}
            />
          </div>
        </div>

        {/* Planner Panel - Structured Output */}
        <div className="w-1/5 min-w-[280px]">
          <PlannerPanel plan={currentPlan} />
        </div>

        {/* Code Editor Panel */}
        <div className="w-1/4 min-w-[320px]">
          <CodeEditor code={currentCode} readOnly={true} />
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <PreviewSandbox code={currentCode} />
          </div>
          <div className="flex-shrink-0 max-h-64 overflow-y-auto">
            <ExplanationPanel explanation={currentExplanation} />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span>
              <strong>Components:</strong> Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart, Stack, Center, Container
            </span>
          </div>
          <div>
            <span><strong>Panels:</strong> Chat | Planner | Code | Preview | Powered by Groq</span>
          </div>
        </div>
      </footer>
    </div>
    </ErrorBoundary>
  );
}
