"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConceptCard from "@/components/ConceptCard";
import ConceptRevealCard from "@/components/ConceptRevealCard";

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

const ReviewDescriptions: React.FC = () => {
  const router = useRouter();
  const [showTopConcept, setShowTopConcept] = useState(false);

  // Generate 20 placeholder concepts
  const initialConcepts: Concept[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Healthy Snack Pack ${i + 1}`,
    description:
      "This is a placeholder description for a healthy snack pack, showcasing a mix of attributes and a high AI score. Perfect for modern lifestyles and health-conscious individuals.",
    aiScore: Math.floor(Math.random() * 101), // Random AI Score between 0 and 100
    attributes: [
      { name: "Low Sugar", score: Math.floor(Math.random() * 101) },
      { name: "High Protein", score: Math.floor(Math.random() * 101) },
      { name: "Vegan", score: Math.floor(Math.random() * 101) },
    ],
    selected: false,
  }));

  const [concepts, setConcepts] = useState<Concept[]>(initialConcepts);
  const [selectAll, setSelectAll] = useState(false);

  const handleToggleSelectAll = () => {
    const newSelectState = !selectAll;
    setConcepts((prev) =>
      prev.map((concept) => ({ ...concept, selected: newSelectState }))
    );
    setSelectAll(newSelectState);
  };

  // Sort concepts by aiScore in descending order without mutating state
  const sortedConcepts = [...concepts].sort((a, b) => b.aiScore - a.aiScore);

  // Add effect to show the top concept animation on page load
  useEffect(() => {
    if (sortedConcepts.length > 0) {
      const timer = setTimeout(() => {
        setShowTopConcept(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [sortedConcepts]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ConceptRevealCard
        concept={sortedConcepts[0]}
        isVisible={showTopConcept}
        onClose={() => setShowTopConcept(false)}
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => router.push("/create-concepts")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Review Descriptions</h1>
          <button
            onClick={() => router.push("/review-images")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700"
          >
            Next: Create Images
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          Select the concepts you want to create images for.
        </p>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleToggleSelectAll}
            className="px-4 py-2 border border-purple-500 text-purple-500 font-semibold rounded-lg transition hover:bg-purple-500 hover:text-white"
          >
            {selectAll ? "Unselect All" : "Select All"}
          </button>
          
          <button
            onClick={() => setShowTopConcept(true)}
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg transition hover:bg-purple-700 shadow-lg flex items-center gap-2"
          >
            <span>Reveal Top Concept</span>
            <span className="text-yellow-300">#{sortedConcepts[0]?.aiScore}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedConcepts.map((concept, index) => (
            <ConceptCard
              key={concept.id}
              concept={concept}
              index={index}
              isSelected={concept.selected}
              toggleSelect={(id) =>
                setConcepts((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
                )
              }
              onEdit={(id, field, value) =>
                setConcepts((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
                )
              }
              onAttributeChange={(id, oldAttr, newAttr) =>
                setConcepts((prev) =>
                  prev.map((c) =>
                    c.id === id
                      ? {
                          ...c,
                          attributes: c.attributes.map((attr) =>
                            attr.name === oldAttr.name ? newAttr : attr
                          ),
                        }
                      : c
                  )
                )
              }
              onAttributeDelete={(id, attr) =>
                setConcepts((prev) =>
                  prev.map((c) =>
                    c.id === id
                      ? {
                          ...c,
                          attributes: c.attributes.filter((a) => a.name !== attr.name),
                        }
                      : c
                  )
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewDescriptions;
