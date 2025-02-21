import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useStore } from '@/lib/store';
import { Walkthrough } from '../Walkthrough';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

import type { User } from '@supabase/supabase-js';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  setUser: (user: User | null) => void;
}

export function Layout({ children, user, setUser }: LayoutProps) {
  const { darkMode, customWallpaper, currentView, setView } = useStore();
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Determine if sidebar should be shown
  const showSidebar = currentView !== 'welcome' && currentView !== 'library' && currentView !== 'custom-feature';

  // Close sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  return (
    <div 
      className={cn(
        "h-screen flex",
        darkMode ? 'dark bg-[#343541]' : 'bg-white',
        "transition-colors duration-200"
      )}
      style={{
        backgroundImage: customWallpaper ? `url(${customWallpaper})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Mobile Sidebar Overlay */}
      {showSidebar && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Full height on mobile */}
      {showSidebar && (
        <div className={cn(
          "fixed inset-y-0 left-0 lg:relative z-50",
          "transition-transform duration-300 lg:translate-x-0",
          "h-[100dvh] lg:h-screen", // Use dynamic viewport height on mobile
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <Sidebar 
            onHelpClick={() => setShowWalkthrough(true)} 
            isMobile={window.innerWidth < 1024}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Now with hamburger menu */}
        <Header 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          showMenuButton={showSidebar}
          user={user}
          setUser={setUser}
        />

        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-y-auto",
          "bg-gradient-to-b from-white to-gray-50 dark:from-[#343541] dark:to-[#2a2b32]",
          "transition-colors duration-200"
        )}>
          <div className="h-full max-w-[1200px] mx-auto px-4 py-6">
            {/* Back Button */}
            {currentView !== 'welcome' && (
              <button
                onClick={() => setView('welcome')}
                className="mb-6 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
                aria-label="Back to Welcome"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {children}
          </div>
        </main>
      </div>

      {/* Walkthrough */}
      {showWalkthrough && (
        <Walkthrough onClose={() => setShowWalkthrough(false)} />
      )}
    </div>
  );
}