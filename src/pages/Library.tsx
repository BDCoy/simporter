import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type ContentType = 'all' | 'podcast' | 'report' | 'dataset' | 'consultant' | 'integration';
type AccessType = 'all' | 'free' | 'paid';

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  access: 'free' | 'paid';
  lastUpdated: Date;
  price?: number;
  url?: string;
}

interface DetailModalProps {
  item: ContentItem;
  onClose: () => void;
}

function DetailModal({ item, onClose }: DetailModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href + '?id=' + item.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
      >
        <div className="relative h-64">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white bg-black/20 hover:bg-black/30 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            {item.type === 'podcast' && <Headphones className="w-5 h-5 text-blue-500" />}
            {item.type === 'report' && <FileText className="w-5 h-5 text-purple-500" />}
            {item.type === 'dataset' && <Database className="w-5 h-5 text-green-500" />}
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {item.category}
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {item.title}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {item.description}
          </p>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(item.lastUpdated).toLocaleDateString()}
            </div>
            <button
              onClick={handleCopyLink}
              className={cn(
                "flex items-center px-3 py-1 rounded-full text-sm transition-colors",
                copied
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              )}
            >
              <Link className="w-4 h-4 mr-1" />
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>

          <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            {item.type === 'podcast' ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Buy for {item.access === 'free' ? 'Free' : `$${item.price}`}
              </>
            ) : item.type === 'consultant' ? (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Connect
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Buy for {item.access === 'free' ? 'Free' : `$${item.price}`}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    type: 'podcast',
    title: 'Market Research Trends 2025',
    description: 'Expert insights on emerging trends in consumer research and market analysis.',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=400&fit=crop',
    category: 'Podcast',
    access: 'free',
    lastUpdated: new Date('2025-02-01')
  },
  {
    id: '2',
    type: 'report',
    title: 'Global Beauty Industry Analysis',
    description: 'Comprehensive analysis of the global beauty market, including trends and forecasts.',
    thumbnail: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&h=400&fit=crop',
    category: 'Report',
    access: 'paid',
    lastUpdated: new Date('2025-01-15'),
    price: 299
  },
  {
    id: '3',
    type: 'dataset',
    title: 'Consumer Behavior Dataset 2024',
    description: 'Raw consumer behavior data from 50,000+ respondents across 20 countries.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    category: 'Dataset',
    access: 'paid',
    lastUpdated: new Date('2025-01-30'),
    price: 499
  }
];

const contentTypeIcons = {
  podcast: Headphones,
  report: FileText,
  dataset: Database,
  consultant: Users,
  integration: Laptop
};

export function Library() {
  const [selectedType, setSelectedType] = useState<ContentType>('all');
  const [selectedAccess, setSelectedAccess] = useState<AccessType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const filteredContent = mockContent.filter(item => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesAccess = selectedAccess === 'all' || item.access === selectedAccess;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
              Library
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
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              {[
                { value: 'all', label: 'All Types' },
                { value: 'podcast', label: 'Podcasts', icon: Headphones },
                { value: 'report', label: 'Reports', icon: FileText },
                { value: 'dataset', label: 'Datasets', icon: Database }
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

          <select
            value={selectedAccess}
            onChange={(e) => setSelectedAccess(e.target.value as AccessType)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {item.thumbnail && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.type === 'podcast' && (
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
                    {item.access === 'paid' && (
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
          <DetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}