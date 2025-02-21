import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Upload as UploadIcon, 
  Image, 
  FileText, 
  Video,
  Package,
  Link,
  Plus,
  Trash2,
  Save,
  Edit2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentItem {
  id: string;
  type: 'product' | 'image' | 'document' | 'video' | 'link';
  name: string;
  description?: string;
  url?: string;
  metadata?: Record<string, any>;
}

interface UploadContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: ContentItem[]) => void;
  initialContent?: ContentItem[];
  contentType?: 'product' | 'all';
}

export function UploadContentModal({
  isOpen,
  onClose,
  onSave,
  initialContent = [],
  contentType = 'all'
}: UploadContentModalProps) {
  const [content, setContent] = useState<ContentItem[]>(initialContent);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const items = [...content];
    const draggedContent = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedContent);
    setContent(items);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const addContent = (type: ContentItem['type']) => {
    setContent([
      ...content,
      {
        id: crypto.randomUUID(),
        type,
        name: `New ${type}`,
        description: ''
      }
    ]);
  };

  const removeContent = (id: string) => {
    setContent(content.filter(item => item.id !== id));
  };

  const updateContent = (id: string, updates: Partial<ContentItem>) => {
    setContent(content.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  const renderContentForm = (item: ContentItem) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Name
        </label>
        <input
          type="text"
          value={item.name}
          onChange={(e) => updateContent(item.id, { name: e.target.value })}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={item.description || ''}
          onChange={(e) => updateContent(item.id, { description: e.target.value })}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
          rows={3}
        />
      </div>

      {item.type === 'product' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              value={item.metadata?.category || ''}
              onChange={(e) => updateContent(item.id, { 
                metadata: { ...item.metadata, category: e.target.value }
              })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Brand
            </label>
            <input
              type="text"
              value={item.metadata?.brand || ''}
              onChange={(e) => updateContent(item.id, { 
                metadata: { ...item.metadata, brand: e.target.value }
              })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          URL
        </label>
        <input
          type="text"
          value={item.url || ''}
          onChange={(e) => updateContent(item.id, { url: e.target.value })}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
          placeholder={`Enter ${item.type} URL...`}
        />
      </div>
    </div>
  );

  if (!isOpen) return null;

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
        className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upload Content
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Add and organize content for your concept test
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Content List */}
            <div className="space-y-4">
              {content.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-move",
                    draggedItem === index && "opacity-50"
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    "p-2 rounded-lg",
                    item.type === 'product' && "bg-blue-100 text-blue-600",
                    item.type === 'image' && "bg-green-100 text-green-600",
                    item.type === 'document' && "bg-purple-100 text-purple-600",
                    item.type === 'video' && "bg-red-100 text-red-600",
                    item.type === 'link' && "bg-orange-100 text-orange-600"
                  )}>
                    {item.type === 'product' && <Package className="w-5 h-5" />}
                    {item.type === 'image' && <Image className="w-5 h-5" />}
                    {item.type === 'document' && <FileText className="w-5 h-5" />}
                    {item.type === 'video' && <Video className="w-5 h-5" />}
                    {item.type === 'link' && <Link className="w-5 h-5" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {editingItem === item.id ? (
                      renderContentForm(item)
                    ) : (
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {item.description}
                          </p>
                        )}
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-block"
                          >
                            View {item.type}
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                      className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeContent(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Content Button */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => addContent('product')}
                  className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </button>

                {contentType === 'all' && (
                  <>
                    <button
                      onClick={() => addContent('image')}
                      className="flex items-center px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Image
                    </button>
                    <button
                      onClick={() => addContent('document')}
                      className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Document
                    </button>
                    <button
                      onClick={() => addContent('video')}
                      className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Video
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Content
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}