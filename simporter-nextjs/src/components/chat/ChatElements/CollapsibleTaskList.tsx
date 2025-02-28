"use client"

import React, { useState } from 'react';

export interface TaskStatus {
  id: string;
  title: string;
  status: 'success' | 'error' | 'pending' | 'in-progress';
  details?: string;
  command?: string;
}

interface CollapsibleTaskListProps {
  title: string;
  message: string;
  tasks: TaskStatus[];
  isCompleted?: boolean;
  numErrors?: number;
  onActionClick?: (taskId: string, action: string) => void;
}

export default function CollapsibleTaskList({
  title,
  message,
  tasks,
  isCompleted = false,
  numErrors = 0,
  onActionClick,
}: CollapsibleTaskListProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getStatusIcon = (status: TaskStatus['status']) => {
    switch (status) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'in-progress':
        return (
          <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getHeaderIcon = () => {
    if (numErrors > 0) {
      return (
        <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (isCompleted) {
      return (
        <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="bg-white dark:bg-[#2c2c2e] border border-[#e5e7eb] dark:border-[#3a3a3c] rounded-xl shadow-sm overflow-hidden mb-4">
      {/* Header */}
      <div className="p-4 bg-[#f8fafc] dark:bg-[#333336] flex items-start">
        <div className="mr-3 mt-0.5">
          {getHeaderIcon()}
        </div>
        <div className="flex-1">
          <p className="font-medium text-[#334155] dark:text-[#e5e7eb]">{message}</p>
        </div>
      </div>
      
      {/* Toggle button */}
      <div 
        className="px-4 py-3 border-t border-b border-[#e5e7eb] dark:border-[#3a3a3c] flex justify-between items-center cursor-pointer hover:bg-[#f8fafc] dark:hover:bg-[#333336] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium text-[#475569] dark:text-[#d4d4d8]">{numErrors > 0 ? `Hide problems` : title}</span>
          <span className="text-sm bg-[#f1f5f9] dark:bg-[#3a3a3c] text-[#64748b] dark:text-[#a1a1aa] px-2 py-0.5 rounded-full">{numErrors > 0 ? numErrors : tasks.length}</span>
        </div>
        <svg 
          className={`w-5 h-5 text-[#94a3b8] dark:text-[#71717a] transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* Task list */}
      {isExpanded && (
        <div className="divide-y divide-[#e5e7eb] dark:divide-[#3a3a3c]">
          {tasks.map((task) => (
            <div key={task.id} className="p-4">
              <div className="flex">
                <div className="mr-3 mt-0.5">
                  {getStatusIcon(task.status)}
                </div>
                <div className="flex-1">
                  <p className={`text-[#334155] dark:text-[#e5e7eb] ${task.status === 'error' ? 'text-[#ef4444] dark:text-[#f87171]' : ''}`}>
                    {task.title}
                  </p>
                  
                  {task.details && (
                    <p className="mt-1 text-sm text-[#64748b] dark:text-[#a1a1aa]">{task.details}</p>
                  )}
                  
                  {task.command && (
                    <div className="mt-2 bg-[#f1f5f9] dark:bg-[#3a3a3c] p-3 rounded-lg border border-[#e2e8f0] dark:border-[#4c4c4e]">
                      <code className="text-sm text-[#334155] dark:text-[#e5e7eb] font-mono">{task.command}</code>
                    </div>
                  )}
                  
                  {task.status === 'pending' && onActionClick && (
                    <div className="mt-3">
                      <button 
                        onClick={() => onActionClick(task.id, 'start')}
                        className="px-3 py-1.5 bg-[#3b82f6] text-white text-sm rounded-lg hover:bg-[#2563eb] transition-colors shadow-sm"
                      >
                        Start
                      </button>
                    </div>
                  )}
                </div>
                
                {(task.status === 'error' || task.details) && (
                  <button className="ml-2 text-[#94a3b8] dark:text-[#71717a] hover:text-[#64748b] dark:hover:text-[#d4d4d8]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}