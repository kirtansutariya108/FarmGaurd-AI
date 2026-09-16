import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { PredictionBreakdown } from './PredictionBreakdown';
import { LowConfidenceCard } from './LowConfidenceCard';
import { HealthyResultCard } from './HealthyResultCard';
import { FarmIntelligenceCard } from './FarmIntelligenceCard';
import { DiseaseResult } from '../../types/disease';
import { FarmIntelligenceData } from '../../types/intelligence';
import { farmIntelligenceService } from '../../services/farmIntelligenceService';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Bookmark, 
  ScanSearch, 
  Activity,
  ListFilter
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DiseaseResultCardProps {
  result: DiseaseResult;
  onScanAnother: () => void;
}

export const DiseaseResultCard: React.FC<DiseaseResultCardProps> = ({ result, onScanAnother }) => {
  const [saved, setSaved] = useState(false);
  const [intelligence, setIntelligence] = useState<FarmIntelligenceData | null>(null);
  const [isLoadingIntelligence, setIsLoadingIntelligence] = useState(false);
  const [intelligenceError, setIntelligenceError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFarmIntelligence() {
      if (!result || result.isLowConfidence) return;

      setIsLoadingIntelligence(true);
      setIntelligenceError(null);

      // Attempt to get user's current GPS location if available
      let lat: number | undefined = undefined;
      let lng: number | undefined = undefined;

      if ('geolocation' in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 4000,
              maximumAge: 300000,
            });
          });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch {
          // Geolocation denied or timed out; will use default farm regional context
        }
      }

      try {
        const intel = await farmIntelligenceService.getFarmIntelligence({
          disease: result.primaryCondition,
          confidence: result.confidence,
          latitude: lat,
          longitude: lng,
          city: result.farmName ? undefined : 'Vadodara'
        });

        if (isMounted) {
          setIntelligence(intel);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('Could not load farm intelligence:', err);
          setIntelligenceError('Farm intelligence is temporarily unavailable.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingIntelligence(false);
        }
      }
    }

    loadFarmIntelligence();

    return () => {
      isMounted = false;
    };
  }, [result]);

  if (result.isLowConfidence) {
    return <LowConfidenceCard result={result} onRetake={onScanAnother} />;
  }

  if (result.isHealthy) {
    return <HealthyResultCard result={result} onScanAnother={onScanAnother} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Alert Card */}
      <Card className="border-rose-200 dark:border-rose-900/60 bg-gradient-to-br from-white via-rose-50/20 to-white dark:from-[#16221b] dark:via-[#201519] dark:to-[#16221b] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 dark:border-rose-950 pb-5">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center ring-1 ring-rose-500/20 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {result.cropName} Foliage
                </span>
                <Badge variant="danger">{result.status}</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
                {result.primaryCondition}
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Diagnostic Confidence
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                {result.confidence}%
              </span>
              <span className="text-xs font-semibold text-slate-400">softmax</span>
            </div>
          </div>
        </div>

        {/* Scan Information & Context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Scanned Image Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-52">
            <img
              src={result.imageUrl}
              alt="Scanned leaf"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/75 text-white px-2 py-0.5 rounded backdrop-blur-xs">
              Scanned: {result.scannedAt}
            </div>
          </div>

          {/* Visual Findings */}
          <div className="md:col-span-2 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                What We Found
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1.5 leading-relaxed bg-white dark:bg-[#121c15] p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                {result.visualFindings}
              </p>
            </div>

            {/* Safety notice */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                Safety Principle: FarmGuard AI does not prescribe chemical dosage rates. Consult an authorized agronomic specialist before application.
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Farm AI Analysis (Disease + Weather Intelligence Layer) */}
      <FarmIntelligenceCard
        intelligence={intelligence}
        isLoading={isLoadingIntelligence}
        error={intelligenceError}
      />

      {/* Probability Breakdown & Next Steps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Softmax predictions breakdown */}
        <PredictionBreakdown predictions={result.topPredictions} />

        {/* Recommended Next Steps */}
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ListFilter className="w-4 h-4 text-emerald-600" />
              Recommended Field Actions
            </h4>
            <span className="text-[10px] text-slate-400">Step-by-step triage</span>
          </div>

          <ul className="space-y-2.5">
            {result.nextSteps.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#152019] border border-slate-200 dark:border-[#223326]">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setSaved(!saved)}
            variant={saved ? 'primary' : 'outline'}
            size="sm"
            icon={<Bookmark className="w-4 h-4" />}
          >
            {saved ? 'Saved to Scan History' : 'Save Result'}
          </Button>
          <Button
            onClick={onScanAnother}
            variant="ghost"
            size="sm"
            icon={<ScanSearch className="w-4 h-4" />}
          >
            Scan Another Crop
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/app/recommendations">
            <Button size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              View Actionable Plan
            </Button>
          </Link>
          <Link to="/app/crop-health">
            <Button variant="secondary" size="sm" icon={<Activity className="w-4 h-4" />}>
              Impact on Farm Score
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
