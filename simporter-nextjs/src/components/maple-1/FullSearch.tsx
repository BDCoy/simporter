"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

// UI Components
import SearchBarWithCommands from "@/components/ui/SearchBarWithCommands";
import InspiringCarousel from "@/components/ui/InspiringCarousel";
import ProjectCard from "@/components/ui/ProjectCard";

export default function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sample projects data (6 projects, but only 3 will be shown in preview)
  const projects = [
    { 
      id: "1", 
      name: "Market Analysis", 
      description: "Beauty industry trends Q1 2025", 
      lastUpdated: "2 days ago",
      created_at: "2025-01-15T10:30:00Z",
      status: "active",
    },
    { 
      id: "2", 
      name: "Consumer Research", 
      description: "Gen Z preferences survey results", 
      lastUpdated: "1 week ago",
      created_at: "2025-01-20T14:20:00Z",
      status: "active",

    },
    { 
      id: "3", 
      name: "Competitor Analysis", 
      description: "Top 5 competitors feature comparison", 
      lastUpdated: "3 days ago",
      created_at: "2025-01-22T09:15:00Z",
      status: "active",

    },
    { 
      id: "4", 
      name: "Product Innovation", 
      description: "New formula sustainability assessment", 
      lastUpdated: "Yesterday",
      created_at: "2025-01-24T16:45:00Z",
      status: "draft",
      category: "product"
    },
    { 
      id: "5", 
      name: "Market Strategy", 
      description: "2025 GTM planning document", 
      lastUpdated: "4 days ago",
      created_at: "2025-01-21T11:10:00Z",
      status: "completed",
      category: "strategy"
    },
    { 
      id: "6", 
      name: "Sales Analytics", 
      description: "Regional performance dashboard", 
      lastUpdated: "1 day ago",
      created_at: "2025-01-24T08:30:00Z",
      status: "active",
      category: "analytics"
    }
  ];
  
  // Handle scroll for "back to top" button
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

  // SearchBarWithCommands handlers
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement search functionality here
  };

  const handleEnhancePrompt = (prompt: string) => {
    console.log("Enhancing prompt:", prompt);
    // Implement prompt enhancement functionality here
  };

  return (
    <div className="min-h-screen bg-white-100 dark:bg-white-500">
      {/* Top Content Header */}
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">Maple-1</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-200">My Projects</h1>
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

        {/* Header above Inspiring Carousel */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Need Inspiration? Click an Idea Below
          </h2>
        </div>

        {/* Inspiring Carousel */}
        <div className="mb-10">
          <InspiringCarousel 
            prompts={[
              "Analyze emerging trends in {beauty} for Gen Z consumers",
              "Map sustainable innovations in {personal care} packaging",
              "Track consumer sentiment around {clean beauty}",
            ]}
          />
        </div>

        {/* Header above Projects Section */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            View My Projects
          </h2>
        </div>

        {/* Projects preview (only 3 projects) */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {projects.slice(0, 3).map(project => (
              <ProjectCard 
                key={project.id}
                project={project}
              />
            ))}
          </div>
        </section>
      </div>
      
      {/* Scroll to top button */}
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
