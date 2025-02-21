import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { 
  Plus, 
  ShoppingCart, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Map, 
  Beaker,
  ArrowUpRight,
  Archive,
  Trash2,
  Share2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/services/project';

const categoryIcons = {
  'Category Analysis': ShoppingCart,
  'Innovation': Lightbulb,
  'Trends': TrendingUp,
  'Consumer Profile': Users,
  'Competitive Landscape': Map,
  'Product Concept': Beaker
};

const categoryColors = {
  'Category Analysis': 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
  'Innovation': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  'Trends': 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
  'Consumer Profile': 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
  'Competitive Landscape': 'text-red-600 bg-red-100 dark:bg-red-900/30',
  'Product Concept': 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30'
};

export function MyProjectsPage() {
  const { setView } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlaceholders, setShowPlaceholders] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data: userProjects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (userProjects && userProjects.length > 0) {
        setProjects(userProjects);
      } else {
        setShowPlaceholders(true);
        setProjects([
          {
            id: 'placeholder-1',
            name: 'Beauty Category Analysis',
            description: 'Comprehensive analysis of the global beauty market trends and opportunities.',
            owner_id: '',
            status: 'active',
            category: 'Category Analysis',
            settings: {
              metadata: {
                query: '/category beauty market trends',
                command: '/category',
                category: 'Category Analysis'
              }
            },
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'placeholder-2',
            name: 'Skincare Innovation Brief',
            description: 'Exploring innovative skincare product concepts and market opportunities.',
            owner_id: '',
            status: 'active',
            category: 'Innovation',
            settings: {
              metadata: {
                query: '/innovation skincare products',
                command: '/innovation',
                category: 'Innovation'
              }
            },
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setView('home');
  };

  const handleOpenProject = (projectId: string) => {
    if (projectId.startsWith('placeholder-')) {
      // For placeholders, just navigate to home to create a new project
      setView('home');
    } else {
      setView('projects', { projectId });
    }
  };

  const handleArchiveProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', projectId);

      if (error) throw error;
      loadProjects();
    } catch (error) {
      console.error('Error archiving project:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || project.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            My Projects
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage and organize your market research projects
          </p>
        </div>
        <button
          onClick={handleCreateProject}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            />
          </div>
          <div className="flex items-center space-x-2">
            {['all', 'active', 'archived'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter as any)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md",
                  selectedFilter === filter
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
          const Icon = categoryIcons[project.category];
          const colorClass = categoryColors[project.category];
          const isPlaceholder = project.id.startsWith('placeholder-');

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow",
                isPlaceholder && "opacity-75"
              )}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2 rounded-lg", colorClass)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {!isPlaceholder && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchiveProject(project.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {project.name}
                </h3>

                {project.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {!isPlaceholder && (
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleOpenProject(project.id)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {isPlaceholder ? 'Create Similar' : 'Open Project'}
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </button>
              </div>

              {project.status === 'archived' && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full">
                    Archived
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery
              ? "No projects match your search criteria"
              : "Get started by creating your first project"}
          </p>
        </div>
      )}
    </div>
  );
}