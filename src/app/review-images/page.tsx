"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Trash2, RotateCw, Send, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface Concept {
  id: number;
  name: string;
  description: string;
  aiScore: number;
  attributes: { name: string; value: string; score: number }[];
  image: string;
}

const conceptsPlaceholder: Concept[] = [
  {
    id: 1,
    name: "Pepsi Natural Vanilla with Pure Cane Sugar",
    description: `Introducing a revolutionary addition to the Pepsi portfolio that combines natural vanilla flavoring with pure cane sugar for an elevated cola experience.

Our unique formula perfectly balances the warmth of Madagascar vanilla beans with the classic Pepsi taste profile consumers love.

Each sip delivers a smooth, creamy vanilla note that complements rather than overpowers the signature cola taste.

The pure cane sugar provides a clean, crisp sweetness that enhances the natural vanilla flavors.`,
    aiScore: 85,
    attributes: [
      { name: "Taste Appeal", value: "Premium vanilla flavor profile with balanced sweetness", score: 92 },
      { name: "Market Potential", value: "High demand in natural beverage segment", score: 88 },
      { name: "Cost Efficiency", value: "Competitive despite premium ingredients", score: 78 },
      { name: "Production Scalability", value: "Existing infrastructure compatible", score: 85 },
      { name: "Consumer Intent", value: "Strong purchase intent across demographics", score: 90 },
      { name: "Sustainability", value: "Responsible sourcing potential", score: 82 },
    ],
    image: "/api/placeholder/300/300",
  },
];

const slideBackgrounds = [
  "https://simporter.com/wp-content/uploads/2025/01/Slide1.svg",
  "https://simporter.com/wp-content/uploads/2025/01/Slide2.svg",
  "https://simporter.com/wp-content/uploads/2025/01/Slide3.svg",
  "https://simporter.com/wp-content/uploads/2025/01/Slide4.svg",
  "https://simporter.com/wp-content/uploads/2025/01/Slide5.svg",
];

const ReviewImages: React.FC = () => {
  const router = useRouter();
  const [concepts, setConcepts] = useState<Concept[]>(conceptsPlaceholder);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showMoreDescription, setShowMoreDescription] = useState<boolean>(false);
  const [editing, setEditing] = useState<{ id: number; field: keyof Concept } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => Math.min(prev + 1, slideBackgrounds.length - 1));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setChatInput("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setEditing(null);
    }
  };

  const getDescriptionPreview = (description: string) => {
    const lines = description.split("\n").filter((line) => line.trim());
    const maxLines = 10;
    if (lines.length <= maxLines) return { preview: description, hasMore: false };
    const preview = lines.slice(0, maxLines).join("\n");
    return {
      preview: preview + (lines.length > maxLines ? "..." : ""),
      hasMore: true,
    };
  };

  const handleEdit = (id: number, field: keyof Concept) => {
    setEditing({ id, field });
    setEditValue(concepts.find((c) => c.id === id)?.[field] as string);
  };

  const handleSaveEdit = () => {
    if (editing) {
      setConcepts((prev) =>
        prev.map((concept) =>
          concept.id === editing.id ? { ...concept, [editing.field]: editValue } : concept
        )
      );
      setEditing(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleDelete = () => {
    if (concepts.length > 1) {
      setConcepts((prev) => prev.filter((_, index) => index !== currentSlide));
      setCurrentSlide((prev) => (prev >= concepts.length - 1 ? concepts.length - 2 : prev));
    }
  };

  const getAttributeColor = (score: number) => {
    if (score > 70) return "from-emerald-500 to-teal-600";
    if (score >= 45) return "from-amber-500 to-orange-600";
    return "from-rose-500 to-pink-600";
  };

  const currentConcept = concepts[currentSlide] || conceptsPlaceholder[0];
  const visibleAttributes = currentConcept.attributes.slice(0, 3);

  const { preview, hasMore } = getDescriptionPreview(currentConcept.description);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content here */}
    </div>
  );
};

export default ReviewImages;
