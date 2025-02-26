"use client"

import React, { useState } from 'react';
import { TaskStatus } from './CollapsibleTaskList';
import ExecutionPanel from './ExecutionPanel';

interface ChatMessageWithTasksProps {
  message: string;
  timestamp: Date;
  isUser?: boolean;
  hasTaskList?: boolean;
  onTaskAction?: (taskId: string, action: string) => void;
  onCopy?: () => void;
  onPositiveFeedback?: () => void;
  onNegativeFeedback?: () => void;
  onRetry?: () => void;
}

export default function ChatMessageWithTasks({
  message,
  timestamp,
  isUser = false,
  hasTaskList = false,
  onTaskAction,
  onCopy,
  onPositiveFeedback,
  onNegativeFeedback,
  onRetry
}: ChatMessageWithTasksProps) {
  const [showActions, setShowActions] = useState(false);
  
  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => !isUser && setShowActions(true)}
      onMouseLeave={() => !isUser && setShowActions(false)}
    >
      {!isUser && (
        <div className="flex items-start mr-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
            AI
          </div>
        </div>
      )}
      
      <div className={`max-w-3xl rounded-2xl shadow-sm overflow-hidden ${
        isUser 
          ? 'bg-[#3b82f6] text-white' 
          : 'bg-white dark:bg-[#2c2c2e] border border-[#e5e7eb] dark:border-[#3a3a3c]'
      }`}>
        <div className={`p-4 ${isUser ? 'text-white' : 'text-[#334155] dark:text-[#e5e7eb]'}`}>
          <p className="text-base leading-relaxed">{message}</p>
          
          {hasTaskList && !isUser && (
            <div className="mt-4">
              <ExecutionPanel 
                initialMessage="Simporter has tried to resolve the problems."
                onTaskAction={onTaskAction}
              />
            </div>
          )}
          
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-xs ${isUser ? 'text-[#93c5fd]' : 'text-[#94a3b8] dark:text-[#71717a]'}`}>
              {formattedTime}
            </span>
            
            {!isUser && showActions && (
              <div className="flex space-x-1 items-center">
                {onCopy && (
                  <button 
                    onClick={onCopy}
                    className="p-1 text-[#64748b] dark:text-[#a1a1aa] hover:text-[#3b82f6] dark:hover:text-[#60a5fa] rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                )}
                
                {onPositiveFeedback && (
                  <button 
                    onClick={onPositiveFeedback}
                    className="p-1 text-[#64748b] dark:text-[#a1a1aa] hover:text-[#10b981] dark:hover:text-[#34d399] rounded transition-colors"
                    title="This was helpful"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </button>
                )}
                
                {onNegativeFeedback && (
                  <button 
                    onClick={onNegativeFeedback}
                    className="p-1 text-[#64748b] dark:text-[#a1a1aa] hover:text-[#ef4444] dark:hover:text-[#f87171] rounded transition-colors"
                    title="This wasn't helpful"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2" />
                    </svg>
                  </button>
                )}
                
                {onRetry && (
                  <button 
                    onClick={onRetry}
                    className="p-1 text-[#64748b] dark:text-[#a1a1aa] hover:text-[#3b82f6] dark:hover:text-[#60a5fa] rounded transition-colors"
                    title="Regenerate response"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isUser && (
        <div className="flex items-start ml-3">
          <div className="w-8 h-8 rounded-full bg-[#f1f5f9] dark:bg-[#3a3a3c] flex items-center justify-center text-[#64748b] dark:text-[#d4d4d8] font-medium text-sm border border-[#e2e8f0] dark:border-[#4c4c4e]">
            DH
          </div>
        </div>
      )}
    </div>
  );
}