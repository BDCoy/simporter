import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface TrendItemProps {
  keyword: string;
  growth: number;
  volume: number;
  sentiment?: number;
  maxVolume?: number;
}

const TrendItem: React.FC<TrendItemProps> = ({
  keyword,
  growth,
  volume,
  sentiment,
  maxVolume = 100
}) => {
  const getGrowthIcon = () => {
    if (growth > 0) return <ArrowUp className="w-4 h-4 text-emerald-500" />;
    if (growth < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getGrowthColor = () => {
    if (growth > 0) return 'text-emerald-500';
    if (growth < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const renderProgressBar = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    return (
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-violet-600 transition-all" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{keyword}</h4>
        <div className="flex items-center gap-2">
          {getGrowthIcon()}
          <span className={`text-sm font-medium ${getGrowthColor()}`}>
            {growth > 0 ? '+' : ''}{growth}%
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Volume</span>
            <span className="font-medium">{volume}K</span>
          </div>
          {renderProgressBar(volume, maxVolume)}
        </div>
        {sentiment !== undefined && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Sentiment</span>
              <span className="font-medium">{sentiment}%</span>
            </div>
            {renderProgressBar(sentiment, 100)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendItem;