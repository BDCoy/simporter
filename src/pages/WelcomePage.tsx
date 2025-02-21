import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Library, Wrench } from 'lucide-react';
import { useStore } from '@/lib/store';
import { TermsModal } from '@/components/TermsModal';
import { PrivacyModal } from '@/components/PrivacyModal';
import { signInWithGoogle, signInWithMicrosoft } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';

const MODELS = [
  {
    id: 'maple-1',
    name: 'Maple-1',
    description: 'Innovate in CPG',
    bgColor: 'bg-[#C19B83] bg-opacity-40',
    textColor: 'text-black',
    icon: Brain
  },
  {
    id: 'library',
    name: 'Library',
    description: 'Get More Value',
    bgColor: 'bg-[#B5A68F] bg-opacity-40',
    textColor: 'text-black',
    icon: Library
  },
  {
    id: 'custom',
    name: 'Custom Feature',
    description: 'Make a request',
    bgColor: 'bg-[#A56548] bg-opacity-40',
    textColor: 'text-black',
    icon: Wrench
  }
];

interface WelcomePageProps {
  user: User | null;
}

export function WelcomePage({ user }: WelcomePageProps) {
  const { setView } = useStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleModelSelect = (modelId: string) => {
    switch (modelId) {
      case 'maple-1':
        setView('home');
        break;
      case 'library':
        setView('library');
        break;
      case 'custom':
        setView('custom-feature');
        break;
    }
  };

  const handleGoogleSignIn = async () => {
    const data = await signInWithGoogle();
    if ('error' in data) {
      setErrorMessage('Google sign in failed');
      setView('welcome');
    }
  }

  const handleMicrosoftSignIn = async () => {
    const data = await signInWithMicrosoft();
    if ('error' in data) {
      setErrorMessage('Microsoft sign in failed');
      setView('welcome');
    }
  };

  return (
    <div className="min-h-screen bg-white px-5 py-8 flex flex-col">
      <div className="max-w-[1000px] mx-auto w-full">
        <div className="flex justify-center mb-12">
          <a href="/" className="inline-block">
            <img 
              src="https://simporter.com/wp-content/uploads/2025/01/Simporter-Logo-Black-Text.svg" 
              alt="Simporter" 
              className="h-[54px] dark:invert"
            />
          </a>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[42px] font-normal tracking-[-0.02em] text-[#1A1A1A] dark:text-white mb-3">
            Welcome to Simporter
          </h1>
          <p className="text-[14px] text-[#666666] dark:text-gray-400 mb-6">
            Select an AI agent to get started or{' '}
            <a 
              href="https://www.youtube.com/@simporter" 
              className="text-[#0066FF] hover:underline dark:text-blue-400" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              visit our YouTube Channel
            </a>
          </p>
          {user === null && (
            <div className="flex justify-center space-x-4">
              <button 
                onClick={handleGoogleSignIn}
                className="inline-flex items-center px-4 py-2 border border-[#E5E7EB] dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-[#374151] dark:text-gray-300"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5 mr-2" alt="" />
                Continue with Google
              </button>
              <button 
                onClick={handleMicrosoftSignIn}
                className="inline-flex items-center px-4 py-2 border border-[#E5E7EB] dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-[#374151] dark:text-gray-300"
              >
                <img src="https://www.microsoft.com/favicon.ico" className="w-5 h-5 mr-2" alt="" />
                Continue with Microsoft
              </button>
            </div>
          )}
          {errorMessage && (
            <div className="flex items-center space-x-2 text-red-600 text-sm mt-4">
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[8px] max-w-[477px] mx-auto mb-16">
          {MODELS.map((model, index) => (
            <motion.button
              key={model.id}
              onClick={() => handleModelSelect(model.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isLoaded ? 1 : 0, 
                y: isLoaded ? 0 : 20 
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}
              className={`
                ${model.bgColor} 
                ${model.textColor} 
                w-full
                aspect-square
                rounded-lg
                p-4
                transition-all 
                duration-500
                relative
                text-left
                border
                border-[#E5E7EB]
                dark:border-gray-700
                bg-opacity-80
                overflow-hidden
                group
                hover:shadow-lg
                before:absolute
                before:content-['']
                before:top-0
                before:left-[-100%]
                before:w-[150%]
                before:h-full
                before:bg-gradient-to-r
                before:from-transparent
                before:via-white/20
                before:to-transparent
                before:transition-all
                before:duration-500
                hover:before:left-[100%]
                after:absolute
                after:content-['']
                after:top-0
                after:left-0
                after:w-full
                after:h-full
                after:bg-white/0
                hover:after:bg-white/10
                after:transition-colors
                after:duration-300
              `}
            >
              <div className="absolute bottom-4 left-4 z-10">
                <h3 className="text-[15px] font-normal mb-1 transition-transform group-hover:translate-y-[-2px] dark:text-white">
                  {model.name}
                </h3>
                <p className={`text-[10px] ${model.textColor} dark:text-gray-300 opacity-60 transition-transform group-hover:translate-y-[-2px]`}>
                  {model.description}
                </p>
              </div>
              {model.icon && (
                <div className="absolute bottom-4 right-4 z-10 transition-transform group-hover:translate-y-[-2px]">
                  <model.icon className="h-[16px] w-[16px] opacity-60 dark:text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <footer className="mt-auto pt-12 pb-6 text-center">
        <div className="text-[12px] text-[#666666] dark:text-gray-400 space-x-4">
          <button 
            onClick={() => setShowTerms(true)} 
            className="hover:underline"
          >
            Terms
          </button>
          <span>|</span>
          <button 
            onClick={() => setShowPrivacy(true)} 
            className="hover:underline"
          >
            Privacy
          </button>
        </div>
      </footer>

      {/* Modals */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
}