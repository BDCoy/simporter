"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Ensure correct import
import { Send, ArrowLeft, Loader, Check } from 'lucide-react';

interface Attribute {
  category: string;
  [key: string]: any;
}

interface ProductIdea {
  id: number;
  text: string;
  selected: boolean;
}

interface ProductIdeationProps {
  selectedAttributes: Attribute[];
  onNext: (selectedIdeas: ProductIdea[]) => void;
  onBack: () => void;
}

const PLACEHOLDER_IDEAS = [
  "High-Protein Nut and Seed Energy Bars",
  "Vegan Chocolate Chip Protein Cookie Bites",
  "Collagen-Infused Fruit Gummies for Skin Health",
  // ... add more ideas
];

const ProductIdeation: React.FC<ProductIdeationProps> = ({ selectedAttributes, onNext, onBack }) => {
  const [productIdeas, setProductIdeas] = useState<ProductIdea[]>([]);
  const [selectedIdeas, setSelectedIdeas] = useState<ProductIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const editInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter(); // Correct usage

  useEffect(() => {
    const generateIdeas = () => {
      const ideas: ProductIdea[] = Array.from({ length: 150 }, (_, i) => {
        const baseIdea = PLACEHOLDER_IDEAS[i % PLACEHOLDER_IDEAS.length];
        const modifier = i >= PLACEHOLDER_IDEAS.length ? ` - Variation ${Math.floor(i / PLACEHOLDER_IDEAS.length)}` : '';
        return {
          id: i + 1,
          text: baseIdea + modifier,
          selected: false
        };
      });
      setProductIdeas(ideas);
      setTimeout(() => setLoading(false), 800);
    };

    generateIdeas();
  }, [selectedAttributes]);

  const handleSkip = () => {
    router.push('/review-report');
  };

  const handleNext = () => {
    onNext(selectedIdeas); // Use onNext callback with selected ideas
    router.push('/review-descriptions');
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setRevision(true);

    // Simulate revision process
    setTimeout(() => {
      const updatedIdeas = productIdeas.map(idea => ({
        ...idea,
        text: idea.text.includes(chatInput)
          ? idea.text
          : `${idea.text} with ${chatInput}`
      }));
      setProductIdeas(updatedIdeas);
      setChatInput('');
      setRevision(false);
    }, 2000);
  };

  const handleIdeaSelect = (idea: ProductIdea) => {
    setSelectedIdeas(prev => {
      const isSelected = prev.some(i => i.id === idea.id);
      const updatedSelected = isSelected ? prev.filter(i => i.id !== idea.id) : [...prev, { ...idea, selected: !isSelected }];
      // Update the productIdeas state to reflect selection
      setProductIdeas(prevIdeas => prevIdeas.map(pi => pi.id === idea.id ? { ...pi, selected: !isSelected } : pi));
      return updatedSelected;
    });
  };

  const handleEditSave = () => {
    if (editValue.trim()) {
      setProductIdeas(prev => prev.map(idea =>
        idea.id === editingId ? { ...idea, text: editValue } : idea
      ));
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
        <div className="text-lg font-bold text-white animate-pulse flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Generating Product Ideas...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Revision Overlay */}
      {revision && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <Loader className="w-8 h-8 text-violet-600 animate-spin mb-4" />
          <p className="text-lg font-semibold text-violet-600 animate-pulse">
            Revising Concepts...
          </p>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-8">
        {/* Header Section with Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-violet-600 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold">Product Ideas</h1>
              <h2 className="text-2xl font-semibold text-gray-500">{selectedIdeas.length} Selected</h2>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSkip}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 hover:scale-105 transition-all duration-300"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 hover:scale-105 transition-all duration-300"
            >
              Next: Generate Descriptions
            </button>
          </div>
        </div>

        {/* Chat Input for Revision (Moved to Top) */}
        <form onSubmit={handleChatSubmit} className="mb-6 flex items-center gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Suggest a revision..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
          <button
            type="submit"
            className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* List of Product Ideas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {productIdeas.map(idea => (
            <div
              key={idea.id}
              className={`relative p-4 border rounded-lg shadow cursor-pointer transition-colors 
                ${idea.selected ? 'border-violet-600 bg-violet-100' : 'border-gray-300 bg-white'}
                hover:bg-gray-100`}
              onClick={() => handleIdeaSelect(idea)}
              onDoubleClick={() => {
                setEditingId(idea.id);
                setEditValue(idea.text);
              }}
            >
              {/* Checkmark for Selected Ideas */}
              {idea.selected && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-violet-600" />
                </div>
              )}

              {editingId === idea.id ? (
                <input
                  ref={editInputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleEditSave}
                  className="w-full border-b-2 border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              ) : (
                <span className="text-gray-800">{idea.text}</span>
              )}
            </div>
          ))}
        </div>

        {/* Optional: Footer or additional content can go here */}
      </div>
    </div>
  );
};

export default ProductIdeation;
