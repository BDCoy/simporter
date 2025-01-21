import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className }) => (
  <span className={`text-sm font-medium px-2 py-1 bg-gray-200 rounded ${className}`}>
    {children}
  </span>
);
