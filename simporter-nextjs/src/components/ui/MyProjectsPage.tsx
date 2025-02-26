"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Archive, Trash2, Share2, Users } from "lucide-react";
import { cn } from "../../lib/utils";

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  status: "active" | "archived";
  category: string;
}

const sampleProjects: Project[] = [
  {
    id: "project-1",
    name: "Project One",
    description: "This is a sample project description for project one.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    category: "Category Analysis",
  },
  {
    id: "project-2",
    name: "Project Two",
    description: "This is a sample project description for project two.",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "archived",
    category: "Innovation",
  },
];

const categoryColors: Record<string, string> = {
  "Category Analysis": "text-emerald-600 bg-emerald-100",
  Innovation: "text-blue-600 bg-blue-100",
  Trends: "text-purple-600 bg-purple-100",
  "Consumer Profile": "text-orange-600 bg-orange-100",
  "Competitive Landscape": "text-red-600 bg-red-100",
  "Product Concept": "text-indigo-600 bg-indigo-100",
};

export default function MyProjects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "active" | "archived">("all");
  const [projects, setProjects] = useState<Project[]>(sampleProjects);

  const handleOpenProject = (projectId: string) => {
    // For demonstration, simply log
    console.log("Open project:", projectId);
  };

  const handleArchiveProject = (projectId: string) => {
    // Simulate archiving by updating state
    setProjects((prevProjects) =>
      prevProjects.map((proj) =>
        proj.id === projectId ? { ...proj, status: "archived" } : proj
      )
    );
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || project.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Projects</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and organize your projects
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg bg-white"
          />
          <div className="flex items-center space-x-2">
            {["all", "active", "archived"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter as "all" | "active" | "archived")}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md",
                  selectedFilter === filter
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const isPlaceholder = project.id.startsWith("placeholder-");
          const colorClass = categoryColors[project.category] || "";
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow",
                isPlaceholder ? "opacity-75" : ""
                            )}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2 rounded-lg", colorClass)}>
                    {/* Optionally render a category icon */}
                  </div>
                  {!isPlaceholder && (
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchiveProject(project.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleOpenProject(project.id)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {isPlaceholder ? "Create Similar" : "Open Project"}
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </button>
              </div>
              {project.status === "archived" && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    Archived
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects found
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? "No projects match your search criteria"
              : "Get started by creating your first project"}
          </p>
        </div>
      )}
    </div>
  );
}
