import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const getChangeIcon = () => {
    if (!change) return null;
    if (change > 0) return <ArrowUp className="w-4 h-4 text-emerald-500" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getChangeColor = () => {
    if (!change) return 'text-gray-500';
    if (change > 0) return 'text-emerald-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-2xl font-bold">
            {prefix}{value}{suffix}
          </div>
          {typeof change !== 'undefined' && (
            <div className="flex items-center gap-1 mt-2">
              {getChangeIcon()}
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-gray-500 ml-1">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCard;