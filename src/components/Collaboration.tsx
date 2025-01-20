"use client";

import React, { useState } from "react";
import { Search, UserPlus, ChevronDown, ChevronUp } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQfYX0TtI6_d_2qUT8TAL2ZyGSmb2uasA5pZB2dfpuje9f13ut-kLsmpd1X5fQtErXlGg&usqp=CAU",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar:
      "https://cdn3d.iconscout.com/3d/premium/thumb/blonde-man-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--boy-male-avatar-head-pack-people-illustrations-4673769.png?f=webp",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQfYX0TtI6_d_2qUT8TAL2ZyGSmb2uasA5pZB2dfpuje9f13ut-kLsmpd1X5fQtErXlGg&usqp=CAU",
  },
];

export default function Collaboration() {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<{ [key: number]: string }>({});

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
      setRoles({ ...roles, [user.id]: "View" });
    }
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    setRoles({ ...roles, [userId]: newRole });
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold text-gray-800">Collaboration</h2>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div className="mt-4">
          {/* Search bar */}
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              aria-label="Search users"
            />
          </div>

          {/* User search results */}
          <div>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={`${user.name}'s avatar`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddUser(user)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    aria-label={`Add ${user.name} to collaboration`}
                  >
                    <UserPlus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No users found.</p>
            )}
          </div>

          {/* Collaborators list */}
          {selectedUsers.length > 0 && (
            <>
              <h3 className="mt-6 text-md font-semibold text-gray-800">
                Collaborators
              </h3>
              <div>
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={`${user.name}'s avatar`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <select
                      value={roles[user.id]}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2 py-1 border rounded-lg text-sm"
                      aria-label={`Change role for ${user.name}`}
                    >
                      <option value="Owner">Owner</option>
                      <option value="Editor">Editor</option>
                      <option value="View">View</option>
                    </select>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
