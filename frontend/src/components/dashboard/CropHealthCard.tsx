import React from 'react';
import { Card } from '../common/Card';
import { HealthRing } from '../common/HealthRing';
import { Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';

interface CropHealthCardProps {
  score: number;
  cropName: string;
}

export const CropHealthCard: React.FC<CropHealthCardProps> = ({ score, cropName }) => {
  return (
    <Card hoverable className="flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Crop Health Index</h3>
          <div className="group relative cursor-pointer text-slate-400 hover:text-slate-600">
            <Info className="w-3.5 h-3.5" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-48 p-2 text-[10px] bg-slate-900 text-white rounded-lg shadow-lg z-20 pointer-events-none">
              FarmGuard decision-support index calculated from visual leaf health, soil moisture, and pest risks.
            </div>
          </div>
        </div>
        <Link to="/app/crop-health" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
          Details <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="my-5 flex items-center justify-center">
        <HealthRing score={score} label="Healthy-looking" sublabel={`${cropName} Field Baseline`} size={130} />
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="text-slate-500 dark:text-slate-400">
          Status: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Optimal Buffer</span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Target: 80+
        </div>
      </div>
    </Card>
  );
};
