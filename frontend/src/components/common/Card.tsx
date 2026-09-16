import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
  highlighted?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  padded = true,
  highlighted = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#152019] rounded-2xl border ${
        highlighted
          ? 'border-emerald-500/50 shadow-md shadow-emerald-950/5 ring-1 ring-emerald-500/20'
          : 'border-slate-200/80 dark:border-[#223326] shadow-sm'
      } ${
        hoverable
          ? 'transition-all duration-200 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:-translate-y-0.5'
          : ''
      } ${padded ? 'p-5 sm:p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
