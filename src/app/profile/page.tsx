"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";

const ProfilePage: React.FC = () => {
  const defaultAvatarUrl = "https://cdn3d.iconscout.com/3d/premium/thumb/blonde-man-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--boy-male-avatar-head-pack-people-illustrations-4673769.png?f=webp";

  const [avatarUrl, setAvatarUrl] = useState(defaultAvatarUrl);
  const [name, setName] = useState("John Doe");
  const [jobTitle, setJobTitle] = useState("Product Manager at XYZ Corp");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingJobTitle, setIsEditingJobTitle] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const [followers, setFollowers] = useState([
    { name: "Jane Smith", image: "https://img.freepik.com/psd-gratis/3d-ilustracion-persona_23-2149436182.jpg?w=360" },
    { name: "Mike Johnson", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBhcaqVKroMZxAivDZ-dpGhndPKdUDw8XrqYa_C18PDJ7OzuFHo-KiYwuzC6ISf5qnTZs&usqp=CAU" }
  ]);

  const [following, setFollowing] = useState([
    { name: "Product Hunt", image: "https://img.freepik.com/psd-gratis/3d-ilustracion-persona-gafas-sol_23-2149436178.jpg" },
    { name: "Design Weekly", image: "https://img.freepik.com/psd-gratis/ilustracion-3d-persona-pelo-punk-chaqueta_23-2149436198.jpg" }
  ]);

  const [reports, setReports] = useState([
    { id: 1, title: "Report 1", likes: 10, shares: 5, date: "2025-01-01", author: { name: "Jane Smith" } },
    { id: 2, title: "Report 2", likes: 20, shares: 8, date: "2025-02-01", author: { name: "Mike Johnson" } },
    { id: 3, title: "Report 3", likes: 15, shares: 6, date: "2025-03-01", author: { name: "Product Hunt" } }
  ]);

  const handleFollowBack = (name: string) => {
    alert(`Followed back ${name}!`);
  };

  const handleImageEdit = () => {
    const newImage = prompt("Enter a new image URL:", avatarUrl);
    if (newImage) setAvatarUrl(newImage);
  };

  const resetToDefaultImage = () => {
    setAvatarUrl(defaultAvatarUrl);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText("https://yourapp.com/invite");
    alert("Invite link copied to clipboard!");
  };

  const renderReports = () => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Your Reports</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <a
            key={report.id}
            href={`/reports/${report.id}`}
            className="block group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="relative rounded-t-lg overflow-hidden">
              <div
                className={`aspect-[4/3] ${
                  ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-orange-500"][index % 4]
                } flex items-center justify-center text-white`}
              >
                <div className="text-center">
                  <p className="font-semibold text-lg">Slide {index + 1}</p>
                  <p className="text-sm">{report.title}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 rounded-lg">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 rounded-lg">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-2">{report.title}</h4>
              <p className="text-sm text-gray-500 mb-2">{report.date}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{report.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">{report.shares}</span>
                </button>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            className="text-blue-500 hover:underline text-lg"
            onClick={() => (window.location.href = "/")}
          >
            Back to Home
          </button>
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        {/* Profile Header */}
        <header className="flex items-center gap-6 mb-8">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover cursor-pointer"
            onClick={handleImageEdit}
          />
          <div>
            {isEditingName ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingName(false);
                  if (e.key === "Escape") setIsEditingName(false);
                }}
                className="text-4xl font-bold"
              />
            ) : (
              <h1
                className="text-4xl font-bold cursor-pointer"
                onDoubleClick={() => setIsEditingName(true)}
              >
                {name}
              </h1>
            )}

            {isEditingJobTitle ? (
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingJobTitle(false);
                  if (e.key === "Escape") setIsEditingJobTitle(false);
                }}
                className="text-gray-500"
              />
            ) : (
              <p
                className="text-gray-500 cursor-pointer"
                onDoubleClick={() => setIsEditingJobTitle(true)}
              >
                {jobTitle}
              </p>
            )}
          </div>
        </header>

        {/* Account Privacy Switch */}
        <div className="flex items-center mb-8">
          <label className="mr-4 font-semibold">Public Account:</label>
          <div
            className={`w-14 h-8 flex items-center rounded-full cursor-pointer ${
              isPrivate ? "bg-gray-500" : "bg-green-500"
            }`}
            onClick={() => setIsPrivate(!isPrivate)}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isPrivate ? "translate-x-6" : "translate-x-1"
              }`}
            ></div>
          </div>
        </div>

        {/* Invite Friends */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Invite Friends</h3>
          <div className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your friend's email"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={copyInviteLink}
            >
              Copy Invite Link
            </button>
          </div>
        </div>

        {/* Followers Section */}
        {renderReports()}
      </div>
    </div>
  );
};

export default ProfilePage;
