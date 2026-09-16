import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  colorVariant?: 'emerald' | 'amber' | 'rose' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  sublabel,
  showPercentage = true,
  colorVariant = 'emerald',
  size = 'md',
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const colors = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span>{label}</span>
            {sublabel && <span className="text-slate-400 dark:text-slate-500">{sublabel}</span>}
          </div>
          {showPercentage && <span className="font-semibold text-slate-900 dark:text-white">{clampedValue}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colors[colorVariant]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
