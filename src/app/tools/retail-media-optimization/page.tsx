"use client";

"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Target, BarChart2 } from 'lucide-react';

interface CampaignData {
  platform: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

interface PerformanceMetric {
  day: string;
  spend: number;
  revenue: number;
  roas: number;
}

const generateDummyData = (days: number): PerformanceMetric[] => {
  return Array.from({ length: days }, (_, i) => ({
    day: `Day ${i + 1}`,
    spend: Math.round(1000 + Math.random() * 500),
    revenue: Math.round(2000 + Math.random() * 1000),
    roas: Number((2 + Math.random()).toFixed(2))
  }));
};

export default function RetailMediaPage() {
  const [campaigns] = useState<CampaignData[]>([
    {
      platform: "Amazon",
      spend: 25000,
      impressions: 500000,
      clicks: 15000,
      conversions: 750,
      revenue: 45000
    },
    {
      platform: "Walmart",
      spend: 18000,
      impressions: 350000,
      clicks: 10500,
      conversions: 520,
      revenue: 31000
    }
  ]);

  const [performanceData] = useState<PerformanceMetric[]>(generateDummyData(30));

  const calculateMetrics = (data: CampaignData[]) => {
    const totalSpend = data.reduce((sum, camp) => sum + camp.spend, 0);
    const totalRevenue = data.reduce((sum, camp) => sum + camp.revenue, 0);
    const totalConversions = data.reduce((sum, camp) => sum + camp.conversions, 0);
    
    return {
      roas: (totalRevenue / totalSpend).toFixed(2),
      ctr: ((data.reduce((sum, camp) => sum + camp.clicks, 0) / 
             data.reduce((sum, camp) => sum + camp.impressions, 0)) * 100).toFixed(2),
      convRate: ((totalConversions / 
                  data.reduce((sum, camp) => sum + camp.clicks, 0)) * 100).toFixed(2)
    };
  };

  const metrics = calculateMetrics(campaigns);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">ROAS</span>
            </div>
            <div className="text-2xl font-bold">{metrics.roas}x</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">CTR</span>
            </div>
            <div className="text-2xl font-bold">{metrics.ctr}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Target className="w-4 h-4" />
              <span className="text-sm">Conversion Rate</span>
            </div>
            <div className="text-2xl font-bold">{metrics.convRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <BarChart2 className="w-4 h-4" />
              <span className="text-sm">Active Campaigns</span>
            </div>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="spend" 
                  stroke="#8884d8" 
                  name="Spend"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#82ca9d" 
                  name="Revenue"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="roas" 
                  stroke="#ff7300" 
                  name="ROAS"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((campaign, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{campaign.platform}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Spend</div>
                    <div className="text-lg font-medium">
                      ${campaign.spend.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Revenue</div>
                    <div className="text-lg font-medium">
                      ${campaign.revenue.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Impressions</div>
                    <div className="text-lg font-medium">
                      {campaign.impressions.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Conversions</div>
                    <div className="text-lg font-medium">
                      {campaign.conversions.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Performance</div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-green-500 h-full"
                        style={{ width: `${(campaign.revenue / campaign.spend) * 33}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      ROAS: {(campaign.revenue / campaign.spend).toFixed(2)}x
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}