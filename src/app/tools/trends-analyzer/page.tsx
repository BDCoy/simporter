"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface Trend {
  keyword: string;
  growth: number;
  volume: number;
  sentiment: number;
}

const initialTrends: Trend[] = [
  { keyword: '#sustainable', growth: 45, volume: 82, sentiment: 78 },
  { keyword: '#plantbased', growth: 32, volume: 65, sentiment: 85 },
  { keyword: '#zerowaste', growth: 28, volume: 58, sentiment: 72 },
];

export default function TrendsAnalyzerPage() {
  const [trends] = useState<Trend[]>(initialTrends);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUp className="w-4 h-4 text-emerald-500" />;
    if (growth < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  }
}