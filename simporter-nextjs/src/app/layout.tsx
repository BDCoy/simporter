"use client";

import React, { ReactNode } from "react";
import "./globals.css"; // Global Tailwind styles

// Global header & sidebar components:
import HeaderLayout from "@/components/layout/header/HeaderLayout";
import Sidebar from "@/components/layout/Sidebar";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 dark:text-gray-100">
        {/* Page Wrapper with flex */}
        <div className="flex min-h-screen">
          {/* Fixed Sidebar on the Left */}
          <aside className="hidden md:block fixed top-0 left-0 w-64 h-screen border-r border-gray-200 shadow-md z-50 bg-white">
            <Sidebar />
          </aside>

          {/* Main area (no extra left container) */}
          <div className="flex-1 flex flex-col md:ml-64">
            {/* Global Header */}
            <HeaderLayout />

            {/* Main Content */}
            <main className="overflow-y-auto p-4">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
