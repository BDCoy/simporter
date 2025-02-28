"use client";

import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/Switch";
import { Loader2 } from "lucide-react";

// Define allowed source categories
export type SourceCategory =
  | "government"
  | "corporate"
  | "data"
  | "mainstream"
  | "misc"
  | "not-sure";

// Define credibility levels
export type Credibility = "high" | "average" | "low";

// Interface for a source item
interface Source {
  id: string;
  name: string;
  url: string;
  category: SourceCategory;
  isActive: boolean;
  credibility: Credibility;
  isUserUploaded: boolean;
}

// Initial sample data with credibility values and source designation
const initialSources: Source[] = [
  {
    id: "1",
    name: "USA.gov",
    url: "https://www.usa.gov",
    category: "government",
    isActive: true,
    credibility: "high",
    isUserUploaded: true,
  },
  {
    id: "2",
    name: "Corporate Blog A",
    url: "https://blog.corporatea.com",
    category: "corporate",
    isActive: true,
    credibility: "average",
    isUserUploaded: true,
  },
  {
    id: "3",
    name: "Data Report 2023",
    url: "https://datareport.com",
    category: "data",
    isActive: true,
    credibility: "high",
    isUserUploaded: false,
  },
  {
    id: "4",
    name: "CNN",
    url: "https://www.cnn.com",
    category: "mainstream",
    isActive: true,
    credibility: "high",
    isUserUploaded: false,
  },
  {
    id: "5",
    name: "Alt News",
    url: "https://www.altnews.com",
    category: "misc",
    isActive: false,
    credibility: "low",
    isUserUploaded: false,
  },
  {
    id: "6",
    name: "Unknown Source",
    url: "https://www.unknownsource.com",
    category: "not-sure",
    isActive: true,
    credibility: "low",
    isUserUploaded: false,
  },
];

// Labels for each category with associated credibility
const categorySettings: { [key in SourceCategory]: { label: string; defaultCredibility: Credibility } } = {
  government: { label: "Government", defaultCredibility: "high" },
  corporate: { label: "Corporate", defaultCredibility: "average" },
  data: { label: "Data", defaultCredibility: "high" },
  mainstream: { label: "Media", defaultCredibility: "average" },
  "misc": { label: "Misc.", defaultCredibility: "low" },
  "not-sure": { label: "Not Sure", defaultCredibility: "low" },
};

// Labels and styling for credibility tags
const credibilityLabels: { [key in Credibility]: string } = {
  high: "High",
  average: "Medium",
  low: "Low",
};

const credibilityColors: { [key in Credibility]: { bg: string; text: string; border: string; } } = {
  high: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  average: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  low: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

const DataSourcesPanel: React.FC = () => {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [selectedCredibilities, setSelectedCredibilities] = useState<Credibility[]>([]);
  const [originalSourceState, setOriginalSourceState] = useState<Source[]>(initialSources);

  // Toggle individual source active state
  const handleToggleActive = (id: string) => {
    setSources((prev) =>
      prev.map((src) =>
        src.id === id ? { ...src, isActive: !src.isActive } : src
      )
    );
  };

  // Toggle category section active state
  const toggleCategorySection = (category: SourceCategory, isUserUploaded: boolean) => {
    const categorySourcesActive = sources.filter(
      src => src.category === category && src.isUserUploaded === isUserUploaded
    ).every(src => src.isActive);

    setSources(prev => 
      prev.map(src => 
        src.category === category && src.isUserUploaded === isUserUploaded
          ? { ...src, isActive: !categorySourcesActive }
          : src
      )
    );
  };

  // Filter sources by credibility level - allows multiple selections
  const filterByCredibility = (credibility: Credibility) => {
    let newSelectedCredibilities;
    
    // If already selected, remove it from the selection
    if (selectedCredibilities.includes(credibility)) {
      newSelectedCredibilities = selectedCredibilities.filter(c => c !== credibility);
    } else {
      // Otherwise add it to the selection
      newSelectedCredibilities = [...selectedCredibilities, credibility];
    }
    
    setSelectedCredibilities(newSelectedCredibilities);
    
    // If no filters selected, show all sources with their original state
    if (newSelectedCredibilities.length === 0) {
      setSources(originalSourceState);
    } else {
      // Only activate sources that match any of the selected credibility levels
      setSources(originalSourceState.map(src => ({
        ...src,
        isActive: newSelectedCredibilities.includes(src.credibility)
      })));
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCredibilities([]);
    setSources(originalSourceState);
  };

  // Filter sources by type (user/AI)
  const getSourcesByType = (isUserUploaded: boolean) => {
    return sources.filter(src => src.isUserUploaded === isUserUploaded);
  };

  // Group sources by category
  const groupSourcesByCategory = (sources: Source[]) => {
    const groupedSources: { [key in SourceCategory]?: Source[] } = {};
    
    // Ensure all categories are represented, even if empty
    Object.keys(categorySettings).forEach(category => {
      groupedSources[category as SourceCategory] = [];
    });
    
    sources.forEach(source => {
      groupedSources[source.category]?.push(source);
    });
    
    return groupedSources;
  };

  const userSourcesByCategory = groupSourcesByCategory(getSourcesByType(true));
  const aiSourcesByCategory = groupSourcesByCategory(getSourcesByType(false));

  // No refresh functionality as requested

  // Source category section component
  const CategorySection = ({ 
    title, 
    sources, 
    category,
    isUserUploaded 
  }: { 
    title: string, 
    sources: Source[], 
    category: SourceCategory,
    isUserUploaded: boolean
  }) => {
    const allActive = sources.every(src => src.isActive);
    
    if (sources.length === 0) return null;
    
    return (
      <div className={`mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-opacity duration-200 ${!allActive ? 'opacity-70' : ''}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
            {!isUserUploaded && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${credibilityColors[categorySettings[category].defaultCredibility].bg} ${credibilityColors[categorySettings[category].defaultCredibility].text}`}>
                {credibilityLabels[categorySettings[category].defaultCredibility]}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {allActive ? 'Enabled' : 'Disabled'}
            </span>
            <Switch 
              checked={allActive}
              onCheckedChange={() => toggleCategorySection(category, isUserUploaded)}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {sources.map((src) => (
            <li key={src.id} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-750">
              <div className="flex items-center space-x-2">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {src.name}
                </a>
                {!isUserUploaded && src.credibility !== categorySettings[category].defaultCredibility && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${credibilityColors[src.credibility].bg} ${credibilityColors[src.credibility].text}`}>
                    {credibilityLabels[src.credibility]}
                  </span>
                )}
              </div>
              <Switch 
                checked={src.isActive}
                onCheckedChange={() => handleToggleActive(src.id)}
                className="data-[state=checked]:bg-blue-500"
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Source list component for user/AI sections
  const SourceList = ({ 
    sources, 
    title,
    isUserUploaded 
  }: { 
    sources: { [key in SourceCategory]?: Source[] }, 
    title: string,
    isUserUploaded: boolean
  }) => (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 h-full">
      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">{title}</h3>
      
      {Object.keys(sources).length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">No sources found</div>
      ) : (
        <div className="space-y-3">
          {Object.entries(sources).map(([category, sourcesInCategory]) => (
            <CategorySection 
              key={category} 
              title={categorySettings[category as SourceCategory].label} 
              sources={sourcesInCategory || []} 
              category={category as SourceCategory}
              isUserUploaded={isUserUploaded}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-6">
        {/* Header with Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Data Sources</h2>
            
            {/* Multi-select Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Filter by:</span>
              <div className="inline-flex items-center rounded-md border border-gray-200 dark:border-gray-700">
                <button
                  onClick={clearFilters}
                  className={`px-3 py-1 text-xs rounded-l-md transition-colors ${
                    selectedCredibilities.length === 0
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                      : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => filterByCredibility("high")}
                  className={`px-3 py-1 text-xs border-l border-gray-200 dark:border-gray-700 transition-colors ${
                    selectedCredibilities.includes("high")
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
                      : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  High
                </button>
                <button
                  onClick={() => filterByCredibility("average")}
                  className={`px-3 py-1 text-xs border-l border-gray-200 dark:border-gray-700 transition-colors ${
                    selectedCredibilities.includes("average")
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
                      : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => filterByCredibility("low")}
                  className={`px-3 py-1 text-xs border-l border-r-0 border-gray-200 dark:border-gray-700 rounded-r-md transition-colors ${
                    selectedCredibilities.includes("low")
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100'
                      : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  Low
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Source Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SourceList 
            sources={userSourcesByCategory} 
            title="User Uploaded Sources" 
            isUserUploaded={true}
          />
          <SourceList 
            sources={aiSourcesByCategory} 
            title="AI Agent Sources" 
            isUserUploaded={false}
          />
        </div>
      </div>
    </div>
  );
};

export default DataSourcesPanel;