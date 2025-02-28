"use client";

import React from "react";

const ChartsTab: React.FC = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Charts Tab
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        This is a placeholder for dynamic charts that will display project data.
      </p>
      {/* Replace this placeholder with your chart component/library */}
      <div className="w-full max-w-md">
        <div className="border border-dashed border-gray-400 dark:border-gray-600 rounded p-4 text-center">
          Chart Placeholder
        </div>
      </div>
    </div>
  );
};

export default ChartsTab;
