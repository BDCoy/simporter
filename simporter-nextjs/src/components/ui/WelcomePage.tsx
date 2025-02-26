"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Library, Wrench, Star } from "lucide-react";

const MODELS = [
  {
    id: "leaderboard",
    name: "Leaderboard",
    description: "See how you perform",
    bgColor: "bg-[#C5A68F] bg-opacity-40",
    textColor: "text-black",
    icon: null,
  },
  {
    id: "api",
    name: "API",
    description: "Connect your tool",
    bgColor: "bg-[#C5A68F] bg-opacity-40",
    textColor: "text-black",
    icon: null,
  },
  {
    id: "maple-1",
    name: "Maple-1",
    description: "Build reports",
    bgColor: "bg-[#C19B83] bg-opacity-40",
    textColor: "text-black",
    icon: Brain,
  },
  {
    id: "library",
    name: "The Library",
    description: "Get the latest scoop",
    bgColor: "bg-[#B5A68F] bg-opacity-40",
    textColor: "text-black",
    icon: Library,
  },
  {
    id: "custom",
    name: "Custom Request",
    description: "Fill out a short form",
    bgColor: "bg-[#A56548] bg-opacity-40",
    textColor: "text-black",
    icon: Wrench,
  },
  {
    id: "unique",
    name: "How's this unique?",
    description: "Learn how we're different",
    bgColor: "bg-[#8E7D6D] bg-opacity-40",
    textColor: "text-black",
    icon: Star,
  },
];

export default function WelcomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleModelSelect = (modelId: string) => {
    console.log("Selected model:", modelId);
    // Add your routing or logic here
  };

  return (
    <div className="min-h-screen bg-white px-5 py-12 flex flex-col">
      <div className="max-w-[1000px] mx-auto w-full">
        <h1 className="text-[42px] font-normal tracking-[-0.02em] text-[#1A1A1A] mb-6 text-center">
          Navigate your new AI app
        </h1>

        {/* YouTube link: Use a proper <a> tag */}
        <div className="text-center mb-12">
          <a
            href="https://www.youtube.com/@simporter"
            className="inline-flex items-center justify-center text-[#000000] hover:text-blue-600 transition-colors text-[14px]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-red-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            Watch helpful content on our YouTube Channel
          </a>
        </div>

        {/* Models grid with bigger squares */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[8px] max-w-[716px] mx-auto mb-16">
          {MODELS.map((model, index) => (
            <motion.button
              key={model.id}
              onClick={() => handleModelSelect(model.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isLoaded ? 1 : 0,
                y: isLoaded ? 0 : 20,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className={`
                ${model.bgColor} 
                ${model.textColor} 
                w-full
                aspect-square
                rounded-lg
                p-6
                transition-all 
                duration-500
                relative
                text-left
                border
                border-[#E5E7EB]
                bg-opacity-80
                overflow-hidden
                group
                hover:shadow-lg
                before:absolute
                before:content-['']
                before:top-0
                before:left-[-100%]
                before:w-[150%]
                before:h-full
                before:bg-gradient-to-r
                before:from-transparent
                before:via-white/20
                before:to-transparent
                before:transition-all
                before:duration-500
                hover:before:left-[100%]
                after:absolute
                after:content-['']
                after:top-0
                after:left-0
                after:w-full
                after:h-full
                after:bg-white/0
                hover:after:bg-white/10
                after:transition-colors
                after:duration-300
              `}
            >
              <div className="absolute bottom-4 left-4 z-10">
                <h3 className="text-[15px] font-normal mb-1 transition-transform group-hover:translate-y-[-2px]">
                  {model.name}
                </h3>
                <p className="text-[10px] opacity-60 transition-transform group-hover:translate-y-[-2px]">
                  {model.description}
                </p>
              </div>

              {model.icon && (
                <div className="absolute bottom-4 right-4 z-10 transition-transform group-hover:translate-y-[-2px]">
                  <model.icon className="h-[16px] w-[16px] opacity-60" />
                </div>
              )}

              {/* Overlay badges */}
              {model.id === "library" && (
                <div className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-bold">
                  Get Data
                </div>
              )}
              {(model.id === "leaderboard" || model.id === "api") && (
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-bold">
                  Coming Soon
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
