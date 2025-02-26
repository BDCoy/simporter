"use client";

import React from 'react';

interface MicrosoftSSOButtonProps {
  onClick?: () => void;
  className?: string;
  text?: string;
  isLoading?: boolean;
}

const MicrosoftSSOButton: React.FC<MicrosoftSSOButtonProps> = ({
  onClick,
  className = '',
  text = 'Continue with Microsoft',
  isLoading = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center justify-center py-3 px-5 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          <div className="mr-2 h-5 w-5 relative">
            <svg width="20" height="20" viewBox="0 0 23 23">
              <path fill="#f3f3f3" d="M0 0h23v23H0z"></path>
              <path fill="#f35325" d="M1 1h10v10H1z"></path>
              <path fill="#81bc06" d="M12 1h10v10H12z"></path>
              <path fill="#05a6f0" d="M1 12h10v10H1z"></path>
              <path fill="#ffba08" d="M12 12h10v10H12z"></path>
            </svg>
          </div>
          <span className="text-base font-medium text-gray-700">{text}</span>
        </>
      )}
    </button>
  );
};

export default MicrosoftSSOButton;