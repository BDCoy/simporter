"use client";

import React, { Dispatch, SetStateAction, ReactNode } from 'react';

interface ComponentItem {
  name: string;
  component: ReactNode;
}

interface ComponentsDropdownProps {
  components?: ComponentItem[]; // now optional
  title?: string;
  selectedComponent?: string;
  onSelectComponent?: Dispatch<SetStateAction<string>>;
}

export default function ComponentsDropdown({
  components = [], // default to an empty array
  title = "Select a Component",
  selectedComponent,
  onSelectComponent,
}: ComponentsDropdownProps) {
  return (
    <div className="relative inline-block text-left">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
        {components.map((item, index) => (
          <button
            key={index}
            className={`block w-full text-left px-4 py-2 text-sm ${
              selectedComponent === item.name
                ? "bg-gray-200 dark:bg-gray-700"
                : ""
            }`}
            onClick={() => onSelectComponent?.(item.name)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
