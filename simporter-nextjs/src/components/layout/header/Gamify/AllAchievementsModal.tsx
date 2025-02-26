"use client";

import React, { useState } from "react";
import type { Achievement } from "../../../../data/achievements";
import { achievements } from "../../../../data/achievements";

interface AllAchievementsModalProps {
  onClose: () => void;
}

// Group achievements by category with explicit types
const achievementsByCategory = achievements.reduce<Record<string, Achievement[]>>(
  (acc, achievement: Achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  },
  {}
);

export default function AllAchievementsModal({ onClose }: AllAchievementsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = Object.keys(achievementsByCategory);

  const filteredAchievements: Record<string, Achievement[]> =
    selectedCategory === "all"
      ? achievementsByCategory
      : { [selectedCategory]: achievementsByCategory[selectedCategory] };

  const searchedAchievements = Object.entries(filteredAchievements).reduce<Record<string, Achievement[]>>(
    (acc, [category, categoryAchievements]) => {
      const filtered = categoryAchievements.filter((achievement) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          achievement.title.toLowerCase().includes(searchLower) ||
          achievement.description.toLowerCase().includes(searchLower)
        );
      });
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {}
  );

  const getBadgeColor = (badgeType: Achievement["badgeType"]) => {
    switch (badgeType) {
      case "Bronze":
        return "bg-amber-600";
      case "Silver":
        return "bg-gray-400";
      case "Gold":
        return "bg-yellow-500";
      case "Diamond":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg transition-colors hover:bg-gray-50 ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-colors hover:bg-gray-50 ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {Object.entries(searchedAchievements).map(([category, categoryAchievements]) => (
            <div key={category} className="mb-8 last:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      achievement.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white ${getBadgeColor(
                          achievement.badgeType
                        )}`}
                      >
                        {achievement.level === "Single" ? "★" : achievement.level}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium text-gray-900">
                            {achievement.title}
                          </h4>
                          <span className="text-sm font-medium text-blue-600">
                            +{achievement.xpReward}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Requirement:</span> {achievement.requirement}
                        </p>
                        {achievement.progress !== undefined && achievement.total !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.total}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 transition-all"
                                style={{
                                  width: `${(achievement.progress / achievement.total) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                        <div className="mt-2 flex items-center">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor(
                              achievement.badgeType
                            )} text-white`}
                          >
                            {achievement.badgeType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
