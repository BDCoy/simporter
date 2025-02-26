"use client"

import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string, useAiDiscovery: boolean) => void;
  onEnhancePrompt: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onEnhancePrompt }) => {
  const [query, setQuery] = useState('');
  const [useAiDiscovery, setUseAiDiscovery] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, useAiDiscovery);
    }
  };

  const handleEnhancePrompt = () => {
    if (query.trim()) {
      setIsEnhancing(true);
      onEnhancePrompt(query);
      // In a real app, you'd want to update the query with the enhanced version
      // after the enhancement is complete
      setTimeout(() => setIsEnhancing(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type '/' for commands or enter your query"
          className="w-full p-4 pr-24 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="absolute right-3 bottom-3 flex space-x-2">
          <button 
            type="button"
            onClick={() => setUseAiDiscovery(!useAiDiscovery)}
            className={`flex items-center text-sm px-2 py-1 rounded-md transition-colors ${
              useAiDiscovery 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Use AI Discovery to ask follow-up questions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Discovery
          </button>
          
          <button 
            type="button"
            onClick={handleEnhancePrompt}
            disabled={isEnhancing || !query.trim()}
            className={`text-sm px-2 py-1 rounded-md ${
              isEnhancing
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : query.trim() ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            title="Enhance your prompt"
          >
            {isEnhancing ? 'Enhancing...' : 'Enhance'}
          </button>
          
          <button 
            type="submit"
            className="text-blue-600 hover:text-blue-800"
            title="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

export default SearchBar;