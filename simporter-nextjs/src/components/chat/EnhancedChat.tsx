"use client"

import React, { useState, useRef, useEffect } from 'react';
import ChatMessageWithTasks from './ChatMessageWithTasks';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  hasTaskList?: boolean;
}

export default function EnhancedChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showUsageBanner, setShowUsageBanner] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Show usage banner when message count exceeds 5
    if (messages.length >= 5 && !showUsageBanner) {
      setShowUsageBanner(true);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI response with task list
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: `I'll help you ${inputValue.toLowerCase().includes('fix') || inputValue.toLowerCase().includes('resolve') ? 'fix those issues' : 'with that'}. Let me get started.`,
        isUser: false,
        timestamp: new Date(),
        hasTaskList: true
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleTaskAction = (taskId: string, action: string) => {
    console.log(`Task ${taskId} action: ${action}`);
    // In a real app, you would handle the task action here
    // For example, start a task, show progress, etc.
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    console.log(`${type} feedback given`);
    // Handle feedback
  };

  const handleRetry = () => {
    console.log('Retry last message');
    // Handle retry
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    // Could show a toast notification here
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f8f8] dark:bg-[#1c1c1e]">
      {/* Usage banner */}
      {showUsageBanner && (
        <div className="flex items-center justify-between px-6 py-3 bg-[#f1f5f9] dark:bg-[#2c2c2e] border-b border-[#e2e8f0] dark:border-[#3a3a3c] text-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-[#64748b] dark:text-[#a1a1aa] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[#475569] dark:text-[#d1d5db]">
              Tip: Long chats cause you to reach your usage limits faster. 
              <button className="ml-1 text-[#3b82f6] dark:text-[#60a5fa] font-medium hover:underline">
                Start a new chat
              </button>
            </span>
          </div>
          <button 
            onClick={() => setShowUsageBanner(false)}
            className="text-[#64748b] dark:text-[#a1a1aa] hover:text-[#475569] dark:hover:text-[#d1d5db]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#6b7280] dark:text-[#a1a1aa]">
            <svg className="w-16 h-16 mb-4 text-[#cbd5e1] dark:text-[#3a3a3c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-light">Ask me anything about your project</p>
            <p className="text-sm text-[#94a3b8] dark:text-[#71717a] mt-2">I can help fix issues, generate code, or explain concepts</p>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessageWithTasks
              key={message.id}
              message={message.content}
              timestamp={message.timestamp}
              isUser={message.isUser}
              hasTaskList={message.hasTaskList}
              onTaskAction={handleTaskAction}
              onCopy={() => handleCopy(message.content)}
              onPositiveFeedback={() => handleFeedback('positive')}
              onNegativeFeedback={() => handleFeedback('negative')}
              onRetry={!message.isUser ? handleRetry : undefined}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t border-[#e2e8f0] dark:border-[#333336] p-4 bg-white dark:bg-[#2c2c2e]">
        <div className="flex items-end max-w-4xl mx-auto">
          <div className="relative flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Message Simporter..."
              className="w-full py-3 pl-4 pr-12 bg-[#f8fafc] dark:bg-[#3a3a3c] border border-[#e2e8f0] dark:border-[#4c4c4e] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent resize-none text-[#334155] dark:text-[#e2e8f0] placeholder-[#94a3b8] dark:placeholder-[#71717a]"
              rows={1}
              style={{
                minHeight: '56px',
                maxHeight: '160px',
                overflowY: 'auto',
              }}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className={`absolute right-3 bottom-3 p-1.5 rounded-full transition-all ${
                !inputValue.trim()
                  ? 'text-[#cbd5e1] dark:text-[#4c4c4e] cursor-not-allowed'
                  : 'text-white bg-[#3b82f6] dark:bg-[#60a5fa] hover:bg-[#2563eb] dark:hover:bg-[#3b82f6]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-center text-[#94a3b8] dark:text-[#71717a] max-w-4xl mx-auto">
          Simporter may display inaccurate info, including about products, code, or content.
        </div>
      </div>
    </div>
  );
}