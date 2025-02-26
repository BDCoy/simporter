"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { ArrowUpRight, Archive, Trash2, Share2 } from "lucide-react";

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  status: "active" | "archived";
  category: string;
}

const categoryColors: Record<string, string> = {
  "Category Analysis": "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Innovation": "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  "Trends": "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
  "Consumer Profile": "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400",
  "Competitive Landscape": "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
  "Product Concept": "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400",
};

interface ProjectCardProps {
  project: Project;
  onOpen: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
}

export default function ProjectCard({
  project,
  onOpen,
  onArchive,
  onDelete,
  onShare,
}: ProjectCardProps) {
  const isPlaceholder = project.id.startsWith("placeholder-");
  const colorClass = categoryColors[project.category] || "";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
        isPlaceholder ? "opacity-75" : "",
        project.status === "archived" ? "opacity-80" : ""
      )}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("px-3 py-1 rounded-md text-xs font-medium", colorClass)}>
            {project.category}
          </div>
          {!isPlaceholder && (
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onShare && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(project.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(project.id);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Archive className="w-4 h-4" />
              </button>
              {onDelete && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {project.name}
        </h3>
        {project.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(project.created_at).toLocaleDateString(undefined, { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
        <button
          onClick={() => onOpen(project.id)}
          className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {isPlaceholder ? "Create Similar" : "Open Project"}
          <ArrowUpRight className="w-4 h-4 ml-2" />
        </button>
      </div>
      {project.status === "archived" && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
            Archived
          </span>
        </div>
      )}
    </motion.div>
  );
}