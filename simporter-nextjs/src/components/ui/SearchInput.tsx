"use client"

import React, { useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  placeholder = "What do you want to discover?",
  onSearch 
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 pr-16 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute right-3 bottom-3 flex space-x-2">
          <button 
            type="button"
            className="text-gray-500 hover:text-blue-600"
            title="AI Assistant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4H8"></path>
              <rect x="2" y="2" width="20" height="8" rx="2"></rect>
              <path d="M20 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z"></path>
              <path d="M12 10v10"></path>
              <path d="M12 14h.01"></path>
            </svg>
          </button>
          <button 
            type="submit"
            className="text-gray-500 hover:text-blue-600"
            title="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </form>
      <div className="mt-2 text-sm text-gray-500">
        Generate insights, reports, and recommendations for consumer goods innovation.
      </div>
    </div>
  );
};

export default SearchInput;