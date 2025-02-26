'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Headphones, FileText, RefreshCw, Check, X, Upload, 
  Edit, Trash, Plus, Clock, DollarSign, Tag, Globe, Hash, Layers,
  Play, BookOpen, Link2, Users, Download, Eye, BarChart, Power, ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Use the correct casing for these imports:
import { Switch } from "@/components/ui/Switch";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/Dialog";

// Define content types
type ContentType = 'data' | 'podcast' | 'report' | 'video' | 'caseStudy' | 'integration' | 'consultant';

// Define language options
type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'other';

// Define library item structure with enhanced metadata
interface LibraryItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  price?: number;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  duration?: number; // For audio/video in seconds
  uploadedAt: Date;
  thumbnailUrl?: string;
  url?: string; // For podcasts (YouTube links)
  status: 'processing' | 'active' | 'error';
  error?: string;
  version: number;
  language?: Language;
  metadata: {
    [key: string]: string;
  };
  recipientEmail?: string;
  videoUrl?: string;
  active: boolean;
  downloads: number;
  views: number;
  revenue: number;
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

/** Helper to format duration */
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/** Helper to extract file extension */
function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/** Helper to detect file type category */
function detectFileType(filename: string): string {
  const ext = getFileExtension(filename);
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
  const spreadsheetTypes = ['xls', 'xlsx', 'csv', 'ods'];
  const presentationTypes = ['ppt', 'pptx', 'odp'];
  const audioTypes = ['mp3', 'wav', 'ogg', 'flac', 'm4a'];
  const videoTypes = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
  const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz'];

  if (imageTypes.includes(ext)) return 'Image';
  if (documentTypes.includes(ext)) return 'Document';
  if (spreadsheetTypes.includes(ext)) return 'Spreadsheet';
  if (presentationTypes.includes(ext)) return 'Presentation';
  if (audioTypes.includes(ext)) return 'Audio';
  if (videoTypes.includes(ext)) return 'Video';
  if (archiveTypes.includes(ext)) return 'Archive';
  
  return 'Other';
}

// Function to get content type color
const getContentColor = (type: ContentType) => {
  switch (type) {
    case 'data':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
    case 'podcast':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300';
    case 'report':
      return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
    case 'video':
      return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300';
    case 'caseStudy':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300';
    case 'integration':
      return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300';
    case 'consultant':
      return 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function LibraryPanel() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeContentTab, setActiveContentTab] = useState<ContentType>('data');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [customMetadataFields, setCustomMetadataFields] = useState<{key: string; value: string}[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  // Enhanced new item state
  const [newItem, setNewItem] = useState<Partial<LibraryItem>>({
    title: '',
    description: '',
    type: 'data',
    price: undefined,
    version: 1,
    language: 'en',
    metadata: {},
    thumbnailUrl: undefined
  });

  // Handle thumbnail image selection
  const handleThumbnailSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onloadend = () => {
          setThumbnailPreview(reader.result as string);
          setNewItem(prev => ({
            ...prev,
            thumbnailUrl: reader.result as string
          }));
        };
        
        reader.readAsDataURL(file);
      }
    },
    []
  );

  // Clear thumbnail preview
  const clearThumbnailPreview = () => {
    setThumbnailPreview(null);
    setNewItem(prev => ({
      ...prev,
      thumbnailUrl: undefined
    }));
  };

  const closeModal = useCallback(() => {
    setIsAddingNew(false);
    setError(null);
    setNewItem({
      title: '',
      description: '',
      type: activeContentTab,
      price: undefined,
      version: 1,
      language: 'en',
      metadata: {},
      thumbnailUrl: undefined
    });
    setThumbnailPreview(null);
    setCustomMetadataFields([]);
  }, [activeContentTab]);

  // Handle escape key and outside click for modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddingNew) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isAddingNew, closeModal]);

  // Toggle item active status
  const toggleItemStatus = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  // Handle file selection with enhanced metadata extraction
  const handleFileSelect = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        const file = acceptedFiles[0];
        const fileExt = getFileExtension(file.name);
        const fileType = detectFileType(file.name);
        
        // Mock duration detection for audio/video
        let duration: number | undefined = undefined;
        if (fileType === 'Audio' || fileType === 'Video') {
          // Simulate duration detection (would be actual metadata in real app)
          duration = Math.floor(Math.random() * 600) + 60; // 1-10 minutes
        }

        // Create metadata object from custom fields
        const metadata: {[key: string]: string} = {};
        customMetadataFields.forEach(field => {
          if (field.key && field.value) {
            metadata[field.key] = field.value;
          }
        });

        // Create new library item with enhanced metadata
        const newLibraryItem: LibraryItem = {
          id: crypto.randomUUID(),
          title: newItem.title || file.name,
          description: newItem.description || '',
          type: activeContentTab,
          fileName: file.name,
          fileSize: file.size,
          fileType: fileType,
          price: newItem.price,
          uploadedAt: new Date(),
          status: 'processing',
          version: 1,
          language: newItem.language,
          duration: duration,
          metadata: metadata,
          active: true,
          downloads: 0,
          views: 0,
          revenue: 0,
        };

        // Use provided thumbnail or generate one based on file type
        if (!newItem.thumbnailUrl && ['Image', 'Video', 'Presentation'].includes(fileType)) {
          // In a real app, this would be an actual thumbnail generation process
          newLibraryItem.thumbnailUrl = `/api/placeholder/300/200?text=${encodeURIComponent(fileType)}`;
        } else if (newItem.thumbnailUrl) {
          newLibraryItem.thumbnailUrl = newItem.thumbnailUrl;
        }

        // Simulate upload with progress
        for (let progress = 0; progress <= 100; progress += 5) {
          setUploadProgress(progress);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Add to library items
        setItems(prev => [...prev, { ...newLibraryItem, status: 'active' }]);

        // Reset form
        setNewItem({
          title: '',
          description: '',
          type: activeContentTab,
          price: undefined,
          version: 1,
          language: 'en',
          metadata: {},
          thumbnailUrl: undefined
        });
        setThumbnailPreview(null);
        setCustomMetadataFields([]);
        setIsAddingNew(false);
      } catch (err) {
        console.error('Upload error:', err);
        setError(err instanceof Error ? err.message : 'Failed to upload file');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [activeContentTab, newItem, customMetadataFields]
  );

  // Handle podcast URL submission with enhanced metadata
  const handleContentSubmit = useCallback(() => {
    if (!newItem.title) {
      setError('Please provide a title');
      return;
    }

    if (activeContentTab === 'podcast' && !newItem.url) {
      setError('Please provide a YouTube URL');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      // Create metadata object from custom fields
      const metadata: {[key: string]: string} = {};
      customMetadataFields.forEach(field => {
        if (field.key && field.value) {
          metadata[field.key] = field.value;
        }
      });

      // Use provided thumbnail or generate based on content type
      let thumbnailUrl = newItem.thumbnailUrl;
      if (!thumbnailUrl) {
        // Mock thumbnail generation when a custom one isn't provided
        thumbnailUrl = `/api/placeholder/300/200?text=${encodeURIComponent(activeContentTab)}`;
      }

      const newContent: LibraryItem = {
        id: crypto.randomUUID(),
        title: newItem.title || '',
        description: newItem.description || '',
        type: activeContentTab,
        url: newItem.url,
        price: newItem.price,
        uploadedAt: new Date(),
        status: 'active',
        version: 1,
        language: newItem.language,
        metadata: metadata,
        thumbnailUrl: thumbnailUrl,
        active: true,
        downloads: 0,
        views: 0,
        revenue: 0,
      };
      
      // Simulate duration for podcasts
      if (activeContentTab === 'podcast') {
        newContent.duration = Math.floor(Math.random() * 3600) + 600; // 10-70 minutes
      }

      setItems(prev => [...prev, newContent]);

      // Reset form
      setNewItem({
        title: '',
        description: '',
        type: activeContentTab,
        price: undefined,
        version: 1,
        language: 'en',
        metadata: {},
        thumbnailUrl: undefined
      });
      setThumbnailPreview(null);
      setCustomMetadataFields([]);
      setIsAddingNew(false);
      setIsUploading(false);
    }, 1000);
  }, [newItem, activeContentTab, customMetadataFields]);

  // Handle form input changes
  const handleInputChangeSimple = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value ? parseFloat(value) : undefined }));
  };

  // Add custom metadata field
  const addCustomMetadataField = () => {
    setCustomMetadataFields([...customMetadataFields, { key: '', value: '' }]);
  };

  // Update custom metadata field
  const updateCustomMetadataField = (index: number, field: string, value: string) => {
    const updatedFields = [...customMetadataFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setCustomMetadataFields(updatedFields);
  };

  // Remove custom metadata field
  const removeCustomMetadataField = (index: number) => {
    setCustomMetadataFields(customMetadataFields.filter((_, i) => i !== index));
  };

  // Delete an item
  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Get content type icon
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'data':
        return <Database className="w-5 h-5" />;
      case 'podcast':
        return <Headphones className="w-5 h-5" />;
      case 'report':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Play className="w-5 h-5" />;
      case 'caseStudy':
        return <BookOpen className="w-5 h-5" />;
      case 'integration':
        return <Link2 className="w-5 h-5" />;
      case 'consultant':
        return <Users className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Content Type Tabs */}
      <div className="flex flex-wrap space-x-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveContentTab('data')}
          className={cn(
            'flex items-center px-3 py-2 font-medium text-sm',
            activeContentTab === 'data'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <Database className="w-4 h-4 mr-1" />
          Data
        </button>
        <button
          onClick={() => setActiveContentTab('podcast')}
          className={cn(
            'flex items-center px-3 py-2 font-medium text-sm',
            activeContentTab === 'podcast'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <Headphones className="w-4 h-4 mr-1" />
          Podcasts
        </button>
        <button
          onClick={() => setActiveContentTab('report')}
          className={cn(
            'flex items-center px-3 py-2 font-medium text-sm',
            activeContentTab === 'report'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <FileText className="w-4 h-4 mr-1" />
          Reports
        </button>
        <button
          onClick={() => setActiveContentTab('video')}
          className={cn(
            'flex items-center px-3 py-2 font-medium text-sm',
            activeContentTab === 'video'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <Play className="w-4 h-4 mr-1" />
          Videos
        </button>
        <button
          onClick={() => setActiveContentTab('caseStudy')}
          className={cn(
            'flex items-center px-3 py-2 font-medium text-sm',
            activeContentTab === 'caseStudy'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <BookOpen className="w-4 h-4 mr-1" />
          Case Studies
        </button>
        <button
          onClick={() => setActiveContentTab('integration')}
          className={cn(
            'flex items-center px-3 py-2 font-medium text-sm',
            activeContentTab === 'integration'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <Link2 className="w-4 h-4 mr-1" />
          Integrations
        </button>
        <button
          onClick={() => setActiveContentTab('consultant')}
          className={cn(
            'flex items-center px-3 py-2 font-medium text-sm',
            activeContentTab === 'consultant'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <Users className="w-4 h-4 mr-1" />
          Consultants
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {activeContentTab === 'data'
            ? 'Data Files'
            : activeContentTab === 'podcast'
            ? 'Podcast Links'
            : activeContentTab === 'report'
            ? 'Report Documents' 
            : activeContentTab === 'video'
            ? 'Video Links'
            : activeContentTab === 'caseStudy'
            ? 'Case Studies'
            : activeContentTab === 'integration'
            ? 'Integrations'
            : 'Consultants'}
        </h2>
        <Button
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
        </Button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {items
          .filter(item => item.type === activeContentTab)
          .map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className={cn(
                      'p-2 rounded-full mr-3',
                      getContentColor(item.type)
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
                  <button 
                    onClick={() => toggleItemStatus(item.id)}
                    className={cn(
                      "p-1 rounded",
                      item.active 
                        ? "text-green-500 hover:text-green-700" 
                        : "text-gray-500 hover:text-gray-700"
                    )}
                    title={item.active ? "Active (click to deactivate)" : "Inactive (click to activate)"}
                  >
                    <Power className="w-4 h-4" />
                  </button>
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
              
              {/* Card Content */}
              <div className="p-4">
                {item.thumbnailUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img 
                      src={item.thumbnailUrl} 
                      alt={item.title} 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {item.description || 'No description provided'}
                </p>
                
                {/* Metadata Display */}
                <div className="space-y-2">
                  {item.fileName && (
                    <div className="flex items-center text-xs text-gray-500">
                      <FileText className="w-3 h-3 mr-1" />
                      <span className="truncate">{item.fileName}</span>
                      {item.fileSize && <span className="ml-1">({formatFileSize(item.fileSize)})</span>}
                    </div>
                  )}
                  
                  {item.fileType && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Tag className="w-3 h-3 mr-1" />
                      <span>{item.fileType}</span>
                    </div>
                  )}
                  
                  {item.duration && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{formatDuration(item.duration)}</span>
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
                  
                  {item.price !== undefined && item.price > 0 && (
                    <div className="flex items-center text-xs text-gray-500">
                      <DollarSign className="w-3 h-3 mr-1" />
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {item.language && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Globe className="w-3 h-3 mr-1" />
                      <span>{item.language.toUpperCase()}</span>
                    </div>
                  )}
                  
                  {Object.keys(item.metadata).length > 0 && (
                    <div className="flex items-start text-xs text-gray-500">
                      <Hash className="w-3 h-3 mr-1 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(item.metadata).map(([key, value], idx) => (
                          <span key={idx} className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {item.version > 1 && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Layers className="w-3 h-3 mr-1" />
                      <span>v{item.version}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Card Footer */}
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

              {/* Analytics Display */}
              <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center" title="Downloads">
                    <Download className="w-3 h-3 mr-1" />
                    <span>{item.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center" title="Views">
                    <Eye className="w-3 h-3 mr-1" />
                    <span>{item.views.toLocaleString()}</span>
                  </div>
                  {item.revenue > 0 && (
                    <div className="flex items-center" title="Revenue">
                      <DollarSign className="w-3 h-3 mr-1" />
                      <span>${item.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <ArrowDown className="w-3 h-3 mr-1" />
                  <button className="text-blue-600 hover:text-blue-800">Download</button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Add New Modal using Dialog component */}
      <Dialog open={isAddingNew} onOpenChange={(open: boolean) => !open && closeModal()}>
        <DialogOverlay />
        {/* Removed className from DialogContent; wrap children in a styled div if needed */}
        <DialogContent>
          <div className="max-w-2xl w-full p-0">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add New{' '}
                {activeContentTab === 'data'
                  ? 'Data File'
                  : activeContentTab === 'podcast'
                  ? 'Podcast'
                  : activeContentTab === 'report'
                  ? 'Report'
                  : activeContentTab === 'video'
                  ? 'Video'
                  : activeContentTab === 'caseStudy'
                  ? 'Case Study'
                  : activeContentTab === 'integration'
                  ? 'Integration'
                  : 'Consultant'}
              </h3>

              {/* Simplified Single-Page Form */}
              <div className="space-y-5">
                {/* Section: Basic Info */}
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">Basic Information</h4>
                  <div className="space-y-4">
                    {/* Title field */}
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Title *
                      </label>
                      <Input
                        type="text"
                        id="title"
                        name="title"
                        value={newItem.title}
                        onChange={handleInputChangeSimple}
                        placeholder="Enter title"
                        required
                      />
                    </div>
                    
                    {/* Description field */}
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Description
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newItem.description}
                        onChange={handleInputChangeSimple}
                        rows={3}
                        placeholder="Enter description"
                      />
                    </div>
                    
                    {/* Podcast URL field */}
                    {activeContentTab === 'podcast' && (
                      <div>
                        <label
                          htmlFor="url"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          YouTube URL *
                        </label>
                        <Input
                          type="url"
                          id="url"
                          name="url"
                          value={newItem.url}
                          onChange={handleInputChangeSimple}
                          placeholder="https://www.youtube.com/watch?v=..."
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Section: Additional Details */}
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">Additional Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Price field */}
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Price (USD)
                      </label>
                      <Input
                        type="number"
                        id="price"
                        name="price"
                        value={newItem.price === undefined ? '' : newItem.price}
                        onChange={handleNumberChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    
                    {/* Language field */}
                    <div>
                      <label
                        htmlFor="language"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Language
                      </label>
                      <Select 
                        value={newItem.language} 
                        onValueChange={(value) => handleSelectChange('language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Version field */}
                    <div>
                      <label
                        htmlFor="version"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Version
                      </label>
                      <Input
                        type="number"
                        id="version"
                        name="version"
                        value={newItem.version}
                        onChange={handleNumberChange}
                        placeholder="1"
                        step="1"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Section: Custom Metadata */}
                <div>
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Custom Metadata</h4>
                    <Button 
                      onClick={addCustomMetadataField}
                      className="flex items-center px-2 py-1 text-sm border border-gray-300 rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Field
                    </Button>
                  </div>
                  
                  {customMetadataFields.length > 0 ? (
                    <div className="space-y-3">
                      {customMetadataFields.map((field, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Input
                            placeholder="Field Name"
                            value={field.key}
                            onChange={(e) => updateCustomMetadataField(index, 'key', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Value"
                            value={field.value}
                            onChange={(e) => updateCustomMetadataField(index, 'value', e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => removeCustomMetadataField(index)}
                            className="text-white bg-red-500 hover:bg-red-600 p-1 rounded"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <p className="text-sm">Add custom fields to organize and categorize your content</p>
                    </div>
                  )}
                </div>
                
                {/* Section: File Upload - only for data and report types */}
                {(activeContentTab === 'data' || activeContentTab === 'report') && (
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">File Upload</h4>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-4 pb-4">
                          <Upload className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
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
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

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

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  Cancel
                </Button>
                
                <Button
                  onClick={handleContentSubmit}
                  disabled={isUploading}
                  className={cn(
                    'bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded',
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  )}
                >
                  {activeContentTab === 'podcast' 
                    ? 'Add Podcast' 
                    : `Add ${activeContentTab === 'data' ? 'Data' : 'Report'}`}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
