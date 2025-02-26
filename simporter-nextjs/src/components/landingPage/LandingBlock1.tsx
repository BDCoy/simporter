"use client";

import React from "react";
import Link from "next/link";

export interface LandingBlock1Props {
  title: string;
  backgroundColor?: string;
}

const LandingBlock1: React.FC<LandingBlock1Props> = ({
  title,
  backgroundColor,
}) => {
  return (
    <div className="flex flex-col items-center py-12 px-4 w-full">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">{title}</h2>

        {/* Image Placeholder with Background Color */}
        <div
          className="rounded-lg overflow-hidden shadow-lg mt-8 w-full h-[600px] flex items-center justify-center"
          style={{ backgroundColor }}
        />
      </div>
    </div>
  );
};

export default function LandingSection() {
  const blocks = [
    {
      title: "Get answers in minutes, not months. Skip the long research.",
      backgroundColor: "#f87171", // Red
    },
    {
      title:
        "Get the latest data about your market. Not just general AI guesses.",
      backgroundColor: "#60a5fa", // Blue
    },
    {
      title:
        "Make reports and slides with one click. No more late nights making decks.",
      backgroundColor: "#34d399", // Green
    },
    {
      title:
        "Share market research with your team. Keep everyone up to date.",
      backgroundColor: "#fbbf24", // Yellow
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8">
      {blocks.map((block, index) => (
        <LandingBlock1 key={index} {...block} />
      ))}
    </div>
  );
}
