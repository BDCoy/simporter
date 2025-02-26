"use client"

import React, { useState, useRef } from 'react';
import { Task } from './TaskList';

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
  tasks?: Task[];
}

interface ChatProps {
  onSendMessage: (message: string, files: File[]) => void;
}

const Chat: React.FC<ChatProps> = ({ onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() || selectedFiles.length > 0) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: 'user',
        timestamp: new Date(),
        files: selectedFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send to parent component
      onSendMessage(inputValue, selectedFiles);
      
      // Clear input and files
      setInputValue('');
      setSelectedFiles([]);
      
      // Simulate AI response with tasks
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `I'll help you ${inputValue.toLowerCase().includes('analyze') ? 'analyze' : 'process'} ${selectedFiles.length > 0 ? 'the uploaded files' : 'your request'}`,
          sender: 'ai',
          timestamp: new Date(),
          tasks: [
            { id: '1', description: 'Initializing analysis', status: 'completed' },
            { id: '2', description: 'Processing data', status: 'in-progress' },
            { id: '3', description: 'Generating insights', status: 'pending' },
            { id: '4', description: 'Preparing visualization', status: 'pending' }
          ]
        };
        
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full border-r">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3/4 rounded-lg p-3 ${
              message.sender === 'user' 
                ? 'bg-blue-100 text-blue-900' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="text-sm">{message.content}</div>
              
              {message.files && message.files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.files.map((file, index) => (
                    <div key={index} className="flex items-center text-xs bg-white rounded p-1">
                      <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span className="truncate max-w-xs">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {message.tasks && (
                <div className="mt-3 bg-white rounded border p-2 space-y-2">
                  {message.tasks.map((task) => (
                    <div key={task.id} className="flex items-start">
                      <div className="flex-shrink-0">
                        {task.status === 'completed' && (
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {task.status === 'in-progress' && (
                          <svg className="w-4 h-4 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                        {task.status === 'pending' && (
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <span className="ml-2 text-xs">{task.description}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-right mt-1 text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Selected files */}
      {selectedFiles.length > 0 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="text-xs font-medium mb-1">Selected files:</div>
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center bg-white text-xs rounded-full pl-2 pr-1 py-1 border">
                <span className="truncate max-w-[100px]">{file.name}</span>
                <button 
                  onClick={() => removeFile(index)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Input area */}
      <div className="border-t p-3">
        <div className="flex items-end">
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Upload files"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={1}
          />
          
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() && selectedFiles.length === 0}
            className={`ml-2 p-2 rounded-full ${
              !inputValue.trim() && selectedFiles.length === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;