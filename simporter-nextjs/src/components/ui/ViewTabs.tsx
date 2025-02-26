"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, Presentation, Database, Upload, FileText, MessageSquare } from "lucide-react";

interface ViewTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

// Now each tab has separate classes for text and the bottom indicator
const tabs = [
  {
    id: "code",
    label: "Code",
    icon: Code,
    textColor: "text-red-500",
    indicatorColor: "bg-red-500",
  },
  {
    id: "slides",
    label: "Slides",
    icon: Presentation,
    textColor: "text-blue-500",
    indicatorColor: "bg-blue-500",
  },
  {
    id: "dataset",
    label: "Dataset",
    icon: Database,
    textColor: "text-yellow-500",
    indicatorColor: "bg-yellow-500",
  },
  {
    id: "uploaded",
    label: "Uploaded Data",
    icon: Upload,
    textColor: "text-green-500",
    indicatorColor: "bg-green-500",
  },
  {
    id: "document",
    label: "Document",
    icon: FileText,
    textColor: "text-blue-500",
    indicatorColor: "bg-blue-500",
  },
  {
    id: "qa",
    label: "Q&A",
    icon: MessageSquare,
    textColor: "text-purple-500",
    indicatorColor: "bg-purple-500",
  },
];

const ViewTabs: React.FC<ViewTabsProps> = ({ activeTab, setActiveTab, className = "" }) => {
  return (
    <div className={`flex items-center overflow-x-auto scrollbar-hide border-b border-gray-200 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-current={isActive ? "page" : undefined}
            className={`
              relative px-4 py-3 flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors
              ${
                isActive
                  ? `${tab.textColor}`
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}

            {isActive && (
              <motion.div
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.indicatorColor}`}
                layoutId="activeTabIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ViewTabs;
