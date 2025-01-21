"use client";

import React, { useState } from 'react';
import { Users, Search, MessageCircle, TrendingUp, Book } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ConsumerBehaviorLab = () => {
  const [activeSource, setActiveSource] = useState('reddit');
  const [researchFocus, setResearchFocus] = useState('problems');

  // Sample research categories
  const researchAreas = [
    {
      title: "Consumer Problems",
      description: "Identify pain points and unmet needs",
      source: "reddit",
      keywordGroups: ["frustration", "issue", "problem", "wish", "need"]
    },
    {
      title: "Usage Patterns",
      description: "How products are being used",
      source: "tiktok",
      keywordGroups: ["routine", "hack", "tutorial", "tips"]
    },
    {
      title: "Purchase Drivers",
      description: "Why consumers choose products",
      source: "reviews",
      keywordGroups: ["because", "reason", "switched to", "better than"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Consumer Behavior Lab</h1>
            <h2 className="text-2xl font-semibold text-gray-500">Social Listening Research Center</h2>
          </div>
          <button className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 flex items-center gap-2">
            <Book className="w-4 h-4" />
            Save Research
          </button>
        </div>

        {/* Research Focus Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-violet-600" />
              Research Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {researchAreas.map((area) => (
                <button
                  key={area.title}
                  onClick={() => setResearchFocus(area.title.toLowerCase())}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    researchFocus === area.title.toLowerCase()
                      ? 'border-violet-600 bg-violet-50'
                      : 'border-gray-200 hover:border-violet-300'
                  }`}
                >
                  <div className="font-medium">{area.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{area.description}</div>
                  <div className="text-xs text-violet-600 mt-2">
                    Primary source: {area.source}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Research Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Sources Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['reddit', 'tiktok', 'instagram', 'reviews'].map((source) => (
                  <button
                    key={source}
                    onClick={() => setActiveSource(source)}
                    className={`w-full p-3 rounded-lg border flex items-center gap-3 ${
                      activeSource === source
                        ? 'border-violet-600 bg-violet-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 text-violet-600" />
                    <div className="text-left">
                      <div className="font-medium capitalize">{source}</div>
                      <div className="text-xs text-gray-500">
                        {source === 'reddit' && 'Problem discussions & solutions'}
                        {source === 'tiktok' && 'Usage patterns & trends'}
                        {source === 'instagram' && 'Visual content & engagement'}
                        {source === 'reviews' && 'Product feedback & sentiment'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Workspace */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Research Workspace</span>
                <div className="text-sm text-gray-500">
                  Analyzing: {activeSource.toUpperCase()}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Keyword Analysis Tool */}
              <div className="mb-6">
                <div className="font-medium mb-2">Keyword Analysis</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Common Phrases</div>
                    <textarea 
                      className="w-full h-24 p-2 border rounded-lg text-sm"
                      placeholder="Enter phrases to track..."
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Sentiment Patterns</div>
                    <textarea 
                      className="w-full h-24 p-2 border rounded-lg text-sm"
                      placeholder="Enter sentiment indicators..."
                    />
                  </div>
                </div>
              </div>

              {/* Research Notes */}
              <div>
                <div className="font-medium mb-2">Research Notes</div>
                <textarea 
                  className="w-full h-48 p-4 border rounded-lg"
                  placeholder="Document your observations and insights..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConsumerBehaviorLab;