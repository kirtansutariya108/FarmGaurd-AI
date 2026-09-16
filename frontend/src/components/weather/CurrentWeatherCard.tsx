import React from 'react';
import { Card } from '../common/Card';
import { WeatherData } from '../../types/weather';
import { CloudSun, Droplets, Wind, Sun, CloudRain, Thermometer, Radio, CloudLightning, CloudDrizzle, Snowflake, CloudFog, Cloud } from 'lucide-react';

interface CurrentWeatherCardProps {
  weather: WeatherData;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather }) => {
  const isLive = weather.source === 'open-meteo' || !weather.source || weather.source !== 'fallback';

  const getWeatherHeroIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('thunder') || c.includes('lightning') || c.includes('hail')) {
      return <CloudLightning className="w-9 h-9 text-amber-300 animate-pulse" />;
    }
    if (c.includes('drizzle')) {
      return <CloudDrizzle className="w-9 h-9 text-cyan-300" />;
    }
    if (c.includes('rain') || c.includes('shower')) {
      return <CloudRain className="w-9 h-9 text-cyan-300" />;
    }
    if (c.includes('snow')) {
      return <Snowflake className="w-9 h-9 text-blue-200" />;
    }
    if (c.includes('fog')) {
      return <CloudFog className="w-9 h-9 text-slate-300" />;
    }
    if (c.includes('clear') || c.includes('sun')) {
      return <Sun className="w-9 h-9 text-amber-400" />;
    }
    if (c.includes('overcast') || c.includes('cloud')) {
      return <Cloud className="w-9 h-9 text-slate-300" />;
    }
    return <CloudSun className="w-9 h-9 text-amber-300" />;
  };

  return (
    <Card className="p-6 sm:p-8 bg-gradient-to-br from-emerald-900 via-green-900 to-slate-900 text-white border-0 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Source & Location Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Field Microclimate Telemetry
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isLive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              {isLive ? 'Live Weather' : 'Weather service temporarily unavailable'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            {weather.location}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
            {weather.latitude !== undefined && weather.longitude !== undefined && (
              <span className="text-[11px] text-slate-400">
                GPS: {weather.latitude.toFixed(4)}° N, {weather.longitude.toFixed(4)}° E
              </span>
            )}
            <span className="text-[11px] text-slate-400">• Updated {weather.lastUpdated}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {weather.currentTemp}°C
            </div>
            <p className="text-xs font-semibold text-emerald-300 mt-0.5">
              {weather.condition}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20 shadow-inner">
            {getWeatherHeroIcon(weather.condition)}
          </div>
        </div>
      </div>

      {/* Grid of Microclimate Indices */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 relative z-10">
        <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
          <div className="flex items-center text-blue-300 gap-1.5 mb-1 text-xs font-medium">
            <Droplets className="w-4 h-4" />
            <span>Air Humidity</span>
          </div>
          <div className="text-lg sm:text-xl font-bold">{weather.humidity}%</div>
          <span className="text-[10px] text-slate-400">Optimum: 60-75%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
          <div className="flex items-center text-cyan-300 gap-1.5 mb-1 text-xs font-medium">
            <CloudRain className="w-4 h-4" />
            <span>Rain Probability</span>
          </div>
          <div className="text-lg sm:text-xl font-bold">{weather.rainProbability}%</div>
          <span className="text-[10px] text-slate-400">
            {weather.precipitationMm !== undefined ? `${weather.precipitationMm} mm rain` : 'Next 24h window'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
          <div className="flex items-center text-emerald-300 gap-1.5 mb-1 text-xs font-medium">
            <Wind className="w-4 h-4" />
            <span>Wind Speed</span>
          </div>
          <div className="text-lg sm:text-xl font-bold">{weather.windSpeedKmH} km/h</div>
          <span className="text-[10px] text-slate-400">
            {weather.windSpeedKmH < 15 ? 'Mild breeze' : weather.windSpeedKmH < 25 ? 'Moderate wind' : 'Strong wind'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
          <div className="flex items-center text-amber-300 gap-1.5 mb-1 text-xs font-medium">
            <Sun className="w-4 h-4" />
            <span>UV Index</span>
          </div>
          <div className="text-lg sm:text-xl font-bold">
            {weather.uvIndex}{' '}
            <span className="text-xs font-normal text-slate-300">
              ({weather.uvIndex < 3 ? 'Low' : weather.uvIndex < 6 ? 'Mod' : weather.uvIndex < 8 ? 'High' : 'Very High'})
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Solar radiation</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10 col-span-2 sm:col-span-1">
          <div className="flex items-center text-rose-300 gap-1.5 mb-1 text-xs font-medium">
            <Thermometer className="w-4 h-4" />
            <span>Soil Temp (0cm)</span>
          </div>
          <div className="text-lg sm:text-xl font-bold">{weather.soilTemp}°C</div>
          <span className="text-[10px] text-slate-400">Rootzone surface</span>
        </div>
      </div>
    </Card>
  );
};
