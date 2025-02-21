import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Image, Upload, X } from 'lucide-react';

const defaultWallpapers = [
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85',
  'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e',
];

export function WallpaperPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const { customWallpaper, setCustomWallpaper } = useStore();
  const [selectedWallpaper, setSelectedWallpaper] = useState(customWallpaper);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedWallpaper(base64);
        setCustomWallpaper(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWallpaperSelect = (wallpaper: string) => {
    setSelectedWallpaper(wallpaper);
    setCustomWallpaper(wallpaper);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
      >
        <Image className="w-4 h-4" />
        <span>Change Wallpaper</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium dark:text-white">
              Choose Wallpaper
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {defaultWallpapers.map((wallpaper, index) => (
              <button
                key={index}
                onClick={() => handleWallpaperSelect(wallpaper)}
                className="relative aspect-video rounded-lg overflow-hidden hover:ring-2 ring-blue-500"
              >
                <img
                  src={wallpaper}
                  alt={`Wallpaper ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <label className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Upload Custom</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}