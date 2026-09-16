import React from 'react';

interface HealthRingProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const HealthRing: React.FC<HealthRingProps> = ({
  score,
  size = 140,
  strokeWidth = 12,
  label = 'Healthy',
  sublabel = 'Crop Condition',
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#10b981'; // emerald
  let statusText = label || 'Healthy';
  if (clampedScore < 50) {
    strokeColor = '#f43f5e'; // rose
    if (!label) statusText = 'Attention Needed';
  } else if (clampedScore < 75) {
    strokeColor = '#f59e0b'; // amber
    if (!label) statusText = 'Moderate';
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Animated score circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {clampedScore}
          </span>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>
      {statusText && (
        <div className="mt-3 text-center">
          <span
            className="inline-block font-bold text-sm px-2.5 py-0.5 rounded-full"
            style={{
              color: strokeColor,
              backgroundColor: `${strokeColor}15`,
            }}
          >
            {statusText}
          </span>
          {sublabel && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sublabel}</p>
          )}
        </div>
      )}
    </div>
  );
};
