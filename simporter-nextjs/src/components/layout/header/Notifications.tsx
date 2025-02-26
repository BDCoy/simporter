"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/context/NotificationContext";

interface NotificationsPanelProps {
  onClose: () => void;
}

export default function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const { pendingNotifications, pastNotifications, markAsRead, clearAll } = useNotifications();

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "achievement":
        return "bg-green-100 text-green-800";
      case "reward":
        return "bg-yellow-100 text-yellow-800";
      case "system":
        return "bg-blue-100 text-blue-800";
      case "social":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const handleMarkAllAsRead = async () => {
    const ids = pendingNotifications.map((notification) => notification.id);
    await markAsRead(ids);
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead([id]);
  };

  return (
    <div className="absolute top-[64px] right-0 w-full md:w-[400px] bg-white border-l border-b border-gray-200 shadow-lg z-50">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Notifications list */}
        <div className="space-y-4">
          {pendingNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-4 rounded-lg transition-colors bg-white border border-gray-200"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    getNotificationColor(notification.type)
                  )}
                >
                  <span className="text-lg">{notification.type}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatTimestamp(new Date(notification.timestamp))}
                    </span>
                  </div>
                  {notification.action && (
                    // TODO: THIS IS NOT IMPLEMENTED
                    <button
                      onClick={notification.action.onClick}
                      className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Mark as read
                </button>
              </div>
            </div>
          ))}
          {pastNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-4 rounded-lg transition-colors bg-gray-50"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    getNotificationColor(notification.type)
                  )}
                >
                  <span className="text-lg">{notification.type}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatTimestamp(new Date(notification.timestamp))}
                    </span>
                  </div>
                  {notification.action && (
                    <button
                      onClick={notification.action.onClick}
                      className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleMarkAllAsRead}
            className="w-full text-center text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
}