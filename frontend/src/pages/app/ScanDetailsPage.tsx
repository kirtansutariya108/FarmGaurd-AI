import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockDiseaseService } from '../../services/mockDiseaseService';
import { historyService } from '../../services/historyService';
import { DiseaseResult } from '../../types/disease';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { PredictionBreakdown } from '../../components/disease/PredictionBreakdown';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Bookmark, 
  ScanSearch, 
  Sparkles, 
  ShieldCheck
} from 'lucide-react';

export const ScanDetailsPage: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<DiseaseResult | null>(null);

  useEffect(() => {
    if (scanId) {
      const localDetail = historyService.getScanDetailById(scanId);
      if (localDetail) {
        setResult(localDetail);
      } else {
        mockDiseaseService.getScanResultById(scanId).then(r => setResult(r));
      }
    }
  }, [scanId]);

  if (!result) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Loading scan details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/app/history">
            <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to History
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Scan Record: {result.id}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {result.cropName} Foliage • Scanned on {result.scannedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/app/scanner">
            <Button size="sm" icon={<ScanSearch className="w-4 h-4" />}>
              Scan Again
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Inspection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Large Image */}
        <div>
          <Card padded={false} className="overflow-hidden rounded-3xl sticky top-20">
            <img
              src={result.imageUrl}
              alt={result.cropName}
              className="w-full h-80 object-cover"
            />
            <div className="p-4 space-y-2 bg-white dark:bg-[#152019]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{result.cropName}</span>
                <Badge variant={result.isHealthy ? 'success' : 'danger'}>{result.status}</Badge>
              </div>
              <p className="text-xs text-slate-500">
                Logged under {result.farmName || 'Green Valley Farm'}
              </p>
            </div>
          </Card>
        </div>

        {/* Right 2 cols: Findings, Softmax & Action Steps */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Diagnosis</span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {result.primaryCondition}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {result.confidence}%
                </span>
                <span className="text-xs text-slate-400 block">Confidence</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Visual Findings
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                {result.visualFindings}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-500 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                Safety Principle: Diagnostic indications serve as an early-alert tool. Verify with local agricultural authorities if symptoms intensify.
              </span>
            </div>
          </Card>

          {/* Predictions Breakdown */}
          <PredictionBreakdown predictions={result.topPredictions} />

          {/* Recommended Next Steps */}
          <Card className="p-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recommended Next Steps
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {result.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
