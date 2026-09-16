import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { HelpCircle, RefreshCw, Camera, Info, ShieldAlert } from 'lucide-react';
import { DiseaseResult } from '../../types/disease';

interface LowConfidenceCardProps {
  result: DiseaseResult;
  onRetake: () => void;
}

export const LowConfidenceCard: React.FC<LowConfidenceCardProps> = ({ result, onRetake }) => {
  return (
    <Card className="border-amber-300 dark:border-amber-800/60 bg-amber-50/20 dark:bg-amber-950/10 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/60 dark:border-amber-900/40 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 flex items-center justify-center ring-1 ring-amber-500/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{result.cropName}</span>
              <Badge variant="warning">Low Confidence ({result.confidence}%)</Badge>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Could Not Confidently Identify Condition
            </h3>
          </div>
        </div>

        <Button onClick={onRetake} variant="secondary" icon={<RefreshCw className="w-4 h-4" />}>
          Try Another Photo
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-[#16221b] border border-amber-200/50 dark:border-amber-900/40 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Trust & Safety AI Notice</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          The uploaded image does not contain enough distinctive foliage pattern cues or may have uneven lighting/motion blur. FarmGuard AI refuses to provide speculative diagnostic recommendations when confidence is below 60%.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          How to Capture a Better Photo
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2 p-2.5 rounded-xl bg-white dark:bg-[#16221b] border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-emerald-600">1.</span>
            <span>Position camera 15-20 cm away from the leaf.</span>
          </li>
          <li className="flex items-start gap-2 p-2.5 rounded-xl bg-white dark:bg-[#16221b] border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-emerald-600">2.</span>
            <span>Ensure the leaf fills the majority of the frame.</span>
          </li>
          <li className="flex items-start gap-2 p-2.5 rounded-xl bg-white dark:bg-[#16221b] border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-emerald-600">3.</span>
            <span>Avoid harsh flash and direct backlighting shadows.</span>
          </li>
          <li className="flex items-start gap-2 p-2.5 rounded-xl bg-white dark:bg-[#16221b] border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-emerald-600">4.</span>
            <span>Hold phone steady to prevent blur.</span>
          </li>
        </ul>
      </div>

      <div className="pt-2 flex justify-center">
        <Button onClick={onRetake} size="lg" icon={<Camera className="w-4 h-4" />}>
          Take Better Leaf Photo
        </Button>
      </div>
    </Card>
  );
};
