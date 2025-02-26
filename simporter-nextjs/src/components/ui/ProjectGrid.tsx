"use client";

import React from "react";
import ProjectCard, { Project } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
  onOpen: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  columns?: 2 | 3 | 4 | 6;
  showHeader?: boolean;
  title?: string;
  description?: string;
}

export default function ProjectGrid({ 
  projects, 
  onOpen, 
  onArchive, 
  onDelete,
  onShare, 
  columns = 3,
  showHeader = true,
  title = "My Projects",
  description = "Manage and organize your research"
}: ProjectGridProps) {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 md:grid-cols-3",
    4: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    6: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
  };

  return (
    <div>
      {showHeader && (
        <>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{description}</p>
        </>
      )}
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onOpen={onOpen} 
            onArchive={onArchive}
            onDelete={onDelete}
            onShare={onShare}
          />
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            No projects available
          </p>
        </div>
      )}
    </div>
  );
}