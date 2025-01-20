"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Search, TrendingUp, Sliders, Info } from "lucide-react";
import pptxgen from "pptxgenjs";

interface DataPoint {
  date: string;
  [key: string]: number | string;
}

const colors = ["#4285f4", "#ea4335", "#fbbc05", "#34a853", "#7e57c2"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
        <p className="font-medium text-gray-600 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-medium">{entry.name}:</span>
            <span>{Math.round(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ShareOfVoiceDashboard: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [keywords, setKeywords] = useState<string[]>(["moisturizer", "sunscreen"]);

  const generateMockData = (): DataPoint[] => {
    const today = new Date();
    return Array.from({ length: 90 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (90 - i));
      const point: DataPoint = { date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
      keywords.forEach((keyword, idx) => {
        const value = Math.max(0, Math.min(100, 50 + idx * 10 + Math.random() * 20 - 10));
        point[keyword] = value;
      });
      return point;
    });
  };

  useEffect(() => {
    setData(generateMockData());
  }, [keywords]);

  const handleDownloadPPTX = () => {
    const pptx = new pptxgen();
    const slide = pptx.addSlide();
  
    slide.addText("Interest Over Time", { x: 1, y: 0.5, fontSize: 18, bold: true });
  
    const chartElement = document.querySelector("svg");
    if (chartElement) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(chartElement);
      const svgDataUri = `data:image/svg+xml;base64,${btoa(svgString)}`;
  
      slide.addImage({
        data: svgDataUri,
        x: 0.5,
        y: 1,
        w: 9,
        h: 4.5,
      });
    }
  
    pptx.writeFile({ fileName: "chart.pptx" });
  };
  
  const handlePublishChart = () => {
    alert("Chart published successfully!");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={handleDownloadPPTX}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Download to PPTX
          </button>
          <button
            onClick={handlePublishChart}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Publish Chart
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">Interest over time</h2>
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              {keywords.map((keyword, index) => (
                <Area
                  key={keyword}
                  type="monotone"
                  dataKey={keyword}
                  stroke={colors[index]}
                  fillOpacity={0.2}
                  fill={colors[index]}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ShareOfVoiceDashboard;
