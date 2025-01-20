"use client";

import React, { useState } from "react";

interface Quest {
  id: number;
  title: string;
  description: string;
  progress: number; // Percentage progress (0 to 100)
  reward: number; // Tokens rewarded on completion
}

const placeholderQuests: Quest[] = [
  { id: 1, title: "Complete 5 Reports", description: "Create 5 reports to earn tokens.", progress: 40, reward: 100 },
  { id: 2, title: "Share 3 Trends", description: "Share 3 insights or trends.", progress: 60, reward: 50 },
  { id: 3, title: "Participate in 1 Workshop", description: "Join a workshop to earn tokens.", progress: 0, reward: 150 },
];

const Quests: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>(placeholderQuests);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-4">Quests</h1>
        <p className="text-gray-600 mb-8">
          Complete tasks and quests to earn tokens and climb the leaderboard!
        </p>

        <div className="space-y-6">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className="bg-white shadow rounded-lg p-4 hover:shadow-xl transition-all"
            >
              <h2 className="text-xl font-bold">{quest.title}</h2>
              <p className="text-gray-600">{quest.description}</p>
              <p className="text-gray-900 font-semibold mt-2">
                Reward: {quest.reward} Tokens
              </p>
              <div className="mt-4">
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-violet-600"
                    style={{ width: `${quest.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {quest.progress}% Completed
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quests;
