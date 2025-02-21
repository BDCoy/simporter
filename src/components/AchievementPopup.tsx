import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementPopupProps {
  achievement: {
    title: string;
    description: string;
    icon: string;
    points: number;
  };
  onClose: () => void;
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-2xl">{achievement.icon}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Achievement Unlocked!
                  </h3>
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {achievement.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </p>
                <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                  +{achievement.points} points
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}