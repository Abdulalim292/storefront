import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-[#17221f] text-white hover:bg-[#34433c]',
    secondary: 'bg-[#e7e3d8] text-[#17221f] hover:bg-[#d8d2c4]',
    outline: 'border border-[#b9b8ae] bg-transparent text-[#26332d] hover:bg-[#eeece4]',
    ghost: 'bg-transparent text-[#48534c] hover:bg-[#eeece4]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#a78b5f] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
