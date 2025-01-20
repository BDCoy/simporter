"use client";

import React, { useState } from 'react';
import { Store, Search, Users, Star, MessageCircle, Share2, Plus, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RetailPerformanceAnalysis = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('amazon');
  const [selectedAnalysis, setSelectedAnalysis] = useState('reviews');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Retail Performance Analysis</h1>
            <h2 className="text-2xl font-semibold text-gray-500">eCommerce Research Hub</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter Results
            </button>
            <button className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Analysis
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analysis Tools */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Retail Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Amazon', desc: 'Reviews and bestseller analysis' },
                    { name: 'Walmart', desc: 'Category & search insights' },
                    { name: 'Target', desc: 'Product positioning analysis' }
                  ].map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => setSelectedPlatform(platform.name.toLowerCase())}
                      className={`w-full p-3 rounded-lg border flex items-center gap-3 ${
                        selectedPlatform === platform.name.toLowerCase() 
                          ? 'border-violet-600 bg-violet-50' 
                          : 'hover:border-violet-300'
                      }`}
                    >
                      <Store className="w-5 h-5 text-violet-600" />
                      <div className="text-left">
                        <div className="font-medium">{platform.name}</div>
                        <div className="text-xs text-gray-500">{platform.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Review Analysis', icon: MessageCircle, type: 'reviews' },
                    { name: 'Search Trends', icon: Search, type: 'search' },
                    { name: 'Category Structure', icon: Filter, type: 'category' }
                  ].map((tool) => (
                    <button
                      key={tool.type}
                      onClick={() => setSelectedAnalysis(tool.type)}
                      className={`w-full p-3 rounded-lg border flex items-center gap-3 ${
                        selectedAnalysis === tool.type 
                          ? 'border-violet-600 bg-violet-50' 
                          : 'hover:border-violet-300'
                      }`}
                    >
                      <tool.icon className="w-5 h-5 text-violet-600" />
                      <div className="text-left">
                        <div className="font-medium">{tool.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Workspace */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select className="w-full border rounded-lg p-2">
                      <option>Personal Care</option>
                      <option>Household Care</option>
                      <option>Food & Beverage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keywords
                    </label>
                    <textarea 
                      className="w-full h-24 border rounded-lg p-2"
                      placeholder="Enter keywords to track..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Period
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="date" 
                        className="border rounded-lg p-2"
                      />
                      <input 
                        type="date" 
                        className="border rounded-lg p-2"
                      />
                    </div>
                  </div>
                  <button className="w-full bg-violet-600 text-white rounded-lg py-2 hover:bg-violet-700">
                    Run Analysis
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Research Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea 
                  className="w-full h-48 border rounded-lg p-2"
                  placeholder="Document your findings here..."
                />
                <div className="flex justify-end mt-4">
                  <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
                    Save Insights
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailPerformanceAnalysis;