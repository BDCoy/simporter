import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, RefreshCw } from 'lucide-react';
import { useStore } from '@/lib/store';
import { streamAIResponse } from '@/lib/ai';
import { getSystemPrompt } from '@/lib/commands';
import { cn } from '@/lib/utils';
import { AuthModal } from './AuthModal';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface ChatProps {
  projectId?: string;
  initialContext?: Record<string, any>;
}

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
  tokens_used?: number;
  isStreaming?: boolean;
  command?: {
    type: string;
    color: string;
  };
}

let messageCounter = 0;
const generateMessageId = () => `msg-${Date.now()}-${messageCounter++}`;

const commandTypes = {
  '/category': { color: 'text-emerald-600' },
  '/innovation': { color: 'text-blue-600' },
  '/trends': { color: 'text-purple-600' },
  '/profile': { color: 'text-orange-600' },
  '/landscape': { color: 'text-red-600' },
  '/concept': { color: 'text-indigo-600' },
};

export function Chat({ projectId, initialContext }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { useTokens, viewParams } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const processingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    setIsAuthenticated(!!user);
  };

  // Handle initial query from navigation
  useEffect(() => {
    const query = viewParams?.query;
    if (query && messages.length === 0) {
      setCurrentQuery(query);
      const command = Object.keys(commandTypes).find(cmd => query.startsWith(cmd));
      const initialMessage: Message = {
        id: generateMessageId(),
        type: 'user',
        content: query,
        timestamp: new Date(),
        command: command ? { 
          type: command,
          color: commandTypes[command].color
        } : undefined
      };
      setMessages([initialMessage]);
      handleAIResponse(query);
    }
  }, [viewParams]);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    if (currentQuery) {
      await handleAIResponse(currentQuery);
    }
  };

  const handleAIResponse = async (content: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Prevent duplicate processing
    if (processingRef.current) {
      return;
    }
    processingRef.current = true;

    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setCurrentQuery(content);
    setIsLoading(true);

    try {
      const userMessage: Message = {
        id: generateMessageId(),
        type: 'user',
        content,
        timestamp: new Date(),
        command: content.startsWith('/') ? {
          type: content.split(' ')[0],
          color: commandTypes[content.split(' ')[0]]?.color || ''
        } : undefined
      };

      const assistantMessage: Message = {
        id: generateMessageId(),
        type: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);

      // Get system prompt if command exists
      const systemPrompt = getSystemPrompt(content);

      // Stream the response
      const stream = streamAIResponse(content, systemPrompt);
      let streamContent = '';

      try {
        for await (const chunk of stream) {
          streamContent += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: streamContent }
                : msg
            )
          );
        }

        // Store message in database
        if (projectId) {
          const { error: insertError } = await supabase.from('messages').insert({
            content: streamContent,
            type: 'assistant',
            tokens_used: Math.ceil(streamContent.length / 4),
            project_id: projectId
          });

          if (insertError) {
            console.error('Failed to store message:', insertError);
          }
        }

        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, isStreaming: false }
              : msg
          )
        );

        setRetryCount(0);

      } catch (streamError: any) {
        if (streamError.name !== 'AbortError') {
          throw streamError;
        }
      }

    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'An error occurred. Please try again.';
      
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isStreaming);
        return [
          ...filtered,
          {
            id: generateMessageId(),
            type: 'error',
            content: errorMessage,
            timestamp: new Date(),
          }
        ];
      });

      if (error instanceof Error && error.message.includes('Failed to fetch') && retryCount < 3) {
        setTimeout(() => handleRetry(), 1000 * Math.pow(2, retryCount));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      processingRef.current = false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const trimmedInput = input.trim();
    setCurrentQuery(trimmedInput);
    setInput('');
    await handleAIResponse(trimmedInput);
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white/40 backdrop-blur-sm dark:bg-gray-800/40 rounded-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "group flex flex-col",
                message.type === 'user' ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] px-4 py-2 rounded-2xl relative font-sf-pro",
                  message.type === 'user'
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : message.type === 'error'
                    ? "bg-red-50 dark:bg-red-900/20 text-red-500 rounded-bl-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm"
                )}
              >
                {message.type === 'error' ? (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <div className="flex-1">{message.content}</div>
                    <button
                      onClick={() => handleRetry()}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                ) : message.command ? (
                  <div className="whitespace-pre-wrap font-medium">
                    <span className={cn(message.command.color, "font-semibold")}>
                      {message.command.type}
                    </span>
                    <span className="text-current">
                      {message.content.slice(message.command.type.length)}
                    </span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap font-medium">{message.content}</div>
                )}
              </div>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 px-2 font-medium">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 text-sm px-4">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse animation-delay-200">●</span>
              <span className="animate-pulse animation-delay-400">●</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message..."
              className={cn(
                "flex-1 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700",
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                "font-medium text-[15px] leading-normal"
              )}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-2 rounded-full transition-colors",
                !input.trim() || isLoading
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}