"use client";

import React, { useState } from 'react';

interface CompactSSOLoginProps {
  onGoogleLogin?: () => void;
  onMicrosoftLogin?: () => void;
  showAutoLogin?: boolean;
  userEmail?: string;
  className?: string;
}

const CompactSSOLogin: React.FC<CompactSSOLoginProps> = ({
  onGoogleLogin,
  onMicrosoftLogin,
  showAutoLogin = false,
  userEmail = 'user@example.com',
  className = ''
}) => {
  const [showAutoLoginOption, setShowAutoLoginOption] = useState(showAutoLogin);

  return (
    <div className={`${className}`}>
      {showAutoLoginOption ? (
        <div className="rounded-lg border border-gray-200 p-4 shadow-sm max-w-xs">
          <p className="text-sm text-gray-600 mb-3">Sign in to Simporter.com with</p>
          <button 
            onClick={onGoogleLogin}
            className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-2 w-full hover:bg-gray-50"
          >
            <div className="mr-2 h-5 w-5 relative">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{userEmail}</span>
              <span className="text-xs text-gray-500">Google Account</span>
            </div>
          </button>
          <div className="mt-3 text-center">
            <button 
              onClick={() => setShowAutoLoginOption(false)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Use another account
            </button>
          </div>
        </div>
      ) : (
        <div className="flex space-x-2">
          <button
            onClick={onGoogleLogin}
            className="flex items-center justify-center h-8 px-3 py-1 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <div className="h-5 w-5 relative mr-2">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-700">Continue with Google</span>
          </button>
          
          <button
            onClick={onMicrosoftLogin}
            className="flex items-center justify-center h-8 px-3 py-1 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <div className="h-5 w-5 relative mr-2">
              <svg width="20" height="20" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"></path>
                <path fill="#f35325" d="M1 1h10v10H1z"></path>
                <path fill="#81bc06" d="M12 1h10v10H12z"></path>
                <path fill="#05a6f0" d="M1 12h10v10H1z"></path>
                <path fill="#ffba08" d="M12 12h10v10H12z"></path>
              </svg>
            </div>
            <span className="text-xs text-gray-700">Continue with Microsoft</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CompactSSOLogin;