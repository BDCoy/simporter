"use client"

import React, { useState } from 'react';

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  details?: string;
}

interface TaskListProps {
  tasks: Task[];
  title?: string;
  collapsible?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  title = "Tasks", 
  collapsible = true 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'in-progress':
        return (
          <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white border rounded-md shadow-sm mb-4">
      <div 
        className={`flex justify-between items-center px-4 py-3 border-b ${
          collapsible ? 'cursor-pointer hover:bg-gray-50' : ''
        }`}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="font-medium">{title}</div>
        {collapsible && (
          <svg 
            className={`w-5 h-5 text-gray-500 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
      
      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {tasks.length === 0 ? (
            <div className="text-sm text-gray-500 italic">No tasks yet</div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  {getStatusIcon(task.status)}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${
                    task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {task.description}
                  </p>
                  {task.details && (
                    <p className="mt-1 text-xs text-gray-500">{task.details}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;