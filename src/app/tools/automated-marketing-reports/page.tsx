"use client";

import React, { useState } from 'react';
import { FileText, Globe, ArrowRight, RefreshCcw, Settings, Layout, Gift, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportTemplate {
  id: string;
  title: string;
  type: 'pptx' | 'blog';
  seoKeywords: string[];
  sections: string[];
}

interface GenerationStatus {
  status: 'idle' | 'generating' | 'completed' | 'error';
  message?: string;
}

const AutomatedReports = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({ status: 'idle' });

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'market_trends',
      title: 'Market Trends Report',
      type: 'pptx',
      seoKeywords: ['consumer insights', 'market analysis', 'trend forecasting'],
      sections: ['Executive Summary', 'Category Overview', 'Social Listening', 'Recommendations']
    },
    {
      id: 'innovation_insights',
      title: 'Innovation Insights Blog',
      type: 'blog',
      seoKeywords: ['product innovation', 'consumer research', 'market opportunities'],
      sections: ['Trend Analysis', 'Consumer Needs', 'Whitespace Opportunities']
    }
  ];

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Automated Reports</h1>
            <h2 className="text-2xl font-semibold text-gray-500">SEO-Optimized Content Generator</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`w-full p-3 rounded-lg border flex items-center gap-3 ${
                        selectedTemplate?.id === template.id 
                          ? 'border-violet-600 bg-violet-50' 
                          : 'hover:border-violet-300'
                      }`}
                    >
                      {template.type === 'pptx' ? (
                        <Layout className="w-5 h-5 text-violet-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-violet-600" />
                      )}
                      <div className="text-left">
                        <div className="font-medium">{template.title}</div>
                        <div className="text-xs text-gray-500">
                          {template.type.toUpperCase()} • Monthly Update
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedTemplate && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Keywords
                        </label>
                        <textarea 
                          className="w-full h-24 border rounded-lg p-2 text-sm"
                          placeholder="Enter target keywords..."
                          defaultValue={selectedTemplate.seoKeywords.join(', ')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content Length
                        </label>
                        <select className="w-full border rounded-lg p-2">
                          <option>Short Form (500-800 words)</option>
                          <option>Medium Form (1000-1500 words)</option>
                          <option>Long Form (2000+ words)</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {selectedTemplate && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedTemplate.sections.map((section: string, index: number) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium mb-2">{section}</div>
                            <div className="space-y-2">
                              <label className="flex items-center text-sm">
                                <input type="checkbox" className="mr-2" defaultChecked />
                                Include data visualizations
                              </label>
                              <label className="flex items-center text-sm">
                                <input type="checkbox" className="mr-2" defaultChecked />
                                Add key insights
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">Content Enhancement</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            Include trend analysis
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            Add market size data
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generation Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Update Schedule</div>
                      <select className="w-full border rounded-lg p-2">
                        <option>First Monday of Month</option>
                        <option>Last Friday of Month</option>
                        <option>Custom Schedule</option>
                      </select>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Distribution</div>
                      <select className="w-full border rounded-lg p-2">
                        <option>Email to Team</option>
                        <option>Upload to Drive</option>
                        <option>Publish to Web</option>
                      </select>
                    </div>
                  </div>

                  <button className="w-full bg-violet-600 text-white rounded-lg py-3 font-semibold hover:bg-violet-700 flex items-center justify-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Generate Report
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

export default AutomatedReports;