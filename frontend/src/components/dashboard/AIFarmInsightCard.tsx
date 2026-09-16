import React from 'react';
import { Card } from '../common/Card';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIFarmInsightCardProps {
  insightText: string;
  farmName: string;
  crop: string;
}

export const AIFarmInsightCard: React.FC<AIFarmInsightCardProps> = ({ insightText, farmName, crop }) => {
  return (
    <Card highlighted className="relative overflow-hidden bg-gradient-to-br from-emerald-50/70 via-white to-green-50/40 dark:from-[#15271d] dark:via-[#16221b] dark:to-[#121c16]">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-md shadow-emerald-900/10 flex-shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              AI Decision Synthesis • {farmName} ({crop})
            </span>
            <Link to="/app/recommendations" className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5">
              Action Plan <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mt-2 leading-relaxed">
            "{insightText}"
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
              Signals: Leaf Vision + Soil Moisture + 48h Weather
            </span>
            <span className="text-[11px] text-slate-400">
              Updated automatically upon new scan
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
