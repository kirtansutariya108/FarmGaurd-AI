import React from 'react';
import { Card } from '../common/Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subvalue?: string;
  icon: LucideIcon;
  variant?: 'emerald' | 'amber' | 'blue' | 'purple';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subvalue,
  icon: Icon,
  variant = 'emerald',
  trend,
}) => {
  const iconColors = {
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 ring-emerald-500/20',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 ring-amber-500/20',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 ring-blue-500/20',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 ring-purple-500/20',
  };

  return (
    <Card hoverable padded={false} className="p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ring-1 ${iconColors[variant]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </span>
          {subvalue && (
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              {subvalue}
            </span>
          )}
        </div>
        {trend && (
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">
            {trend}
          </p>
        )}
      </div>
    </Card>
  );
};
