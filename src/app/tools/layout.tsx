"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const getCurrentTool = () => {
    const path = pathname.split('/').pop();
    return path === 'tools' ? 'innovation-cycle' : path;
  };

  const handleTabChange = (value: string) => {
    router.push(`/tools/${value}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">Tools</h1>
        <h2 className="text-2xl font-semibold text-gray-500 mb-8">
          Enterprise-Grade Analysis Tools
        </h2>
        
        <div className="mb-8">
          <Tabs value={getCurrentTool()} onValueChange={handleTabChange}>
            <TabsList className="border-b border-gray-200 w-full">
              <TabsTrigger value="innovation-cycle">
                Innovation Cycle
              </TabsTrigger>
              <TabsTrigger value="dynamic-pricing">
                Dynamic Pricing
              </TabsTrigger>
              <TabsTrigger value="trends-analyzer">
                Trends Analyzer
              </TabsTrigger>
              <TabsTrigger value="dtc-optimization">
                DTC Optimization
              </TabsTrigger>
              <TabsTrigger value="flavor-prediction">
                Flavor Prediction
              </TabsTrigger>
              <TabsTrigger value="retail-media">
                Retail Media
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {children}
      </div>
    </div>
  );
}