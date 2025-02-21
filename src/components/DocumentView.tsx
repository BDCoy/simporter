import React from 'react';
import { marked } from 'marked';

interface DocumentViewProps {
  content?: string;
}

export function DocumentView({ content }: DocumentViewProps) {
  if (!content) {
    return (
      <div className="h-full p-6">
        <div className="text-gray-500 dark:text-gray-400 text-center">
          No document content available
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-auto">
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: marked(content) }}
      />
    </div>
  );
}