"use client";

import React, { useState, useEffect } from "react";
import ReportCard from "@/components/ReportCard";
import { Report } from "@/types";

// Main Page Component
export default function Page() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [followedAuthors, setFollowedAuthors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Explore");

  useEffect(() => {
    // Initialize sample reports
    const initialReports: Report[] = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      title: `Sample Report ${i + 1}`,
      author: {
        name: `Author ${i + 1}`,
        profilePicture: "/path/to/profile-picture",
        image: "/path/to/image", // Add the `image` property
        title: "Research Analyst",
        company: "Sample Company",
        followers: 100 + i,
        joinDate: `2024-0${i + 1}-01`, // Add the `joinDate` property
      },
      date: `2025-0${i + 1}-01`,
      likes: 10 + i,
      shares: 5 + i,
      liked: false,
      totalSlides: 10 + i,
    }));
    setReports(initialReports);
  }, []);

  const userReports = reports.slice(0, 2);
  const followedReports = reports.filter((report) =>
    followedAuthors.includes(report.author.name)
  );

  const filteredReports = () => {
    let displayedReports = reports;

    if (activeTab === "Your Reports") displayedReports = userReports;
    if (activeTab === "People You Follow") displayedReports = followedReports;

    return displayedReports.filter((r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleFollow = (authorName: string) => {
    setFollowedAuthors((prev) =>
      prev.includes(authorName)
        ? prev.filter((name) => name !== authorName)
        : [...prev, authorName]
    );
  };

  const renderEmptyState = () => {
    if (activeTab === "Your Reports") {
      return (
        <div className="text-center text-gray-700 mt-10">
          <h2 className="text-2xl font-bold mb-2">No Reports Yet</h2>
          <p className="mb-4">You haven’t created any reports yet.</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Create Your First Report
          </button>
        </div>
      );
    }

    if (activeTab === "People You Follow") {
      return (
        <div className="text-center text-gray-700 mt-10">
          <h2 className="text-2xl font-bold mb-2">No Followed Authors</h2>
          <p className="mb-4">Start following authors to see their reports here.</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Explore Popular Authors
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

        <div className="flex gap-4 mb-6">
          {["Explore", "Your Reports", "People You Follow"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${
                activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Reports"
          className="w-full mb-4 p-2 border rounded"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports().length > 0 ? (
            filteredReports().map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                handleFollow={handleFollow}
                isFollowing={followedAuthors.includes(report.author.name)}
              />
            ))
          ) : (
            renderEmptyState()
          )}
        </div>
      </div>
    </div>
  );
}
