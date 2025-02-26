"use client";

import React, { useState } from "react";
import { showcaseItems } from "./componentData";
import Dropdown, { OptionItem } from "../../components/ui/Dropdown";

export default function ComponentsPage() {
  // State for selected type and component name
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");

  // Create a list of distinct types from your showcase items
  const distinctTypes = Array.from(new Set(showcaseItems.map((item) => item.type)));
  const typeOptions: OptionItem[] = distinctTypes.map((type) => ({
    value: type,
    label: type,
  }));

  // Filter items by selected type; if none is selected, name options remain empty
  const filteredItems = selectedType
    ? showcaseItems.filter((item) => item.type === selectedType)
    : [];

  const nameOptions: OptionItem[] = filteredItems.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  // Find the item that matches both selected type and name
  const selectedItem = showcaseItems.find(
    (item) => item.type === selectedType && item.name === selectedName
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Simporter UI Components</h1>

      {/* Dropdown for component type */}
      <Dropdown
        label="Component Type"
        options={typeOptions}
        value={selectedType}
        onChange={(newType) => {
          console.log("Type selected:", newType);
          setSelectedType(newType);
          setSelectedName(""); // Reset the component name when type changes
        }}
        placeholder="Select a type..."
      />

      {/* Dropdown for component name */}
      <Dropdown
        label="Component Name"
        options={nameOptions}
        value={selectedName}
        onChange={(newName) => {
          console.log("Name selected:", newName);
          setSelectedName(newName);
        }}
        placeholder="Select a component..."
        disabled={!selectedType}
      />

      {/* Render the selected component */}
      <div className="mt-6 border p-4 rounded-md">
        {selectedItem ? (
          selectedItem.component
        ) : (
          <p className="text-gray-600">
            Please select a type and a component to preview it here.
          </p>
        )}
      </div>
    </div>
  );
}
