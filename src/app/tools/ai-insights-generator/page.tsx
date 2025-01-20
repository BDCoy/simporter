"use client";

import React, { useState } from 'react';
import { Sparkles, Search, Filter, ArrowRight, Book, Share2, Star, Bookmark, Target, TrendingUp, Users, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MarketInsight {
  id: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  tags: string[];
  sources: string[];
  timestamp: string;
}

interface CompanyContext {
  name: string;
  industry: string;
  competitors: string[];
  focusAreas: string[];
}

const InsightsGenerator = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [companyContext, setCompanyContext] = useState<CompanyContext>({
    name: '',
    industry: '',
    competitors: [],
    focusAreas: []
  });
  const [generatedInsights, setGeneratedInsights] = useState<MarketInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Example insights for demonstration
  const sampleInsights: MarketInsight[] = [
    {
      id: '1',
      title: 'Rising Consumer Interest in Sustainable Packaging',
      description: 'Analysis shows 47% increase in sustainability-related discussions, particularly focusing on packaging materials and recycling initiatives.',
      category: 'consumer',
      confidence: 0.89,
      impact: 'high',
      tags: ['sustainability', 'packaging', 'consumer-preference'],
      sources: ['Social Media', 'Review Analysis'],
      timestamp: '2024-01-19'
    }
  ];

  const handleGenerateInsights = () => {
    setIsGenerating(true);
    // Simulate API call to LLM
    setTimeout(() => {
      setGeneratedInsights(sampleInsights);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI Insights Generator</h1>
            <h2 className="text-2xl font-semibold text-gray-500">Market Intelligence Assistant</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter Insights
            </button>
            <button 
              className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 flex items-center gap-2"
              onClick={handleGenerateInsights}
              disabled={isGenerating}
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Generate Insights'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input 
                      type="text"
                      className="w-full border rounded-lg p-2"
                      placeholder="Enter company name"
                      value={companyContext.name}
                      onChange={(e) => setCompanyContext({
                        ...companyContext,
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select 
                      className="w-full border rounded-lg p-2"
                      value={companyContext.industry}
                      onChange={(e) => setCompanyContext({
                        ...companyContext,
                        industry: e.target.value
                      })}
                    >
                      <option value="">Select industry</option>
                      <option value="cpg">Consumer Packaged Goods</option>
                      <option value="retail">Retail</option>
                      <option value="technology">Technology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Focus Areas
                    </label>
                    <div className="space-y-2">
                      {['Innovation', 'Sustainability', 'Digital', 'Consumer Experience'].map((area) => (
                        <label key={area} className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCompanyContext({
                                  ...companyContext,
                                  focusAreas: [...companyContext.focusAreas, area]
                                });
                              } else {
                                setCompanyContext({
                                  ...companyContext,
                                  focusAreas: companyContext.focusAreas.filter(a => a !== area)
                                });
                              }
                            }}
                          />
                          {area}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insight Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 'consumer', name: 'Consumer Behavior', icon: Users },
                    { id: 'competition', name: 'Competitive Moves', icon: Target },
                    { id: 'innovation', name: 'Innovation Trends', icon: Lightbulb },
                    { id: 'market', name: 'Market Dynamics', icon: TrendingUp }
                  ].map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full p-3 rounded-lg border flex items-center gap-3 ${
                        selectedCategory === category.id
                          ? 'border-violet-600 bg-violet-50'
                          : 'hover:border-violet-300'
                      }`}
                    >
                      <category.icon className="w-5 h-5 text-violet-600" />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Insights */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generated Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedInsights.map((insight) => (
                    <div 
                      key={insight.id} 
                      className="p-4 border rounded-lg hover:border-violet-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{insight.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                            <span>•</span>
                            <span>Impact: {insight.impact}</span>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-violet-600">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {insight.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="text-xs px-2 py-1 bg-violet-50 text-violet-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {generatedInsights.length === 0 && !isGenerating && (
                    <div className="text-center py-12 text-gray-500">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Configure your company context and generate insights</p>
                    </div>
                  )}
                  {isGenerating && (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">Generating insights...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsGenerator;