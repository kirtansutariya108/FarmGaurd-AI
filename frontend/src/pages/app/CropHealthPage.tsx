import React from 'react';
import { useApp } from '../../hooks/useFarmContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { HealthRing } from '../../components/common/HealthRing';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Leaf, 
  Droplets, 
  CloudSun, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  Info
} from 'lucide-react';

export const CropHealthPage: React.FC = () => {
  const { selectedFarm, farms } = useApp();

  const activeFarm = selectedFarm || farms[0] || {
    name: 'Green Valley Farm',
    crop: 'Tomato',
    healthScore: 82,
  };

  const metrics = [
    { label: 'Leaf Health & Pigmentation', score: 88, variant: 'emerald' as const, note: 'Normal chlorophyll levels with localized lower leaf spots' },
    { label: 'Disease Risk Safeguard', score: 85, variant: 'emerald' as const, note: 'Low pathogen spread probability in current temperature range' },
    { label: 'Root Moisture Balance', score: 72, variant: 'amber' as const, note: 'Approaching lower moisture threshold (32% current soil dampness)' },
    { label: 'Weather Stress Index', score: 80, variant: 'emerald' as const, note: 'Favorable humidity with mild cloud cover forecasted' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Activity className="w-7 h-7 text-emerald-600" />
              Crop Health Intelligence
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Holistic health indicators synthesized across leaf vision, soil moisture, and weather signals
          </p>
        </div>

        <Link to="/app/scanner">
          <Button size="sm" icon={<ArrowRight className="w-4 h-4" />}>
            Run Fresh Crop Scan
          </Button>
        </Link>
      </div>

      {/* Main Score Hero Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-white via-emerald-50/20 to-white dark:from-[#16221b] dark:via-[#132219] dark:to-[#16221b]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Health Ring Center */}
          <div className="flex flex-col items-center justify-center p-4">
            <HealthRing score={activeFarm.healthScore} size={160} strokeWidth={14} label="Healthy-looking" sublabel={`${activeFarm.crop} Parcel Score`} />
          </div>

          {/* Breakdown Explanation */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                <Leaf className="w-4 h-4" />
                <span>Overall Farm Health Verdict</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {activeFarm.name} is in Optimal Buffer Range ({activeFarm.healthScore}/100)
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Your crop displays strong canopy vigor and normal leaf development. While minor visual anomalies have been recorded in lower foliage, environmental conditions remain favorable.
            </p>

            {/* Disclaimer Alert */}
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Notice:</strong> FarmGuard Health Indicator is a project-specific decision-support indicator based on available signals. It is not a universal agricultural standard.
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Factor Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((m, idx) => (
          <Card key={idx} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{m.label}</h4>
              <span className="text-sm font-extrabold text-emerald-600">{m.score} / 100</span>
            </div>

            <ProgressBar value={m.score} colorVariant={m.variant} showPercentage={false} size="md" />

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {m.note}
            </p>
          </Card>
        ))}
      </div>

      {/* Cross-Farm Portfolio Comparison */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Multi-Farm Health Comparison
        </h3>
        <div className="space-y-3">
          {farms.map(f => (
            <div key={f.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{f.name}</span>
                <span className="text-[11px] text-slate-400 block">{f.crop} • {f.location}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 hidden sm:block">
                  <ProgressBar value={f.healthScore} showPercentage={false} size="sm" />
                </div>
                <span className="text-xs font-bold text-emerald-600">{f.healthScore} / 100</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
