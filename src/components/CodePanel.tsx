import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { Preview } from './Preview';
import { Code, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide } from '@/lib/core/PresentationBuilder';

interface Tab {
  id: 'code' | 'preview';
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: 'code', label: 'Code', icon: Code },
  { id: 'preview', label: 'Preview', icon: Eye },
];

export function CodePanel() {
  const [activeTab, setActiveTab] = useState<Tab['id']>('preview');
  const [code, setCode] = useState('');
  const [slides, setSlides] = useState<Slide[]>([]);

  return (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-sm dark:bg-gray-800/40 rounded-lg">
      {/* Tabs */}
      <div className="flex border-b border-gray-200/50 dark:border-gray-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'code' && (
          <CodeEditor
            value={code}
            onChange={(value) => setCode(value || '')}
            language="typescript"
          />
        )}
        {activeTab === 'preview' && (
          <Preview code={code} isVisible={activeTab === 'preview'} slides={slides} />
        )}
      </div>
    </div>
  );
}