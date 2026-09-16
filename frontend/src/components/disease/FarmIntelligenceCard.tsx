import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { FarmIntelligenceData } from '../../types/intelligence';
import {
  Sparkles,
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Wheat,
  ListChecks,
  Info
} from 'lucide-react';

interface FarmIntelligenceCardProps {
  intelligence: FarmIntelligenceData | null;
  isLoading?: boolean;
  error?: string | null;
}

export const FarmIntelligenceCard: React.FC<FarmIntelligenceCardProps> = ({
  intelligence,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <Card className="p-6 border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/30 via-white to-emerald-50/20 dark:from-[#132219] dark:via-[#16201a] dark:to-[#132219] animate-pulse">
        <div className="flex items-center gap-3 border-b border-emerald-100 dark:border-emerald-950 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-200 dark:bg-emerald-900" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-emerald-200 dark:bg-emerald-800 rounded w-1/3" />
            <div className="h-3 bg-emerald-100 dark:bg-emerald-900 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-3 pt-4">
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
          <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
      </Card>
    );
  }

  if (error || !intelligence) {
    return (
      <Card className="p-5 border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-slate-700 dark:text-slate-300">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
              Farm Intelligence Notice
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-400/90 mt-1 leading-relaxed">
              {error || 'Farm intelligence is temporarily unavailable. Primary disease diagnosis remains active above.'}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const {
    disease,
    confidence,
    riskLevel,
    weatherRisk,
    advisory,
    actions,
    weatherFactors,
    weatherSummary
  } = intelligence;

  // Determine risk badge variant
  const getRiskVariant = (risk: string): 'danger' | 'warning' | 'success' | 'neutral' => {
    const r = risk.toLowerCase();
    if (r === 'high') return 'danger';
    if (r === 'moderate' || r === 'elevated') return 'warning';
    if (r === 'low' || r === 'normal') return 'success';
    return 'neutral';
  };

  return (
    <Card className="border-emerald-200/90 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50/30 via-white to-emerald-50/10 dark:from-[#122218] dark:via-[#16201a] dark:to-[#122218] p-6 sm:p-7 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 dark:border-emerald-950 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center ring-1 ring-emerald-500/20 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                🌾 Farm AI Analysis
              </h3>
              <Badge variant={getRiskVariant(riskLevel)}>
                {riskLevel} Risk
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Correlated AI diagnosis with hyper-local agro-meteorological telemetry
            </p>
          </div>
        </div>

        {weatherSummary && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#152019] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{weatherSummary.location || 'Local Weather'}:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">
              {weatherSummary.currentTemp}°C, {weatherSummary.condition}
            </span>
          </div>
        )}
      </div>

      {/* Disease + Weather Context Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#142019] border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Disease Detected
          </span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
            {disease}
          </p>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {confidence}% confidence
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#142019] border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Weather Context
          </span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            {weatherSummary?.humidity || 70}% Humidity
          </p>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Rain Chance: {weatherSummary?.rainProbability || 0}%
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#142019] border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Weather Risk Level
          </span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-amber-500" />
            {weatherRisk}
          </p>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Wind: {weatherSummary?.windSpeedKmH || 10} km/h
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#142019] border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Field Action Urgency
          </span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            {riskLevel === 'High' ? 'Immediate Monitoring' : 'Routine Scouting'}
          </p>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Preventive approach
          </span>
        </div>
      </div>

      {/* Advisory Narrative Box */}
      <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50">
        <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
          <Wheat className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Agronomic Advisory
        </h4>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-2 leading-relaxed">
          {advisory}
        </p>
      </div>

      {/* Weather Factors Considered */}
      {weatherFactors && weatherFactors.length > 0 && (
        <div>
          <h4 className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
            Key Environmental Factors Considered:
          </h4>
          <div className="flex flex-wrap gap-2">
            {weatherFactors.map((factor, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/60"
              >
                • {factor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Practical Actions */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <ListChecks className="w-4 h-4 text-emerald-600" />
          Recommended Preventive Actions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {actions.map((act, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#142019] border border-slate-200/70 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span className="leading-relaxed">{act}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
