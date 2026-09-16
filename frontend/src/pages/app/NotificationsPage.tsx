import React, { useState } from 'react';
import { initialMockNotifications } from '../../data/mockNotifications';
import { FarmNotification } from '../../types/history';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  ScanSearch, 
  CloudRain, 
  Droplets, 
  Activity, 
  CheckCheck, 
  ArrowRight 
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<FarmNotification[]>(initialMockNotifications);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'scanner':
        return <ScanSearch className="w-5 h-5 text-rose-500" />;
      case 'weather':
        return <CloudRain className="w-5 h-5 text-cyan-500" />;
      case 'irrigation':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      default:
        return <Activity className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Bell className="w-7 h-7 text-emerald-600" />
              Notifications & Farm Alerts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time triggers for crop diseases, upcoming weather shifts, and irrigation windows
          </p>
        </div>

        <Button
          onClick={markAllAsRead}
          variant="outline"
          size="sm"
          icon={<CheckCheck className="w-4 h-4" />}
        >
          Mark All as Read
        </Button>
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {notifications.map(n => (
          <Card
            key={n.id}
            hoverable
            className={`p-5 flex items-start gap-4 transition-all ${
              n.isRead ? 'opacity-70 bg-white dark:bg-[#152019]' : 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200/70 dark:border-emerald-900/40'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#121a14] border border-slate-200/80 dark:border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              {getIcon(n.category)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h3>
                <span className="text-[11px] text-slate-400">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {n.message}
              </p>

              {n.linkUrl && (
                <div className="pt-2">
                  <Link to={n.linkUrl} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
                    Inspect Alert <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
