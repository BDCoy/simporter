"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

// UI Components
import SearchBarWithCommands from "@/components/ui/SearchBarWithCommands";
import InspiringCarousel from "@/components/ui/InspiringCarousel";
import ProjectCard, { Project as ProjectType } from "@/components/ui/ProjectCard";

export default function FullSearch() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sample projects data typed as ProjectType
  // Removed "lastUpdated" to match the expected type
  const projects: ProjectType[] = [
    {
      id: "1",
      name: "Market Analysis",
      description: "Beauty industry trends Q1 2025",
      created_at: "2025-01-15T10:30:00Z",
      status: "active",
      category: "", // provided as empty string if none
    },
    {
      id: "2",
      name: "Consumer Research",
      description: "Gen Z preferences survey results",
      created_at: "2025-01-20T14:20:00Z",
      status: "active",
      category: "",
    },
    {
      id: "3",
      name: "Competitor Analysis",
      description: "Top 5 competitors feature comparison",
      created_at: "2025-01-22T09:15:00Z",
      status: "active",
      category: "",
    },
    {
      id: "4",
      name: "Product Innovation",
      description: "New formula sustainability assessment",
      created_at: "2025-01-24T16:45:00Z",
      status: "active",
      category: "product",
    },
    {
      id: "5",
      name: "Market Strategy",
      description: "2025 GTM planning document",
      created_at: "2025-01-21T11:10:00Z",
      status: "archived",
      category: "strategy",
    },
    {
      id: "6",
      name: "Sales Analytics",
      description: "Regional performance dashboard",
      created_at: "2025-01-24T08:30:00Z",
      status: "active",
      category: "analytics",
    },
  ];

  // Scroll-to-top logic
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handlers for SearchBarWithCommands
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement search functionality here
  };

  const handleEnhancePrompt = () => {
    console.log("Enhancing prompt");
    // Implement prompt enhancement functionality here
  };

  // onOpen and onArchive handlers now match the expected type: (id: string) => void
  const handleOpenProject = (id: string) => {
    console.log("Open project with id:", id);
    // Implement project opening logic here
  };

  const handleArchiveProject = (id: string) => {
    console.log("Archive project with id:", id);
    // Implement project archiving logic here
  };

  return (
    <div className="min-h-screen bg-white-50 dark:bg-white-900">
      {/* Top Content Header */}
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">Maple-1</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-200">
          My Projects
        </h1>
        <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
          Manage your projects with ease.
        </p>
      </div>

      <div className="container mx-auto px-4 pb-6">
        {/* Search Bar */}
        <div className="mb-10">
          <SearchBarWithCommands
            onSearch={handleSearch}
            onEnhancePrompt={handleEnhancePrompt}
          />
        </div>

        {/* Header above Projects Section */}
        <div className="mb-6 text-left">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            View My Projects
          </h2>
        </div>

        {/* Projects preview (only 3 projects) */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={handleOpenProject}
                onArchive={handleArchiveProject}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Scroll-to-top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
