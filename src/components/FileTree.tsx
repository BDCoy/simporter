import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  onSelect: (path: string) => void;
  selectedFile: string | null;
}

export function FileTree({ onSelect, selectedFile }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium dark:text-white">Project Files</h2>
      </div>
      <div className="flex-1 p-2 overflow-auto">
        {/* Add file tree content here */}
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center pt-4">
          No files yet
        </div>
      </div>
    </div>
  );
}