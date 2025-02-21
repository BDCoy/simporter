import React from 'react';
import { 
  Folders, 
  Home, 
  LayoutTemplate, 
  Library,
  Beaker,
  Book,
  HelpCircle,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';

interface SidebarProps {
  onHelpClick: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ onHelpClick, isMobile, onClose }: SidebarProps) {
  const { currentView, setView } = useStore();
  const [isExpanded, setIsExpanded] = React.useState(isMobile);

  const navigation = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'my-projects', name: 'My Projects', icon: Folders, className: 'projects-nav' },
    { id: 'templates', name: 'Templates', icon: LayoutTemplate, className: 'templates-nav' },
    { id: 'library', name: 'Library', icon: Library },
    { id: 'concept-test', name: 'Concept Test', icon: Beaker },
    { id: 'knowledge-base', name: 'Knowledge Base', icon: Book }
  ];

  const handleNavClick = (id: string) => {
    setView(id);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div 
      className={cn(
        "h-full flex flex-col transition-all duration-300 z-40",
        "bg-white dark:bg-[#202123] border-r border-gray-200 dark:border-[#4E4F60]/20",
        isMobile ? "w-[280px]" : (isExpanded ? "w-64" : "w-14")
      )}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-[#4E4F60]/20">
          <img 
            src="https://simporter.com/wp-content/uploads/2025/01/Simporter-Logo-Black-Text.svg"
            alt="Simporter"
            className="h-6 w-auto dark:invert"
          />
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-[#ECECF1] dark:hover:bg-[#2A2B32] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-[#343541] dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-[#ECECF1] dark:hover:bg-[#2A2B32]',
                  item.className
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0',
                    (isExpanded || isMobile) && 'mr-3',
                    isActive
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 group-hover:text-gray-700 dark:text-[#ECECF1] dark:group-hover:text-white'
                  )}
                />
                {(isExpanded || isMobile) && (
                  <span className="truncate">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-[#4E4F60]/20">
        <button
          onClick={onHelpClick}
          className={cn(
            "w-full flex items-center px-3 py-2.5 rounded-md transition-colors",
            "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            "dark:text-[#ECECF1] dark:hover:bg-[#2A2B32]"
          )}
        >
          <HelpCircle className="w-5 h-5" />
          {(isExpanded || isMobile) && <span className="ml-3 text-sm">Help</span>}
        </button>
        {!isMobile && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "w-full flex items-center justify-center p-2 mt-1 rounded-md transition-colors",
              "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              "dark:text-[#ECECF1] dark:hover:bg-[#2A2B32]"
            )}
          >
            <ChevronRight className={cn(
              "w-4 h-4 transition-transform",
              isExpanded && "rotate-180"
            )} />
          </button>
        )}
      </div>
    </div>
  );
}