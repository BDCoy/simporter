import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StorageDropdownProps {
  onSelect: (provider: 'google-drive' | 'onedrive') => void;
}

export function StorageDropdown({ onSelect }: StorageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (provider: 'google-drive' | 'onedrive') => {
    onSelect(provider);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
      >
        <Cloud className="w-4 h-4 mr-2" />
        Connect Storage
        <ChevronDown className={cn(
          "w-4 h-4 ml-2 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-40"
            >
              <div className="p-2 space-y-1">
                <button
                  onClick={() => handleSelect('google-drive')}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <Cloud className="w-4 h-4 mr-2 text-red-600" />
                  Connect to Google Drive
                </button>
                <button
                  onClick={() => handleSelect('onedrive')}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <Cloud className="w-4 h-4 mr-2 text-blue-600" />
                  Connect to OneDrive
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}