'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * A simple Button component.
 */
export const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={cn('px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700', className)}
      {...props}
    >
      {children}
    </button>
  );
};
