"use client";

import React, { ReactNode } from "react";
import "./globals.css"; // Global Tailwind styles
import { AuthProvider } from "@/context/AuthContext";

// Global header & sidebar components:
import HeaderLayout from "@/components/layout/header/HeaderLayout";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

interface RootLayoutProps {
  children: ReactNode;
}

const LayoutContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isExpanded } = useSidebar();

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - pinned/fixed for main page only */}
      <div className="hidden md:block fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-md z-50">
        <Sidebar />
      </div>

      {/* Main area (adjust margin based on sidebar state) */}
      <div className={`flex-1 ${isExpanded ? "md:ml-64" : "md:ml-16"} flex flex-col`}>
        {/* Global Header */}
        <HeaderLayout />

        {/* Main Content */}
        <main className="overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 dark:text-gray-100">
        {/* Auth Provider */}
        <AuthProvider>
          {/* Page Wrapper with flex */}
          <div className="flex min-h-screen">
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
        </AuthProvider>

        <SidebarProvider>
          <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
      </body>
    </html>
  );
}