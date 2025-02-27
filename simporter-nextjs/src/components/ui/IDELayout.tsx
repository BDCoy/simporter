"use client";

import React, { useState } from "react";
import TaskList, { Task } from "@/components/ui/TaskList";
import ViewTabs from "@/components/ui/ViewTabs";
import ViewActions from "@/components/ui/ViewActions";
import VisualInspector from "@/components/ui/VisualInspector";

// The below references your search bar with drag/drop attachments logic
import SearchBarWithCommands from "@/components/ui/SearchBarWithCommands";

interface Slide {
  id: string;
  title: string;
  content: React.ReactNode;
  type: "title" | "content" | "chart" | "table" | "image";
}

interface InspectableElement {
  id: string;
  tagName: string;
  className: string;
  rect: DOMRect;
}
export default IDELayout;
export interface IDELayoutProps {
  // If you need props, add them here
}

// A minimal mock “Chat” component for demonstration
const Chat = () => (
  <div className="flex flex-col h-full border-t p-4">
    <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded p-4">
      <div className="mb-4 text-right">
        <div className="inline-block bg-blue-100 p-3 rounded-lg max-w-xs text-blue-900">
          Can you analyze consumer sentiment for clean beauty products?
        </div>
      </div>
      <div className="mb-4">
        <div className="inline-block bg-white border border-gray-200 p-3 rounded-lg max-w-xs text-gray-800">
          I'll help you analyze consumer sentiment for clean beauty products. Let me work on that for you.
        </div>
      </div>
    </div>
    <div className="border rounded-lg flex items-end">
      <textarea
        placeholder="Type your message..."
        className="flex-1 p-2 focus:outline-none"
        rows={2}
      />
      <button className="p-2 m-1 text-blue-600 hover:bg-blue-50 rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
          />
        </svg>
      </button>
    </div>
  </div>
);

const IDELayout: React.FC<IDELayoutProps> = () => {
  const [activeTab, setActiveTab] = useState("slides");
  const [isInspectorActive, setIsInspectorActive] = useState(false);
  const [isCreateSlideModalOpen, setIsCreateSlideModalOpen] = useState(false);

  // Mock slides
  const [slides] = useState<Slide[]>([
    {
      id: "1",
      title: "Consumer Sentiment Analysis",
      content: (
        <div className="text-center text-gray-500">
          <p>Title slide content would appear here</p>
        </div>
      ),
      type: "title",
    },
    {
      id: "2",
      title: "Market Overview",
      content: (
        <div className="text-center text-gray-500">
          <p>Content slide with market data would appear here</p>
        </div>
      ),
      type: "content",
    },
    {
      id: "3",
      title: "Monthly Sales Trends",
      content: (
        <div className="text-center text-gray-500">
          <p>Chart slide with sales data would appear here</p>
        </div>
      ),
      type: "chart",
    },
  ]);

  // Mock tasks
  const [tasks] = useState<Task[]>([
    { id: "1", description: "Analyzing consumer data", status: "completed" },
    { id: "2", description: "Processing market trends", status: "in-progress" },
    { id: "3", description: "Generating insights report", status: "pending" },
  ]);

  const [problemTasks] = useState<Task[]>([
    {
      id: "p1",
      description: "Missing data in Q3 report",
      status: "in-progress",
      details: "Filling gaps with predictive model",
    },
  ]);

  // Handler for your search bar
  const handleSearch = (query: string, files?: File[]) => {
    console.log("Search triggered in IDE layout:", query, files);
  };

  const handleEnhancePrompt = () => {
    console.log("Enhance prompt triggered");
  };

  // Example create slide logic
  const handleCreateSlide = (content: string) => {
    console.log("Create slide with content:", content);
    // Implement real logic
  };

  // Mock a “SlidesViewer” for the “slides” tab
  const SlidesViewer = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="text-lg font-bold">Slides</h3>
      </div>
      <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
        <div className="bg-white w-full max-w-2xl aspect-video shadow-md p-6 rounded">
          <h2 className="text-2xl font-bold">{slides[0].title}</h2>
          <div className="mt-4">{slides[0].content}</div>
        </div>
      </div>
    </div>
  );

  // Example render function for the main tab area
  const renderActiveTab = () => {
    switch (activeTab) {
      case "slides":
        return <SlidesViewer />;
      case "chat":
        return <Chat />;
      case "tasks":
        return (
          <div className="p-4 space-y-4">
            <TaskList tasks={tasks} title="Tasks" />
            <TaskList tasks={problemTasks} title="Problems Identified" />
          </div>
        );
      case "execution":
        return (
          <div className="p-4">
            <p className="text-gray-600">Execution panel placeholder</p>
          </div>
        );
      default:
        return (
          <div className="p-4 text-gray-600">
            <p>Not implemented</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left panel - Chat or your “Search + Chat” area */}
      <div className="w-1/3 flex flex-col border-r">
        <div className="p-4 border-b bg-blue-50">
          <div className="font-bold mb-1 text-blue-800">SIMPORTER</div>
          {/* Use your search bar with attachments logic */}
          <SearchBarWithCommands
            onSearch={handleSearch}
            onEnhancePrompt={handleEnhancePrompt}
          />
        </div>

        {/* Chat or tasks below */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Example: tasks above, chat below */}
          <div className="p-4 space-y-4">
            <TaskList tasks={tasks} title="Tasks" />
            <TaskList tasks={problemTasks} title="Problems" />
          </div>
          {/* Chat area */}
          <div className="flex-1 overflow-hidden">
            <Chat />
          </div>
        </div>
      </div>

      {/* Right panel - IDE & Slides */}
      <div className="flex-1 flex flex-col">
        {/* Tab row */}
        <div className="border-b flex items-center bg-gray-100 p-2">
          <button
            onClick={() => setActiveTab("slides")}
            className={`px-3 py-1 rounded ${
              activeTab === "slides"
                ? "bg-white font-semibold"
                : "hover:bg-white"
            }`}
          >
            Slides
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-1 rounded ${
              activeTab === "chat"
                ? "bg-white font-semibold"
                : "hover:bg-white"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-3 py-1 rounded ${
              activeTab === "tasks"
                ? "bg-white font-semibold"
                : "hover:bg-white"
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab("execution")}
            className={`px-3 py-1 rounded ${
              activeTab === "execution"
                ? "bg-white font-semibold"
                : "hover:bg-white"
            }`}
          >
            Execution
          </button>

          {/* Visual Inspector button */}
          <button
            onClick={() => setIsInspectorActive(!isInspectorActive)}
            className={`ml-auto p-1.5 rounded ${
              isInspectorActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            title="Visual Inspector"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-hidden">{renderActiveTab()}</div>
      </div>

      {/* Visual Inspector overlay (if needed) */}
      <VisualInspector
        isActive={isInspectorActive}
        onSelectElement={(elem) => {
          console.log("Element selected:", elem);
          setIsInspectorActive(false);
        }}
      />

      {/* Example “Create Slide” modal if you want it */}
      {isCreateSlideModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4">
            <h3 className="text-lg font-medium mb-4">Create New Slide</h3>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={4}
              placeholder="Describe what you want on this slide"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsCreateSlideModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Implement your create logic
                  console.log("Creating slide...");
                  setIsCreateSlideModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
