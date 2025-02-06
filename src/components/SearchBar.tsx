import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  analyzing: boolean;
}

function SearchBar({ onSearch, analyzing }: SearchBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm text-gray-900 placeholder-gray-500"
          placeholder="Enter your analysis query..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={analyzing}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {analyzing ? (
            <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
          ) : (
            <Search className="h-6 w-6 text-gray-400" />
          )}
        </div>
      </div>
    </form>
  );
}

export default SearchBar