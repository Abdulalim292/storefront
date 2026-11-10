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
    primary: 'btn',
    secondary: 'btn btn--quiet',
    outline: 'btn btn--quiet',
    ghost: 'btn btn--quiet border-transparent',
  };

  const sizes = {
    sm: 'btn--sm',
    md: '',
    lg: 'min-h-14 px-8 text-base',
  };

  return (
    <button
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
