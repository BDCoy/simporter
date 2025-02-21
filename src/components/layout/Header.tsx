import React, { useState } from 'react';
import { 
  Bell, 
  UserCircle2, 
  Gift,
  ChevronDown,
  LogOut,
  LogIn,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import { ReferralModal } from '../ReferralModal';
import { NotificationPopup, type Notification } from '../NotificationPopup';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/auth';
import { AuthModal } from '../AuthModal';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  showMenuButton?: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
}

const userMenuItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Header({ onMenuClick, isSidebarOpen, showMenuButton = true, user, setUser }: HeaderProps) {
  const { setView, currentView } = useStore();
  console.log('header user:', user);
  const [menuStates, setMenuStates] = useState({
    referral: false,
    user: false,
    notifications: false,
    auth: false
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleMenu = (menu: keyof typeof menuStates) => {
    setMenuStates(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleNavigation = (view: string) => {
    setView(view);
    setMenuStates(prev => ({ ...prev, user: false }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      handleNavigation('welcome');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNotificationAction = (id: string, action: 'read' | 'clear') => {
    if (action === 'read') {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  return (
    <>
      <header className="h-14 border-b border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[#343541]">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2A2B32] rounded-lg transition-colors"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <img 
              src="https://simporter.com/wp-content/uploads/2025/01/Simporter-Logo-Black-Text.svg"
              alt="Simporter"
              className="h-8 w-auto hidden sm:block dark:invert"
            />
          </div>

          <div className="flex items-center space-x-3">
            {user && (
              <>
                <button
                  onClick={() => toggleMenu('referral')}
                  className="hidden sm:flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-md"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Get Free Tokens
                </button>

                <div className="relative">
                  <button
                    onClick={() => toggleMenu('notifications')}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2A2B32] rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {menuStates.notifications && (
                      <NotificationPopup
                        notifications={notifications}
                        onClose={() => toggleMenu('notifications')}
                        onMarkAsRead={(id) => handleNotificationAction(id, 'read')}
                        onClearAll={() => handleNotificationAction('', 'clear')}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            <div className="relative">
              <button
                onClick={() => toggleMenu('user')}
                className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2A2B32] rounded-lg transition-colors"
              >
                {user ? (
                  <img src={`https://eu.ui-avatars.com/api/?name=${user?.user_metadata.full_name.replace(' ', '+') || 'User+Name'}&size=250`} alt={user.user_metadata.full_name || 'User'} className="w-8 h-8 rounded-full" />
                ) : (
                  <UserCircle2 className="w-8 h-8" />
                )}
                <ChevronDown className="w-4 h-4 hidden sm:block" />
              </button>

              <AnimatePresence>
                {menuStates.user && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#202123] rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700"
                  >
                    {user && userMenuItems.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => handleNavigation(id)}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2B32]"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                      </button>
                    ))}
                    <button
                      onClick={user ? handleSignOut : () => toggleMenu('auth')}
                      className={`w-full flex items-center px-4 py-2 text-sm ${user ? 'text-red-600' : 'text-green-600'} hover:bg-gray-100 dark:hover:bg-[#2A2B32]`}
                    >
                      {user ? <LogOut className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                      {user ? 'Sign Out' : 'Sign In'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuStates.referral && (
          <ReferralModal
            isOpen={menuStates.referral}
            onClose={() => toggleMenu('referral')}
          />
        )}
        {menuStates.auth && (
          <AuthModal
            isOpen={menuStates.auth}
            onClose={() => toggleMenu('auth')}
          />
        )}
      </AnimatePresence>
    </>
  );
}