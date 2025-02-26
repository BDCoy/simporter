"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Headphones,
  FileText,
  Database,
  Users,
  Laptop,
  Play,
  ExternalLink,
  Clock,
  Link,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type ContentType = "all" | "podcast" | "report" | "dataset" | "consultant" | "integration";
export type AccessType = "all" | "free" | "paid";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  access: "free" | "paid";
  lastUpdated: Date;
  price?: number;
  url?: string;
}

interface DetailModalProps {
  item: ContentItem;
  onClose: () => void;
}

// Detail Modal Popup
function DetailModal({ item, onClose }: DetailModalProps) {
    const [copied, setCopied] = useState(false);
  
    const handleCopyLink = () => {
      navigator.clipboard.writeText(window.location.href + "?id=" + item.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
  
    // Mock author data - replace with real data
    const authorInfo = {
      name: "Dr. Sarah Johnson",
      organization: "Global Market Insights",
      avatar: "/api/placeholder/40/40",
    };
  
    // Mock publication details - replace with real data
    const publicationDetails = {
      publishedDate: new Date("2024-12-10"),
      lastUpdated: new Date(item.lastUpdated),
      format: item.type === "podcast" ? "Audio" : item.type === "report" ? "PDF + Interactive" : "CSV, Excel",
      length: item.type === "podcast" ? "1h 24m" : item.type === "report" ? "87 pages" : "50,000+ records",
      license: "Single user license"
    };
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto px-4 py-12">
          <button
            onClick={onClose}
            className="fixed top-4 right-4 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full z-50"
          >
            <X className="w-5 h-5" />
          </button>
  
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex items-center space-x-2 mb-3">
              {item.type === "podcast" && <Headphones className="w-5 h-5 text-blue-500" />}
              {item.type === "report" && <FileText className="w-5 h-5 text-purple-500" />}
              {item.type === "dataset" && <Database className="w-5 h-5 text-green-500" />}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {item.category}
              </span>
            </div>
  
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {item.title}
            </h1>
  
            <div className="flex items-center mb-6">
              <img 
                src={authorInfo.avatar} 
                alt={authorInfo.name} 
                className="w-8 h-8 rounded-full mr-3"
              />
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-white">{authorInfo.name}</span>
                <span className="mx-2 text-gray-400">·</span>
                <span className="text-gray-600 dark:text-gray-400">{publicationDetails.publishedDate.toLocaleDateString()}</span>
              </div>
            </div>
          </header>
  
          {/* Cover Image */}
          {item.thumbnail && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={800}
                height={400}
                className="w-full object-cover"
              />
              {item.type === "podcast" && (
                <div className="relative mt-4">
                  <div className="flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <Play className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Play Preview ({publicationDetails.length})</span>
                  </div>
                </div>
              )}
            </div>
          )}
  
          {/* Main Content */}
          <div className="prose dark:prose-invert max-w-none mb-10">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              {item.description}
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. 
              Donec in efficitur ipsum, in egestas libero. Aliquam erat volutpat. Fusce vel congue elit.
              Donec posuere vulputate arcu. Phasellus accumsan cursus velit.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">What You'll Get</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 text-green-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 dark:text-white">Complete {item.type} access</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full digital access to all content</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 text-green-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 dark:text-white">Interactive elements</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Explore data through interactive charts</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 text-green-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 dark:text-white">Regular updates</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access to future updates for 12 months</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 text-green-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 dark:text-white">Export options</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Export data in various formats</p>
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Key Highlights</h2>
            <ul className="space-y-2 mb-8">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Comprehensive analysis of global market trends with actionable insights</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Expert perspectives from industry leaders and market specialists</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Data-backed forecasting and trend analysis for the next 5 years</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Strategic recommendations for market positioning and growth</span>
              </li>
            </ul>
          </div>
  
          {/* Item Details */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Item Details
            </h3>
            
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="text-gray-600 dark:text-gray-400">Format:</div>
              <div className="text-gray-900 dark:text-white">{publicationDetails.format}</div>
              
              <div className="text-gray-600 dark:text-gray-400">Length:</div>
              <div className="text-gray-900 dark:text-white">{publicationDetails.length}</div>
              
              <div className="text-gray-600 dark:text-gray-400">Published:</div>
              <div className="text-gray-900 dark:text-white">{publicationDetails.publishedDate.toLocaleDateString()}</div>
              
              <div className="text-gray-600 dark:text-gray-400">Last updated:</div>
              <div className="text-gray-900 dark:text-white">{publicationDetails.lastUpdated.toLocaleDateString()}</div>
              
              <div className="text-gray-600 dark:text-gray-400">License:</div>
              <div className="text-gray-900 dark:text-white">{publicationDetails.license}</div>
            </div>
          </div>
  
          {/* Purchase Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Price</span>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {item.access === "free" ? "Free" : `$${item.price}`}
                </span>
              </div>
              
              <button className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                {item.type === "podcast" ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {item.access === "free" ? "Listen Now" : "Purchase"}
                  </>
                ) : item.type === "dataset" ? (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    {item.access === "free" ? "Download Now" : "Purchase"}
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    {item.access === "free" ? "Read Now" : "Purchase"}
                  </>
                )}
              </button>
            </div>
            
            <button
              onClick={handleCopyLink}
              className={cn(
                "w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm border transition-colors",
                copied
                  ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                  : "bg-white text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              )}
            >
              <Link className="w-4 h-4 mr-2" />
              {copied ? "Link Copied!" : "Share this resource"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

const mockContent: ContentItem[] = [
  {
    id: "1",
    type: "podcast",
    title: "Market Research Trends 2025",
    description:
      "Expert insights on emerging trends in consumer research and market analysis.",
    thumbnail:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=400&fit=crop",
    category: "Podcast",
    access: "free",
    lastUpdated: new Date("2025-02-01"),
  },
  {
    id: "2",
    type: "report",
    title: "Global Beauty Industry Analysis",
    description:
      "Comprehensive analysis of the global beauty market, including trends and forecasts.",
    thumbnail:
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&h=400&fit=crop",
    category: "Report",
    access: "paid",
    lastUpdated: new Date("2025-01-15"),
    price: 299,
  },
  {
    id: "3",
    type: "dataset",
    title: "Consumer Behavior Dataset 2024",
    description:
      "Raw consumer behavior data from 50,000+ respondents across 20 countries.",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    category: "Dataset",
    access: "paid",
    lastUpdated: new Date("2025-01-30"),
    price: 499,
  },
];

const contentTypeIcons = {
  podcast: Headphones,
  report: FileText,
  dataset: Database,
  consultant: Users,
  integration: Laptop,
};

export default function TheLibrary() {
  const [selectedType, setSelectedType] = useState<ContentType>("all");
  const [selectedAccess, setSelectedAccess] = useState<AccessType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const filteredContent = mockContent.filter((item) => {
    const matchesType = selectedType === "all" || item.type === selectedType;
    const matchesAccess = selectedAccess === "all" || item.access === selectedAccess;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesAccess && matchesSearch;
  });

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              The Library
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Explore market research resources, datasets, and tools
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-800 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              {[
                { value: "all", label: "All Types" },
                { value: "podcast", label: "Podcasts", icon: Headphones },
                { value: "report", label: "Reports", icon: FileText },
                { value: "dataset", label: "Datasets", icon: Database },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value as ContentType)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-lg flex items-center space-x-1",
                    selectedType === type.value
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-white-100 dark:hover:bg-white-800"
                  )}
                >
                  {type.icon && <type.icon className="w-4 h-4" />}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <select
            value={selectedAccess}
            onChange={(e) => setSelectedAccess(e.target.value as AccessType)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-white-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Access</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => {
            const Icon = contentTypeIcons[item.type];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white dark:bg-white-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {item.thumbnail && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.type === "podcast" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {item.category}
                      </span>
                    </div>
                    {item.access === "paid" && (
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        ${item.price}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(item.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
