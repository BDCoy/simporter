"use client"

import React from 'react';

interface ViewActionsProps {
  activeTab: string;
}

const ViewActions: React.FC<ViewActionsProps> = ({ activeTab }) => {
  const getExportType = () => {
    switch (activeTab) {
      case 'slides':
        return 'PPTX';
      case 'dataset':
        return 'XLSX';
      case 'document':
        return 'DOCX';
      case 'code':
        return 'CSV';
      default:
        return 'Data';
    }
  };

  const handleExport = () => {
    console.log(`Exporting as ${getExportType()}`);
    // Implement export functionality
  };

  const handleFullscreen = () => {
    console.log('Fullscreen view');
    // Implement fullscreen functionality
  };

  const handleShare = () => {
    console.log('Share view');
    // Implement share functionality
  };

  const handleOpenInNewTab = () => {
    console.log('Open in new tab');
    // Implement open in new tab functionality
    window.open('/preview/' + activeTab, '_blank');
  };

  return (
    <div className="flex items-center space-x-2 ml-auto">
      <button 
        onClick={handleExport}
        className="flex items-center text-sm px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download {getExportType()}
      </button>
      
      <button 
        onClick={handleFullscreen}
        className="p-1.5 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
        title="Fullscreen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
        </svg>
      </button>
      
      <button 
        onClick={handleShare}
        className="p-1.5 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
        title="Share"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
      
      <button 
        onClick={handleOpenInNewTab}
        className="p-1.5 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
        title="Open in new tab"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </button>
    </div>
  );
};

export default ViewActions;