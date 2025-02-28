"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ConversationalAgent: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [message, setMessage] = useState(
    "Hello! I'm your friendly Newfoundland research assistant. Let me explain our latest findings."
  );

  // Simulate transcription by revealing one character at a time.
  useEffect(() => {
    if (isPaused) return;
    let index = 0;
    const interval = setInterval(() => {
      if (index < message.length) {
        setTranscript((prev) => prev + message[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [message, isPaused]);

  const togglePause = () => setIsPaused((prev) => !prev);

  // Framer Motion variants for a cute "heartbeat" scale effect
  const animationVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
    paused: {
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Conversational Agent
      </h2>
      {/* Animated cartoon Newfoundland image */}
      <div className="flex justify-center mb-4">
        <motion.img
          src="https://via.placeholder.com/300.png?text=Newfoundland" // Replace with your actual cartoon image URL
          alt="Cute Cartoon Newfoundland"
          className="w-48 h-48 rounded-full object-cover shadow-lg"
          variants={animationVariants}
          animate={isPaused ? "paused" : "animate"}
        />
      </div>
      {/* Pause/Resume Control */}
      <div className="flex justify-center mb-4">
        <button
          onClick={togglePause}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>
      {/* Transcript / Chat Output */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Transcript
        </h3>
        <textarea
          readOnly
          value={transcript}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          rows={6}
        />
      </div>
    </div>
  );
};

export default ConversationalAgent;
