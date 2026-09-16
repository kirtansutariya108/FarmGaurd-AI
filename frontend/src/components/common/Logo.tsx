import React from 'react';
import { Leaf } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-emerald-600 to-green-900 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 ring-1 ring-emerald-500/30 flex-shrink-0`}>
        <Leaf className="w-5/8 h-5/8 text-emerald-300 transform -rotate-12" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${textSizes[size]}`}>
            FarmGuard
          </span>
          <span className="text-xs font-black tracking-widest px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            From crop image to farm decisions
          </span>
        )}
      </div>
    </div>
  );
};
