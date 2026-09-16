import React from 'react';
import { Card } from '../common/Card';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WeatherInsightCardProps {
  insight: string;
}

export const WeatherInsightCard: React.FC<WeatherInsightCardProps> = ({ insight }) => {
  return (
    <Card highlighted className="p-6 bg-gradient-to-br from-emerald-50/50 via-white to-green-50/20 dark:from-[#15251c] dark:via-[#16221b] dark:to-[#121c16]">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-900/10">
          <Sparkles className="w-5 h-5 text-lime-300" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            Farm Weather Synthesis
          </span>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1 leading-relaxed">
            "{insight}"
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Helps prevent irrigation washout and optimize foliar applications.</span>
            </div>
            <Link to="/app/irrigation" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Adjust Irrigation Schedule <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
