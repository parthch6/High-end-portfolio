'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg';

interface LogoProps {
  href?: string;
  className?: string;
  size?: LogoSize;
  interactive?: boolean;
}

const sizeClasses: Record<LogoSize, string> = {
  xs: 'w-9 h-9',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export function PortfolioLogo({ 
  href = '/', 
  className,
  size = 'xs',
  interactive = true 
}: LogoProps) {
  const defaultClass = sizeClasses[size];
  const finalClassName = className || defaultClass;

  const content = (
    <div className={cn(finalClassName, 'flex-shrink-0')}>
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Outer gradient ring */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-90 shadow-lg" />
        
        {/* Inner core glow */}
        <div className="absolute inset-1 rounded-md bg-gradient-to-br from-blue-300 to-purple-300 opacity-80" />
        
        {/* Center highlight */}
        <div className="absolute inset-2 rounded-md bg-gradient-to-br from-white/40 to-transparent" />
      </div>
    </div>
  );

  if (interactive) {
    return (
      <Link href={href} className="group relative hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

export default PortfolioLogo;
