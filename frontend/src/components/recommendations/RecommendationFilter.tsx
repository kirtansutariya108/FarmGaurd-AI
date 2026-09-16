import React from 'react';
import { RecommendationStatus } from '../../types/recommendation';

interface RecommendationFilterProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  counts: Record<string, number>;
}

export const RecommendationFilter: React.FC<RecommendationFilterProps> = ({
  currentFilter,
  onFilterChange,
  counts,
}) => {
  const tabs = [
    { id: 'All', label: 'All Tasks' },
    { id: 'Urgent', label: 'Urgent' },
    { id: 'Today', label: 'Today' },
    { id: 'Monitor', label: 'Monitor' },
    { id: 'Completed', label: 'Completed' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-slate-800">
      {tabs.map(tab => {
        const isActive = currentFilter === tab.id;
        const count = counts[tab.id] || 0;

        return (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              isActive
                ? 'bg-emerald-700 text-white shadow-sm dark:bg-emerald-600'
                : 'bg-white dark:bg-[#152019] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                isActive
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
