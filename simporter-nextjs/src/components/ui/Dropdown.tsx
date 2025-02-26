"use client";

import React from "react";

export interface OptionItem {
  value: string;
  label: string;
}

interface DropdownProps {
  options: OptionItem[];
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  disabled = false,
}: DropdownProps) {
  return (
    <div className="inline-block relative w-64 mb-4">
      {label && <label className="block mb-1 font-semibold">{label}</label>}
      <select
        className="block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-4 py-2 cursor-pointer"
        value={value}
        onChange={(e) => {
          console.log("Dropdown change:", e.target.value);
          onChange(e.target.value);
        }}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
