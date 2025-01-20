"use client";

import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Home,
  FilePlus,
  FileText,
  Sparkles,
  TrendingUp,
  Trophy,
  CreditCard,
  LogOut,
  User,
  Settings,
  Grid
} from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu')) {
        setIsUserMenuOpen(false);
      }
      if (!target.closest('.apps-menu')) {
        setIsAppsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Create Report', href: '/create-report', icon: FilePlus },
    { name: 'News Quiz', href: '/quiz', icon: Sparkles },
    { name: 'Prelaunch Forecast Tool', href: '/prelaunch-forecasting', icon: TrendingUp },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  ];

  return (
    <header className="bg-white h-16 px-4 border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-full mx-auto h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <a href="/" className="flex items-center">
              <img 
                src="https://simporter.com/wp-content/uploads/2023/07/blue-logo.svg" 
                alt="Simporter Logo" 
                className="h-6 w-auto"
              />
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2">
            {/* Apps Menu */}
            <div className="apps-menu relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAppsMenuOpen(!isAppsMenuOpen);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Grid className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Profile Menu */}
            <div className="profile-menu relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-gray-200 transition-all"
              >
                <img
                  src="https://simporter.com/wp-content/uploads/2025/01/image-removebg-preview-5.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Profile Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <img
                        src="https://simporter.com/wp-content/uploads/2025/01/image-removebg-preview-5.png"
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium">User Name</div>
                        <div className="text-sm text-gray-500">user@simporter.com</div>
                      </div>
                    </div>
                  </div>
                  <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="w-4 h-4 mr-3" />
                    My Profile
                  </a>
                  <a href="/billing" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <CreditCard className="w-4 h-4 mr-3" />
                    Billing
                  </a>
                  <a href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </a>
                  <div className="h-px bg-gray-200 my-1" />
                  <a href="/logout" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </a>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 bg-white border-b border-gray-200 mt-2 py-2 px-4 shadow-lg">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.name}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;