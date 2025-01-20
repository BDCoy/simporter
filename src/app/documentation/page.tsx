import React from "react";

const DocumentationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6">Documentation</h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">Getting Started</h3>
            <p className="text-gray-600">Learn the basics of using Simporter.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">Features Overview</h3>
            <p className="text-gray-600">
              Explore the features available in the app.
            </p>
          </div>
          {/* Add more sections */}
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
