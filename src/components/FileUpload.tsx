import React from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  onFileUpload: (file: File) => void;
  helperText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = '.csv',
  maxSize = 5 * 1024 * 1024, // 5MB default
  onFileUpload,
  helperText
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        alert('File is too large. Please upload a smaller file.');
        return;
      }
      onFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        alert('File is too large. Please upload a smaller file.');
        return;
      }
      onFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <span className="text-lg font-semibold mb-2">
            Drop your file here
          </span>
          <span className="text-sm text-gray-500">
            or click to browse files
          </span>
        </label>
      </div>
      
      {helperText && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {helperText}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileUpload;