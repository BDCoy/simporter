"use client";

import React, { useState } from "react";
import ExecutionPanel, { ExecutionPanelProps } from "./ExecutionPanel";

export interface Task {
  id: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "error";
  details?: string;
}

interface TaskListProps {
  tasks: Task[];
  title?: string;
  collapsible?: boolean;
  executionPanelProps?: ExecutionPanelProps;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  title = "Tasks",
  collapsible = true,
  executionPanelProps,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return (
          <svg
            className="w-5 h-5 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "in-progress":
        return (
          <svg
            className="w-5 h-5 text-blue-500 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        {title}
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Task List Panel */}
        <div className="flex-1 md:w-1/2 bg-white border rounded-md shadow-sm">
          <div
            className={`flex justify-between items-center px-4 py-3 border-b ${
              collapsible ? "cursor-pointer hover:bg-gray-50" : ""
            }`}
            onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
          >
            <div className="font-medium">{title}</div>
            {collapsible && (
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  isCollapsed ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
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
                      <p
                        className={`text-sm ${
                          task.status === "completed"
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {task.description}
                      </p>
                      {task.details && (
                        <p className="mt-1 text-xs text-gray-500">
                          {task.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {/* Execution Panel */}
        <div className="flex-1 md:w-1/2 bg-white border rounded-md shadow-sm">
          <ExecutionPanel
            initialMessage="I found some issues with your dependencies and configuration."
            {...executionPanelProps}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskList;
