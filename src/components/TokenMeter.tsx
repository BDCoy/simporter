import React from 'react';
import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';

interface TokenMeterProps {
  tokensRemaining: number;
  maxTokens?: number;
}

export function TokenMeter({ tokensRemaining, maxTokens = 100000 }: TokenMeterProps) {
  const percentage = (tokensRemaining / maxTokens) * 100;
  
  const getTokenColor = (percentage: number) => {
    if (percentage > 70) return 'bg-emerald-500';
    if (percentage > 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="relative flex items-center space-x-3 group">
      <Cloud className="w-4 h-4 text-blue-600" />
      <div className="relative w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 ${getTokenColor(percentage)}`}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        {tokensRemaining.toLocaleString()}
      </motion.div>
      
      {/* Tooltip */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap">
          {percentage.toFixed(1)}% tokens remaining
        </div>
      </div>
    </div>
  );
}