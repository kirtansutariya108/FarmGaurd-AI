import React from 'react';
import { Card } from '../common/Card';
import { IrrigationRecommendation } from '../../types/irrigation';
import { Droplets, Thermometer, CloudRain, Calendar, Wind, Sprout } from 'lucide-react';

interface ConditionMetricsProps {
  signals: IrrigationRecommendation['fieldSignals'];
}

export const ConditionMetrics: React.FC<ConditionMetricsProps> = ({ signals }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Target Crop */}
      <Card padded={false} className="p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-emerald-600">
          <Sprout className="w-4 h-4" />
          <span className="text-[10px] text-slate-400 font-bold uppercase">Crop</span>
        </div>
        <div className="mt-2">
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
            {signals.crop}
          </span>
          <span className="text-[11px] text-slate-400 truncate block">
            {signals.growthStage}
          </span>
        </div>
      </Card>

      {/* 2. Soil Moisture */}
      <Card padded={false} className="p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-blue-500">
          <Droplets className="w-4 h-4" />
          <span className="text-[10px] text-slate-400 font-bold uppercase">Soil Moisture</span>
        </div>
        <div className="mt-2">
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {signals.soilMoisture !== null ? `${signals.soilMoisture}%` : 'N/A'}
          </span>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 block font-medium">
            {signals.soilMoisture !== null && signals.soilMoisture < 35 ? 'Low Threshold' : 'Buffer OK'}
          </span>
        </div>
      </Card>

      {/* 3. Temperature */}
      <Card padded={false} className="p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-amber-500">
          <Thermometer className="w-4 h-4" />
          <span className="text-[10px] text-slate-400 font-bold uppercase">Temperature</span>
        </div>
        <div className="mt-2">
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {signals.temperature}°C
          </span>
          <span className="text-[11px] text-slate-400 block">
            Ambient field air
          </span>
        </div>
      </Card>

      {/* 4. Humidity */}
      <Card padded={false} className="p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-cyan-500">
          <Wind className="w-4 h-4" />
          <span className="text-[10px] text-slate-400 font-bold uppercase">Humidity</span>
        </div>
        <div className="mt-2">
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {signals.humidity}%
          </span>
          <span className="text-[11px] text-slate-400 block">
            Relative humidity
          </span>
        </div>
      </Card>

      {/* 5. Rain Probability */}
      <Card padded={false} className="p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-indigo-500">
          <CloudRain className="w-4 h-4" />
          <span className="text-[10px] text-slate-400 font-bold uppercase">Rain Prob</span>
        </div>
        <div className="mt-2">
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {signals.rainProbability}%
          </span>
          <span className="text-[11px] text-slate-400 block">
            Next 24 hours
          </span>
        </div>
      </Card>

      {/* 6. Last Irrigation */}
      <Card padded={false} className="p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-purple-500">
          <Calendar className="w-4 h-4" />
          <span className="text-[10px] text-slate-400 font-bold uppercase">Last Watered</span>
        </div>
        <div className="mt-2">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {signals.lastIrrigationDaysAgo !== null ? `${signals.lastIrrigationDaysAgo} days ago` : 'Unknown'}
          </span>
          <span className="text-[11px] text-slate-400 block">
            Cycle interval
          </span>
        </div>
      </Card>
    </div>
  );
};
