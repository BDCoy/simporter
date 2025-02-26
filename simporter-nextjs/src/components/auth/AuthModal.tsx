"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { signInWithGoogle, signInWithMicrosoft } from '@/utils/auth/serverAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [error, setError] = React.useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithGoogle();
      if (response?.error) {
        setError('Google sign in failed: ' + response.error.message);
      } else {
        onClose();
      }
    } catch (error) {
      setError('Google sign in failed');
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      const response = await signInWithMicrosoft();
      if (response?.error) {
        setError('Microsoft sign in failed: ' + response.error.message);
      } else {
        onClose();
      }
    } catch (error) {
      setError('Microsoft sign in failed');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden" // Updated className
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Sign in to Continue
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Please sign in to continue.
                </p>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm mb-6">
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center px-4 py-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-5 h-5 mr-3"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Continue with Google
                  </span>
                </button>

                <button
                  onClick={handleMicrosoftSignIn}
                  className="w-full flex items-center justify-center px-4 py-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
                >
                  <img
                    src="https://www.microsoft.com/favicon.ico"
                    alt="Microsoft"
                    className="w-5 h-5 mr-3"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Continue with Microsoft
                  </span>
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                By continuing, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}