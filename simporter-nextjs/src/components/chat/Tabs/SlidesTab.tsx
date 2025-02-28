"use client";

import React, { useState } from "react";
import Slides, { SlideItem, Comment } from "./Slides";

interface SlidesTabProps {
  isEditable?: boolean;
  onCreateSlide?: () => void;
  onAddComment?: (slideId: string, comment: Omit<Comment, "id">) => void;
}

const SlidesTab: React.FC<SlidesTabProps> = ({
  isEditable = true,
  onCreateSlide,
  onAddComment,
}) => {
  // Initial slides are blank
  const [slides, setSlides] = useState<SlideItem[]>([
    {
      id: "slide-1",
      title: "New Slide",
      content:
        "<div class='p-4'><h1 class='text-3xl font-bold text-center'>Add your title here</h1><p class='text-center mt-4 text-xl text-gray-600'>Add your subtitle here</p></div>",
      type: "title",
      comments: [],
    },
  ]);
  const [showTitleDialog, setShowTitleDialog] = useState(false);
  const [newSlideTitle, setNewSlideTitle] = useState("");
  const [useAIGeneration, setUseAIGeneration] = useState(true);

  // Open the add slide dialog
  const openAddSlideDialog = () => {
    setNewSlideTitle("");
    setUseAIGeneration(true);
    setShowTitleDialog(true);
  };

  // Save content when editing is done
  const handleSaveContent = (slideIndex: number, content: string) => {
    const updatedSlides = [...slides];
    updatedSlides[slideIndex].content = content;
    setSlides(updatedSlides);
  };

  // Add a comment to a slide
  const handleAddComment = (slideId: string, comment: Omit<Comment, "id">) => {
    // Call parent handler if available
    if (onAddComment) {
      onAddComment(slideId, comment);
    }

    // Also update local state
    const updatedSlides = [...slides];
    const slideIndex = updatedSlides.findIndex(slide => slide.id === slideId);
    
    if (slideIndex !== -1) {
      if (!updatedSlides[slideIndex].comments) {
        updatedSlides[slideIndex].comments = [];
      }

      updatedSlides[slideIndex].comments?.push({
        id: `comment-${Date.now()}`,
        ...comment,
      });

      setSlides(updatedSlides);
    }
  };

  // Delete a slide
  const handleDeleteSlide = (slideIndex: number) => {
    if (slides.length <= 1) return;

    const updatedSlides = slides.filter((_, index) => index !== slideIndex);
    setSlides(updatedSlides);
  };

  // Create a new slide with title
  const createNewSlide = () => {
    if (newSlideTitle.trim() === "") return;

    if (useAIGeneration) {
      // Simulate AI-generated content
      setTimeout(() => {
        const aiGeneratedSlide: SlideItem = {
          id: `slide-${slides.length + 1}`,
          title: newSlideTitle,
          content: `<div class='p-4'>
            <h2 class='text-2xl font-bold'>${newSlideTitle}</h2>
            <ul class='mt-4 space-y-2'>
              <li>• AI-generated point one about ${newSlideTitle}</li>
              <li>• AI-generated point two with supporting details</li>
              <li>• AI-generated point three with analysis</li>
              <li>• AI-generated recommendation</li>
            </ul>
          </div>`,
          type: "content",
          comments: [],
        };

        setSlides([...slides, aiGeneratedSlide]);
        setShowTitleDialog(false);
      }, 500);
    } else {
      // Create a blank slide with the title
      const newSlide: SlideItem = {
        id: `slide-${slides.length + 1}`,
        title: newSlideTitle,
        content: `<div class='p-4'><h2 class='text-2xl font-bold'>${newSlideTitle}</h2><p class='mt-4'>Add your content here</p></div>`,
        type: "content",
        comments: [],
      };

      setSlides([...slides, newSlide]);
      setShowTitleDialog(false);
    }
  };

  // Create a blank slide directly
  const addBlankSlide = () => {
    const newSlide: SlideItem = {
      id: `slide-${slides.length + 1}`,
      title: `New Slide ${slides.length + 1}`,
      content:
        "<div class='p-4'><h2 class='text-2xl font-bold'>Add your title here</h2><p class='mt-4'>Add your content here</p></div>",
      type: "content",
      comments: [],
    };

    setSlides([...slides, newSlide]);
  };

  // Custom controls for the slides component
  const renderCustomControls = () => null; // No custom controls for SlidesTab

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Toolbar with additional slide actions */}
      <div className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <button
          onClick={openAddSlideDialog}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center transition-colors"
          title="Add new slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Slide
        </button>
      </div>

      {/* Main Slides Component */}
      <Slides
        slides={slides}
        isEditable={isEditable}
        onSaveContent={handleSaveContent}
        onAddComment={handleAddComment}
        onDeleteSlide={handleDeleteSlide}
        renderCustomControls={renderCustomControls}
      />

      {/* Add Slide Dialog */}
      {showTitleDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
              Add New Slide
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                What do you want the slide title to be?
              </label>
              <input
                type="text"
                value={newSlideTitle}
                onChange={(e) => setNewSlideTitle(e.target.value)}
                placeholder="Enter slide title"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                autoFocus
              />
            </div>

            <div className="flex items-center mb-6">
              <button
                onClick={() => setUseAIGeneration(!useAIGeneration)}
                className="relative inline-flex items-center"
              >
                <div
                  className={`w-10 h-5 transition-colors rounded-full mr-2 ${
                    useAIGeneration ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform transform ${
                      useAIGeneration ? "translate-x-5" : ""
                    }`}
                  ></div>
                </div>
                <span
                  className={`text-sm ${
                    useAIGeneration ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  AI Generate Content
                </span>
              </button>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setUseAIGeneration(false);
                  createNewSlide();
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm flex items-center"
                disabled={!newSlideTitle.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="text-gray-500 dark:text-gray-400">Skip</span>
              </button>

              <div className="space-x-2">
                <button
                  onClick={() => setShowTitleDialog(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewSlide}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900"
                  disabled={!newSlideTitle.trim()}
                >
                  <span className="flex items-center">
                    {useAIGeneration && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    Create
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidesTab;