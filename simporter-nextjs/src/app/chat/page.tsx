"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import dynamic from "next/dynamic";
import ProjectDropdown from "@/components/ui/ProjectDropdown";

// Types
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

// Project management utility functions
const handleCollaborate = (projectId: string, projectName: string) => {
  console.log(`Opening collaboration options for ${projectName} (ID: ${projectId})`);
  alert(`Collaboration for "${projectName}"\n\nShare this URL to collaborate:\nhttps://app.example.com/projects/${projectId}/collaborate`);
};

const handleArchive = async (projectId: string, projectName: string): Promise<boolean> => {
  console.log(`Archiving project: ${projectName} (ID: ${projectId})`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Project archived: ${projectName}`);
      alert(`Project "${projectName}" has been archived`);
      resolve(true);
    }, 500);
  });
};

const handleDelete = async (projectId: string, projectName: string): Promise<boolean> => {
  console.log(`Deleting project: ${projectName} (ID: ${projectId})`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Project deleted: ${projectName}`);
      alert(`Project "${projectName}" has been deleted`);
      resolve(true);
    }, 800);
  });
};

const handleRename = async (projectId: string, newName: string): Promise<boolean> => {
  console.log(`Renaming project to: ${newName} (ID: ${projectId})`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Project renamed to: ${newName}`);
      resolve(true);
    }, 300);
  });
};

// Dynamically import components that depend on browser APIs
const ViewActions = dynamic(() => import("@/components/chat/ViewActions"), {
  ssr: false,
  loading: () => <div className="p-4">Loading actions...</div>,
});

const ViewTabs = dynamic(() => import("@/components/chat/Tabs/ViewTabs"), {
  ssr: false,
  loading: () => <div className="p-4">Loading tabs...</div>,
});

// Skeleton loader for Chat section
const ChatSkeleton = () => (
  <div className="h-full flex flex-col animate-pulse">
    <div className="flex-1 p-4 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-center">
          <div
            className={`rounded-lg p-4 max-w-[80%] ${
              i % 2 === 0
                ? "bg-gray-200"
                : "bg-blue-50"
            } w-full`}
          >
            <div className="h-4 bg-gray-300 rounded w-24 mb-2 animate-pulse" />
            <div className="h-3 bg-gray-300 rounded w-48 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
    <div className="border-t border-gray-200 p-4">
      <div className="bg-gray-200 rounded-lg h-12 animate-pulse" />
    </div>
  </div>
);

// PlayStop button component
const PlayStopButton = ({ isProcessing, hasInput, onStart }: { 
  isProcessing: boolean, 
  hasInput: boolean, 
  onStart: () => void 
}) => {
  return (
    <button
      onClick={onStart}
      disabled={isProcessing || !hasInput}
      className={`p-2 rounded-full transition-colors duration-200 ${
        isProcessing 
          ? 'bg-red-100 text-red-600' 
          : hasInput
            ? 'bg-green-100 text-green-600 hover:bg-green-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }`}
      title={isProcessing ? "Processing" : hasInput ? "Start processing" : "Type a message"}
    >
      {isProcessing ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
    </button>
  );
};

// Mock RAG utility functions
const fetchRelevantDocuments = async (query: string, files: File[]) => {
  // Simulate document retrieval delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock document retrieval
  const documents = files.length > 0 
    ? files.map(file => ({ title: file.name, excerpt: `Content from ${file.name}`, relevance: 0.85 + Math.random() * 0.15 }))
    : [
        { title: "Knowledge Base #1", excerpt: "Relevant information for your query...", relevance: 0.92 },
        { title: "Documentation #2", excerpt: "Additional context for your question...", relevance: 0.85 },
      ];
  
  return documents;
};

const processLLMRequest = async (
  message: string, 
  files: File[], 
  documents: any[], 
  setTasks: (taskId: string, status: 'pending' | 'in-progress' | 'completed') => void
) => {
  // This would be an actual API call to your LLM service
  // Simulate LLM processing with sequential task updates
  
  // Update task statuses one by one
  setTasks('retrieval', 'in-progress');
  await new Promise(resolve => setTimeout(resolve, 800));
  setTasks('retrieval', 'completed');
  
  setTasks('processing', 'in-progress');
  await new Promise(resolve => setTimeout(resolve, 1200));
  setTasks('processing', 'completed');
  
  setTasks('generating', 'in-progress');
  await new Promise(resolve => setTimeout(resolve, 1000));
  setTasks('generating', 'completed');
  
  // Return mock response
  return {
    content: `Based on ${documents.length} relevant documents, here's what I found about "${message}": 
    
The information you're looking for requires analyzing ${files.length > 0 ? 'the uploaded files' : 'our knowledge base'}. 
    
Key insights:
1. ${documents[0]?.title || 'Main Document'} contains information about your query
2. There are several approaches to solving this problem
3. I recommend starting with a structured approach

Would you like me to explain any particular aspect in more detail?`,
    suggestions: [
      "Explain the solution step by step",
      "Show me code examples",
      "What other approaches could work?",
      "Generate a visual diagram"
    ]
  };
};

export default function ChatPage() {
  const [mounted, setMounted] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [relevantDocs, setRelevantDocs] = useState<any[]>([]);
  const [isPaidUser] = useState(true); // This could come from auth context
  const [projectName, setProjectName] = useState("Market Analysis Project");
  const [projectId] = useState("proj_" + Math.random().toString(36).substr(2, 9)); // Mock project ID
  
  // Define task status type to fix typing issues
  type TaskStatus = 'pending' | 'in-progress' | 'completed';
  
  // Tasks for the current processing
  const [currentTasks, setCurrentTasks] = useState<Array<{
    id: string;
    description: string;
    status: TaskStatus;
  }>>([
    { id: 'retrieval', description: 'Retrieving relevant documents', status: 'pending' },
    { id: 'processing', description: 'Processing information', status: 'pending' },
    { id: 'generating', description: 'Generating response', status: 'pending' },
  ]);
  
  // Project action handlers
  const handleProjectRename = useCallback(async (newName: string) => {
    try {
      const success = await handleRename(projectId, newName);
      if (success) {
        setProjectName(newName);
      }
    } catch (error) {
      console.error("Error renaming project:", error);
    }
  }, [projectId]);

  const handleProjectCollaborate = useCallback(() => {
    handleCollaborate(projectId, projectName);
  }, [projectId, projectName]);

  const handleProjectArchive = useCallback(async () => {
    try {
      const success = await handleArchive(projectId, projectName);
      if (success) {
        // In a real app, you might redirect to a projects list page
        console.log("Project archived successfully");
      }
    } catch (error) {
      console.error("Error archiving project:", error);
    }
  }, [projectId, projectName]);

  const handleProjectDelete = useCallback(async () => {
    try {
      const success = await handleDelete(projectId, projectName);
      if (success) {
        // In a real app, you might redirect to a projects list page
        console.log("Project deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  }, [projectId, projectName]);

  // Function to update task status
  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setCurrentTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status } : task
      )
    );
  }, []);

  // Handler for sending messages
  const handleSendMessage = useCallback(async (message: string, files: File[]) => {
    if (!message.trim() && files.length === 0) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      files: files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setInputValue('');
    setSelectedFiles([]);
    
    try {
      // Reset tasks to pending
      setCurrentTasks(prev => 
        prev.map(task => ({ ...task, status: 'pending' as TaskStatus }))
      );
      
      // Add AI message with pending tasks
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMessageId,
        content: "Processing your request...",
        sender: 'ai',
        timestamp: new Date(),
        tasks: currentTasks
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Fetch relevant documents
      const documents = await fetchRelevantDocuments(message, files);
      setRelevantDocs(documents);
      
      // Process the request with the LLM
      const response = await processLLMRequest(
        message, 
        files, 
        documents, 
        updateTaskStatus
      );
      
      // Update the AI message with the response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { 
                ...msg, 
                content: response.content,
                tasks: currentTasks.map(task => ({ ...task, status: 'completed' as TaskStatus }))
              } 
            : msg
        )
      );
      
      // Automatically switch to the chat tab if not already there
      if (activeTab !== "chat") {
        setActiveTab("chat");
      }
      
    } catch (error) {
      console.error("Error processing message:", error);
      
      // Update with error message
      setMessages(prev => 
        prev.map(msg => 
          msg.sender === 'ai' && msg === prev[prev.length - 1]
            ? { 
                ...msg, 
                content: "I'm sorry, I encountered an error processing your request. Please try again.",
                tasks: currentTasks.map(task => 
                  task.status === 'in-progress' 
                    ? { ...task, status: 'pending' as TaskStatus }
                    : task
                )
              } 
            : msg
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, [activeTab, currentTasks, updateTaskStatus]);

  // Input handlers
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleFileSelect = useCallback((files: File[]) => {
    setSelectedFiles(files);
  }, []);

  // Mount check to prevent hydration mismatch and reset scroll position to the top
  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  // Add initial welcome message
  useEffect(() => {
    if (mounted && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content: "Welcome! How can I assist you today? You can upload files for analysis or ask me questions directly.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    }
  }, [mounted, messages.length]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-4 flex flex-col md:flex-row gap-4">
          {/* Chat Section */}
          {!isChatMinimized && (
            <div className="md:w-1/3 lg:w-2/5 h-full flex flex-col">
              <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <ProjectDropdown 
                    projectName={projectName}
                    onRename={handleProjectRename}
                    onCollaborate={handleProjectCollaborate}
                    onArchive={handleProjectArchive}
                    onDelete={handleProjectDelete}
                  />
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setIsChatMinimized(true)}
                      className="md:hidden p-1 rounded-full hover:bg-gray-200"
                      aria-label="Minimize chat"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <Suspense fallback={<ChatSkeleton />}>
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
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
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
                          
                          {/* Display tasks if any */}
                          {message.tasks && (
                            <div className="mt-3 bg-gray-100 rounded p-2 space-y-2 border border-gray-200">
                              {message.tasks.map((task) => (
                                <div key={task.id} className="flex items-start">
                                  <div className="flex-shrink-0 mt-0.5">
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
                                  <span className="ml-2 text-xs text-gray-700">{task.description}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="text-right mt-1 text-xs text-gray-400">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Show typing indicator when processing */}
                    {isProcessing && !messages.find(m => m.sender === 'ai' && m.tasks) && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-lg p-3 max-w-[85%]">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Suspense>
                
                {/* Chat input area */}
                <div className="border-t border-gray-200">
                  {/* Selected files */}
                  {selectedFiles.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-100">
                      <div className="text-xs font-medium mb-1 text-gray-700">Selected files:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center bg-white text-xs rounded-full pl-2 pr-1 py-1 border border-gray-300 text-gray-800">
                            <span className="truncate max-w-[100px]">{file.name}</span>
                            <button 
                              onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                              disabled={isProcessing}
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
                  
                  <div className="p-3 bg-white">
                    <div className="flex items-end">
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        id="file-upload"
                        onChange={(e) => {
                          if (e.target.files) {
                            const filesArray = Array.from(e.target.files);
                            handleFileSelect([...selectedFiles, ...filesArray]);
                          }
                        }}
                        disabled={isProcessing}
                      />
                      <button
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="p-2 text-gray-500 hover:text-gray-700"
                        title="Upload files"
                        disabled={isProcessing}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>
                      
                      <textarea
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (inputValue.trim() || selectedFiles.length > 0) {
                              handleSendMessage(inputValue, selectedFiles);
                            }
                          }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-800 placeholder-gray-400"
                        rows={1}
                        disabled={isProcessing}
                      />
                      
                      {/* Play/Stop Button */}
                      <PlayStopButton 
                        isProcessing={isProcessing} 
                        hasInput={!!inputValue.trim() || selectedFiles.length > 0}
                        onStart={() => {
                          if (inputValue.trim() || selectedFiles.length > 0) {
                            handleSendMessage(inputValue, selectedFiles);
                          }
                        }}
                      />
                    </div>
                    
                    {/* Subscription indicator */}
                    <div className="mt-1 text-center">
                      <span className="text-xs text-gray-500">
                        {isPaidUser ? 'Premium User' : 'Free User'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Tabbed Content Area */}
          <div
            className={`flex-1 h-full transition-all duration-300 ${
              isChatMinimized ? "w-full" : "md:w-2/3 lg:w-3/5"
            }`}
          >
            <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
              {/* View Actions placed above the tabs header */}
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <Suspense fallback={<div className="p-2">Loading actions...</div>}>
                  <ViewActions activeTab={activeTab} setActiveTab={setActiveTab} />
                </Suspense>
              </div>
              
              {/* Tabs Header and Active Tab Content */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <Suspense fallback={<div className="p-4">Loading tabs...</div>}>
                  <ViewTabs 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                  />
                </Suspense>
              </div>
            </div>
          </div>
          
          {/* Mobile Chat Toggle Button */}
          {isChatMinimized && (
            <button
              onClick={() => setIsChatMinimized(false)}
              className="md:hidden fixed bottom-6 left-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-10"
              aria-label="Show chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}