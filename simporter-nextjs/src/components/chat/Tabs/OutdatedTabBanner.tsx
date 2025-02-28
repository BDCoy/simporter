"use client";

import React from "react";
import { RefreshCw } from "lucide-react";

interface OutdatedTabBannerProps {
  tabName: string;
  onRefresh: () => void;
  onRefreshAll: () => void;
  onDismiss: () => void;
}

const OutdatedTabBanner: React.FC<OutdatedTabBannerProps> = ({
  tabName,
  onRefresh,
  onRefreshAll,
  onDismiss,
}) => {
  return (
    <div className="w-full bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2.5 flex items-center">
      <RefreshCw className="text-amber-500 dark:text-amber-400 h-5 w-5 mr-3 animate-spin-slow" />
      <span className="text-amber-800 dark:text-amber-300 font-medium flex-grow">
        This tab may be outdated. Do you want to refresh it?
      </span>
      <div className="flex space-x-2 ml-4">
        <button
          onClick={onRefresh}
          className="px-3 py-1 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors"
        >
          Yes
        </button>
        <button
          onClick={onDismiss}
          className="px-3 py-1 text-sm font-medium bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md transition-colors"
        >
          Not Now
        </button>
        <button
          onClick={onRefreshAll}
          className="px-3 py-1 text-sm font-medium bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md transition-colors"
        >
          Refresh All Outdated Tabs
        </button>
      </div>
    </div>
  );
};

export default OutdatedTabBanner;