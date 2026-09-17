import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { CheckCircle2, Loader2, Sparkles, Brain } from 'lucide-react';

interface AnalysisProgressProps {
  onComplete?: () => void;
  statusText?: string;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ onComplete, statusText }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(2), 400);
    const timer2 = setTimeout(() => setStep(3), 800);
    const timer3 = setTimeout(() => setStep(4), 1200);
    const timer4 = onComplete ? setTimeout(() => onComplete(), 1600) : undefined;

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (timer4) clearTimeout(timer4);
    };
  }, [onComplete]);

  const steps = [
    { num: 1, title: 'Image Upload & Resolution Check', desc: 'Validating aspect ratio, sharpness, and leaf focus' },
    { num: 2, title: 'Foliage Preprocessing & Normalization', desc: 'Resizing to 224x224 and normalizing RGB tensor matrix' },
    { num: 3, title: 'Deep Neural Net Inference', desc: 'Evaluating visual pathogen patterns with trained model' },
    { num: 4, title: 'Synthesizing Diagnosis & Recommendations', desc: 'Extracting confidence probabilities and next actions' },
  ];

  return (
    <Card className="max-w-xl mx-auto p-8 text-center space-y-8 animate-fade-in shadow-xl">
      {/* Animated AI Core Graphic */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 animate-ping"></div>
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-700 to-green-500 text-white flex items-center justify-center shadow-lg shadow-emerald-900/30 relative z-10">
          <Brain className="w-10 h-10 animate-pulse" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          Analyzing Foliage with Farm AI... <Sparkles className="w-5 h-5 text-amber-500" />
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {statusText || 'Evaluating visual anomalies via FastAPI MobileNetV2 Neural Network'}
        </p>
      </div>

      {/* Progressive Step Indicators */}
      <div className="space-y-3.5 text-left max-w-md mx-auto">
        {steps.map(s => {
          const isDone = step > s.num;
          const isCurrent = step === s.num;
          return (
            <div
              key={s.num}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/80 scale-[1.02]'
                  : isDone
                  ? 'bg-slate-50 dark:bg-slate-800/40 opacity-90'
                  : 'opacity-40'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                    {s.num}
                  </div>
                )}
              </div>
              <div>
                <p className={`text-xs font-bold ${isCurrent ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-900 dark:text-white'}`}>
                  {s.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Inference pipeline: POST /api/predict</span>
      </div>

    </Card>
  );
};
