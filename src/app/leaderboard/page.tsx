"use client";

import React, { useState, useEffect } from "react";
import Shop from "@/components/Shop";
import Quests from "@/components/Quests";
import { useRouter } from "next/navigation"; // Correct import for useRouter in "app" directory
import { Clipboard, Check } from "lucide-react";

interface LeaderboardItem {
  rank: number;
  username: string;
  points: number;
  tokens?: number; // Only for premium users
  avatar: string;
  isPremium: boolean;
  hidden?: boolean; // Tracks whether the user is hidden from the leaderboard
}

const placeholders: LeaderboardItem[] = [
  { rank: 1, username: "George Washington", points: 1800, tokens: 100, avatar: "/avatars/washington.jpg", isPremium: true },
  { rank: 2, username: "Abraham Lincoln", points: 1700, tokens: 90, avatar: "/avatars/lincoln.jpg", isPremium: true },
  { rank: 3, username: "Franklin D. Roosevelt", points: 1600, tokens: 80, avatar: "/avatars/roosevelt.jpg", isPremium: false },
  { rank: 4, username: "John F. Kennedy", points: 1500, tokens: 0, avatar: "/avatars/kennedy.jpg", isPremium: false },
  { rank: 5, username: "Barack Obama", points: 1400, tokens: 0, avatar: "/avatars/obama.jpg", isPremium: true },
];

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [userTokens, setUserTokens] = useState(2500); // Example token balance
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedCollaborators, setSuggestedCollaborators] = useState<LeaderboardItem[]>([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState<LeaderboardItem[]>([]);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const router = useRouter(); // Corrected hook usage

  useEffect(() => {
    // Simulate API call; use placeholder data if leaderboard is empty
    const fetchLeaderboardData = async () => {
      const data: LeaderboardItem[] = []; // Simulate empty leaderboard
      setLeaderboardData(data.length ? data : placeholders);
    };
    fetchLeaderboardData();
  }, []);

  // Filter suggestions based on search term
  useEffect(() => {
    if (searchTerm) {
      setSuggestedCollaborators(
        leaderboardData.filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setSuggestedCollaborators([]);
    }
  }, [searchTerm, leaderboardData]);

  const handleAddCollaborator = (user: LeaderboardItem) => {
    if (!selectedCollaborators.find((collab) => collab.username === user.username)) {
      setSelectedCollaborators((prev) => [...prev, user]);
    }
  };

  const handleRemoveCollaborator = (username: string) => {
    setSelectedCollaborators((prev) =>
      prev.filter((collab) => collab.username !== username)
    );
  };

  const handleCopyLink = () => {
    if (!placeholders[0].isPremium) return; // Only premium users can copy the link
    navigator.clipboard.writeText("https://example.com/collaboration/report/12345");
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const handleSendInvite = () => {
    alert("Invitations sent to collaborators!");
    setSelectedCollaborators([]);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-4">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h1>

        {/* Tabs */}
        <div className="flex gap-6 mb-6">
          {["leaderboard", "shop", "quests"].map((tab) => (
            <button
              key={tab}
              className={`text-sm font-medium pb-2 border-b-2 ${
                activeTab === tab
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Collaborator Search */}
        {activeTab === "leaderboard" && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Collaborators
            </h2>
            <div className="flex gap-4 items-center mb-4">
              <input
                type="text"
                placeholder="Search for collaborators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-600"
              />
              <button
                className={`px-4 py-2 rounded-lg font-semibold ${
                  placeholders[0].isPremium
                    ? "bg-violet-600 text-white hover:bg-violet-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                onClick={handleCopyLink}
                disabled={!placeholders[0].isPremium}
              >
                {isLinkCopied ? (
                  <Check className="inline-block w-5 h-5" />
                ) : (
                  <Clipboard className="inline-block w-5 h-5" />
                )}
                Copy Viewer Link
              </button>
            </div>
            <div className="space-y-4">
              {suggestedCollaborators.map((user) => (
                <div
                  key={user.username}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="text-sm text-gray-800">{user.username}</p>
                  </div>
                  <button
                    className="text-violet-600 hover:underline"
                    onClick={() => handleAddCollaborator(user)}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
            {selectedCollaborators.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  Selected Collaborators
                </h3>
                <div className="space-y-4">
                  {selectedCollaborators.map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <p className="text-sm text-gray-800">{user.username}</p>
                      </div>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleRemoveCollaborator(user.username)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-4 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
                  onClick={handleSendInvite}
                >
                  Send Invites
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "shop" && <Shop />}
        {activeTab === "quests" && <Quests />}
      </div>
    </div>
  );
};

export default Leaderboard;
