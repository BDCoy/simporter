"use client"

// src/components/ui/MainContent.tsx
import React from 'react';
import SearchInput from './SearchInput';

interface MainContentProps {
  onSearch?: (query: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ onSearch }) => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-3xl flex flex-col items-center">
        <SearchInput onSearch={onSearch} />
        
        <div className="mt-8 text-sm text-gray-500">
          Type "/" for commands or
          <button className="ml-2 text-blue-600 hover:underline flex items-center">
            <span className="mr-1">AI</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4H8"></path>
              <rect x="2" y="2" width="20" height="8" rx="2"></rect>
              <path d="M20 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z"></path>
              <path d="M12 10v10"></path>
              <path d="M12 14h.01"></path>
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
};

export default MainContent;