'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Book, 
  Video, 
  FileText, 
  Star, 
  Clock,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  ThumbsUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'guide';
  readTime: number;
  likes: number;
  url: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: 'Getting Started with Concept Testing',
    description: 'Learn the basics of setting up and running effective concept tests.',
    category: 'Basics',
    type: 'guide',
    readTime: 5,
    likes: 124,
    url: '/kb/getting-started'
  },
  {
    id: '2',
    title: 'Advanced Audience Targeting',
    description: 'Deep dive into audience segmentation and targeting strategies.',
    category: 'Advanced',
    type: 'article',
    readTime: 8,
    likes: 89,
    url: '/kb/audience-targeting'
  },
  {
    id: '3',
    title: 'Video Tutorial: Creating Your First Test',
    description: 'Step-by-step video guide to creating and launching your first concept test.',
    category: 'Tutorials',
    type: 'video',
    readTime: 12,
    likes: 256,
    url: '/kb/video-first-test'
  }
];

const categories = [
  'All',
  'Basics',
  'Advanced',
  'Tutorials',
  'Best Practices',
  'Case Studies'
];

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const ArticleCard = ({ article }: { article: Article }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-2 rounded-lg",
          article.type === 'guide' && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
          article.type === 'video' && "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
          article.type === 'article' && "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        )}>
          {article.type === 'guide' && <Book className="w-5 h-5" />}
          {article.type === 'video' && <Video className="w-5 h-5" />}
          {article.type === 'article' && <FileText className="w-5 h-5" />}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <ThumbsUp className="w-4 h-4 mr-1" />
          <span>{article.likes}</span>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {article.title}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {article.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          <span>{article.readTime} min read</span>
        </div>
        <a
          href={article.url}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Read more
          <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Knowledge Base
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Learn how to get the most out of Simporter
          </p>
        </div>
        <Button 
          variant="outline" 
          asChild
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <a href="/kb/contribute">
            <Star className="w-4 h-4 mr-2" />
            Contribute
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                  selectedCategory === category
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No articles found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}