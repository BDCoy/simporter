"use client";

import React, { useState } from "react";

export default function ConceptArtPage() {
  const [rows, setRows] = useState<{ name: string; description: string }[]>([]);
  const [variations, setVariations] = useState<"1" | "3">("1");
  const [output, setOutput] = useState<string[]>([]);

  const handleAddRow = () => {
    setRows([...rows, { name: "", description: "" }]);
  };

  const handleRowChange = (index: number, field: "name" | "description", value: string) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const generateVariations = async () => {
    const payload = {
      rows,
      variations: parseInt(variations, 10),
    };

    try {
      const response = await fetch("https://api.ideogram.ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setOutput(data.variations || []);
    } catch (error) {
      console.error("Error generating variations:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Concept Art Variations</h1>
      <p className="text-gray-600 mb-8">
        Add rows with names and descriptions. Select the number of variations you want and generate.
      </p>

      <div className="mb-4">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
        >
          Add Row
        </button>
      </div>

      <div className="space-y-4">
        {rows.map((row, index) => (
          <div key={index} className="flex gap-4">
            <input
              type="text"
              placeholder="Name"
              value={row.name}
              onChange={(e) => handleRowChange(index, "name", e.target.value)}
              className="flex-1 p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Description"
              value={row.description}
              onChange={(e) => handleRowChange(index, "description", e.target.value)}
              className="flex-1 p-2 border rounded-lg"
            />
          </div>
        ))}
      </div>

      <div className="my-6">
        <label className="block mb-2 text-gray-700">Number of Variations</label>
        <select
          value={variations}
          onChange={(e) => setVariations(e.target.value as "1" | "3")}
          className="p-2 border rounded-lg"
        >
          <option value="1">1 Variation</option>
          <option value="3">3 Variations</option>
        </select>
      </div>

      <button
        onClick={generateVariations}
        className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
      >
        Generate Variations
      </button>

      {output.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Variations</h2>
          <ul className="space-y-4">
            {output.map((variation, index) => (
              <li key={index} className="p-4 border rounded-lg">
                {variation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
