"use client"

import React, { useState } from 'react';
import CollapsibleTaskList, { TaskStatus } from './CollapsibleTaskList';

interface ExecutionPanelProps {
  initialMessage: string;
  onTaskAction?: (taskId: string, action: string) => void;
}

export default function ExecutionPanel({ initialMessage, onTaskAction }: ExecutionPanelProps) {
  // Example task lists - in a real app, these would be dynamically generated
  const [fixDependenciesTasks] = useState<TaskStatus[]>([
    { 
      id: 'update-package', 
      title: 'Update package.json', 
      status: 'success'
    },
    { 
      id: 'install-deps', 
      title: 'Install dependencies', 
      status: 'success',
      command: 'npm install'
    },
    { 
      id: 'update-tailwind', 
      title: 'Update tailwind.config.ts', 
      status: 'success' 
    },
    { 
      id: 'start-app', 
      title: 'Start application', 
      status: 'pending',
      command: 'npm run dev'
    }
  ]);

  const [errorTasks] = useState<TaskStatus[]>([
    { 
      id: 'err1', 
      title: 'Terminal error', 
      status: 'error',
      details: 'Cannot find module \'tailwindcss\' after installing it'
    },
    { 
      id: 'err2', 
      title: 'Terminal error', 
      status: 'error',
      details: 'Error: Cannot find module \'next\''
    },
    { 
      id: 'err3', 
      title: 'Terminal error', 
      status: 'error',
      details: 'Error in plugin \'tailwindcss\''
    },
    { 
      id: 'err4', 
      title: 'Terminal error', 
      status: 'error',
      details: 'PostCSS plugin tailwindcss requires PostCSS 8'
    }
  ]);
  
  const [changesMade] = useState<TaskStatus[]>([
    { 
      id: 'change1', 
      title: 'Added critters dependency to fix the build optimization error', 
      status: 'success' 
    },
    { 
      id: 'change2', 
      title: 'Removed tailwindcss-filters plugin since it\'s not needed and was causing errors', 
      status: 'success' 
    },
    { 
      id: 'change3', 
      title: 'Simplified the tailwind configuration to use only the necessary features', 
      status: 'success' 
    }
  ]);

  return (
    <div className="space-y-4">
      <CollapsibleTaskList
        title="Show problems"
        message={initialMessage}
        tasks={errorTasks}
        numErrors={errorTasks.length}
        onActionClick={onTaskAction}
      />
      
      <CollapsibleTaskList
        title="Fix Dependencies and Configuration"
        message="Let me fix the dependency issues by updating the package.json and tailwind configuration:"
        tasks={fixDependenciesTasks}
        onActionClick={onTaskAction}
      />
      
      <CollapsibleTaskList
        title="The changes I made"
        message="The changes I made:"
        tasks={changesMade}
        isCompleted={true}
      />
      
      <div className="bg-[#f8fafc] dark:bg-[#333336] p-4 rounded-xl border border-[#e5e7eb] dark:border-[#3a3a3c] text-sm text-[#475569] dark:text-[#d4d4d8]">
        <p>These changes should resolve the dependency errors while maintaining the core functionality of the application.</p>
      </div>
    </div>
  );
}