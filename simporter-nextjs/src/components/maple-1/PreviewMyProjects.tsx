"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProjectGrid from "@/components/ui/ProjectGrid";
import type { Project } from "@/components/ui/ProjectCard";

// Sample preview project data
const sampleProjects: Project[] = [
  {
    id: "project-1",
    name: "Market Analysis Report",
    description: "Comprehensive analysis of market trends and consumer behavior in the technology sector.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    category: "Category Analysis",
  },
  {
    id: "project-2",
    name: "Product Innovation Strategy",
    description: "New product development strategy focusing on sustainable materials and eco-friendly packaging.",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    category: "Innovation",
  },
];

interface PreviewMyProjectsProps {
  maxProjects?: number;
  title?: string;
  viewAllText?: string;
  viewAllHref?: string;
}

export default function PreviewMyProjects({
  maxProjects = 2,
  title = "Recent Projects",
  viewAllText = "View All Projects",
  viewAllHref = "/projects"
}: PreviewMyProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Simulate fetching preview project data
    setProjects(sampleProjects.slice(0, maxProjects));
  }, [maxProjects]);

  const handleOpen = (id: string) => {
    console.log("PreviewMyProjects: Open project", id);
    // In a real app, navigate to project details page
    // router.push(`/projects/${id}`);
  };

  const handleArchive = (id: string) => {
    console.log("PreviewMyProjects: Archive project", id);
    // In a real app, call API to archive project
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <Link 
          href={viewAllHref}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center group"
        >
          {viewAllText}
          <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      
      <ProjectGrid 
        projects={projects} 
        onOpen={handleOpen} 
        onArchive={handleArchive}
        columns={2}
        showHeader={false}
      />
      
      {projects.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No recent projects</p>
          <Link 
            href="/projects/new" 
            className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create your first project
          </Link>
        </div>
      )}
    </div>
  );
}