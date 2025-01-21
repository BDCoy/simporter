"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, TrendingUp, Users, Star, Bell, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BrandHealthMonitor = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data - in production this would come from your API
  const brandMetrics = {
    score: 85,
    sentiment: 78,
    shareOfVoice: 42,
    loyalty: 72
  };

  const trendData = [
    { month: 'Jan', score: 82 },
    { month: 'Feb', score: 84 },
    { month: 'Mar', score: 85 },
    { month: 'Apr', score: 83 },
    { month: 'May', score: 85 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Brand Health Monitor</h1>
            <h2 className="text-2xl font-semibold text-gray-500">Real-time brand performance insights</h2>
          </div>
          <button className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Configure Alerts
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Brand Score</CardTitle>
              <Shield className="w-4 h-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brandMetrics.score}/100</div>
              <div className="text-xs text-green-500">↑ 2.1% from last month</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Sentiment</CardTitle>
              <Star className="w-4 h-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brandMetrics.sentiment}%</div>
              <div className="text-xs text-green-500">↑ 1.3% from last month</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Share of Voice</CardTitle>
              <BarChart2 className="w-4 h-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brandMetrics.shareOfVoice}%</div>
              <div className="text-xs text-red-500">↓ 0.8% from last month</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Loyalty Score</CardTitle>
              <Users className="w-4 h-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brandMetrics.loyalty}%</div>
              <div className="text-xs text-green-500">↑ 1.7% from last month</div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Brand Health Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex gap-6 mb-6 border-b">
          {['overview', 'sentiment', 'demographics', 'competition'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium pb-2 border-b-2 ${
                activeTab === tab
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Achievement Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-600" />
              Brand Health Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Social Engagement', progress: 75 },
                { title: 'Customer Satisfaction', progress: 82 },
                { title: 'Market Position', progress: 68 }
              ].map((achievement) => (
                <div key={achievement.title} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium mb-2">{achievement.title}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-violet-600 h-2 rounded-full"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Level {Math.floor(achievement.progress / 20)} • {achievement.progress}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandHealthMonitor;