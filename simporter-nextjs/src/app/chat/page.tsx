"use client";

import React from "react";
import EnhancedChat from "@/components/chat/EnhancedChat";
import IDELayout from "@/components/ui/IDELayout";

export default function TaskChatDemo() {
  return (
    <div className="flex flex-col h-screen bg-[#f8f8f8] dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-white dark:bg-[#1c1c1e] border-b border-[#e2e8f0] dark:border-[#2c2c2e] px-8 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Simporter AI Assistant
          </h1>
          <div className="flex items-center space-x-4">
            <button className="text-[#64748b] dark:text-[#a1a1aa] hover:text-[#3b82f6] dark:hover:text-[#60a5fa] p-1.5 rounded transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
            <div className="h-6 w-px bg-[#e2e8f0] dark:bg-[#3a3a3c]"></div>
            <button className="flex items-center text-[#475569] dark:text-[#d4d4d8] hover:text-[#334155] dark:hover:text-white transition-colors">
              <span className="h-8 w-8 rounded-full bg-[#f1f5f9] dark:bg-[#3a3a3c] flex items-center justify-center text-[#64748b] dark:text-[#d4d4d8] font-medium text-sm mr-2 border border-[#e2e8f0] dark:border-[#4c4c4e]">
                DH
              </span>
              <span className="text-sm">Account</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content: Split into Chat (left 1/3) and IDE (right 2/3) */}
      <div className="flex flex-1 max-w-6xl mx-auto w-full p-8 overflow-hidden">
        {/* Left Panel: Chat */}
        <div className="w-1/3 pr-4 border-r border-gray-200 dark:border-gray-700">
          <EnhancedChat />
        </div>
        {/* Right Panel: IDE Layout */}
        <div className="w-2/3 pl-4">
          <IDELayout />
        </div>
      </div>
    </div>
  );
}
