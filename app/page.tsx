'use client';

import React, { useState } from 'react';
import ChatPanel from '@/components/ChatPanel';
import CodeEditor from '@/components/CodeEditor';
import PreviewSandbox from '@/components/PreviewSandbox';
import ExplanationPanel from '@/components/ExplanationPanel';
import VersionHistory from '@/components/VersionHistory';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ExplanationOutput } from '@/lib/agents/explainer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentCode, setCurrentCode] = useState<string>('');
  const [currentExplanation, setCurrentExplanation] = useState<ExplanationOutput | undefined>();
  const [currentVersionId, setCurrentVersionId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

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
      // Determine if this is a modification or new generation
      const isModification = currentCode.length > 0;
      const endpoint = isModification ? '/api/modify' : '/api/generate';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIntent: userMessage,
          currentVersionId: currentVersionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update code and explanation
        setCurrentCode(data.version.code);
        setCurrentExplanation(data.version.explanation);
        setCurrentVersionId(data.version.id);

        // Add assistant message
        const assistantMsg: Message = {
          role: 'assistant',
          content: isModification
            ? `I've modified the UI based on your request. ${data.version.explanation?.summary || ''}`
            : `I've generated your UI. ${data.version.explanation?.summary || ''}`,
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

  const handleRollback = async (versionId: string) => {
    try {
      const response = await fetch('/api/rollback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ versionId }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentCode(data.version.code);
        setCurrentExplanation(data.version.explanation);
        setCurrentVersionId(data.version.id);

        // Add system message
        const systemMsg: Message = {
          role: 'assistant',
          content: '⏮️ Rolled back to previous version',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, systemMsg]);
      }
    } catch (error) {
      console.error('Rollback failed:', error);
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

      {/* Main Content - 3 Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-1/4 min-w-[300px] flex flex-col">
          <ChatPanel
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            messages={messages}
          />
          <VersionHistory
            currentVersionId={currentVersionId}
            onRollback={handleRollback}
          />
        </div>

        {/* Middle Panel - Code Editor */}
        <div className="w-1/3 min-w-[400px]">
          <CodeEditor code={currentCode} readOnly={true} />
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <PreviewSandbox code={currentCode} />
          </div>
          <ExplanationPanel explanation={currentExplanation} />
        </div>
      </div>

      {/* Footer Info */}
      <footer className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span>
              <strong>Components:</strong> Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart
            </span>
          </div>
          <div>
            <span>Powered by Gemini 1.5 Pro</span>
          </div>
        </div>
      </footer>
    </div>
    </ErrorBoundary>
  );
}
