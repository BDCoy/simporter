"use client";

import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, Clock, Users, MessageSquare, MoreVertical, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProjectManagement = () => {
  const [activeView, setActiveView] = useState('board');
  const [selectedProject, setSelectedProject] = useState(null);

  // Sample project data
  const projects = [
    {
      id: 1,
      name: "Concept Testing - Beauty",
      status: "in_progress",
      progress: 65,
      dueDate: "2025-02-01",
      members: ["Alex", "Sarah", "Mike"],
      tasks: [
        { id: 1, title: "Survey Programming", status: "completed" },
        { id: 2, title: "Data Collection", status: "in_progress" },
        { id: 3, title: "Analysis", status: "pending" }
      ]
    },
    {
      id: 2,
      name: "Market Size Analysis",
      status: "pending",
      progress: 30,
      dueDate: "2025-02-15",
      members: ["John", "Emma"],
      tasks: [
        { id: 4, title: "Data Gathering", status: "in_progress" },
        { id: 5, title: "Competitor Analysis", status: "pending" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-12 h-screen">
        {/* Sidebar */}
        <div className="col-span-2 bg-white border-r border-gray-200 p-4">
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Projects</h2>
            <button className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>

          <div className="space-y-2">
            {['All Projects', 'My Tasks', 'Calendar', 'Reports'].map((item) => (
              <button 
                key={item}
                className="w-full p-2 text-left rounded-lg hover:bg-gray-100 text-gray-700"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-7 p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Project Dashboard</h1>
              <p className="text-gray-500">Track and manage your research projects</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64"
                />
              </div>
              <button className="px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <button>
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-violet-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-2">
                      {project.tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 ${
                              task.status === 'completed' ? 'text-green-500' : 'text-gray-300'
                            }`} />
                            <span>{task.title}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.status === 'completed' ? 'bg-green-100 text-green-600' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Due {project.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{project.members.length} members</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Activity Sidebar */}
        <div className="col-span-3 bg-white border-l border-gray-200 p-4">
          <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { user: "Sarah", action: "completed", task: "Survey Programming" },
              { user: "Mike", action: "commented on", task: "Data Collection" },
              { user: "Alex", action: "created", task: "Analysis Plan" }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                  {activity.user[0]}
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {" "}{activity.action}{" "}
                    <span className="font-medium">{activity.task}</span>
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;