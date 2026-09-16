import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CheckCircle2, Sprout, ArrowRight, ShieldCheck } from 'lucide-react';
import { DiseaseResult } from '../../types/disease';
import { Link } from 'react-router-dom';

interface HealthyResultCardProps {
  result: DiseaseResult;
  onScanAnother: () => void;
}

export const HealthyResultCard: React.FC<HealthyResultCardProps> = ({ result, onScanAnother }) => {
  return (
    <Card className="border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200/60 dark:border-emerald-900/40 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center ring-1 ring-emerald-500/30">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{result.cropName}</span>
              <Badge variant="success">Healthy-looking ({result.confidence}%)</Badge>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              No Obvious Disease Patterns Detected
            </h3>
          </div>
        </div>

        <Button onClick={onScanAnother} variant="secondary">
          Scan Another Leaf
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left findings */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Visual Findings
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-4 rounded-xl bg-white dark:bg-[#16221b] border border-slate-200 dark:border-slate-800">
            {result.visualFindings}
          </p>

          <div className="p-3 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-300/50 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
            <span>Note: This diagnostic scan reflects the sampled foliage. Continue weekly monitoring across your whole farm parcel.</span>
          </div>
        </div>

        {/* Right next steps */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Recommended Routine Next Steps
          </h4>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {result.nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-white dark:bg-[#16221b] border border-slate-200 dark:border-slate-800">
                <Sprout className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <Link to="/app/irrigation">
          <Button variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
            Check Irrigation Advisor
          </Button>
        </Link>
        <Link to="/app/crop-health">
          <Button size="sm" icon={<ArrowRight className="w-4 h-4" />}>
            View Overall Farm Health Score
          </Button>
        </Link>
      </div>
    </Card>
  );
};
