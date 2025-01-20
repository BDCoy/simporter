import React from "react";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, className = "", barClassName = "" }, ref) => {
    // Ensure value is between 0 and max
    const normalizedValue = Math.min(Math.max(0, value), max);
    const percentage = (normalizedValue / max) * 100;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={normalizedValue}
        className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
      >
        <div
          className={`h-full bg-violet-600 transition-all ${barClassName}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };