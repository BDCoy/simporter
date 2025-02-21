import React, { useState } from 'react';
import { 
  Play, 
  Loader2, 
  AlertCircle, 
  Command, 
  Plus,
  Sparkles,
  ArrowLeft,
  ShoppingCart,
  Lightbulb,
  TrendingUp,
  Users,
  Map,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { createProjectFromSearch } from '@/lib/services/project';
import { AuthModal } from '@/components/AuthModal';

const quickStartTemplates = [
  { 
    icon: ShoppingCart, 
    title: 'Generate Category Report',
    prompt: '/category',
    placeholder: "Describe the category and report you'd like",
    color: 'text-emerald-600'
  },
  { 
    icon: Lightbulb, 
    title: 'Create Innovation Brief',
    prompt: '/innovation',
    placeholder: "Describe the innovation area you'd like to explore",
    color: 'text-blue-600'
  },
  { 
    icon: TrendingUp, 
    title: 'Analyze Social Trends',
    prompt: '/trends',
    placeholder: "Specify the trends you'd like to analyze",
    color: 'text-purple-600'
  },
  { 
    icon: Users, 
    title: 'Build Consumer Profile',
    prompt: '/profile',
    placeholder: "Describe the consumer segment you'd like to analyze",
    color: 'text-orange-600'
  },
  { 
    icon: Map, 
    title: 'Map Competitive Landscape',
    prompt: '/landscape',
    placeholder: "Specify the market segment you'd like to map",
    color: 'text-red-600'
  },
  { 
    icon: MessageCircle, 
    title: 'Design Product Concept',
    prompt: '/concept',
    placeholder: "Describe the product concept you'd like to develop",
    color: 'text-indigo-600'
  },
];

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<typeof quickStartTemplates[0] | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [aiDiscoveryEnabled, setAiDiscoveryEnabled] = useState(true);
  const { setProjectName, setView } = useStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/' && !searchQuery && !e.repeat) {
      // Only show commands if it's the first character
      setShowCommands(true);
      setSelectedCommand(0);
    } else if (e.key === 'Escape') {
      setShowCommands(false);
      setSelectedCommand(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showCommands && selectedCommand >= 0) {
        handleTemplateClick(quickStartTemplates[selectedCommand]);
      } else {
        handleSearch(e);
      }
    } else if (showCommands) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCommand((prev) => 
          prev < quickStartTemplates.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCommand((prev) => prev > 0 ? prev - 1 : prev);
      }
    }
  };

  const handleTemplateClick = (template: typeof quickStartTemplates[0]) => {
    setSearchQuery(template.prompt + ' ');
    setActiveTemplate(template);
    const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
      const length = template.prompt.length + 1;
      inputElement.setSelectionRange(length, length);
    }
    setShowCommands(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Create project from search with AI discovery flag
      const project = await createProjectFromSearch(searchQuery.trim(), aiDiscoveryEnabled);
      
      // Set the project name
      setProjectName(project.name);
      
      // Navigate to projects page with the project data
      setView('projects', { 
        projectId: project.id,
        query: searchQuery,
        aiDiscovery: aiDiscoveryEnabled
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Authentication required') {
          setShowAuthModal(true);
        } else {
          setError('Failed to process your request. Please try again.');
          console.error('Error processing query:', error);
        }
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12 mt-10">
        <h1 className="text-4xl font-bold mb-4 dark:text-white font-sf-pro">
          What do you want to discover?
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-xl font-sf-pro">
          Generate insights, reports, and recommendations for consumer goods innovation.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activeTemplate?.placeholder || 'Type "/" for commands or enter your question...'}
              className={cn(
                "w-full px-6 py-4 text-lg rounded-lg pr-32",
                "border-2 border-gray-200 dark:border-gray-700",
                "bg-white dark:bg-gray-800",
                "text-gray-900 dark:text-white",
                "focus:outline-none focus:border-blue-500",
                "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                "font-sf-pro",
                "transition-colors",
                activeTemplate && activeTemplate.color
              )}
              style={{
                caretColor: activeTemplate?.color.replace('text-', '') || 'currentColor'
              }}
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setAiDiscoveryEnabled(!aiDiscoveryEnabled)}
                className={cn(
                  "flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                  aiDiscoveryEnabled
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                )}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI
              </button>
              <button 
                type="button"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                onClick={() => {
                  setShowCommands(true);
                  setSearchQuery('/');
                  const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (inputElement) {
                    inputElement.focus();
                    inputElement.setSelectionRange(1, 1);
                  }
                }}
              >
                <Command className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                type="submit"
                disabled={!searchQuery.trim() || isProcessing}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  !searchQuery.trim() || isProcessing
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400"
                    : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                )}
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="absolute left-0 right-0 -bottom-12 flex items-center justify-center text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          {showCommands && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              {quickStartTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateClick(template)}
                  className={cn(
                    "w-full flex items-center px-4 py-2 text-left",
                    "hover:bg-gray-50 dark:hover:bg-gray-700",
                    "transition-colors",
                    selectedCommand === index && "bg-gray-50 dark:bg-gray-700"
                  )}
                >
                  <template.icon className={cn("w-4 h-4 mr-3", template.color)} />
                  <span className={cn("font-medium", template.color)}>{template.prompt}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {template.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}