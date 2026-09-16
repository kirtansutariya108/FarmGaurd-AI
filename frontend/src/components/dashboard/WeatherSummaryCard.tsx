import React from 'react';
import { Card } from '../common/Card';
import { WeatherData } from '../../types/weather';
import { CloudSun, Droplets, Wind, CloudRain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WeatherSummaryCardProps {
  weather: WeatherData;
}

export const WeatherSummaryCard: React.FC<WeatherSummaryCardProps> = ({ weather }) => {
  return (
    <Card hoverable className="relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Local Weather</h3>
        </div>
        <Link to="/app/weather" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
          Forecast <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="my-4 flex items-center justify-between">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {weather.currentTemp}°C
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            {weather.condition} • {weather.location}
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center ring-1 ring-amber-500/20">
          <CloudSun className="w-8 h-8" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center justify-center text-blue-500 mb-1">
            <Droplets className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] text-slate-400">Humidity</span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{weather.humidity}%</p>
        </div>

        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center justify-center text-cyan-500 mb-1">
            <CloudRain className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] text-slate-400">Rain Prob</span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{weather.rainProbability}%</p>
        </div>

        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center justify-center text-emerald-500 mb-1">
            <Wind className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] text-slate-400">Wind</span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{weather.windSpeedKmH} km/h</p>
        </div>
      </div>
    </Card>
  );
};
