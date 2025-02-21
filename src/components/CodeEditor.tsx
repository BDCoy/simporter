import React, { useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useStore } from '@/lib/store';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
}

export function CodeEditor({ value, onChange, language = 'typescript' }: CodeEditorProps) {
  const { darkMode } = useStore();
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    
    // Configure editor settings
    editor.updateOptions({
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      automaticLayout: true,
      padding: { top: 16, bottom: 16 },
    });
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={value}
      onChange={onChange}
      theme={darkMode ? 'vs-dark' : 'light'}
      onMount={handleEditorDidMount}
      options={{
        readOnly: false,
        wordWrap: 'on',
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: true,
        formatOnPaste: true,
        formatOnType: true,
      }}
    />
  );
}