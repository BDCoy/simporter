import React from 'react';
import { marked } from 'marked';

interface DataViewProps {
  data?: string;
}

export function DataView({ data }: DataViewProps) {
  if (!data) {
    return (
      <div className="h-full p-6">
        <div className="text-gray-500 dark:text-gray-400 text-center">
          No data to display
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-auto">
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: marked(data) }}
      />
    </div>
  );
}