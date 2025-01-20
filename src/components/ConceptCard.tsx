import React, { useState } from "react";
import { Star } from "lucide-react";
import AttributeDropdown from "@/components/AttributeDropdown";

interface Attribute {
  name: string;
  score: number;
}

interface Concept {
  id: number;
  title: string;
  description: string;
  aiScore: number;
  attributes: Attribute[];
  selected: boolean;
}

interface ConceptCardProps {
  concept: Concept;
  index: number;
  isSelected: boolean;
  toggleSelect: (id: number) => void;
  onEdit: (id: number, field: "title" | "description", value: string) => void;
  onAttributeChange: (id: number, oldAttr: Attribute, newAttr: Attribute) => void;
  onAttributeDelete: (id: number, attr: Attribute) => void;
}

const ConceptCard: React.FC<ConceptCardProps> = ({
  concept,
  index,
  isSelected,
  toggleSelect,
  onEdit,
  onAttributeChange,
  onAttributeDelete,
}) => {
  const [editingField, setEditingField] = useState<"title" | "description" | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEditStart = (field: "title" | "description") => {
    setEditingField(field);
    setEditValue(field === "title" ? concept.title : concept.description);
  };

  const handleEditSave = () => {
    if (editValue.trim()) {
      onEdit(concept.id, editingField!, editValue);
    }
    setEditingField(null);
  };

  const getScoreColor = (score: number) => {
    if (score > 69) return "text-green-600";
    if (score > 44) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-md p-4 transition-transform duration-300 ${
        isSelected ? "ring-4 ring-blue-500" : "ring-1 ring-gray-300"
      } hover:scale-105`}
      style={{ overflow: "visible" }} // Ensure this card allows dropdown overflow
      onClick={() => toggleSelect(concept.id)}
    >
      {/* Rank */}
      <div className="absolute top-0 left-0 bg-gray-800 text-white px-3 py-1 text-sm rounded-tr-lg">
        Rank #{index + 1}
      </div>

      {/* Title */}
      <div className="mb-4">
        {editingField === "title" ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSave}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
        ) : (
          <h3
            className="text-lg font-semibold cursor-pointer"
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleEditStart("title");
            }}
          >
            {concept.title || "No Title"}
          </h3>
        )}
      </div>

      {/* AI Score */}
      <div className={`text-gray-500 mb-4 ${getScoreColor(concept.aiScore)}`}>
        <Star className="inline-block w-5 h-5 text-yellow-500" /> AI Score: {concept.aiScore}%
      </div>

      {/* Attributes */}
      <div className="mb-4" style={{ position: "relative", zIndex: 1 }}>
        <h4 className="text-sm font-semibold">Attributes:</h4>
        <div className="flex flex-wrap gap-2">
          {concept.attributes.map((attr, index) => (
            <AttributeDropdown
              key={index}
              currentAttr={{
                name: attr.name,
                impact:
                  attr.score > 69
                    ? "good"
                    : attr.score > 44
                    ? "ok"
                    : "bad",
              }}
              onChange={(newAttr) =>
                onAttributeChange(concept.id, attr, { ...attr, name: newAttr.name })
              }
              onDelete={() => onAttributeDelete(concept.id, attr)}
            />
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        {editingField === "description" ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSave}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
        ) : (
          <p
            className="text-gray-700 cursor-pointer"
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleEditStart("description");
            }}
          >
            {concept.description || "No Description"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConceptCard;
