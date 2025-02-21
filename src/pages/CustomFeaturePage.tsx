import React, { useState } from 'react';
import { Settings, Users, DollarSign, Bot, Database, Plug, Code } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface UserInfo {
  name: string;
  email: string;
  company?: string;
}

const featureTypes = [
  { 
    icon: Bot, 
    label: 'Custom AI Agent', 
    description: 'Specialized AI agents tailored to your needs',
    bgColor: 'bg-[#C19B83] bg-opacity-40',
    textColor: 'text-black'
  },
  { 
    icon: Database, 
    label: 'Custom Data Model', 
    description: 'Specialized data processing and analysis',
    bgColor: 'bg-[#B5A68F] bg-opacity-40',
    textColor: 'text-black'
  },
  { 
    icon: Plug, 
    label: 'Integration', 
    description: 'Connect with your existing tools and platforms',
    bgColor: 'bg-[#A56548] bg-opacity-40',
    textColor: 'text-black'
  },
  { 
    icon: Code, 
    label: 'Platform Feature', 
    description: 'New functionality in the Simporter platform',
    bgColor: 'bg-[#D4C1A6] bg-opacity-40',
    textColor: 'text-black'
  }
];

export function CustomFeaturePage() {
  const { darkMode } = useStore();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    company: '',
  });
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [potentialUsers, setPotentialUsers] = useState('');
  const [budget, setBudget] = useState('');
  const [featureType, setFeatureType] = useState('');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaValue) {
      alert('Please complete the captcha');
      return;
    }
    setIsSubmitting(true);
    // Here you would typically send the data to your backend
    console.log({
      userInfo,
      featureType,
      problem,
      solution,
      potentialUsers,
      budget,
      captchaValue,
    });
    setIsSubmitting(false);
  };

  const inputClasses = "w-full px-4 py-2 bg-white dark:bg-[#2A2B32] border border-[#E5E7EB] dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#C19B83] focus:border-transparent transition-colors text-[#1A1A1A] dark:text-white placeholder-gray-500 dark:placeholder-gray-400";

  return (
    <div className="min-h-screen bg-white dark:bg-[#343541]">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C19B83] bg-opacity-40 dark:bg-[#C19B83]/20 mb-6">
            <Settings className="w-8 h-8 text-[#1A1A1A] dark:text-white" />
          </div>
          <h1 className="text-[42px] font-normal tracking-[-0.02em] text-[#1A1A1A] dark:text-white mb-4">
            Request a Custom Feature
          </h1>
          <p className="text-[14px] text-[#666666] dark:text-gray-400 max-w-2xl mx-auto">
            Need something specific for your business? Request a custom feature for Simporter's AI platform.
          </p>
        </div>

        {/* Feature Type Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {featureTypes.map((type, index) => (
            <motion.button
              key={type.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isLoaded ? 1 : 0, 
                y: isLoaded ? 0 : 20 
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}
              onClick={() => setFeatureType(type.label)}
              className={cn(`
                ${type.bgColor}
                ${type.textColor}
                w-full
                p-4
                rounded-lg
                transition-all
                duration-300
                relative
                text-left
                border
                border-[#E5E7EB]
                dark:border-gray-700
                overflow-hidden
                group
                hover:shadow-lg
              `,
                featureType === type.label && "ring-2 ring-[#C19B83] dark:ring-[#C19B83]/50"
              )}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-white/50 dark:bg-black/10">
                  <type.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[15px] font-medium mb-1 dark:text-white">
                    {type.label}
                  </h3>
                  <p className="text-[12px] text-[#666666] dark:text-gray-400">
                    {type.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-8 bg-white dark:bg-[#2A2B32] p-8 rounded-lg border border-[#E5E7EB] dark:border-gray-700 shadow-sm"
        >
          {/* User Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-2">
                Name
              </label>
              <input
                type="text"
                required
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-2">
              Company
            </label>
            <input
              type="text"
              value={userInfo.company}
              onChange={(e) => setUserInfo({ ...userInfo, company: e.target.value })}
              className={inputClasses}
            />
          </div>

          {/* Problem Description */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-2">
              What business challenge are you trying to solve?
            </label>
            <textarea
              required
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={4}
              className={cn(inputClasses, "resize-none")}
              placeholder="Describe your specific business problem or opportunity..."
            />
          </div>

          {/* Solution Vision */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-2">
              How do you envision this feature working?
            </label>
            <textarea
              required
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={4}
              className={cn(inputClasses, "resize-none")}
              placeholder="Describe your ideal solution and specific requirements..."
            />
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-2">
                <Users className="inline-block w-4 h-4 mr-1" />
                Who will use this feature?
              </label>
              <input
                type="text"
                value={potentialUsers}
                onChange={(e) => setPotentialUsers(e.target.value)}
                placeholder="e.g., Sales team, Data analysts"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-2">
                <DollarSign className="inline-block w-4 h-4 mr-1" />
                Estimated Budget Range
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., $10,000 - $50,000"
                className={inputClasses}
              />
            </div>
          </div>

          {/* reCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="YOUR_RECAPTCHA_SITE_KEY"
              onChange={(value) => setCaptchaValue(value)}
              theme={darkMode ? 'dark' : 'light'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !captchaValue || !featureType}
            className={cn(
              "w-full py-3 px-4 rounded-xl font-medium transition-all",
              "text-white bg-[#C19B83] hover:bg-[#A56548]",
              "focus:outline-none focus:ring-2 focus:ring-[#C19B83] focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-sm hover:shadow-md"
            )}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Custom Feature Request'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}