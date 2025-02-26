"use client"

import React, { useState } from 'react';
import TaskList, { Task } from '@/components/ui/TaskList';
import ViewTabs from '@/components/ui/ViewTabs';
import ViewActions from '@/components/ui/ViewActions';
import VisualInspector from '@/components/ui/VisualInspector';

interface Slide {
  id: string;
  title: string;
  content: React.ReactNode;
  type: 'title' | 'content' | 'chart' | 'table' | 'image';
}

interface InspectableElement {
  id: string;
  tagName: string;
  className: string;
  rect: DOMRect;
}

const IDELayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('slides');
  const [isInspectorActive, setIsInspectorActive] = useState(false);
  const [isCreateSlideModalOpen, setIsCreateSlideModalOpen] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      title: 'Consumer Sentiment Analysis',
      content: (
        <div className="text-center text-gray-500">
          <p>Title slide content would appear here</p>
        </div>
      ),
      type: 'title'
    },
    {
      id: '2',
      title: 'Market Overview',
      content: (
        <div className="text-center text-gray-500">
          <p>Content slide with market data would appear here</p>
        </div>
      ),
      type: 'content'
    },
    {
      id: '3',
      title: 'Monthly Sales Trends',
      content: (
        <div className="text-center text-gray-500">
          <p>Chart slide with sales data would appear here</p>
        </div>
      ),
      type: 'chart'
    }
  ]);
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', description: 'Analyzing consumer data', status: 'completed' },
    { id: '2', description: 'Processing market trends', status: 'in-progress' },
    { id: '3', description: 'Generating insights report', status: 'pending' }
  ]);
  
  const [problemTasks, setProblemTasks] = useState<Task[]>([
    { id: 'p1', description: 'Missing data in Q3 report', status: 'in-progress', details: 'Filling gaps with predictive model' }
  ]);

  const handleSearch = (query: string, useAiDiscovery: boolean) => {
    console.log('Search query:', query, 'Use AI Discovery:', useAiDiscovery);
    // Implement search functionality
  };

  const handleEnhancePrompt = (query: string) => {
    console.log('Enhancing prompt:', query);
    // Implement prompt enhancement
  };

  const handleSendMessage = (message: string, files: File[]) => {
    console.log('Message sent:', message);
    console.log('Files:', files);
    // Implement message handling
  };

  const handleAddSlide = (type: Slide['type']) => {
    setIsCreateSlideModalOpen(true);
  };

  const handleCreateSlide = (content: string) => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: content.split('\n')[0] || 'New Slide',
      content: (
        <div className="text-center text-gray-500">
          <p>{content}</p>
        </div>
      ),
      type: 'content'
    };
    
    setSlides([...slides, newSlide]);
  };

  const handleSelectElement = (element: InspectableElement) => {
    console.log('Selected element:', element);
    setIsInspectorActive(false);
    // Implement element selection handling
  };

  // Mock Chat component
  const Chat = () => (
    <div className="flex flex-col h-full border-t p-4">
      <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded p-4">
        <div className="mb-4 text-right">
          <div className="inline-block bg-blue-100 p-3 rounded-lg max-w-xs text-blue-900">
            Can you analyze consumer sentiment for clean beauty products?
          </div>
        </div>
        <div className="mb-4">
          <div className="inline-block bg-white border border-gray-200 p-3 rounded-lg max-w-xs text-gray-800">
            I'll help you analyze consumer sentiment for clean beauty products. Let me work on that for you.
          </div>
        </div>
      </div>
      <div className="border rounded-lg flex items-end">
        <textarea
          placeholder="Type your message..."
          className="flex-1 p-2 focus:outline-none"
          rows={2}
        />
        <button className="p-2 m-1 text-blue-600 hover:bg-blue-50 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );

  // Mock SlidesViewer component
  const SlidesViewer = ({ slides, onAddSlide }: { slides: Slide[], onAddSlide: (type: Slide['type']) => void }) => (
    <div className="h-full flex flex-col">
      <div className="border-b p-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div>Slide 1 of {slides.length}</div>
      </div>
      <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
        <div className="bg-white w-full max-w-2xl aspect-video shadow-md p-6 rounded">
          <h2 className="text-2xl font-bold">{slides[0].title}</h2>
          <div className="mt-4">
            {slides[0].content}
          </div>
        </div>
      </div>
      <div className="border-t p-2 bg-gray-50">
        <button 
          onClick={() => onAddSlide('content')}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Slide
        </button>
      </div>
    </div>
  );

  // Mock CreateSlideModal component
  const CreateSlideModal = ({ 
    isOpen, 
    onClose, 
    onCreateSlide 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    onCreateSlide: (content: string) => void;
  }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4">
          <h3 className="text-lg font-medium mb-4">Create New Slide</h3>
          <textarea 
            className="w-full border rounded p-2 mb-4" 
            rows={4}
            placeholder="Describe what you want on this slide"
          />
          <div className="flex justify-end space-x-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={() => onCreateSlide("Example slide content")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Mock SearchBar component
  const SearchBar = ({ 
    onSearch, 
    onEnhancePrompt 
  }: { 
    onSearch: (query: string, useAiDiscovery: boolean) => void; 
    onEnhancePrompt: (query: string) => void;
  }) => (
    <div>
      <div className="relative">
        <input
          type="text"
          className="w-full p-3 border rounded-lg pl-4 pr-20"
          placeholder="Type '/' for commands or enter your query"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <span>AI Discovery</span>
          </button>
          <button className="p-1 text-gray-500 hover:bg-gray-100 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Generate insights, reports, and recommendations for consumer goods innovation.
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'slides':
        return <SlidesViewer slides={slides} onAddSlide={handleAddSlide} />;
      case 'code':
        return (
          <div className="p-4 bg-gray-50 h-full">
            <pre className="bg-white p-4 border rounded-md overflow-auto h-full">
              {`// Example code would appear here
import React from 'react';
import { analyzeData } from './utils';

const ConsumerAnalysis = ({ data }) => {
  const results = analyzeData(data);
  
  return (
    <div>
      <h2>Analysis Results</h2>
      <div className="results">
        {results.map(item => (
          <div key={item.id}>
            <h3>{item.category}</h3>
            <p>{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsumerAnalysis;`}
            </pre>
          </div>
        );
      case 'dataset':
        return (
          <div className="p-4 bg-gray-50 h-full">
            <div className="bg-white border rounded-md overflow-auto h-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-{Math.floor(index / 3) + 1}-{(index % 28) + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Product {(index % 5) + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Region {(index % 4) + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Math.floor(Math.random() * 10000)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{['Positive', 'Neutral', 'Negative'][index % 3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View</h3>
              <p>This view is not implemented in this prototype</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left panel - Chat */}
      <div className="w-1/3 flex flex-col border-r">
        <div className="p-4 border-b bg-blue-50">
          <div className="font-bold mb-1 text-blue-800">SIMPORTER</div>
          <SearchBar onSearch={handleSearch} onEnhancePrompt={handleEnhancePrompt} />
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 space-y-4">
            <TaskList 
              tasks={tasks} 
              title="Tasks" 
            />
            
            <TaskList 
              tasks={problemTasks} 
              title="Problems Identified" 
            />
          </div>
          
          <div className="flex-1 overflow-hidden">
            <Chat />
          </div>
        </div>
      </div>
      
      {/* Right panel - IDE & Preview */}
      <div className="flex-1 flex flex-col">
        {/* View controls */}
        <div className="border-b flex items-center">
          <ViewTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <ViewActions activeTab={activeTab} />
          
          <button
            onClick={() => setIsInspectorActive(!isInspectorActive)}
            className={`ml-2 p-1.5 rounded mr-2 ${
              isInspectorActive 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Visual Inspector"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        
        {/* View content */}
        <div className="flex-1 overflow-hidden">
          {renderActiveTab()}
        </div>
      </div>
      
      {/* Visual inspector overlay */}
      <VisualInspector
        isActive={isInspectorActive}
        onSelectElement={handleSelectElement}
      />
      
      {/* Create slide modal */}
      <CreateSlideModal
        isOpen={isCreateSlideModalOpen}
        onClose={() => setIsCreateSlideModalOpen(false)}
        onCreateSlide={handleCreateSlide}
      />
    </div>
  );
};

export default IDELayout;