'use client';

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Headphones, FileText, RefreshCw, Check, X, Upload, Edit, Trash, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Define content types
type ContentType = 'data' | 'podcast' | 'report';

// Define library item structure
interface LibraryItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  fileName?: string;
  fileSize?: number;
  uploadedAt: Date;
  thumbnailUrl?: string;
  url?: string; // For podcasts (YouTube links)
  status: 'processing' | 'active' | 'error';
  error?: string;
}

/** Helper to format file size nicely */
function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export default function LibraryPanel() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeContentTab, setActiveContentTab] = useState<ContentType>('data');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Partial<LibraryItem>>({
    title: '',
    description: '',
    type: 'data'
  });

  // Handle file selection
  const handleFileSelect = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        const file = acceptedFiles[0];

        // Create new library item
        const newLibraryItem: LibraryItem = {
          id: crypto.randomUUID(),
          title: newItem.title || file.name,
          description: newItem.description || '',
          type: activeContentTab,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date(),
          status: 'processing'
        };

        // Simulate upload
        for (let progress = 0; progress <= 100; progress += 5) {
          setUploadProgress(progress);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Add to library items
        setItems((prev) => [...prev, { ...newLibraryItem, status: 'active' }]);

        // Reset form
        setNewItem({
          title: '',
          description: '',
          type: activeContentTab
        });
        setIsAddingNew(false);
      } catch (err) {
        console.error('Upload error:', err);
        setError(err instanceof Error ? err.message : 'Failed to upload file');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [activeContentTab, newItem]
  );

  // Handle podcast URL submission
  const handlePodcastSubmit = useCallback(() => {
    if (!newItem.title || !newItem.url) {
      setError('Please provide both title and YouTube URL');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const newPodcast: LibraryItem = {
        id: crypto.randomUUID(),
        title: newItem.title || '',
        description: newItem.description || '',
        type: 'podcast',
        url: newItem.url,
        uploadedAt: new Date(),
        status: 'active'
      };
      setItems((prev) => [...prev, newPodcast]);

      // Reset form
      setNewItem({
        title: '',
        description: '',
        type: 'podcast',
        url: ''
      });
      setIsAddingNew(false);
      setIsUploading(false);
    }, 1000);
  }, [newItem]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  // Delete an item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Icon for content type
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'data':
        return <Database className="w-5 h-5" />;
      case 'podcast':
        return <Headphones className="w-5 h-5" />;
      case 'report':
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Content Type Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveContentTab('data')}
          className={cn(
            'flex items-center px-4 py-2 font-medium',
            activeContentTab === 'data'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <Database className="w-4 h-4 mr-2" />
          Data
        </button>
        <button
          onClick={() => setActiveContentTab('podcast')}
          className={cn(
            'flex items-center px-4 py-2 font-medium',
            activeContentTab === 'podcast'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <Headphones className="w-4 h-4 mr-2" />
          Podcasts
        </button>
        <button
          onClick={() => setActiveContentTab('report')}
          className={cn(
            'flex items-center px-4 py-2 font-medium',
            activeContentTab === 'report'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <FileText className="w-4 h-4 mr-2" />
          Reports
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {activeContentTab === 'data'
            ? 'Data Files'
            : activeContentTab === 'podcast'
            ? 'Podcast Links'
            : 'Report Documents'}
        </h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New{' '}
          {activeContentTab === 'data'
            ? 'Data'
            : activeContentTab === 'podcast'
            ? 'Podcast'
            : 'Report'}
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {items
          .filter((item) => item.type === activeContentTab)
          .map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className={cn(
                      'p-2 rounded-full mr-3',
                      item.type === 'data'
                        ? 'bg-blue-100 text-blue-600'
                        : item.type === 'podcast'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-green-100 text-green-600'
                    )}
                  >
                    {getContentTypeIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Added {item.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-500 hover:text-blue-600" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 text-gray-500 hover:text-red-600"
                    title="Delete"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {item.description || 'No description provided'}
                </p>
                {item.fileName && (
                  <div className="flex items-center text-xs text-gray-500">
                    <FileText className="w-3 h-3 mr-1" />
                    <span className="truncate">{item.fileName}</span>
                    {item.fileSize && <span className="ml-1">({formatFileSize(item.fileSize)})</span>}
                  </div>
                )}
                {item.url && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Headphones className="w-3 h-3 mr-1" />
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline truncate"
                    >
                      {item.url}
                    </a>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                  {item.status === 'processing' ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-blue-500 mr-2 animate-spin" />
                      <span className="text-xs text-blue-500">Processing...</span>
                    </>
                  ) : item.status === 'active' ? (
                    <>
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-xs text-green-500">Active</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-xs text-red-500">Error</span>
                    </>
                  )}
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Add New Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add New{' '}
                {activeContentTab === 'data'
                  ? 'Data File'
                  : activeContentTab === 'podcast'
                  ? 'Podcast'
                  : 'Report'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newItem.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter title"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter description"
                  />
                </div>

                {activeContentTab === 'podcast' ? (
                  <div>
                    <label
                      htmlFor="url"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      YouTube URL *
                    </label>
                    <input
                      type="url"
                      id="url"
                      name="url"
                      value={newItem.url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {activeContentTab === 'data' ? 'Upload Data File *' : 'Upload Report *'}
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activeContentTab === 'data'
                              ? 'Excel, CSV, or ZIP files'
                              : 'PowerPoint or PDF files'}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept={
                            activeContentTab === 'data'
                              ? '.xlsx,.csv,.zip'
                              : '.pdf,.pptx,.ppt'
                          }
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleFileSelect(Array.from(e.target.files));
                            }
                          }}
                          required
                        />
                      </label>
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Processing... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}

                {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setError(null);
                    setNewItem({
                      title: '',
                      description: '',
                      type: activeContentTab
                    });
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                {activeContentTab === 'podcast' ? (
                  <button
                    type="button"
                    onClick={handlePodcastSubmit}
                    disabled={isUploading}
                    className={cn(
                      'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
                      isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    )}
                  >
                    Add Podcast
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
