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
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Wheat,
  ListChecks,
  Eye,
  Shield,
  Info,
  CloudOff,
  Sun,
  Layers
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
      <Card className="p-6 sm:p-8 border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/30 via-white to-emerald-50/20 dark:from-[#132219] dark:via-[#16201a] dark:to-[#132219] animate-pulse space-y-5">
        <div className="flex items-center gap-3 border-b border-emerald-100 dark:border-emerald-950 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-200 dark:bg-emerald-900" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-emerald-200 dark:bg-emerald-800 rounded w-1/3" />
            <div className="h-3 bg-emerald-100 dark:bg-emerald-900 rounded w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="h-24 bg-slate-100 dark:bg-slate-800/80 rounded-2xl" />
          <div className="h-24 bg-slate-100 dark:bg-slate-800/80 rounded-2xl" />
          <div className="h-24 bg-slate-100 dark:bg-slate-800/80 rounded-2xl" />
        </div>
        <div className="h-20 bg-slate-100 dark:bg-slate-800/80 rounded-2xl" />
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
              {error || 'Farm intelligence advisory is temporarily unavailable. Primary diagnosis remains active above.'}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const {
    disease,
    crop = 'Crop',
    confidence,
    severity = 'moderate',
    summary,
    weatherRisk = 'MODERATE',
    weatherAvailable = false,
    riskFactors = [],
    immediateActions = [],
    monitoringActions = [],
    preventionActions = [],
    weatherAdvice = [],
    weatherSummary,
    disclaimer,
    advisory,
    actions = [],
    weatherFactors = []
  } = intelligence;

  // Derive active lists (combining structured lists with fallback arrays for maximum compatibility)
  const displaySummary = summary || advisory || 'AI decision support assessment synthesized with crop context.';
  const effectiveImmediateActions = immediateActions.length > 0 ? immediateActions : actions.slice(0, 4);
  const effectiveMonitoring = monitoringActions.length > 0 ? monitoringActions : [
    'Inspect surrounding foliage daily for lesion progression.',
    'Monitor after upcoming rain or high-humidity periods.',
    'Scout adjacent rows for early symptom spread.'
  ];
  const effectivePrevention = preventionActions.length > 0 ? preventionActions : [
    'Avoid unnecessary leaf wetness through base watering.',
    'Maintain appropriate crop spacing to promote canopy ventilation.',
    'Follow locally recommended preventive agronomic practices.'
  ];

  // Determine weather risk badge styling
  const upperWeatherRisk = (weatherRisk || 'MODERATE').toUpperCase();
  const getWeatherRiskBadge = () => {
    if (upperWeatherRisk === 'HIGH') return <Badge variant="danger">HIGH WEATHER RISK</Badge>;
    if (upperWeatherRisk === 'MODERATE') return <Badge variant="warning">MODERATE WEATHER RISK</Badge>;
    if (upperWeatherRisk === 'LOW') return <Badge variant="success">LOW WEATHER RISK</Badge>;
    return <Badge variant="neutral">WEATHER UNAVAILABLE</Badge>;
  };

  const getSeverityBadge = () => {
    const s = (severity || 'moderate').toLowerCase();
    if (s === 'high') return <Badge variant="danger">High Severity</Badge>;
    if (s === 'moderate') return <Badge variant="warning">Moderate Severity</Badge>;
    return <Badge variant="success">Low Severity</Badge>;
  };

  return (
    <Card className="border-emerald-200/90 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50/25 via-white to-emerald-50/15 dark:from-[#122218] dark:via-[#16201a] dark:to-[#122218] p-6 sm:p-8 shadow-sm space-y-7">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 dark:border-emerald-950 pb-5">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center ring-1 ring-emerald-500/20 flex-shrink-0 shadow-2xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Farmer Decision & Action Plan
              </h3>
              {getSeverityBadge()}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Correlated AI diagnosis with agronomic disease knowledge and hyper-local weather telemetry
            </p>
          </div>
        </div>

        {weatherSummary && weatherAvailable ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#152019] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500 dark:text-slate-400">{weatherSummary.location || 'Local Weather'}:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">
              {weatherSummary.currentTemp}°C, {weatherSummary.condition}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 self-start sm:self-auto">
            <CloudOff className="w-3.5 h-3.5 text-slate-400" />
            <span>Live Weather Offline</span>
          </div>
        )}
      </div>

      {/* SECTION A & B: AI DIAGNOSIS & WHAT THIS MEANS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Section A: AI Diagnosis Overview */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#142019] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wheat className="w-3.5 h-3.5 text-emerald-600" />
              A. AI Diagnosis
            </span>
            <div className="mt-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{crop}</span>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight mt-0.5">
                {disease}
              </h4>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Confidence:</span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {confidence}%
            </span>
          </div>
        </div>

        {/* Section B: What This Means */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              B. What This Means
            </span>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-2 leading-relaxed font-normal">
              {displaySummary}
            </p>
          </div>

          {riskFactors.length > 0 && (
            <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-900/60">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Key Risk Factors:
              </span>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {riskFactors.map((rf, idx) => (
                  <li
                    key={idx}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white/80 dark:bg-emerald-950/80 text-slate-700 dark:text-slate-300 border border-emerald-200/60 dark:border-emerald-800/60"
                  >
                    • {rf}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* SECTION C: CURRENT WEATHER RISK */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#142019] border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              C. Current Weather Risk Assessment
            </h4>
          </div>
          {getWeatherRiskBadge()}
        </div>

        {weatherAvailable && weatherSummary ? (
          <div className="space-y-3">
            {/* Real Telemetry Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Temperature</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  {weatherSummary.currentTemp !== undefined ? `${weatherSummary.currentTemp}°C` : '—'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Humidity</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  {weatherSummary.humidity !== undefined ? `${weatherSummary.humidity}%` : '—'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Rain Probability</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  {weatherSummary.rainProbability !== undefined ? `${weatherSummary.rainProbability}%` : '—'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Wind Speed</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  {weatherSummary.windSpeedKmH !== undefined ? `${weatherSummary.windSpeedKmH} km/h` : '—'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Precipitation</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  {weatherSummary.precipitationMm !== undefined ? `${weatherSummary.precipitationMm} mm` : '0.0 mm'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Condition</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate block">
                  {weatherSummary.condition || 'Clear'}
                </span>
              </div>
            </div>

            {/* Weather Advice Narrative */}
            {weatherAdvice.length > 0 && (
              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                {weatherAdvice.map((adv, idx) => (
                  <p key={idx} className="leading-relaxed font-medium">
                    {adv}
                  </p>
                ))}
              </div>
            )}

            {/* Weather factors analyzed */}
            {weatherFactors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {weatherFactors.map((wf, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300"
                  >
                    {wf}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-3">
            <CloudOff className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">Weather data unavailable</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Showing disease-based guidance only without environmental correlation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SECTION D, E, F: WHAT TO DO NOW, MONITOR, PREVENTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Section D: What To Do Now */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#142019] border border-emerald-200/70 dark:border-emerald-800/60 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-emerald-100 dark:border-emerald-950 pb-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              D. What To Do Now
            </h4>
          </div>
          <ul className="space-y-2">
            {effectiveImmediateActions.map((act, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 text-xs text-slate-800 dark:text-slate-200 border border-emerald-100/80 dark:border-emerald-900/40"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[9px] flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <span className="leading-relaxed font-medium">{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section E: What To Monitor */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#142019] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <Eye className="w-4 h-4 text-blue-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              E. What To Monitor
            </h4>
          </div>
          <ul className="space-y-2">
            {effectiveMonitoring.map((mon, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800"
              >
                <span className="text-blue-500 font-bold">•</span>
                <span className="leading-relaxed">{mon}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section F: Prevention */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#142019] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <Shield className="w-4 h-4 text-teal-600" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              F. Long-Term Prevention
            </h4>
          </div>
          <ul className="space-y-2">
            {effectivePrevention.map((prev, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800"
              >
                <span className="text-teal-600 font-bold">•</span>
                <span className="leading-relaxed">{prev}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SECTION G: IMPORTANT NOTE / SAFETY DISCLAIMER */}
      <div className="p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            G. Important Verification & Safety Note
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {disclaimer || (
              'This AI result is a decision-support indication based on the uploaded leaf photo and available environmental telemetry. Confirm uncertain cases with a qualified agricultural expert, especially before applying crop-protection products.'
            )}
          </p>
        </div>
      </div>
    </Card>
  );
};

