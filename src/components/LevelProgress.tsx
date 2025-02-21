import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';

export function LevelProgress() {
  const { user, levels } = useStore();
  if (!user) return null;

  const currentLevel = levels.find(l => l.level === user.level);
  if (!currentLevel) return null;

  const progress = ((user.points - currentLevel.minPoints) / 
    (currentLevel.maxPoints - currentLevel.minPoints)) * 100;

  const nextLevel = levels.find(l => l.level === user.level + 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Level {currentLevel.level}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentLevel.title}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.points.toLocaleString()} points
          </p>
          {nextLevel && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Next level at {nextLevel.minPoints.toLocaleString()} points
            </p>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {currentLevel.perks.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Current Perks
          </h4>
          <div className="space-y-1">
            {currentLevel.perks.map((perk, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400"
              >
                <Star className="w-4 h-4 text-yellow-500 mr-2" />
                {perk}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}