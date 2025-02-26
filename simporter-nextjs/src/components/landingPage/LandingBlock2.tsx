"use client"; 

import React from "react";

export interface LandingBlock2Props {
  title: string;
  description: string;
  reverse?: boolean;
  backgroundColor?: string;
}

const LandingBlock2: React.FC<LandingBlock2Props> = ({
  title,
  description,
  reverse = false,
  backgroundColor,
}) => {
  return (
    <div
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } items-center py-16 px-8 w-full`}
    >
      {/* Text Section */}
      <div className="md:w-1/2 text-center md:text-left pr-0 md:pr-12 mb-8 md:mb-0">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>
        <p className="text-gray-700 text-lg">{description}</p>
      </div>

      {/* Colored Image Placeholder */}
      <div className="md:w-1/2 flex items-center justify-center">
        <div
          className="w-80 h-80 md:w-96 md:h-96 rounded-lg shadow-lg"
          style={{ backgroundColor }}
        />
      </div>
    </div>
  );
};

export default function LandingSection() {
  const blocks = [
    {
      title: "Ask better questions. Get better answers.",
      description:
        "Combine the best AI models with the latest market data to find answers you can trust. Just pick your topic and our AI guides you to the right questions - like having a research expert by your side. While other tools offer old data, you can access real-time insights to show you what matters right now.",
      backgroundColor: "#f87171", // Red
    },
    {
      title: "Make great-looking reports fast. Share what matters.",
      description:
        "Turn your findings into clean slides and reports with one click. Each report looks professional and is ready to share. Stop spending hours making things look nice.",
      backgroundColor: "#60a5fa", // Blue
      reverse: true,
    },
    {
      title: "Learn about any industry quickly. Get specific insights.",
      description:
        "Whether you work in food, banking, movies, or cars, get answers that matter to your business. No more sorting through general info to find what you need.",
      backgroundColor: "#34d399", // Green
    },
    {
      title: "Work with your team easily. Keep everything in one place.",
      description:
        "Share your research with everyone who needs it. Your team can see all the insights, add their own findings, and find what they need fast.",
      backgroundColor: "#fbbf24", // Yellow
      reverse: true,
    },
    {
      title: "Spot new trends first. Know what's changing.",
      description:
        "See how customers are changing their minds, what they think about brands, and what's new in your market. Find opportunities before others do.",
      backgroundColor: "#a78bfa", // Purple
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-16">
      {blocks.map((block, index) => (
        <LandingBlock2 key={index} {...block} />
      ))}
    </div>
  );
}
