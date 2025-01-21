"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  content: string;
  style: {
    bg: string;
    layout: "default" | "centered" | "split";
    titleFont: string;
    contentFont: string;
  };
}

interface EditableSlideshowProps {
  initialSlides?: Slide[];
  initialIndex?: number;
}

const EditableSlideshow: React.FC<EditableSlideshowProps> = ({
  initialSlides = [],
  initialIndex = 0,
}) => {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(initialIndex);
  const [editingField, setEditingField] = useState<{
    field: "title" | "content";
    id: number;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const currentSlide = slides[currentSlideIndex] || {
    id: Date.now(),
    title: "Default Slide",
    content: "Default content",
    style: { bg: "#ffffff", layout: "default", titleFont: "sans", contentFont: "sans" },
  };

  const handleEdit = (field: "title" | "content") => {
    setEditingField({ field, id: currentSlide.id });
    setEditValue(currentSlide[field]);
  };

  const handleSaveEdit = () => {
    if (editingField) {
      setSlides((prev) =>
        prev.map((slide) =>
          slide.id === editingField.id ? { ...slide, [editingField.field]: editValue } : slide
        )
      );
      setEditingField(null);
      setEditValue("");
    }
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now(),
      title: `New Slide ${slides.length + 1}`,
      content: "New content",
      style: { bg: "#ffffff", layout: "default", titleFont: "sans", contentFont: "sans" },
    };
    setSlides((prev) => [...prev, newSlide]);
  };

  const deleteSlide = () => {
    if (slides.length > 1) {
      setSlides((prev) => prev.filter((_, index) => index !== currentSlideIndex));
      setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentSlideIndex === 0}
          className="bg-gray-100 px-3 py-2 rounded-lg disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-gray-600">
          Slide {currentSlideIndex + 1} / {slides.length}
        </span>
        <button
          onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
          disabled={currentSlideIndex === slides.length - 1}
          className="bg-gray-100 px-3 py-2 rounded-lg disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <div
        className="p-8 border rounded-lg"
        style={{ backgroundColor: currentSlide.style.bg }}
      >
        {editingField?.id === currentSlide.id && editingField.field === "title" ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            className="w-full font-bold text-xl"
          />
        ) : (
          <h2
            className="text-xl font-bold mb-4 cursor-pointer"
            onDoubleClick={() => handleEdit("title")}
          >
            {currentSlide.title}
          </h2>
        )}
        {editingField?.id === currentSlide.id && editingField.field === "content" ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            className="w-full h-32"
          />
        ) : (
          <p className="cursor-pointer" onDoubleClick={() => handleEdit("content")}>
            {currentSlide.content}
          </p>
        )}
      </div>
      <div className="mt-6 flex gap-4">
        <button
          onClick={addSlide}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" />
          Add Slide
        </button>
        <button
          onClick={deleteSlide}
          disabled={slides.length === 1}
          className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
          Delete Slide
        </button>
      </div>
    </div>
  );
};

export default EditableSlideshow;
