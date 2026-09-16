import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useFarmContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { WeatherSummaryCard } from '../../components/dashboard/WeatherSummaryCard';
import { CropHealthCard } from '../../components/dashboard/CropHealthCard';
import { AIFarmInsightCard } from '../../components/dashboard/AIFarmInsightCard';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { mockWeatherService } from '../../services/mockWeatherService';
import { WeatherData } from '../../types/weather';
import { mockWeatherData } from '../../data/mockWeather';
import { 
  Activity, 
  AlertTriangle, 
  Droplets, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { selectedFarm, t, user } = useApp();
  const [weather, setWeather] = useState<WeatherData>(mockWeatherData);

  useEffect(() => {
    mockWeatherService.getCurrentWeather(selectedFarm?.location).then(w => setWeather(w));
  }, [selectedFarm]);

  const activeFarm = selectedFarm || {
    id: 'farm-1',
    name: 'Green Valley Farm',
    location: 'Vadodara, Gujarat',
    crop: 'Tomato',
    healthScore: 82,
    soilMoisture: 32,
    diseaseRisk: 'Low',
    lastIrrigationDaysAgo: 2,
  };

  const getInsightText = () => {
    if (activeFarm.crop === 'Potato') {
      return `Your Potato crop in ${activeFarm.location} is in vegetative stage with healthy foliage (94/100). Moisture is optimal at 48%. No immediate irrigation required today.`;
    }
    return `Your latest ${activeFarm.crop} leaf scan looks healthy, while soil moisture is approaching the lower range (${activeFarm.soilMoisture}%). Rain is possible tomorrow (30%); inspect field conditions before the next irrigation cycle.`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Greeting & Active Farm Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.dashboard.greeting}, {user?.fullName?.split(' ')[0] || 'Farmer'} 👋
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {activeFarm.name}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {activeFarm.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Live Farm Cockpit
            </span>
          </div>
        </div>

        {/* Demo Mode Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multi-Signal Decision Mode</span>
        </div>
      </div>

      {/* 2. Top Statistics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <StatCard
          label={t.dashboard.cropHealth}
          value={activeFarm.healthScore}
          subvalue="/ 100"
          icon={Activity}
          variant="emerald"
          trend="Healthy baseline"
        />

        <StatCard
          label={t.dashboard.diseaseRisk}
          value={activeFarm.diseaseRisk}
          subvalue="Level"
          icon={AlertTriangle}
          variant="amber"
          trend="Last scan: Today"
        />

        <StatCard
          label={t.dashboard.soilMoisture}
          value={`${activeFarm.soilMoisture}%`}
          subvalue="Root Zone"
          icon={Droplets}
          variant="blue"
          trend={activeFarm.soilMoisture < 35 ? 'Approaching threshold' : 'Optimal'}
        />

        <StatCard
          label={t.dashboard.nextIrrigation}
          value={activeFarm.soilMoisture < 35 ? 'Soon' : '48h'}
          subvalue="Suggested"
          icon={Clock}
          variant="purple"
          trend="Drip window recommended"
        />
      </div>

      {/* 3. AI Farm Insight Banner */}
      <AIFarmInsightCard
        insightText={getInsightText()}
        farmName={activeFarm.name}
        crop={activeFarm.crop}
      />

      {/* 4. Core Diagnostic & Weather Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CropHealthCard score={activeFarm.healthScore} cropName={activeFarm.crop} />
        <WeatherSummaryCard weather={weather} />
      </div>

      {/* 5. Quick Actions Bar */}
      <QuickActions />

      {/* 6. Recent Activity & Diagnostics Feed */}
      <RecentActivity />

      {/* Bottom Trust Notice */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#152019] text-center text-[11px] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>
          {t.brand.disclaimer}
        </span>
      </div>
    </div>
  );
};
