"use client";

import React from "react";
import { cn } from "@/lib/utils"; // Use your cn helper

// Dummy definitions to satisfy the imports (adjust as needed)
const avatarMapping: Record<string, string> = {
  "Newf Puppy": "/images/dog-avatar.png", // Replace with your actual avatar image path
};

const getBadge = (level: number): string => {
  return "/images/level-badge.png"; // Replace with your actual badge image path
};

interface Achievement {
  id: number;
  title: string;
  completed: boolean;
  progress?: number;
  icon?: string;
  xpReward?: number;
  badge?: string;
}

interface UserData {
  level: number;
  maxLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  streak: number;
  tokens: number;
  recentAchievements: Achievement[];
  dogLevel: string;
}

interface GamificationPanelProps {
  userData: UserData;
  onClose: () => void;
  onViewAllAchievements: () => void;
}

export function GamificationPanel({
  userData,
  onClose,
  onViewAllAchievements,
}: GamificationPanelProps) {
  if (!userData) return null;

  const progressPercentage = (userData.currentXP / userData.xpForNextLevel) * 100;
  const currentBadge = getBadge(userData.level);
  const currentAvatar = avatarMapping[userData.dogLevel] || "/images/default-avatar.png";

  const achievementsWithBadge: Achievement[] = [
    {
      id: 1,
      title: "First Login",
      completed: true,
      icon: "🎯",
      xpReward: 100,
    },
    {
      id: 2,
      title: "3-Day Streak",
      completed: true,
      icon: "🔥",
      xpReward: 150,
      badge: currentBadge,
    },
    {
      id: 3,
      title: "Complete 10 Projects",
      completed: false,
      progress: 3,
      icon: "📊",
      xpReward: 500,
    },
  ];

  return (
    <div className="absolute top-16 right-0 w-full md:w-[400px] bg-white border-l border-gray-200 z-50 shadow-lg">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Your Progress</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Avatar and Level Display */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-blue-100">
              <img
                src={currentAvatar}
                alt={userData.dogLevel}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10">
              <img
                src={currentBadge}
                alt="Level Badge"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Level and XP progress */}
        <div className="mb-6 text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              Level {userData.level}
            </span>
            <span className="text-sm md:text-base text-gray-500">
              ({userData.dogLevel})
            </span>
          </div>
          <div className="text-xs md:text-sm text-gray-500 mb-2">
            {userData.currentXP} / {userData.xpForNextLevel} XP
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* User stats */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
          {/* Daily login streak */}
          <div className="flex items-center p-2 md:p-3 bg-gray-50 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6 text-orange-500 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="text-xs text-gray-500">Daily Streak</h4>
              <p className="text-sm md:text-base font-bold text-gray-900">
                {userData.streak} days
              </p>
            </div>
          </div>
          {/* Token balance */}
          <div className="flex items-center p-2 md:p-3 bg-gray-50 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="text-xs text-gray-500">Token Balance</h4>
              <p className="text-sm md:text-base font-bold text-gray-900">{userData.tokens}</p>
            </div>
          </div>
        </div>
        {/* Recent Achievements */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Recent Achievements</h4>
          <div className="space-y-2">
            {achievementsWithBadge.map((achievement) => (
              <div
                key={achievement.id}
                className={cn(
                  "flex items-center p-2 rounded-md",
                  achievement.completed ? "bg-gray-50" : "bg-gray-50/50"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mr-2",
                    achievement.completed ? "bg-green-100" : "bg-blue-100"
                  )}
                >
                  <span className="text-lg">{achievement.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5
                      className={cn(
                        "text-sm truncate",
                        achievement.completed ? "text-gray-900 font-medium" : "text-gray-500"
                      )}
                    >
                      {achievement.title}
                    </h5>
                    {achievement.badge && (
                      <img
                        src={achievement.badge}
                        alt="Achievement Badge"
                        className="w-4 h-4 object-contain"
                      />
                    )}
                  </div>
                  {!achievement.completed && achievement.progress !== undefined && (
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(achievement.progress / 10) * 100}%` }}
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-blue-600">+{achievement.xpReward} XP</span>
                    {achievement.completed && (
                      <span className="text-xs text-green-600">Completed</span>
                    )}
                  </div>
                </div>
                {achievement.completed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {achievement.progress}/10
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => onViewAllAchievements()}
          className="w-full py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View All Achievements
        </button>
      </div>
    </div>
  );
}
