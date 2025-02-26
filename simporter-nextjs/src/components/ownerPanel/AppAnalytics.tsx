'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Calendar, Filter, Download, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define types for our metrics and data
type Metric = {
  name: string;
  value: string;
  change: string;
  category: string;
};

type PageData = {
  name: string;
  views: number;
  uniqueVisitors: number;
  conversionRate: string;
};

type SubscriptionData = {
  name: string;
  value: number;
  color: string;
};

type ChartData = {
  date: string;
  value: number;
};

export default function AppAnalytics() {
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("revenue");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("monthly");

  // Sample chart data
  const barData: ChartData[] = [
    { date: '2024-02-01', value: 100 },
    { date: '2024-02-08', value: 120 },
    { date: '2024-02-15', value: 115 },
    { date: '2024-02-22', value: 140 },
    { date: '2024-03-01', value: 135 }
  ];

  // Updated page analytics with requested pages
  const pageAnalyticsData: PageData[] = [
    { name: 'Landing', views: 15234, uniqueVisitors: 12453, conversionRate: '3.2%' },
    { name: 'Maple-1', views: 8765, uniqueVisitors: 6543, conversionRate: '4.5%' },
    { name: 'The Library', views: 12432, uniqueVisitors: 9876, conversionRate: '2.8%' },
    { name: 'Knowledge Base', views: 10987, uniqueVisitors: 8765, conversionRate: '1.9%' },
    { name: 'Request a Feature', views: 4321, uniqueVisitors: 3567, conversionRate: '7.6%' }
  ];

  // Financial metrics
  const financialMetrics: Metric[] = [
    { name: 'ARR', value: '$1,248,000', change: '+12%', category: 'revenue' },
    { name: 'MRR', value: '$104,000', change: '+8%', category: 'revenue' },
    { name: 'NRR', value: '108%', change: '+3%', category: 'revenue' }
  ];

  // Usage metrics
  const usageMetrics: Metric[] = [
    { name: 'DAUs', value: '1,248', change: '+15%', category: 'users' },
    { name: 'WAUs', value: '3,567', change: '+9%', category: 'users' },
    { name: 'MAUs', value: '8,752', change: '+7%', category: 'users' }
  ];

  // User metrics
  const userMetrics: Metric[] = [
    { name: 'Active Users', value: '7,890', change: '+8%', category: 'users' },
    { name: 'New Users', value: '1,234', change: '+22%', category: 'users' },
    { name: 'Existing Users', value: '6,656', change: '+5%', category: 'users' },
    { name: 'Churned Users', value: '123', change: '-10%', category: 'users' },
    { name: 'Churn Rate', value: '1.5%', change: '-0.3%', category: 'users' },
    { name: 'Average Session', value: '24m 30s', change: '+12%', category: 'engagement' },
    { name: 'Signup Rate', value: '3.2%', change: '+0.5%', category: 'conversion' },
    { name: 'Upgrade Rate', value: '12.5%', change: '+1.8%', category: 'conversion' },
    { name: 'Average Time between Upgrades', value: '68 days', change: '-5 days', category: 'conversion' },
    { name: 'Total Top Ups', value: '456', change: '+23%', category: 'revenue' }
  ];

  // SSO metrics
  const ssoMetrics: Metric[] = [
    { name: 'Microsoft SSO Users', value: '3,245', change: '+18%', category: 'users' },
    { name: 'Google SSO Users', value: '4,123', change: '+14%', category: 'users' }
  ];

  // Subscription tier metrics
  const subscriptionTierMetrics: Metric[] = [
    { name: 'Free Tier Users', value: '5,432', change: '+9%', category: 'users' },
    { name: '$25 Tier Users', value: '1,875', change: '+15%', category: 'users' },
    { name: '$75 Tier Users', value: '984', change: '+11%', category: 'users' },
    { name: '$250 Tier Users', value: '432', change: '+7%', category: 'users' }
  ];

  // Combine all metrics
  const allMetrics: Metric[] = [
    ...financialMetrics, 
    ...usageMetrics, 
    ...userMetrics, 
    ...ssoMetrics, 
    ...subscriptionTierMetrics
  ];

  // Filter metrics by category
  const filteredMetrics = selectedCategory === "all" 
    ? allMetrics
    : allMetrics.filter(metric => metric.category === selectedCategory);

  // Subscription tier distribution data for pie chart
  const subscriptionData: SubscriptionData[] = [
    { name: 'Free', value: 5432, color: '#94a3b8' },
    { name: '$25 Tier', value: 1875, color: '#60a5fa' },
    { name: '$75 Tier', value: 984, color: '#818cf8' },
    { name: '$250 Tier', value: 432, color: '#7c3aed' }
  ];

  // Categories for filter dropdown
  const categories = [
    { value: "all", label: "All Metrics" },
    { value: "revenue", label: "Revenue Metrics" },
    { value: "users", label: "User Metrics" },
    { value: "engagement", label: "Engagement Metrics" },
    { value: "conversion", label: "Conversion Metrics" }
  ];

  // Timeframe options for filter dropdown
  const timeframes = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" }
  ];
  
  return (
    <div className="w-full space-y-6 bg-gray-50 p-6 rounded-lg">
      {/* Header with Date Range Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">SaaS Metrics Dashboard</h2>
          <p className="text-gray-500">Track and analyze your business performance</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={startDate.toISOString().split('T')[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="border rounded p-2"
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={endDate.toISOString().split('T')[0]}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="border rounded p-2"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters as dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Category:</span>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-52 bg-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Timeframe:</span>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-full md:w-52 bg-white">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {timeframes.map((timeframe) => (
                <SelectItem key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {financialMetrics.map((metric) => (
          <Card key={metric.name} className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{metric.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`text-sm px-2 py-1 rounded-full ${
                  metric.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {metric.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content in Tabs */}
      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="metrics">Metrics Overview</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="pages">Page Performance</TabsTrigger>
        </TabsList>
        
        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          {/* Selected Metric Chart */}
          {selectedMetric && (
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>{selectedMetric.name} Trend</CardTitle>
                <p className="text-sm text-gray-500">Data shown for the selected period</p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name={selectedMetric.name} fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metrics Table */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
              <p className="text-sm text-gray-500">
                Click on any metric to see detailed trend
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Metric</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Value</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Change</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMetrics.map((metric) => (
                      <tr
                        key={metric.name}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedMetric(metric)}
                      >
                        <td className="px-4 py-3 font-medium">{metric.name}</td>
                        <td className="px-4 py-3">{metric.value}</td>
                        <td
                          className={`px-4 py-3 ${
                            metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {metric.change}
                        </td>
                        <td className="px-4 py-3 capitalize">
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                            {metric.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* User Analytics Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* User Metrics */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>User Metrics</CardTitle>
                <p className="text-sm text-gray-500">Overview of user activity and engagement</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usageMetrics.map((metric) => (
                    <div key={metric.name} className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="font-medium">{metric.name}</span>
                      <div className="flex items-center gap-2">
                        <span>{metric.value}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          metric.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subscription Distribution */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <p className="text-sm text-gray-500">Users by subscription tier</p>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subscriptionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {subscriptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {subscriptionTierMetrics.map((metric) => (
                    <div key={metric.name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <span className="text-sm">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SSO Users Card */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>SSO Usage</CardTitle>
                <p className="text-sm text-gray-500">Users by SSO provider</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ssoMetrics.map((metric) => (
                    <div key={metric.name} className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="font-medium">{metric.name}</span>
                      <div className="flex items-center gap-2">
                        <span>{metric.value}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          metric.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Activity & Retention */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>User Activity & Retention</CardTitle>
                <p className="text-sm text-gray-500">Insights into user behavior</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userMetrics
                    .filter(metric => ['Active Users', 'New Users', 'Existing Users', 'Churned Users', 'Churn Rate'].includes(metric.name))
                    .map((metric) => (
                      <div key={metric.name} className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="font-medium">{metric.name}</span>
                        <div className="flex items-center gap-2">
                          <span>{metric.value}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            (metric.name === 'Churned Users' || metric.name === 'Churn Rate')
                              ? (metric.change.startsWith('-') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
                              : (metric.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
                          }`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Page Analytics Tab */}
        <TabsContent value="pages">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Page Analytics</CardTitle>
              <p className="text-sm text-gray-500">Performance metrics for key pages</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Page</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Views</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Unique Visitors</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pageAnalyticsData.map((page) => (
                      <tr key={page.name} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{page.name}</td>
                        <td className="px-4 py-3 text-right">{page.views.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          {page.uniqueVisitors.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">{page.conversionRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}