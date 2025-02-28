import React, { useState } from 'react';
import { RefreshCw, ChevronDown, History } from 'lucide-react';

const Preview = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [activeTab, setActiveTab] = useState("charts");
  
  // Mock data for collaborators
  const collaborators = [
    { id: "1", name: "Jane Smith", level: "Admin", isActive: true },
    { id: "2", name: "John Doe", level: "Editor", isActive: true },
    { id: "3", name: "Alex Johnson", level: "Viewer", isActive: false },
  ];
  
  // Mock tab colors
  const tabColors = {
    slides: "blue",
    data: "green",
    charts: "blue",
    collab: "green",
    code: "blue",
  };
  
  const handleRefreshTab = () => {
    setShowBanner(false);
  };
  
  const handleRefreshAll = () => {
    setShowBanner(false);
  };
  
  const handleDismiss = () => {
    setShowBanner(false);
  };
  
  return (
    <div className="flex flex-col border rounded-lg shadow-sm max-w-4xl mx-auto bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center bg-gray-50 px-3 py-2 border-b overflow-x-auto gap-1">
        {/* Project name */}
        <div className="relative">
          <button className="px-3 py-1.5 text-lg font-semibold text-gray-800 flex items-center">
            Data Analysis Project
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex-1 flex">
          {Object.entries(tabColors).map(([tabId, color]) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors mx-0.5 whitespace-nowrap relative ${
                activeTab === tabId 
                  ? `border-b-2 border-${color === 'blue' ? 'blue' : 'green'}-500 bg-${color === 'blue' ? 'blue' : 'green'}-50 text-${color === 'blue' ? 'blue' : 'green'}-700` 
                  : 'border-b-2 border-transparent hover:bg-gray-100 text-gray-600'
              }`}
            >
              {tabId.charAt(0).toUpperCase() + tabId.slice(1)}
              {tabId === 'charts' && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>
          ))}
        </div>
        
        {/* ViewActions with Last Saved Time and separate refresh buttons */}
        <div className="flex items-center space-x-2">
          {/* Last Saved timestamp */}
          <button className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors">
            <History className="h-3 w-3 mr-1" />
            Last saved at 2:45 PM
          </button>
          
          {/* Two separate refresh buttons */}
          <button
            onClick={handleRefreshTab}
            className="p-1.5 text-gray-700 bg-white border border-gray-300 rounded-l hover:bg-gray-50 flex items-center text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh Tab
          </button>
          
          <button
            onClick={handleRefreshAll}
            className="p-1.5 text-gray-700 bg-white border border-gray-300 border-l-0 rounded-r hover:bg-gray-50 text-xs"
          >
            Refresh All
          </button>
          
          {/* Original buttons */}
          <button className="flex items-center text-sm px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PPTX
          </button>
          
          <button className="p-1.5 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
        </div>
        
        {/* Collaborators component on the right side */}
        <div className="ml-4 pl-4 border-l">
          <div className="flex -space-x-2">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="relative group">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-medium text-xs border-2 border-white ${
                  collaborator.isActive ? "bg-blue-500" : "bg-gray-400"
                }`}>
                  {collaborator.name.charAt(0)}
                </div>
                
                {/* Status indicator */}
                {collaborator.isActive && (
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-white"></div>
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                  {collaborator.name} • {collaborator.level}
                </div>
              </div>
            ))}
            
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs border-2 border-white">
              +2
            </div>
          </div>
        </div>
      </div>
      
      {/* Outdated Tab Banner */}
      {showBanner && (
        <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center">
          <RefreshCw className="text-amber-500 h-5 w-5 mr-3" />
          <span className="text-amber-800 font-medium flex-grow">
            This tab may be outdated. Do you want to refresh it?
          </span>
          <div className="flex space-x-2 ml-4">
            <button
              onClick={handleRefreshTab}
              className="px-3 py-1 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors"
            >
              Yes
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1 text-sm font-medium bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-md transition-colors"
            >
              Not Now
            </button>
            <button
              onClick={handleRefreshAll}
              className="px-3 py-1 text-sm font-medium bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-md transition-colors"
            >
              Refresh All Outdated Tabs
            </button>
          </div>
        </div>
      )}
      
      {/* Content placeholder */}
      <div className="p-6 h-64 flex items-center justify-center bg-white">
        <p className="text-gray-500">Tab content would appear here</p>
      </div>
    </div>
  );
};

export default Preview;