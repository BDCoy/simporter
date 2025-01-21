"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface PriceData {
  date: string;
  price: number;
  competitor: number;
}

const initialData: PriceData[] = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  price: 100,
  competitor: 95
}));

export default function DynamicPricingPage() {
  const [priceAdjustment, setPriceAdjustment] = useState<number>(0);
  const [data, setData] = useState<PriceData[]>(initialData);

  const updatePrices = (adjustment: number) => {
    setPriceAdjustment(adjustment);
    setData(prev => prev.map(item => ({
      ...item,
      price: 100 * (1 + adjustment / 100)
    })));
  };

  const calculateImpact = () => {
    const currentPrice = 100 * (1 + priceAdjustment / 100);
    const competitorPrice = 95;
    
    if (currentPrice < competitorPrice * 0.95) {
      return {
        icon: <ArrowUp className="w-4 h-4 text-green-500" />,
        text: "High potential for market share gain",
        effect: "Positive",
        color: "text-green-600"
      };
    } else if (currentPrice > competitorPrice * 1.05) {
      return {
        icon: <ArrowDown className="w-4 h-4 text-red-500" />,
        text: "Risk of losing market share",
        effect: "Negative",
        color: "text-red-600"
      };
    } else {
      return {
        icon: <Minus className="w-4 h-4 text-gray-500" />,
        text: "Maintaining competitive position",
        effect: "Neutral",
        color: "text-gray-600"
      };
    }
  };

  const impact = calculateImpact();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Price Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#8884d8" 
                      name="Your Price"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="competitor" 
                      stroke="#82ca9d" 
                      name="Competitor"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Price Adjustment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment (%)
                </label>
                <input
                  type="range"
                  min={-20}
                  max={20}
                  step={1}
                  value={priceAdjustment}
                  onChange={(e) => updatePrices(Number(e.target.value))}
                  className="w-full"
                />
                <div className="mt-2 text-center font-medium">
                  {priceAdjustment > 0 ? '+' : ''}{priceAdjustment}%
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  {impact.icon}
                  <span className={`font-medium ${impact.color}`}>
                    {impact.effect} Impact
                  </span>
                </div>
                <p className="text-sm text-gray-600">{impact.text}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}