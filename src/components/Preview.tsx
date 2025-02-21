import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { marked } from 'marked';
import type { Slide } from '@/lib/core/PresentationBuilder';

interface PreviewProps {
  code: string;
  isVisible: boolean;
  slides?: Slide[];
}

export function Preview({ code, isVisible, slides = [] }: PreviewProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="h-full overflow-auto p-6">
            {slides.length > 0 ? (
              <div className="space-y-8">
                {slides.map((slide, index) => (
                  <div key={slide.id} className="prose dark:prose-invert max-w-none">
                    <h2>{slide.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: slide.content }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No preview available
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}