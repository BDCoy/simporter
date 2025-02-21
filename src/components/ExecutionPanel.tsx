import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
}

interface ExecutionPanelProps {
  tasks: Task[];
  logs: { message: string }[];
  isRunning: boolean;
  currentStep: number;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

export function ExecutionPanel({
  tasks,
  logs,
  isRunning,
  currentStep,
  onPause,
  onResume,
  onRestart
}: ExecutionPanelProps) {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium dark:text-white">Execution Progress</h2>
        <div className="flex items-center space-x-2">
          {isRunning ? (
            <button
              onClick={onPause}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Pause className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onResume}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Play className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onRestart}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={cn(
              "relative p-4 rounded-lg border",
              index === currentStep
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(task.status)}
                <span className="font-medium dark:text-white">{task.title}</span>
              </div>
              <span className="text-sm text-gray-500">{task.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  task.status === 'completed'
                    ? "bg-green-500"
                    : task.status === 'error'
                    ? "bg-red-500"
                    : "bg-blue-500"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${task.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 p-4 border-t border-gray-200 dark:border-gray-700 overflow-auto">
        <h3 className="text-sm font-medium mb-3 dark:text-white">Execution Logs</h3>
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div
              key={index}
              className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded"
            >
              {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}