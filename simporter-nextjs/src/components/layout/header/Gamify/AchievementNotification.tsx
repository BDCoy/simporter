"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

interface AchievementNotificationProps {
  title: string;
  icon?: string;
  isNew?: boolean;
  progress?: {
    current: number;
    total: number;
  };
  onClose: () => void;
}

export function AchievementNotification({
  title,
  icon = "",
  isNew = true,
  progress,
  onClose,
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Start entrance animation
    const entranceTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 500);
    }, 5000);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div
      className={clsx(
        "fixed top-5 right-5 flex items-center p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 z-50 max-w-xs transition-all duration-500",
        {
          "opacity-0 translate-x-5": !isVisible,
          "opacity-100 translate-x-0": isVisible && isAnimating,
          "opacity-0 translate-y-2": isVisible && !isAnimating,
        }
      )}
      style={{
        boxShadow:
          "0 10px 25px rgba(0, 0, 0, 0.08), 0 0 10px rgba(255, 255, 255, 0.2)",
      }}
    >
      <div className="relative flex-shrink-0 mr-4">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shadow-sm">
          {icon ? (
            icon.endsWith(".svg") ||
            icon.endsWith(".png") ||
            icon.endsWith(".webp") ? (
              <img src={icon} alt={title} className="w-6 h-6" />
            ) : (
              <span className="w-6 h-6 flex items-center justify-center">
                {icon}
              </span>
            )
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        {isNew && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-sm font-medium text-gray-900">{title}</h4>
            {isNew ? (
              <p className="text-xs text-green-600 font-medium">
                Achievement Unlocked
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                In Progress: {progress?.current}/{progress?.total}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(() => {
                setIsVisible(false);
                onClose();
              }, 300);
            }}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {!isNew && progress && (
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
