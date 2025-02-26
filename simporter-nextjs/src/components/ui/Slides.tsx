"use client"

import React, { useState } from 'react';

interface CreateSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSlide: (content: string) => void;
}

const CreateSlideModal: React.FC<CreateSlideModalProps> = ({
  isOpen,
  onClose,
  onCreateSlide
}) => {
  const [slideContent, setSlideContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (slideContent.trim()) {
      setIsProcessing(true);
      
      // Simulate processing delay
      setTimeout(() => {
        onCreateSlide(slideContent);
        setSlideContent('');
        setIsProcessing(false);
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Create New Slide</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe what you want on this slide
            </label>
            <textarea
              value={slideContent}
              onChange={(e) => setSlideContent(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Example: A slide showing monthly sales data as a bar chart with analysis of top performing products"
              disabled={isProcessing}
            />
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Our AI will generate a suitable slide based on your description. You can edit it after creation.</p>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm text-white rounded-md ${
                isProcessing
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isProcessing || !slideContent.trim()}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : 'Create Slide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSlideModal;