import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';

interface EmptyStatePopupProps {
  onClose: () => void;
}

export function EmptyStatePopup({ onClose }: EmptyStatePopupProps) {
  const { setView } = useStore();

  const handleStartProject = () => {
    setView('home');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg glass rounded-2xl shadow-xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-4">
            Create Your First Project
          </h2>

          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Start by asking a question or using one of our templates to generate insights about your market.
          </p>

          <button
            onClick={handleStartProject}
            className="w-full flex items-center justify-center px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Start a New Project
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}