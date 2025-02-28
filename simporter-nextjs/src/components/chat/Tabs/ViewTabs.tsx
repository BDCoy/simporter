"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  Presentation,
  Database,
  Upload,
  FileText,
  MessageSquare,
} from "lucide-react";

// Import the content components for each tab
import CodeTab from "@/components/chat/Tabs/CodeTab";
import CollabTab from "@/components/chat/Tabs/CollabTab";
import CreateSlideModal from "@/components/chat/Tabs/CreateSlideModal";
import DataTab from "@/components/chat/Tabs/DataTab";
import DocumentTab from "@/components/chat/Tabs/DocumentTab";
import ExecutionPanel from "@/components/chat/Tabs/ExecutionPanel";
import FAQTab from "@/components/chat/Tabs/FAQTab";
import Slides from "@/components/chat/Tabs/Slides";
import SlidesTab from "@/components/chat/Tabs/SlidesTab";
import TaskList from "@/components/chat/Tabs/TaskList";
import UploadedDataTab from "@/components/chat/Tabs/UploadedDataTab";

// New missing tabs:
import ChartsTab from "@/components/chat/Tabs/Charts";
import ImagesTab from "@/components/chat/Tabs/ImagesTab";
import TokensTab from "@/components/chat/Tabs/TokensTab";

export interface ViewTabsProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  className?: string;
}

const tabConfig = [
  {
    id: "code",
    label: "Code",
    icon: Code,
    textColor: "text-red-500",
    indicatorColor: "bg-red-500",
    Component: CodeTab,
  },
  {
    id: "slides",
    label: "Slides",
    icon: Presentation,
    textColor: "text-blue-500",
    indicatorColor: "bg-blue-500",
    Component: SlidesTab,
  },
  {
    id: "dataset",
    label: "Dataset",
    icon: Database,
    textColor: "text-yellow-500",
    indicatorColor: "bg-yellow-500",
    Component: DataTab,
  },
  {
    id: "uploaded",
    label: "Uploaded Data",
    icon: Upload,
    textColor: "text-green-500",
    indicatorColor: "bg-green-500",
    Component: UploadedDataTab,
  },
  {
    id: "document",
    label: "Document",
    icon: FileText,
    textColor: "text-blue-500",
    indicatorColor: "bg-blue-500",
    Component: DocumentTab,
  },
  {
    id: "faq",
    label: "FAQ",
    icon: MessageSquare,
    textColor: "text-purple-500",
    indicatorColor: "bg-purple-500",
    Component: FAQTab,
  },
  {
    id: "collab",
    label: "Collaborate",
    icon: MessageSquare,
    textColor: "text-pink-500",
    indicatorColor: "bg-pink-500",
    Component: CollabTab,
  },
  {
    id: "charts",
    label: "Charts",
    icon: Presentation,
    textColor: "text-blue-500",
    indicatorColor: "bg-blue-500",
    Component: ChartsTab,
  },
  {
    id: "images",
    label: "Images",
    icon: Upload,
    textColor: "text-green-500",
    indicatorColor: "bg-green-500",
    Component: ImagesTab,
  },
  {
    id: "tokens",
    label: "Tokens/History",
    icon: Code,
    textColor: "text-gray-500",
    indicatorColor: "bg-gray-500",
    Component: TokensTab,
  },
  {
    id: "execution",
    label: "Execution",
    icon: Code,
    textColor: "text-orange-500",
    indicatorColor: "bg-orange-500",
    Component: ExecutionPanel,
  },
];

const ViewTabs: React.FC<ViewTabsProps> = ({
  activeTab,
  setActiveTab = () => {},
  className = "",
}) => {
  const activeTabConfig = tabConfig.find((tab) => tab.id === activeTab);
  const ActiveComponent = activeTabConfig ? activeTabConfig.Component : null;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Sticky Header */}
      <div
        className={`sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}
      >
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          {tabConfig.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={`
                  relative px-4 py-3 flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors
                  ${isActive ? tab.textColor : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}
                `}
              >
                <Icon className="w-4 h-4" />
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
      </div>
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {ActiveComponent ? <ActiveComponent /> : <div>Select a Tab</div>}
      </div>
    </div>
  );
};

export default ViewTabs;
