import React from 'react';
import { LucideIcon } from 'lucide-react';

interface RecommendationProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'error';
  actions?: React.ReactNode;
}

const RecommendationCard: React.FC<RecommendationProps> = ({
  title,
  description,
  icon: Icon,
  variant = 'default',
  actions
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50 border-emerald-100';
      case 'warning':
        return 'bg-amber-50 border-amber-100';
      case 'error':
        return 'bg-red-50 border-red-100';
      default:
        return 'bg-violet-50 border-violet-100';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'success':
        return 'text-emerald-900';
      case 'warning':
        return 'text-amber-900';
      case 'error':
        return 'text-red-900';
      default:
        return 'text-violet-900';
    }
  };

  return (
    <div className={`rounded-lg border ${getVariantStyles()}`}>
      <div className="p-6">
        <div className="flex items-center gap-3">
          {Icon && <Icon className={`w-5 h-5 ${getTextStyles()}`} />}
          <h3 className={`text-lg font-semibold ${getTextStyles()}`}>
            {title}
          </h3>
        </div>
      </div>
      <div className="px-6 pb-6">
        <p className={`${getTextStyles()} text-sm opacity-90`}>
          {description}
        </p>
        {actions && (
          <div className="mt-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;