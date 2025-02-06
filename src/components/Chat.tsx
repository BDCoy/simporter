import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, User, Bot, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface ChatProps {
  query: string;
}

interface Message {
  id: number;
  type: 'user' | 'assistant' | 'error';
  content: string;
}

interface ApiError {
  type: string;
  error: {
    type: string;
    message: string;
  };
}

function Chat({ query }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeCode = async (userQuery: string, retry = false) => {
    try {
      setLoading(true);
      
      const codeElement = document.querySelector('pre code');
      const code = codeElement ? codeElement.textContent || '' : '';

      const response = await axios.post('/api/analyze', {
        query: userQuery,
        code
      });

      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'assistant',
        content: response.data.analysis
      }]);
      setRetryCount(0);
    } catch (error: any) {
      console.error('Error analyzing code:', error);
      
      const errorResponse = error.response?.data as ApiError;
      let errorMessage = 'Sorry, I encountered an error while analyzing the code. Please try again.';
      
      if (errorResponse?.error?.type === 'rate_limit_error') {
        errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
      } else if (errorResponse?.error?.type === 'overloaded_error') {
        errorMessage = 'The AI service is currently overloaded. Please try again in a few moments.';
        if (!retry && retryCount < 3) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            analyzeCode(userQuery, true);
          }, Math.pow(2, retryCount) * 1000);
          return;
        }
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      setMessages([{
        id: Date.now(),
        type: 'user',
        content: query
      }]);
      analyzeCode(query);
    }
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    await analyzeCode(input);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-medium text-gray-900">AI Assistant</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === 'assistant' ? 'bg-gray-50' : 
              message.type === 'error' ? 'bg-red-50' : ''
            } p-3 rounded-lg`}
          >
            {message.type === 'assistant' ? (
              <Bot className="h-6 w-6 text-indigo-600" />
            ) : message.type === 'error' ? (
              <AlertCircle className="h-6 w-6 text-red-600" />
            ) : (
              <User className="h-6 w-6 text-gray-600" />
            )}
            <div className="flex-1">
              <p className={`text-sm ${
                message.type === 'error' ? 'text-red-800' : 'text-gray-900'
              } whitespace-pre-wrap`}>{message.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
      </form>
    </div>
  );
}

export default Chat