import React from 'react';
import { Card } from '../common/Card';
import { ForecastDay } from '../../types/weather';
import { CloudSun, Sun, CloudRain, CloudLightning, CloudDrizzle, Snowflake, CloudFog, Cloud, Droplets } from 'lucide-react';

interface ForecastListProps {
  forecast: ForecastDay[];
}

export const ForecastList: React.FC<ForecastListProps> = ({ forecast }) => {
  const getIcon = (iconName: string) => {
    const icon = iconName.toLowerCase();
    if (icon.includes('lightning') || icon.includes('thunder')) {
      return <CloudLightning className="w-6 h-6 text-amber-500" />;
    }
    if (icon.includes('drizzle')) {
      return <CloudDrizzle className="w-6 h-6 text-cyan-400" />;
    }
    if (icon.includes('rain') || icon.includes('shower')) {
      return <CloudRain className="w-6 h-6 text-cyan-500" />;
    }
    if (icon.includes('snow')) {
      return <Snowflake className="w-6 h-6 text-blue-300" />;
    }
    if (icon.includes('fog')) {
      return <CloudFog className="w-6 h-6 text-slate-400" />;
    }
    if (icon === 'sun' || icon.includes('clear')) {
      return <Sun className="w-6 h-6 text-amber-500" />;
    }
    if (icon === 'cloud' || icon.includes('overcast')) {
      return <Cloud className="w-6 h-6 text-slate-400" />;
    }
    return <CloudSun className="w-6 h-6 text-amber-400" />;
  };

  const daysCount = forecast.length || 7;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {daysCount}-Day Agricultural Weather Outlook
          </h3>
          <p className="text-xs text-slate-400">
            Open-Meteo precipitation volume, rain probability, and diurnal thermal spread
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
          7-Day Forecast
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {forecast.map((day, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all ${
              idx === 0
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800 shadow-xs'
                : 'bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                {day.dayName}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {day.date}
              </span>
            </div>

            <div className="my-2.5 flex items-center justify-center">
              {getIcon(day.icon)}
            </div>

            <div className="space-y-1 w-full">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {day.tempMax}° / <span className="text-slate-400 font-normal">{day.tempMin}°</span>
              </div>
              
              <div className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-0.5">
                <CloudRain className="w-3 h-3" /> {day.rainProbability}%
              </div>

              {day.precipitationMm !== undefined && day.precipitationMm > 0 && (
                <div className="text-[9px] font-medium text-slate-500 dark:text-slate-400">
                  {day.precipitationMm} mm
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
