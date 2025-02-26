"use client";

import React, { useState } from "react";
import SearchBarWithCommands from "@/components/ui/SearchBarWithCommands";

export default function PreviewSearch() {
  const [query, setQuery] = useState("");

  const handleSearch = (q: string) => {
    setQuery(q);
    console.log("PreviewSearch: Searching for:", q);
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="text-xl font-bold mb-2">Preview Search</h3>
      <SearchBarWithCommands
        onSearch={handleSearch}
        onEnhancePrompt={() => {}}
      />
      {query && (
        <div className="mt-2">
          <p className="text-gray-500 text-sm">Preview results for: {query}</p>
        </div>
      )}
    </div>
  );
}
