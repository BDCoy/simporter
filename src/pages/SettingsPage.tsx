import React from 'react';
import { useStore } from '@/lib/store';
import { 
  Moon, 
  Sun, 
  Bell, 
  Globe, 
  Lock, 
  CreditCard, 
  Cloud,
  Users,
  Trash2,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

interface SettingsPageProps {
    user: User | null;
  }

export function SettingsPage({ user }: SettingsPageProps) {
  const { darkMode, setDarkMode, setView } = useStore();

  const handleNavigateToTeam = () => {
    setView('team');
  };

  const handleNavigateToTokenUsage = () => {
    setView('token-usage');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8 dark:text-white">Settings</h1>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4 dark:text-white">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {darkMode ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                darkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium dark:text-white">Notifications</h2>
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="space-y-4">
            {['Email notifications', 'Push notifications', 'Weekly digest'].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                <button
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium dark:text-white">Account</h2>
            <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          
          <div className="space-y-6">
            {/* Profile */}
            <div className="flex items-center space-x-4">
              <img 
              src={`https://eu.ui-avatars.com/api/?name=${user?.user_metadata.full_name.replace(' ', '+') || 'User+Name'}&size=250`} 
              alt={user?.user_metadata.full_name || 'User'} 
              className="w-16 h-16 rounded-full"
              />
              <div>
              <h3 className="font-medium dark:text-white">
              {user?.user_metadata.full_name || 'User Name'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
              {user?.email || 'email@example.com'}
              </p>
              </div>
            </div>

            {/* Settings List */}
            <div className="space-y-2">
              {[
                { icon: Globe, text: 'Language' },
                { icon: CreditCard, text: 'Billing' },
                { icon: Cloud, text: 'Storage' },
                { 
                  icon: Users, 
                  text: 'Team Members',
                  onClick: handleNavigateToTeam,
                  showArrow: true
                },
                { 
                  icon: BarChart3, 
                  text: 'Token Usage',
                  onClick: handleNavigateToTokenUsage,
                  showArrow: true
                }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
                  </div>
                  {item.showArrow && <ChevronRight className="w-4 h-4 text-gray-400" />}
                </button>
              ))}
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-red-600 mb-4">Danger Zone</h3>
              <button className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}