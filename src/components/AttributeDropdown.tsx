import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Trash2, Search, Check } from "lucide-react";

interface Attribute {
  name: string;
  impact: "good" | "ok" | "bad";
}

interface AttributeDropdownProps {
  currentAttr: Attribute;
  onChange: (newAttr: Attribute) => void;
  onDelete: () => void;
}

const AttributeDropdown: React.FC<AttributeDropdownProps> = ({
  currentAttr,
  onChange,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableAttributes: Attribute[] = [
    { name: "High Protein", impact: "good" },
    { name: "Vegan", impact: "good" },
    { name: "Gluten-Free", impact: "good" },
    { name: "Low Sugar", impact: "good" },
    { name: "Sugar-Free", impact: "good" },
    { name: "Collagen", impact: "good" },
    { name: "Fruit Gummies", impact: "ok" },
    { name: "Skin Health", impact: "good" },
    { name: "Dairy-Free", impact: "good" },
    { name: "Probiotic", impact: "good" },
  ];

  const filteredAttributes = availableAttributes.filter((attr) =>
    attr.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Dropdown Trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center px-2 py-1 bg-gray-200 rounded-full text-xs hover:bg-gray-300 transition"
      >
        {currentAttr.name} <ChevronDown className="w-3 h-3 ml-1" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50"
          style={{ zIndex: 9999 }} // Ensure it's above other elements
        >
          <div className="p-2">
            <div className="flex items-center mb-2">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <ul className="max-h-48 overflow-y-auto">
              {filteredAttributes.map((attr, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    onChange(attr);
                    setIsOpen(false);
                  }}
                >
                  <span>{attr.name}</span>
                  {attr.name === currentAttr.name && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </li>
              ))}
              {filteredAttributes.length === 0 && (
                <li className="px-4 py-2 text-gray-500">No attributes found.</li>
              )}
            </ul>
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-100 rounded-md mt-2"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete Attribute
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeDropdown;
