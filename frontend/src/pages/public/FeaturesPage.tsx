import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { 
  ScanSearch, 
  Droplets, 
  CloudSun, 
  Activity, 
  ListChecks, 
  History, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: ScanSearch,
      color: 'emerald',
      title: 'AI Crop Disease Detection',
      tagline: 'Deep leaf vision with softmax confidence distributions',
      desc: 'Upload leaf photos from mobile or desktop. The model detects visual anomalies, categorizes conditions (e.g. Early Blight, Late Blight, Septoria), and flags low-confidence or healthy foliage.',
      points: [
        'Multi-class probability ranking',
        'Built-in low confidence safeguard',
        'Curated image quality diagnostics'
      ]
    },
    {
      icon: Droplets,
      color: 'blue',
      title: 'Smart Irrigation Advisor',
      tagline: 'Moisture thresholds + growth stages + weather forecast',
      desc: 'Never irrigate blindly. FarmGuard calculates whether watering is Recommended Soon, Not Needed, or Monitoring based on root depth, recent rainfall, and ambient heat.',
      points: [
        'Growth-stage specific moisture bounds',
        'Rain forecast cross-checking',
        'Interactive field reading updates'
      ]
    },
    {
      icon: CloudSun,
      color: 'amber',
      title: 'Weather-Aware Insights',
      tagline: '5-Day agricultural forecast and rain probability alerts',
      desc: 'Local microclimate tracking tailored to farm coordinates. View temperature curves, relative humidity, wind speed for spraying, and impending rain windows.',
      points: [
        'Agricultural telemetry synthesis',
        'Spray window recommendations',
        'Microclimate anomaly tracking'
      ]
    },
    {
      icon: Activity,
      color: 'purple',
      title: 'Crop Health Index',
      tagline: 'Holistic 0-100 score synthesized from multiple field signals',
      desc: 'A project-specific decision-support metric that tracks overall health stability, water stress, and pathogen vulnerability over the lifecycle of your crop.',
      points: [
        'Visual health progress ring',
        'Multi-farm portfolio comparison',
        'Lifecycle trend tracking'
      ]
    },
    {
      icon: ListChecks,
      color: 'emerald',
      title: 'Actionable Farm Recommendations',
      tagline: 'Transforms raw telemetry into prioritized farm tasks',
      desc: 'Instead of confusing charts, get clear, categorized action items sorted by urgency (Urgent, Today, Monitor, Completed) to organize daily field labor.',
      points: [
        'One-click task execution links',
        'Prioritized triage workflow',
        'Completed task audit trails'
      ]
    },
    {
      icon: History,
      color: 'blue',
      title: 'Comprehensive Scan History',
      tagline: 'Historical visual archive of every leaf inspection',
      desc: 'Review past crop scans, track how symptoms evolved over weeks, and maintain transparent records for agricultural specialists or insurance audits.',
      points: [
        'Filterable by crop & status',
        'Historical image gallery',
        'Diagnostic comparison views'
      ]
    }
  ];

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          Complete Feature Suite
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Engineered for modern agricultural decision support
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Explore how FarmGuard AI combines computer vision, field sensors, and weather forecasting into an indispensable farm management platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <Card key={idx} hoverable className="p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center ring-1 ring-emerald-500/20">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{f.tagline}</p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {f.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Trust Callout */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Scientifically Responsible UX</span>
          </div>
          <h3 className="text-xl font-bold">Ready to see it in action?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Experience our complete workflow directly in demo mode without creating an account.
          </p>
        </div>
        <Link to="/app/dashboard">
          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold">
            Launch Prototype App
          </Button>
        </Link>
      </div>
    </div>
  );
};
