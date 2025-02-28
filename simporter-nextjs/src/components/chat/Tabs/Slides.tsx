"use client";

import React, { useState, useEffect, useRef } from "react";

export interface SlideItem {
  id: string;
  title: string;
  content: string;
  type?: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  author: {
    name: string;
    initials: string;
    color: string;
  };
  text: string;
  timestamp: Date;
  resolved?: boolean;
}

interface SlidesProps {
  slides: SlideItem[];
  isEditable?: boolean;
  onSaveContent?: (slideIndex: number, content: string) => void;
  onAddComment?: (slideId: string, comment: Omit<Comment, "id">) => void;
  onDeleteSlide?: (slideIndex: number) => void;
  renderCustomControls?: (currentSlideIndex: number) => React.ReactNode;
}

const Slides: React.FC<SlidesProps> = ({
  slides,
  isEditable = true,
  onSaveContent,
  onAddComment,
  onDeleteSlide,
  renderCustomControls,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [newComment, setNewComment] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  // Rich text editor controls
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  // Navigation functions
  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Zoom functions
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseInt(e.target.value, 10);
    setZoomLevel(newZoom);
  };

  const zoomIn = () => {
    if (zoomLevel < 200) setZoomLevel(zoomLevel + 10);
  };

  const zoomOut = () => {
    if (zoomLevel > 50) setZoomLevel(zoomLevel - 10);
  };

  // Save content when editing is done
  const handleBlur = () => {
    if (editorRef.current && isEditing) {
      const content = editorRef.current.innerHTML;
      if (onSaveContent) {
        onSaveContent(currentSlideIndex, content);
      }
      setIsEditing(false);
    }
  };

  // Enable editing
  const enableEditing = () => {
    setIsEditing(true);
    // Focus the editor after a short delay to allow state update
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 0);
  };

  // Open the add comment dialog
  const openCommentDialog = () => {
    setNewComment("");
    setShowCommentDialog(true);
  };

  // Add a comment to the current slide
  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Omit<Comment, "id"> = {
      author: {
        name: "User",
        initials: "US",
        color: "bg-blue-500",
      },
      text: newComment,
      timestamp: new Date(),
      resolved: false,
    };

    if (onAddComment && slides[currentSlideIndex]) {
      onAddComment(slides[currentSlideIndex].id, comment);
    }
    
    setShowCommentDialog(false);
  };

  // Delete current slide
  const deleteCurrentSlide = () => {
    if (slides.length <= 1) return;
    
    if (onDeleteSlide) {
      onDeleteSlide(currentSlideIndex);
    }
  };

  // Update the editor content when the current slide changes
  useEffect(() => {
    if (editorRef.current && slides[currentSlideIndex]) {
      editorRef.current.innerHTML = slides[currentSlideIndex].content || "";
    }
  }, [currentSlideIndex, slides]);

  // Check if the current slide has comments
  const hasComments = slides[currentSlideIndex]?.comments?.length > 0;

  if (slides.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No slides available.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Toolbar with actions and zoom */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        {/* Left side - slide actions */}
        <div className="flex items-center space-x-2">
          {isEditable && (
            <>
              {!isEditing ? (
                <button
                  onClick={enableEditing}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md flex items-center transition-colors"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleBlur}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center transition-colors"
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Done
                </button>
              )}

              <button
                onClick={deleteCurrentSlide}
                disabled={slides.length <= 1}
                className={`px-3 py-1.5 text-xs rounded-md flex items-center transition-colors ${
                  slides.length <= 1
                    ? "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                    : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40"
                }`}
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>

              <button
                onClick={openCommentDialog}
                className="px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/40 text-xs rounded-md flex items-center transition-colors"
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
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                Comment
                {hasComments && (
                  <span className="ml-1 px-1.5 py-0.5 bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 rounded-full text-xs">
                    {slides[currentSlideIndex]?.comments?.length}
                  </span>
                )}
              </button>
            </>
          )}
        </div>

        {/* Right side - zoom controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={zoomOut}
            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
            disabled={zoomLevel <= 50}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <div className="flex items-center">
            <input
              type="range"
              min="50"
              max="200"
              step="10"
              value={zoomLevel}
              onChange={handleZoomChange}
              className="w-24 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="ml-2 text-xs text-gray-600 dark:text-gray-400 w-10">
              {zoomLevel}%
            </span>
          </div>

          <button
            onClick={zoomIn}
            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
            disabled={zoomLevel >= 200}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add Comment Dialog */}
      {showCommentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Add Comment</h3>
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment here..."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-[100px]"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCommentDialog(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={addComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900"
                disabled={!newComment.trim()}
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slides;
