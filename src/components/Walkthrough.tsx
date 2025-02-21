import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { X, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WalkthroughProps {
  onClose?: () => void;
}

interface Step {
  title: string;
  description: string;
  target: string;
  placement: 'top' | 'right' | 'bottom' | 'left';
}

const steps: Step[] = [
  {
    title: 'Welcome to Simporter',
    description: "Let's take a quick tour of the main features.",
    target: '.logo',
    placement: 'bottom'
  },
  {
    title: 'Start a New Project',
    description: 'Use the search bar to ask questions or type "/" for quick commands.',
    target: '.search-input',
    placement: 'bottom'
  },
  {
    title: 'AI Assistant',
    description: 'Ask questions and get insights about your data.',
    target: '.chat-panel',
    placement: 'right'
  },
  {
    title: 'Project Management',
    description: 'Create and manage your projects here.',
    target: '.projects-nav',
    placement: 'right'
  },
  {
    title: 'Templates',
    description: 'Use pre-built templates to get started quickly.',
    target: '.templates-nav',
    placement: 'right'
  },
  {
    title: 'Token Management',
    description: 'Monitor your token usage and credits here.',
    target: '.token-meter',
    placement: 'bottom'
  }
];

export function Walkthrough({ onClose }: WalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { setHasSeenWalkthrough } = useStore();
  const [targetElement, setTargetElement] = useState<DOMRect | null>(null);

  useEffect(() => {
    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    return () => window.removeEventListener('resize', updateTargetPosition);
  }, [currentStep]);

  const updateTargetPosition = () => {
    const element = document.querySelector(steps[currentStep].target);
    if (element) {
      setTargetElement(element.getBoundingClientRect());
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setHasSeenWalkthrough(true);
    onClose?.();
  };

  const getPopupPosition = () => {
    if (!targetElement) return {};

    const padding = 12; // Space between target and popup
    const placement = steps[currentStep].placement;

    switch (placement) {
      case 'top':
        return {
          bottom: `${window.innerHeight - targetElement.top + padding}px`,
          left: `${targetElement.left + (targetElement.width / 2)}px`,
          transform: 'translateX(-50%)'
        };
      case 'right':
        return {
          left: `${targetElement.right + padding}px`,
          top: `${targetElement.top + (targetElement.height / 2)}px`,
          transform: 'translateY(-50%)'
        };
      case 'bottom':
        return {
          top: `${targetElement.bottom + padding}px`,
          left: `${targetElement.left + (targetElement.width / 2)}px`,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          right: `${window.innerWidth - targetElement.left + padding}px`,
          top: `${targetElement.top + (targetElement.height / 2)}px`,
          transform: 'translateY(-50%)'
        };
      default:
        return {};
    }
  };

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Semi-transparent overlay */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={handleComplete}
      />

      {/* Cut out mask for the highlighted element */}
      {targetElement && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/50">
            <div
              className="absolute bg-transparent"
              style={{
                top: targetElement.top - 4,
                left: targetElement.left - 4,
                width: targetElement.width + 8,
                height: targetElement.height + 8,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
              }}
            />
          </div>
        </div>
      )}

      {/* Highlight border */}
      {targetElement && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute border-2 border-blue-500 rounded-lg pointer-events-none"
          style={{
            top: targetElement.top - 4,
            left: targetElement.left - 4,
            width: targetElement.width + 8,
            height: targetElement.height + 8
          }}
        >
          {/* Pulsing effect */}
          <motion.div
            className="absolute inset-0 border-2 border-blue-400 rounded-lg"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}

      {/* Popup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute glass p-6 rounded-xl shadow-xl w-80"
        style={getPopupPosition()}
      >
        <button
          onClick={handleComplete}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {steps[currentStep].title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {steps[currentStep].description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex space-x-1.5">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  index === currentStep
                    ? "bg-blue-600"
                    : "bg-gray-300 dark:bg-gray-600"
                )}
              />
            ))}
          </div>

          <div className="flex space-x-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
            >
              {currentStep === steps.length - 1 ? (
                'Finish'
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}