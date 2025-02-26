"use client";

import React, { useState, KeyboardEvent } from "react";
import { cn } from "../../lib/utils"; // Ensure this file exists: see below
import { Sparkles } from "lucide-react";

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onEnhancePrompt: () => void;
}

const SearchBarWithCommands: React.FC<SearchBarProps> = ({
  onSearch,
  onEnhancePrompt,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(-1);

  const quickStartTemplates = [
    {
      icon: Sparkles,
      title: "Generate Category Report",
      prompt: "/category",
      placeholder: "Describe the category and report you'd like",
      color: "text-emerald-600",
    },
    // You can add more templates here
  ];

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "/" && !searchQuery && !e.repeat) {
      setShowCommands(true);
      setSelectedCommand(0);
    } else if (e.key === "Escape") {
      setShowCommands(false);
      setSelectedCommand(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showCommands && selectedCommand >= 0) {
        const template = quickStartTemplates[selectedCommand];
        setSearchQuery(template.prompt + " ");
        setShowCommands(false);
      } else {
        onSearch(searchQuery);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-8 relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Type "/" for commands or enter your question...'
        className={cn(
          "w-full px-6 py-4 text-lg rounded-lg pr-32",
          "border-2 border-gray-200 dark:border-gray-700",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-white"
        )}
      />

      {showCommands && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {quickStartTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => {
                setSearchQuery(template.prompt + " ");
                setShowCommands(false);
              }}
              className={cn(
                "w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700",
                index === selectedCommand ? "bg-gray-50 dark:bg-gray-700" : ""
              )}
            >
              <template.icon className={cn("w-4 h-4 mr-3", template.color)} />
              <span className={cn("font-medium", template.color)}>
                {template.prompt}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {template.title}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 space-x-2">
        <button
          onClick={onEnhancePrompt}
          className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
        >
          Enhance Prompt
        </button>
        <button
          onClick={() => onSearch(searchQuery)}
          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBarWithCommands;
