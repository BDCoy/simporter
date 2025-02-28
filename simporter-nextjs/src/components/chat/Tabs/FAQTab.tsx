"use client";

import React, { useState, useEffect, useRef } from "react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isEditing?: boolean;
}

const FAQTab: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedFAQs, setSelectedFAQs] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewFAQDialog, setShowNewFAQDialog] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [useAIGeneration, setUseAIGeneration] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);

  // Simulated fetch function that represents our LLM updating FAQs dynamically
  const fetchFaqs = async () => {
    setLoading(true);
    // Simulate an API delay (e.g., 1 second)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Placeholder FAQs; in production, replace this with the actual LLM response.
    const dynamicFaqs: FAQ[] = [
      {
        id: "faq-1",
        question: "What is the purpose of this report?",
        answer:
          "This report dynamically analyzes consumer sentiment in the clean beauty market, providing actionable insights for product development and marketing strategies. It combines real-time data with historical trends to identify emerging opportunities.",
      },
      {
        id: "faq-2",
        question: "How often are data insights updated?",
        answer:
          "The data is updated daily based on the latest market trends provided by our LLM. We analyze social media conversations, review platforms, and search trends to ensure you have the most current information available for decision-making.",
      },
      {
        id: "faq-3",
        question: "Who should review these insights?",
        answer:
          "These insights are valuable for multiple stakeholders including product developers, marketers, executives, and investors. Each section contains targeted recommendations for different roles to help them apply the findings to their specific areas of responsibility.",
      },
    ];
    setFaqs(dynamicFaqs);
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Navigation functions
  const goToNextSlide = () => {
    if (currentSlideIndex < faqs.length - 1) {
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

  // Toggle selected FAQs
  const toggleAddToShow = (id: string) => {
    setSelectedFAQs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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

  // Save content when editing is done
  const handleBlur = () => {
    if (editorRef.current && isEditing) {
      const updatedFaqs = [...faqs];
      updatedFaqs[currentSlideIndex].answer = editorRef.current.innerHTML;
      setFaqs(updatedFaqs);
      setIsEditing(false);
    }
  };

  // Delete current FAQ
  const deleteCurrentFAQ = () => {
    if (faqs.length <= 1) return;

    const updatedFaqs = faqs.filter((_, index) => index !== currentSlideIndex);
    setFaqs(updatedFaqs);

    // Adjust current index if needed
    if (currentSlideIndex >= updatedFaqs.length) {
      setCurrentSlideIndex(updatedFaqs.length - 1);
    }

    // Remove from selected FAQs if selected
    setSelectedFAQs(selectedFAQs.filter(id => id !== faqs[currentSlideIndex].id));
  };

  // Create a new FAQ
  const createNewFAQ = () => {
    if (newQuestion.trim() === "") return;

    if (useAIGeneration) {
      // Simulate AI-generated content
      setTimeout(() => {
        const aiGeneratedFAQ: FAQ = {
          id: `faq-${faqs.length + 1}`,
          question: newQuestion,
          answer: `This is an AI-generated answer about ${newQuestion}. It provides comprehensive information about the topic, including key facts, statistics, and actionable insights.`,
        };

        setFaqs([...faqs, aiGeneratedFAQ]);
        setCurrentSlideIndex(faqs.length);
        setShowNewFAQDialog(false);
        setNewQuestion("");
        setNewAnswer("");
      }, 800);
    } else {
      // Create a new FAQ with provided content
      const newFAQ: FAQ = {
        id: `faq-${faqs.length + 1}`,
        question: newQuestion,
        answer: newAnswer || "No answer provided yet.",
      };

      setFaqs([...faqs, newFAQ]);
      setCurrentSlideIndex(faqs.length);
      setShowNewFAQDialog(false);
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093V14M10 18h4M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
            />
          </svg>
          <h3 className="mt-2 text-xl font-medium text-gray-700 dark:text-gray-300">
            No FAQs Available
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Add a new FAQ to get started.
          </p>
          <button
            onClick={() => setShowNewFAQDialog(true)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Add FAQ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Toolbar with actions and zoom */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        {/* Left side - FAQ actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNewFAQDialog(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center transition-colors"
            title="Add new FAQ"
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
            Add FAQ
          </button>

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
              Edit Answer
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
              Save
            </button>
          )}

          <button
            onClick={deleteCurrentFAQ}
            disabled={faqs.length <= 1}
            className={`px-3 py-1.5 text-xs rounded-md flex items-center transition-colors ${
              faqs.length <= 1
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

      {/* Editing toolbar - only visible when editing */}
      {isEditing && (
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-2 flex items-center space-x-1 overflow-x-auto">
          <button onClick={() => document.execCommand("bold")} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.5 10a2.5 2.5 0 01-2.5 2.5H5V7h6a2.5 2.5 0 012.5 2.5v.5z" />
              <path d="M15 7.5v-.5a3 3 0 00-3-3H5v9h7a3 3 0 003-3v-.5h1v-2h-1z" />
            </svg>
          </button>
          <button onClick={() => document.execCommand("italic")} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 5h8v2H6zM6 13h8v2H6zM9 9h5v2H9zM9 17h5v2H9z" />
              <path d="M12.5 5l-5 10H6l5-10h1.5z" />
            </svg>
          </button>
          <button onClick={() => document.execCommand("underline")} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3C7 2.44772 6.55228 2 6 2C5.44772 2 5 2.44772 5 3V10C5 12.7614 7.23858 15 10 15C12.7614 15 15 12.7614 15 10V3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3V10C13 11.6569 11.6569 13 10 13C8.34315 13 7 11.6569 7 10V3Z" />
              <path d="M5 17C5 16.4477 5.44772 16 6 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H6C5.44772 18 5 17.5523 5 17Z" />
            </svg>
          </button>
          <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          <button onClick={() => document.execCommand("insertUnorderedList")} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              <circle cx="2" cy="4" r="1" />
              <circle cx="2" cy="10" r="1" />
              <circle cx="2" cy="16" r="1" />
            </svg>
          </button>
          <button onClick={() => document.execCommand("insertOrderedList")} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              <path d="M3 4h1v1H3V4zm0 6h1v1H3v-1zm0 6h1v1H3v-1z" />
            </svg>
          </button>
          <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          <button onClick={() => document.execCommand("removeFormat")} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Main FAQ view */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <div
          className="w-4/5 aspect-video bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform relative"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          <div className="h-full flex flex-col p-6">
            {/* FAQ Question */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2">
              {faqs[currentSlideIndex]?.question}
            </h2>
            
            {/* FAQ Answer */}
            {isEditing ? (
              <div
                ref={editorRef}
                contentEditable={true}
                className="flex-grow outline-none overflow-auto text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: faqs[currentSlideIndex]?.answer || "" }}
                onBlur={handleBlur}
              />
            ) : (
              <div
                className="flex-grow overflow-auto text-gray-700 dark:text-gray-300 cursor-pointer"
                dangerouslySetInnerHTML={{ __html: faqs[currentSlideIndex]?.answer || "" }}
                onClick={enableEditing}
              />
            )}
            
            {/* Add to Slides Button */}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                FAQ #{currentSlideIndex + 1}
              </span>
              <button
                onClick={() => toggleAddToShow(faqs[currentSlideIndex].id)}
                className={`px-4 py-2 rounded transition-colors flex items-center ${
                  selectedFAQs.includes(faqs[currentSlideIndex].id)
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {selectedFAQs.includes(faqs[currentSlideIndex].id) ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Added to Slides
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add to Slides
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="mt-4 flex items-center space-x-4">
          <button
            onClick={goToPrevSlide}
            disabled={currentSlideIndex === 0}
            className={`p-2 rounded-full ${
              currentSlideIndex === 0
                ? "text-gray-300 dark:text-gray-600"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentSlideIndex + 1} / {faqs.length}
          </span>
          <button
            onClick={goToNextSlide}
            disabled={currentSlideIndex === faqs.length - 1}
            className={`p-2 rounded-full ${
              currentSlideIndex === faqs.length - 1
                ? "text-gray-300 dark:text-gray-600"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Selected FAQs Panel */}
      {selectedFAQs.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              FAQs Added to Show ({selectedFAQs.length})
            </h3>
            <button 
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setSelectedFAQs([])}
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {selectedFAQs.map((id) => {
              const faq = faqs.find(f => f.id === id);
              return faq ? (
                <div key={id} className="bg-white dark:bg-gray-700 rounded-md p-3 shadow-sm border border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mr-2">{faq.question}</h4>
                    <button 
                      onClick={() => toggleAddToShow(id)} 
                      className="text-red-500 hover:text-red-700 flex-shrink-0" 
                      aria-label="Remove from show"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {faq.answer.replace(/<[^>]*>/g, '')}
                  </p>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Add New FAQ Dialog */}
      {showNewFAQDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
              Add New FAQ
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Question
              </label>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter your question"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                autoFocus
              />
            </div>

            {!useAIGeneration && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Answer
                </label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  rows={4}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            )}

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
                  AI Generate Answer
                </span>
              </button>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewFAQDialog(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={createNewFAQ}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900"
                disabled={!newQuestion.trim()}
              >
                {useAIGeneration ? (
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Create with AI
                  </span>
                ) : (
                  "Create FAQ"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQTab;