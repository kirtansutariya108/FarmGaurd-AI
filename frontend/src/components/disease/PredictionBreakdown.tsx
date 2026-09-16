import React from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { DiseasePrediction } from '../../types/disease';

interface PredictionBreakdownProps {
  predictions: DiseasePrediction[];
}

export const PredictionBreakdown: React.FC<PredictionBreakdownProps> = ({ predictions }) => {
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Prediction Probability Distribution
        </h4>
        <span className="text-[10px] text-slate-400">Multi-class softmax</span>
      </div>

      <div className="space-y-3.5">
        {predictions.map((p, idx) => {
          let variant: 'emerald' | 'amber' | 'rose' = 'rose';
          if (p.diseaseName.toLowerCase().includes('healthy')) variant = 'emerald';
          else if (idx > 0) variant = 'amber';

          return (
            <div key={p.diseaseName} className="space-y-1">
              <ProgressBar
                label={p.diseaseName}
                value={p.confidence}
                colorVariant={variant}
                size="md"
              />
              {p.description && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 pl-0.5">
                  {p.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
