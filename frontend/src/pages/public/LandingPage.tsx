import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { HealthRing } from '../../components/common/HealthRing';
import { 
  ScanSearch, 
  Droplets, 
  CloudSun, 
  Activity, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  BarChart3, 
  Smartphone,
  Cpu,
  Sprout
} from 'lucide-react';
import { useApp } from '../../hooks/useFarmContext';

export const LandingPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-fade-in shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.brand.badge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Turn crop images into <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-500 dark:from-emerald-400 dark:to-green-300">
              smarter farm decisions.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            FarmGuard AI helps farmers monitor crop health, identify possible leaf diseases, understand field conditions, and make data-driven irrigation decisions.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link to="/app/dashboard">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Start Monitoring (Demo App)
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                Explore How It Works
              </Button>
            </Link>
          </div>

          {/* Trust Guarantee note */}
          <p className="text-xs text-slate-400 dark:text-slate-500 pt-2">
            No fake accuracy guarantees • Built for actionable decision-support
          </p>
        </div>

        {/* Hero Interactive Mock Preview */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-slate-200/80 to-slate-100/30 dark:from-[#24382c] dark:to-[#121c15] shadow-2xl border border-slate-300/80 dark:border-[#2a4032]">
          <div className="rounded-2xl bg-white dark:bg-[#152019] border border-slate-200 dark:border-[#223326] p-5 sm:p-7 shadow-inner space-y-6">
            {/* Mock Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Green Valley Farm — Tomato Parcel</span>
                  <p className="text-[11px] text-slate-400">Vadodara, Gujarat • 2.5 Acres</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Active Health Sentinel</Badge>
                <span className="text-xs text-slate-400">Live Simulation</span>
              </div>
            </div>

            {/* Mock Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">Crop Health</span>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">82 / 100</div>
                <span className="text-[11px] text-slate-400">Optimal Buffer</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">Disease Risk</span>
                <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">Low</div>
                <span className="text-[11px] text-emerald-600">Scan: Today</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">Soil Moisture</span>
                <div className="text-2xl font-extrabold text-amber-600 mt-1">32%</div>
                <span className="text-[11px] text-amber-600">Approaching limit</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">Irrigation Advice</span>
                <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">Soon</div>
                <span className="text-[11px] text-blue-500">Drip recommended</span>
              </div>
            </div>

            {/* Mock AI Insight Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-emerald-900 dark:text-emerald-200">AI Farm Insight: </span>
                <span className="text-slate-700 dark:text-slate-300">
                  "Your latest Tomato leaf scan looks healthy, while soil moisture is approaching the lower range (32%). Rain is possible tomorrow (30%); inspect field moisture before starting the next morning pump cycle."
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Why FarmGuard AI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            Farm decisions shouldn't rely on guesswork.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Modern agriculture requires connecting visible foliage symptoms with root moisture and upcoming weather.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable className="p-7 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center ring-1 ring-rose-500/20">
              <ScanSearch className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Foliage Symptom Blindspots</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Early-stage fungal blight and bacterial spot often spread undetected until yield is lost. Fast visual diagnosis protects crop value.
            </p>
          </Card>

          <Card hoverable className="p-7 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center ring-1 ring-blue-500/20">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Water Waste & Over-Irrigation</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Irrigating without soil and weather context risks root rot, disease acceleration, and wasted pump electricity.
            </p>
          </Card>

          <Card hoverable className="p-7 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center ring-1 ring-amber-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unclear Action Steps</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Complex telemetry graphs are useless without simple, prioritized actions for farmers in the field.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. MULTI-SIGNAL SOLUTION SHOWCASE */}
      <section className="bg-slate-100/70 dark:bg-[#121c15] py-20 border-y border-slate-200/80 dark:border-[#223326]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              The Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              One platform. Multiple farm signals.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              We aggregate leaf pathology, soil metrics, and 5-day weather into synthesized advice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hoverable className="p-6 space-y-3 bg-white dark:bg-[#16221b]">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <ScanSearch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Disease Detection</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Upload a leaf image and receive instant multi-class condition classification with confidence breakdown.
              </p>
            </Card>

            <Card hoverable className="p-6 space-y-3 bg-white dark:bg-[#16221b]">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Irrigation Advisor</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Combines crop growth stage, soil dampness, and heat index to recommend precise watering windows.
              </p>
            </Card>

            <Card hoverable className="p-6 space-y-3 bg-white dark:bg-[#16221b]">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <CloudSun className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Weather Insights</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Understand how upcoming rain showers and wind speeds influence spray timing and field operations.
              </p>
            </Card>

            <Card hoverable className="p-6 space-y-3 bg-white dark:bg-[#16221b]">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Crop Health Index</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Track holistic 0-100 health trajectory over time across all registered crop parcels.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS WORKFLOW */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            How FarmGuard AI Works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            From field capture to execution in less than 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            { step: '01', title: 'Capture Leaf', desc: 'Take a clear smartphone photo of an affected or routine leaf in daylight.' },
            { step: '02', title: 'Analyze Signals', desc: 'AI analyzes visual patterns while cross-checking microclimate and soil data.' },
            { step: '03', title: 'Understand Diagnosis', desc: 'Review pathogen probability, confidence, and contextual risk factors.' },
            { step: '04', title: 'Take Action', desc: 'Execute clear next steps: irrigation adjustments, isolation, or expert consultation.' },
          ].map((item, idx) => (
            <Card key={idx} className="p-6 space-y-3 relative">
              <div className="text-2xl font-black text-emerald-700/30 dark:text-emerald-400/30 font-mono">
                {item.step}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-emerald-800 to-green-950 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start monitoring your farm smarter today.
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Test our prototype now with realistic crop leaf samples, mock telemetry, and instant decision synthesis.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link to="/app/scanner">
                <Button size="lg" className="bg-white text-emerald-950 hover:bg-emerald-50">
                  Try Crop Scanner Live
                </Button>
              </Link>
              <Link to="/app/dashboard">
                <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
                  Explore Full Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
