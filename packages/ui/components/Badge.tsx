import React from 'react';
import { cn } from '../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
        {
          'bg-green-100 text-green-800': variant === 'default',
          'bg-gray-100 text-gray-800': variant === 'secondary',
          'bg-red-100 text-red-800': variant === 'destructive',
          'border border-gray-300 text-gray-800': variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}