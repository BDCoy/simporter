"use client";

import React, { useState, useRef, useEffect } from "react";

interface Section {
  id: string;
  title: string;
  content: string;
}

interface Comment {
  id: string;
  author: {
    name: string;
    initials: string;
    color: string;
  };
  text: string;
  position: {
    sectionId: string;
    selectionStart?: number;
    selectionEnd?: number;
  };
  timestamp: Date;
  resolved?: boolean;
}

interface DocumentTabProps {
  isEditable?: boolean;
  onAddComment?: (sectionId: string, comment: Omit<Comment, "id">) => void;
}

const DocumentTab: React.FC<DocumentTabProps> = ({ isEditable = true, onAddComment }) => {
  // Sample document sections
  const [sections, setSections] = useState<Section[]>([
    {
      id: "section-1",
      title: "Executive Summary",
      content:
        "This report provides a comprehensive analysis of consumer sentiment in the clean beauty market. Our research indicates growing demand for sustainable, ethically sourced products with transparent ingredient lists. Key findings highlight the importance of brand authenticity and environmental responsibility in consumer purchasing decisions."
    },
    {
      id: "section-2",
      title: "Market Overview",
      content:
        "The clean beauty market has experienced significant growth over the past five years, with a compound annual growth rate (CAGR) of 12%. This growth is projected to continue, reaching a market value of $22 billion by 2028. Driving factors include increasing consumer awareness of product ingredients, environmental concerns, and regulatory changes impacting cosmetic formulations."
    },
    {
      id: "section-3",
      title: "Consumer Insights",
      content:
        "Our survey of 2,500 consumers revealed that 78% are willing to pay a premium for clean beauty products. The most important factors influencing purchasing decisions are ingredient transparency (82%), brand ethics (76%), and sustainable packaging (68%). Demographic analysis shows strongest adoption among millennials and Gen Z, though interest is growing across all age groups."
    },
    {
      id: "section-4",
      title: "Competitive Landscape",
      content:
        "The market features a mix of established beauty conglomerates and indie brands. Traditional beauty giants are acquiring clean beauty startups or launching their own clean lines to capture market share. Meanwhile, direct-to-consumer brands are disrupting the space with innovative marketing strategies and strong digital presence. Key differentiators include certification standards, ingredient policies, and sustainability commitments."
    },
    {
      id: "section-5",
      title: "Recommendations",
      content:
        "Based on our analysis, we recommend: 1) Prioritizing transparent ingredient communication, 2) Investing in sustainable packaging innovations, 3) Leveraging social media for authentic storytelling, 4) Implementing clear certification standards, and 5) Developing educational content to increase consumer awareness about clean beauty benefits."
    }
  ]);

  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "comment-1",
      author: { name: "Sarah", initials: "SC", color: "bg-purple-500" },
      text: "Can we add more specific stats about market growth by region?",
      position: { sectionId: "section-2" },
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      resolved: false
    },
    {
      id: "comment-2",
      author: { name: "Mike", initials: "MJ", color: "bg-green-500" },
      text: "We should highlight our competitive advantages in this section",
      position: { sectionId: "section-4" },
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      resolved: true
    }
  ]);
  
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [selectedSectionForComment, setSelectedSectionForComment] = useState<string | null>(null);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  // Get active section
  const getActiveSection = () => sections.find(section => section.id === activeSection) || sections[0];
  
  // Get comments for a section
  const getSectionComments = (sectionId: string) =>
    comments.filter(comment => comment.position.sectionId === sectionId && !comment.resolved);
  
  // Handler to switch between sections
  const handleSectionChange = (sectionId: string) => {
    if (isEditing) {
      if (confirm("You have unsaved changes. Do you want to discard them?")) {
        setIsEditing(false);
        setActiveSection(sectionId);
      }
    } else {
      setActiveSection(sectionId);
    }
  };
  
  // Start editing a section
  const startEditing = () => {
    if (!isEditable) return;
    const section = getActiveSection();
    setEditedContent(section.content);
    setIsEditing(true);
  };
  
  // Save edited content
  const saveEditing = () => {
    const updatedSections = sections.map(section =>
      section.id === activeSection ? { ...section, content: editedContent } : section
    );
    setSections(updatedSections);
    setIsEditing(false);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
  };
  
  // Add a new section
  const addNewSection = () => {
    const newSection: Section = {
      id: `section-${sections.length + 1}`,
      title: `New Section ${sections.length + 1}`,
      content: "Add your content here."
    };
    setSections([...sections, newSection]);
    setActiveSection(newSection.id);
  };
  
  // Delete the current section
  const deleteSection = () => {
    if (sections.length <= 1) return;
    const updatedSections = sections.filter(section => section.id !== activeSection);
    setSections(updatedSections);
    setActiveSection(updatedSections[0].id);
  };
  
  // Start adding a comment
  const startAddComment = (sectionId: string) => {
    setSelectedSectionForComment(sectionId);
    setNewCommentText("");
    setShowCommentForm(true);
  };
  
  // Submit a new comment
  const submitComment = () => {
    if (!selectedSectionForComment || !newCommentText.trim()) return;
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: {
        name: "Dillon",
        initials: "DH",
        color: "bg-blue-500"
      },
      text: newCommentText,
      position: { sectionId: selectedSectionForComment },
      timestamp: new Date(),
      resolved: false
    };
    setComments([...comments, newComment]);
    setShowCommentForm(false);
    // Call the parent handler if available
    if (onAddComment) {
      onAddComment(selectedSectionForComment, {
        author: newComment.author,
        text: newComment.text,
        position: newComment.position,
        timestamp: newComment.timestamp,
        resolved: newComment.resolved
      });
    }
  };
  
  // Resolve a comment
  const resolveComment = (commentId: string) => {
    const updatedComments = comments.map(comment =>
      comment.id === commentId ? { ...comment, resolved: true } : comment
    );
    setComments(updatedComments);
  };
  
  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHrs < 24) {
      return `${diffHrs} hour${diffHrs !== 1 ? "s" : ""} ago`;
    } else {
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Section Navigation Sidebar */}
      <div className="w-full lg:w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 lg:h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Document</h2>
          {isEditable && (
            <button
              onClick={addNewSection}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
        <div className="overflow-y-auto">
          {sections.map((section) => {
            const sectionComments = getSectionComments(section.id);
            return (
              <div
                key={section.id}
                className={`border-b border-gray-200 dark:border-gray-700 ${section.id === activeSection ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
              >
                <button
                  className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                  onClick={() => handleSectionChange(section.id)}
                >
                  <div className="flex-1">
                    <span className={`font-medium ${section.id === activeSection ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                      {section.title}
                    </span>
                    {/* Comment indicator */}
                    {sectionComments.length > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                        {sectionComments.length}
                      </span>
                    )}
                  </div>
                  {section.id === activeSection && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Document Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Section Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {getActiveSection().title}
          </h3>
          <div className="flex items-center space-x-2">
            {isEditable && !isEditing && (
              <>
                <button
                  onClick={startEditing}
                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => startAddComment(activeSection)}
                  className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/40 rounded"
                >
                  Comment
                </button>
                {sections.length > 1 && (
                  <button
                    onClick={deleteSection}
                    className="px-3 py-1.5 text-xs bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40 rounded"
                  >
                    Delete
                  </button>
                )}
              </>
            )}
            {isEditable && isEditing && (
              <>
                <button
                  onClick={saveEditing}
                  className="px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-800">
          {isEditing ? (
            <textarea
              ref={editorRef}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none"
            />
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {getActiveSection().content}
              </p>
              {/* Section Comments */}
              {getSectionComments(activeSection).length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comments</h4>
                  <div className="space-y-3">
                    {getSectionComments(activeSection).map((comment) => (
                      <div key={comment.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 flex">
                        <div className={`h-8 w-8 rounded-full ${comment.author.color} flex-shrink-0 flex items-center justify-center text-white font-medium text-sm`}>
                          {comment.author.initials}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {comment.author.name}
                              </span>
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                {formatTimestamp(comment.timestamp)}
                              </span>
                            </div>
                            {isEditable && (
                              <button
                                onClick={() => resolveComment(comment.id)}
                                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                title="Resolve comment"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Add Comment Modal */}
      {showCommentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
              Add Comment
            </h3>
            <div className="mb-4">
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Type your comment here..."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-[100px]"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCommentForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={submitComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900"
                disabled={!newCommentText.trim()}
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

export default DocumentTab;
