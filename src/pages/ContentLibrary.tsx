import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Headphones, 
  FileText, 
  Database, 
  Users, 
  Laptop,
  Play,
  Download,
  ExternalLink,
  Star,
  Clock,
  ChevronDown,
  Tag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ContentType = 'all' | 'podcast' | 'report' | 'dataset' | 'consultant' | 'integration';
type AccessType = 'all' | 'free' | 'paid';

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  thumbnail?: string;
  tags: string[];
  access: 'free' | 'paid';
  rating: number;
  downloads: number;
  lastUpdated: Date;
  price?: number;
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    type: 'podcast',
    title: 'Market Research Trends 2025',
    description: 'Expert insights on emerging trends in consumer research and market analysis.',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=400&fit=crop',
    tags: ['trends', 'research', 'innovation'],
    access: 'free',
    rating: 4.5,
    downloads: 1250,
    lastUpdated: new Date('2025-02-01')
  },
  {
    id: '2',
    type: 'report',
    title: 'Global Beauty Industry Analysis',
    description: 'Comprehensive analysis of the global beauty market, including trends and forecasts.',
    thumbnail: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&h=400&fit=crop',
    tags: ['beauty', 'market analysis', 'trends'],
    access: 'paid',
    rating: 4.8,
    downloads: 3420,
    lastUpdated: new Date('2025-01-15'),
    price: 299
  },
  {
    id: '3',
    type: 'dataset',
    title: 'Consumer Behavior Dataset 2024',
    description: 'Raw consumer behavior data from 50,000+ respondents across 20 countries.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    tags: ['consumer behavior', 'data', 'research'],
    access: 'paid',
    rating: 4.7,
    downloads: 890,
    lastUpdated: new Date('2025-01-30'),
    price: 499
  },
  {
    id: '4',
    type: 'consultant',
    title: 'Market Research Experts Network',
    description: 'Connect with certified market research consultants specializing in consumer goods.',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    tags: ['consulting', 'experts', 'research'],
    access: 'free',
    rating: 4.9,
    downloads: 0,
    lastUpdated: new Date('2025-02-10')
  },
  {
    id: '5',
    type: 'integration',
    title: 'Survey Analytics Suite',
    description: 'Advanced survey analytics tools with AI-powered insights and visualization.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    tags: ['tools', 'analytics', 'surveys'],
    access: 'paid',
    rating: 4.6,
    downloads: 2150,
    lastUpdated: new Date('2025-02-05'),
    price: 149
  }
];

const contentTypeIcons = {
  podcast: Headphones,
  report: FileText,
  dataset: Database,
  consultant: Users,
  integration: Laptop
};

export function ContentLibrary() {
  const [selectedType, setSelectedType] = useState<ContentType>('all');
  const [selectedAccess, setSelectedAccess] = useState<AccessType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');

  const filteredContent = mockContent.filter(item => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesAccess = selectedAccess === 'all' || item.access === selectedAccess;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesAccess && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.lastUpdated.getTime() - a.lastUpdated.getTime();
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Content Library
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Explore market research resources, datasets, and tools
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4 flex-wrap gap-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            {[
              { value: 'all', label: 'All Types' },
              { value: 'podcast', label: 'Podcasts', icon: Headphones },
              { value: 'report', label: 'Reports', icon: FileText },
              { value: 'dataset', label: 'Datasets', icon: Database },
              { value: 'consultant', label: 'Consultants', icon: Users },
              { value: 'integration', label: 'Integrations', icon: Laptop }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value as ContentType)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg flex items-center space-x-1",
                  selectedType === type.value
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {type.icon && <type.icon className="w-4 h-4" />}
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedAccess}
            onChange={(e) => setSelectedAccess(e.target.value as AccessType)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Access</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'rating')}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
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
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {item.thumbnail && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    {item.access === 'paid' && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded">
                        ${item.price}
                      </span>
                    )}
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded",
                      item.access === 'free'
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                    )}>
                      {item.access.charAt(0).toUpperCase() + item.access.slice(1)}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </div>

                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                        {item.rating}
                      </span>
                    </div>
                    {item.downloads > 0 && (
                      <div className="flex items-center">
                        <Download className="w-4 h-4 text-gray-400" />
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                          {item.downloads.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(item.lastUpdated).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                    {item.type === 'podcast' ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Listen Now
                      </>
                    ) : item.type === 'consultant' ? (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </>
                    )}
                  </button>
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
  );
}