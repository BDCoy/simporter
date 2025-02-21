import React, { useCallback, useState } from 'react';
import { Upload, FileType, Database, AlertCircle, RefreshCw, Check, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface DataFile {
  id: string;
  name: string;
  size: number;
  status: 'processing' | 'active' | 'error';
  type: string;
  uploadedAt: Date;
  lastProcessed: Date | null;
  error?: string;
}

export function OwnerDashboard() {
  const { isOwner } = useStore();
  const [files, setFiles] = useState<DataFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: FileType[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      for (const file of acceptedFiles) {
        // Create a new file entry
        const newFile: DataFile = {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          status: 'processing',
          type: file.type,
          uploadedAt: new Date(),
          lastProcessed: null
        };

        setFiles(prev => [...prev, newFile]);

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('rag-data')
          .upload(`files/${newFile.id}/${file.name}`, file, {
            onUploadProgress: (progress) => {
              setUploadProgress((progress.loaded / progress.total) * 100);
            }
          });

        if (error) throw error;

        // Process the file for RAG
        await processFileForRAG(newFile.id, data.path);

        // Update file status
        setFiles(prev =>
          prev.map(f =>
            f.id === newFile.id
              ? { ...f, status: 'active', lastProcessed: new Date() }
              : f
          )
        );
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const processFileForRAG = async (fileId: string, filePath: string) => {
    try {
      // Get file content
      const { data: fileData, error: fetchError } = await supabase.storage
        .from('rag-data')
        .download(filePath);

      if (fetchError) throw fetchError;

      // Process file content based on type
      const text = await fileData.text();
      const chunks = splitIntoChunks(text);

      // Get embeddings for each chunk
      for (const chunk of chunks) {
        const embedding = await getEmbedding(chunk);
        
        // Store in documents table
        const { error: insertError } = await supabase
          .from('documents')
          .insert({
            content: chunk,
            embedding,
            metadata: {
              fileId,
              fileName: filePath.split('/').pop(),
              chunkIndex: chunks.indexOf(chunk)
            }
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Processing error:', error);
      setFiles(prev =>
        prev.map(f =>
          f.id === fileId
            ? { ...f, status: 'error', error: 'Failed to process file' }
            : f
        )
      );
      throw error;
    }
  };

  const splitIntoChunks = (text: string, maxChunkSize = 1000): string[] => {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxChunkSize) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  };

  const getEmbedding = async (text: string): Promise<number[]> => {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-3-small'
      })
    });

    const data = await response.json();
    return data.data[0].embedding;
  };

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Only owners can access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
        Owner Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              RAG Data Upload
            </h2>
            <Upload className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
            <input
              type="file"
              className="hidden"
              id="file-upload"
              multiple
              accept=".txt,.csv,.json,.md"
              onChange={(e) => onDrop(Array.from(e.target.files || []))}
              disabled={isUploading}
            />
            <label
              htmlFor="file-upload"
              className={cn(
                "cursor-pointer flex flex-col items-center",
                isUploading && "opacity-50 pointer-events-none"
              )}
            >
              <FileType className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isUploading ? 'Uploading...' : 'Drag and drop files or click to upload'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Supported formats: CSV, JSON, TXT, MD
              </span>
            </label>

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
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 text-sm text-red-500">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Data Files Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Data Files
            </h2>
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="space-y-4">
            {files.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No files uploaded yet
              </p>
            ) : (
              files.map(file => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {file.status === 'processing' ? (
                        <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                      ) : file.status === 'active' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Intl.DateTimeFormat('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        }).format(file.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Processing Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Processing Stats
            </h2>
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Active Files
                </span>
                <span className="text-gray-900 dark:text-white">
                  {files.filter(f => f.status === 'active').length}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600"
                  style={{
                    width: `${(files.filter(f => f.status === 'active').length / Math.max(files.length, 1)) * 100}%`
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Processing
                </span>
                <span className="text-gray-900 dark:text-white">
                  {files.filter(f => f.status === 'processing').length}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{
                    width: `${(files.filter(f => f.status === 'processing').length / Math.max(files.length, 1)) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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