import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { IrrigationRecommendation } from '../../types/irrigation';
import { Droplets, CheckCircle, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface RecommendationBannerProps {
  recommendation: IrrigationRecommendation;
  onOpenModal: () => void;
}

export const RecommendationBanner: React.FC<RecommendationBannerProps> = ({
  recommendation,
  onOpenModal,
}) => {
  const getBannerTheme = () => {
    switch (recommendation.status) {
      case 'Recommended':
        return {
          border: 'border-amber-300 dark:border-amber-800/80',
          bg: 'bg-gradient-to-br from-amber-50/60 via-white to-amber-50/20 dark:from-[#201c13] dark:via-[#16221b] dark:to-[#16221b]',
          icon: <AlertCircle className="w-8 h-8 text-amber-600" />,
          badgeVariant: 'warning' as const,
        };
      case 'Not Needed':
        return {
          border: 'border-emerald-300 dark:border-emerald-800/80',
          bg: 'bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/20 dark:from-[#132219] dark:via-[#16221b] dark:to-[#16221b]',
          icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
          badgeVariant: 'success' as const,
        };
      default:
        return {
          border: 'border-blue-300 dark:border-blue-800/80',
          bg: 'bg-gradient-to-br from-blue-50/60 via-white to-blue-50/20 dark:from-[#131d27] dark:via-[#16221b] dark:to-[#16221b]',
          icon: <HelpCircle className="w-8 h-8 text-blue-600" />,
          badgeVariant: 'info' as const,
        };
    }
  };

  const currentTheme = getBannerTheme();

  return (
    <Card className={`p-6 sm:p-8 border ${currentTheme.border} ${currentTheme.bg} space-y-6 shadow-sm`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-white dark:bg-[#121a14] shadow-sm ring-1 ring-black/5 flex-shrink-0">
            {currentTheme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Irrigation Decision Verdict
              </span>
              <Badge variant={currentTheme.badgeVariant}>
                Priority: {recommendation.priority}
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              {recommendation.headline}
            </h2>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Generated: {recommendation.generatedAt}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why Reason breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-blue-500" />
            Decision Rationale (Multi-Signal)
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#121c15] p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {recommendation.summary}
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {recommendation.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Advice Box */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recommended Field Action
            </h4>
            <div className="p-4 rounded-xl bg-white dark:bg-[#121c15] border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed mt-1.5">
              "{recommendation.actionAdvice}"
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenModal}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Update sensor reading or last watered date <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
