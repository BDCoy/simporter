"use client"

import React, { useState, useRef, useEffect } from 'react';
import ChatWithFileUpload from './ChatwithFileUpload';
import ChatMessageWithTasks from './ChatMessageWithTasks';
import CollapsibleTaskList from './CollapsibleTaskList';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  files?: {
    name: string;
    size: number;
    type: string;
  }[];
  tasks?: Array<{
    id: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
  }>;
}

interface EnhancedChatProps {
  onSendMessage: (message: string, files: File[]) => void;
  isPaidUser?: boolean;
  messages?: Message[];
  isProcessing?: boolean;
}

const EnhancedChat: React.FC<EnhancedChatProps> = ({ 
  onSendMessage, 
  isPaidUser = false, 
  messages = [], 
  isProcessing = false 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() || selectedFiles.length > 0) {
      onSendMessage(inputValue, selectedFiles);
      setInputValue('');
      setSelectedFiles([]);
    }
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-lg p-3 ${
                message.sender === 'user' 
                  ? `${isPaidUser ? 'bg-blue-600' : 'bg-green-600'} text-white` 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              {/* If message has tasks, render ChatMessageWithTasks component */}
              {message.tasks ? (
                <ChatMessageWithTasks 
                  message={message.content}
                  tasks={message.tasks}
                  timestamp={message.timestamp}
                />
              ) : (
                <>
                  <div className="text-sm break-words whitespace-pre-wrap">{message.content}</div>
                  
                  {/* Display attached files if any */}
                  {message.files && message.files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.files.map((file, index) => (
                        <div key={index} className="flex items-center text-xs bg-gray-700 text-white rounded p-1">
                          <svg className="h-4 w-4 text-gray-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="truncate max-w-xs">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-right mt-1 text-xs text-gray-400 dark:text-gray-300">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {/* Show typing indicator when processing */}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-[85%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat input area */}
      <ChatWithFileUpload
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
        selectedFiles={selectedFiles}
        onFileSelect={handleFileSelect}
        onRemoveFile={handleRemoveFile}
        isPaidUser={isPaidUser}
        isDisabled={isProcessing}
      />
    </div>
  );
};

export default EnhancedChat;