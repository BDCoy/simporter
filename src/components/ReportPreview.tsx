import React from 'react';
import { motion } from 'framer-motion';

interface ReportPreviewProps {
  slides: any[];
  documentContent: string;
  codeContent: string;
  isGenerating: boolean;
}

export function ReportPreview({
  slides,
  documentContent,
  codeContent,
  isGenerating
}: ReportPreviewProps) {
  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-lg p-4 overflow-auto">
      <h2 className="text-lg font-medium mb-4 dark:text-white">Report Preview</h2>
      
      {isGenerating ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      ) : slides.length > 0 ? (
        <div className="space-y-6">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <h3 className="text-lg font-medium mb-2 dark:text-white">{slide.title}</h3>
              <div className="prose dark:prose-invert">{slide.content}</div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No content to preview yet
        </div>
      )}
    </div>
  );
}