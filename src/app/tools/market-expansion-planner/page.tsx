"use client";

import React, { useState } from 'react';
import { Globe, Search, Users, Sparkles, Share2, MessageCircle, Plus, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MarketExpansionPlanner = () => {
  const [activeTab, setActiveTab] = useState('research');
  const [selectedInsight, setSelectedInsight] = useState(null);
  
  // Sample collaborative insights
  const marketInsights = [
    {
      id: 1,
      author: "Sarah K.",
      title: "Gen Z Skincare Trends",
      category: "Personal Care",
      keyFindings: [
        "Emphasis on sustainability",
        "Preference for multi-purpose products",
        "Strong influence of social proof"
      ],
      sources: ["TikTok Analysis", "Reddit Discussions"],
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      author: "Mike R.",
      title: "Plant-based Food Market",
      category: "Food & Beverage",
      keyFindings: [
        "Growing interest in protein alternatives",
        "Price sensitivity remains key barrier",
        "Taste is primary purchase driver"
      ],
      sources: ["Consumer Reviews", "Social Listening"],
      likes: 32,
      comments: 12
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header with Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Market Expansion Planner</h1>
            <h2 className="text-2xl font-semibold text-gray-500">Collaborative Market Research Hub</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Research
            </button>
            <button className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Analysis
            </button>
          </div>
        </div>

        {/* Research Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Research Tools Panel */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Research Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { icon: Search, name: 'Trend Analysis', desc: 'Track emerging patterns' },
                    { icon: Users, name: 'Consumer Insights', desc: 'Analyze behavior patterns' },
                    { icon: Globe, name: 'Market Sizing', desc: 'Estimate opportunities' },
                    { icon: Sparkles, name: 'AI Assistant', desc: 'Get research suggestions' }
                  ].map((tool) => (
                    <button
                      key={tool.name}
                      className="w-full p-3 rounded-lg border hover:border-violet-300 flex items-center gap-3 group"
                    >
                      <tool.icon className="w-5 h-5 text-violet-600" />
                      <div className="text-left">
                        <div className="font-medium group-hover:text-violet-600">{tool.name}</div>
                        <div className="text-xs text-gray-500">{tool.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Saved Research */}
            <Card>
              <CardHeader>
                <CardTitle>Saved Research</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Beauty Market Analysis', 'Competitor Deep Dive', 'Consumer Survey'].map((item) => (
                    <div key={item} className="p-3 rounded-lg border flex items-center justify-between">
                      <span className="font-medium">{item}</span>
                      <Bookmark className="w-4 h-4 text-violet-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {/* Collaborative Insights Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Market Insights Feed</span>
                  <button className="text-sm text-violet-600 hover:text-violet-700">
                    Filter
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketInsights.map((insight) => (
                    <div key={insight.id} className="p-4 rounded-lg border hover:border-violet-300 cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium text-lg">{insight.title}</div>
                          <div className="text-sm text-gray-500">By {insight.author} • {insight.category}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="text-gray-500 hover:text-violet-600">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button className="text-gray-500 hover:text-violet-600">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 mb-3">
                        {insight.keyFindings.map((finding, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-1 h-1 rounded-full bg-violet-600"></div>
                            {finding}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div>Sources: {insight.sources.join(', ')}</div>
                        <div className="flex items-center gap-4">
                          <span>{insight.likes} likes</span>
                          <span>{insight.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interactive Analysis Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium mb-2">Market Size Calculator</div>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="Category name..."
                        className="w-full p-2 border rounded-lg"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          placeholder="TAM..."
                          className="w-1/2 p-2 border rounded-lg"
                        />
                        <input 
                          type="number" 
                          placeholder="Market share %..."
                          className="w-1/2 p-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium mb-2">Trend Analyzer</div>
                    <textarea 
                      className="w-full h-24 p-2 border rounded-lg"
                      placeholder="Enter keywords to track..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketExpansionPlanner;