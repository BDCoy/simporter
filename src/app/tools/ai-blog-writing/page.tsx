"use client";

import React, { useState } from "react";

export default function AIBlogWriterPage() {
  const [content, setContent] = useState<string>(""); // Full blog content
  const [chunk, setChunk] = useState<string>(""); // Current chunk being written
  const [isLoading, setIsLoading] = useState(false);

  const handleWriteNextChunk = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/write-next-chunk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: content }),
      });

      const data = await response.json();
      const newChunk = data.chunk || "";

      setContent((prevContent) => `${prevContent}\n\n${newChunk}`);
      setChunk(newChunk);
    } catch (error) {
      console.error("Error generating next chunk:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "AI-generated image for blog content" }),
      });

      const data = await response.json();
      const imageUrl = data.imageUrl || "";

      setContent((prevContent) => `${prevContent}\n\n![Generated Image](${imageUrl})`);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">AI Blog Writing Tool</h1>
      <p className="text-gray-600 mb-8">
        Write and update articles with fresh data, embedding AI-generated images throughout the content.
      </p>

      {/* Blog Content Editor */}
      <div
        className="border p-4 rounded-lg bg-white shadow-md mb-6"
        style={{
          height: "500px",
          overflowY: "scroll",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          lineHeight: "1.6",
        }}
      >
        {content || "Start writing your blog by generating the first 800 words."}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={handleWriteNextChunk}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Writing..." : "Write the Next 800 Words"}
        </button>
        <button
          onClick={handleGenerateImage}
          className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate and Embed Image"}
        </button>
      </div>
    </div>
  );
}
