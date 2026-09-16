import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Link } from 'react-router-dom';
import { ScanSearch, Droplets, CloudSun, PlusCircle } from 'lucide-react';
import { useApp } from '../../hooks/useFarmContext';

export const QuickActions: React.FC = () => {
  const { t } = useApp();

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.dashboard.quickActions}</h3>
        <span className="text-[11px] text-slate-400">Core workflows</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/app/scanner">
          <Button 
            variant="primary" 
            className="w-full h-full flex flex-col items-center justify-center p-3 text-center gap-2"
          >
            <ScanSearch className="w-5 h-5" />
            <span className="text-xs font-bold">{t.dashboard.scanCrop}</span>
          </Button>
        </Link>

        <Link to="/app/irrigation">
          <Button 
            variant="secondary" 
            className="w-full h-full flex flex-col items-center justify-center p-3 text-center gap-2"
          >
            <Droplets className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold">{t.dashboard.checkIrrigation}</span>
          </Button>
        </Link>

        <Link to="/app/weather">
          <Button 
            variant="outline" 
            className="w-full h-full flex flex-col items-center justify-center p-3 text-center gap-2"
          >
            <CloudSun className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold">{t.dashboard.viewWeather}</span>
          </Button>
        </Link>

        <Link to="/app/farms">
          <Button 
            variant="outline" 
            className="w-full h-full flex flex-col items-center justify-center p-3 text-center gap-2"
          >
            <PlusCircle className="w-5 h-5 text-slate-500" />
            <span className="text-xs font-bold">Register Farm</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
};
