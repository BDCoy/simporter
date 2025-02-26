'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('rounded-lg border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700', className)} {...props}>
      {children}
    </div>
  );
};

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-4 border-b dark:border-gray-700', className)} {...props}>
      {children}
    </div>
  );
};

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle: React.FC<CardTitleProps> = ({ className, children, ...props }) => {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-white', className)} {...props}>
      {children}
    </h3>
  );
};

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-4', className)} {...props}>
      {children}
    </div>
  );
};
