'use client';

import React, { useEffect, useState } from 'react';
import * as Babel from '@babel/standalone';

interface PreviewSandboxProps {
  code: string;
}

const PreviewSandbox: React.FC<PreviewSandboxProps> = ({ code }) => {
  const [error, setError] = useState<string | null>(null);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (!code) {
      setComponent(null);
      setError(null);
      return;
    }

    try {
      // Transform the code using Babel
      const transformed = Babel.transform(code, {
        presets: ['react', 'typescript'],
        filename: 'GeneratedUI.tsx',
      }).code;

      // Create a function to evaluate the code
      const evalCode = new Function(
        'React',
        'Button',
        'Card',
        'Input',
        'Table',
        'Modal',
        'Sidebar',
        'Navbar',
        'Chart',
        `
        ${transformed}
        return GeneratedUI;
        `
      );

      // Import components dynamically
      const ButtonModule = require('@/components/ui/Button').default;
      const CardModule = require('@/components/ui/Card').default;
      const InputModule = require('@/components/ui/Input').default;
      const TableModule = require('@/components/ui/Table').default;
      const ModalModule = require('@/components/ui/Modal').default;
      const SidebarModule = require('@/components/ui/Sidebar').default;
      const NavbarModule = require('@/components/ui/Navbar').default;
      const ChartModule = require('@/components/ui/Chart').default;

      // Execute the code
      const GeneratedComponent = evalCode(
        React,
        ButtonModule,
        CardModule,
        InputModule,
        TableModule,
        ModalModule,
        SidebarModule,
        NavbarModule,
        ChartModule
      );

      setComponent(() => GeneratedComponent);
      setError(null);
    } catch (err: any) {
      console.error('Preview error:', err);
      setError(err.message || 'Failed to render preview');
      setComponent(null);
    }
  }, [code]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold mb-2">Preview Error</h3>
            <p className="text-red-700 text-sm font-mono">{error}</p>
          </div>
        ) : Component ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Component />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p>No preview yet</p>
              <p className="text-sm mt-2">Generate a UI to see the preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewSandbox;
