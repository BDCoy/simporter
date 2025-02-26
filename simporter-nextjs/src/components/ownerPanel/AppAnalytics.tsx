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
  ResponsiveContainer
} from 'recharts';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// If you want to show user analytics inside the same view, import it:
import UserAnalytics from './UserAnalytics';

export default function AppAnalytics() {
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState<any>(null);

  // For demonstration, here's some sample chart data:
  const barData = [
    { date: '2024-02-01', value: 100 },
    { date: '2024-02-08', value: 120 },
    { date: '2024-02-15', value: 115 },
    { date: '2024-02-22', value: 140 }
  ];

  // Basic example metrics
  const metricsData = [
    { name: 'Active Users', value: '2,341', change: '+8%' },
    { name: 'Average Session Duration', value: '24m 30s', change: '+12%' },
    { name: 'Churned Users', value: '45', change: '-10%' }
    // ...
  ];

  // Page analytics example
  const pageAnalyticsData = [
    { name: 'Landing', views: 15234, uniqueVisitors: 12453 },
    { name: 'Home', views: 25432, uniqueVisitors: 20123 },
    { name: 'Projects', views: 18765, uniqueVisitors: 15432 }
  ];

  // We’ll skip advanced filter/sort logic here for brevity,
  // but you can replicate what you had in the original code.

  return (
    <div className="w-full space-y-6">
      {/* Date Range Selector */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">SaaS Metrics Dashboard</h2>
        <div className="flex items-center space-x-4">
          {/* Start */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={startDate.toISOString().split('T')[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="border rounded p-2"
            />
          </div>
          <span>to</span>
          {/* End */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={endDate.toISOString().split('T')[0]}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="border rounded p-2"
            />
          </div>
        </div>
      </div>

      {/* Example simple filters */}
      <div className="flex space-x-4 mb-4">
        <Input placeholder="Filter by category" />
        <Input placeholder="Filter by metric" />
      </div>

      {/* Chart */}
      {selectedMetric && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{selectedMetric.name} Trend</CardTitle>
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

      {/* Metrics Table (very simplified) */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-500">Metric</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Value</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {metricsData.map((metric) => (
              <tr
                key={metric.name}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedMetric(metric)}
              >
                <td className="px-4 py-3">{metric.name}</td>
                <td className="px-4 py-3">{metric.value}</td>
                <td
                  className={`px-4 py-3 ${
                    metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Page Analytics (simplified) */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Page Analytics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">Page</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Views</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Unique Visitors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pageAnalyticsData.map((page) => (
                <tr key={page.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{page.name}</td>
                  <td className="px-4 py-3 text-right">{page.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    {page.uniqueVisitors.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* If you want the user analytics section here as well: */}
      <UserAnalytics />
    </div>
  );
}
