import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  timeLeft: number;
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onTimeSet: (minutes: number) => void;
}

const presetTimes = [
  { label: '25min', value: 25 },
  { label: '15min', value: 15 },
  { label: '5min', value: 5 }
];

export function TimerPopup({
  isOpen,
  onClose,
  timeLeft,
  isActive,
  onStart,
  onPause,
  onReset,
  onTimeSet
}: TimerPopupProps) {
  const [customMinutes, setCustomMinutes] = useState('25');

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(customMinutes);
    if (!isNaN(minutes) && minutes > 0) {
      onTimeSet(minutes);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      style={{ zIndex: 100 }}
      className="fixed top-20 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Pomodoro Timer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isActive ? 'Time to focus!' : 'Timer paused'}
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={onReset}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={isActive ? onPause : onStart}
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full",
              isActive
                ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                : "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
            )}
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            {presetTimes.map((preset) => (
              <button
                key={preset.value}
                onClick={() => onTimeSet(preset.value)}
                className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleCustomTimeSubmit} className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              className="w-20 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
            >
              Set Custom
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}