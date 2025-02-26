"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Folders,
  LayoutTemplate,
  Book,
  Library,
  Beaker,
  HelpCircle,
  ChevronRight,
  X,
  ChevronLeft,
  Cog
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
  onExpandedChange?: (expanded: boolean) => void;
}

const navigation = [
  { id: "home", name: "Home", icon: Home, href: "/" },
  { id: "maple-1", name: "Maple-1", icon: Home, href: "/maple-1" }, // icon should change
  { id: "my-projects", name: "My Projects", icon: Folders, href: "/my-projects" },
  { id: "navigation", name: "Navigation", icon: LayoutTemplate, href: "/navigation" },
  { id: "trusted-by", name: "Trusted by", icon: Book, href: "/trusted-by" },
  { id: "library", name: "Library", icon: Library, href: "/library" },
  { id: "benefits", name: "Benefits", icon: Beaker, href: "/benefits" },
  { id: "features", name: "Features", icon: HelpCircle, href: "/features" },
  { id: "settings", name: "Settings", icon: Cog, href: "/settings" },
  { id: "start-free", name: "Start free", icon: ChevronRight, href: "/start-free" },
];

const Sidebar: React.FC<SidebarProps> = ({ isMobile, onClose, onExpandedChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const pathname = usePathname();

  // Expand sidebar on hover
  useEffect(() => {
    if (isHovering && !isMobile) {
      const timer = setTimeout(() => {
        setIsExpanded(true)
        onExpandedChange?.(true)
      }, 200)
      return () => clearTimeout(timer)
    } else if (!isHovering && !isMobile) {
      const timer = setTimeout(() => {
        setIsExpanded(false)
        onExpandedChange?.(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isHovering, isMobile, onExpandedChange])

  // Function to handle mouse enter/leave
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  // Toggle sidebar expansion manually
  const toggleSidebar = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onExpandedChange?.(newExpanded)
  }

  return (
    <aside
      className={cn(
        "h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
        isMobile ? "w-64" : isExpanded ? "w-64" : "w-16",
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mobile header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-gray-900 dark:text-white">Logo</div>
          <button onClick={onClose} className="p-2 text-gray-600 dark:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Desktop toggle button */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className="absolute right-0 top-4 -mr-3 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border border-gray-200 dark:border-gray-700 z-10"
        >
          {isExpanded ?
            <ChevronLeft className="w-4 h-4 text-gray-500" /> :
            <ChevronRight className="w-4 h-4 text-gray-500" />
          }
        </button>
      )}

      {/* Logo/Brand */}
      <div className={cn(
        "p-4 flex items-center",
        isExpanded || isMobile ? "justify-start" : "justify-center"
      )}>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              pathname === item.href ? "bg-gray-200 dark:bg-gray-700" : "",
              "text-gray-700 dark:text-gray-300 group"
            )}
            title={item.name}
          >
            <div className={cn(
              isExpanded || isMobile ? "mr-3" : "mx-auto"
            )}>
              <item.icon className="w-5 h-5" />
            </div>
            {(isExpanded || isMobile) && (
              <span className="transition-opacity duration-200">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn(
        "p-4 border-t border-gray-200 dark:border-gray-700",
        isExpanded || isMobile ? "text-sm text-gray-500" : "text-center"
      )}>
        {(isExpanded || isMobile) ? (
          <p>© 2025 Maple</p>
        ) : (
          <span className="text-xs">©</span>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;