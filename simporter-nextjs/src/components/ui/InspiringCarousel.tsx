"use client";

import React, { useState, useEffect } from "react";

export interface InspiringCarouselProps {
  prompts: string[];
  autoRotateInterval?: number;
  onPromptClick?: (prompt: string) => void;
  setSearchQuery?: (query: string) => void; // Added a new prop to set the search query directly
}

const InspiringCarousel: React.FC<InspiringCarouselProps> = ({
  prompts,
  autoRotateInterval = 3000,
  onPromptClick,
  setSearchQuery,
}) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) =>
        prev === prompts.length - 1 ? 0 : prev + 1
      );
    }, autoRotateInterval);
    return () => clearInterval(interval);
  }, [isPaused, prompts.length, autoRotateInterval]);

  const handlePromptClick = (prompt: string) => {
    // Use the new setSearchQuery prop if available
    if (setSearchQuery) {
      setSearchQuery(prompt);
    }
    
    // Still call the original onPromptClick for backward compatibility
    if (onPromptClick) {
      onPromptClick(prompt);
    }
  };

  return (
    <div
      className="relative bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 shadow-md"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            setCurrentPromptIndex((prev) =>
              prev === 0 ? prompts.length - 1 : prev - 1
            )
          }
          className="p-2 text-gray-600 hover:text-gray-900"
          aria-label="Previous prompt"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex-1 px-8 text-center">
          <p
            className="text-lg text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handlePromptClick(prompts[currentPromptIndex])}
          >
            {prompts[currentPromptIndex]}
          </p>
        </div>
        <button
          onClick={() =>
            setCurrentPromptIndex((prev) =>
              prev === prompts.length - 1 ? 0 : prev + 1
            )
          }
          className="p-2 text-gray-600 hover:text-gray-900"
          aria-label="Next prompt"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {prompts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPromptIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentPromptIndex ? "bg-blue-600 w-3" : "bg-gray-300"
            }`}
            aria-label={`Go to prompt ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default InspiringCarousel;