'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, readOnly = false }) => {
  return (
    <div className="h-full bg-gray-900">
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Generated Code</h2>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Copy Code
        </button>
      </div>
      <Editor
        height="calc(100% - 57px)"
        defaultLanguage="typescript"
        value={code}
        onChange={(value) => onChange?.(value || '')}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor;
