"use client";

import React, { useState } from "react";

interface ImageVariant {
  id: string;
  url: string;
}

const ImagesTab: React.FC = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageVariant[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateImages = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // Simulate an API call delay (replace with actual API call to Ideogram)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate 4 dummy image variants
      const variants: ImageVariant[] = Array.from({ length: 4 }).map((_, i) => ({
        id: `${Date.now()}-${i}`,
        url: `https://via.placeholder.com/300?text=${encodeURIComponent(query)}+Variant+${i + 1}`,
      }));
      setImages(variants);
    } catch (e) {
      setError("Failed to generate images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToSlideshow = (image: ImageVariant) => {
    // Replace with your actual logic to add the image to the slideshow.
    alert(`Image added to slideshow:\n${image.url}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Create AI Images
      </h2>
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Enter search query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded"
        />
        <button
          onClick={generateImages}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate
        </button>
        {images.length > 0 && (
          <button
            onClick={generateImages}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Redo
          </button>
        )}
      </div>
      {loading && (
        <p className="text-gray-700 dark:text-gray-300">Generating images...</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="border border-gray-300 dark:border-gray-600 rounded p-2 flex flex-col items-center"
            >
              <img
                src={img.url}
                alt={`Variant for ${query}`}
                className="w-full h-auto mb-2 rounded"
              />
              <button
                onClick={() => handleAddToSlideshow(img)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add to Slideshow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagesTab;
