import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useApp } from '../../hooks/useFarmContext';
import { 
  LayoutDashboard, 
  Sprout, 
  ScanSearch, 
  Droplets, 
  CloudSun, 
  ListChecks, 
  History, 
  Bell, 
  Settings, 
  HelpCircle, 
  User, 
  Activity,
  Sparkles
} from 'lucide-react';

export const AppSidebar: React.FC = () => {
  const { t } = useApp();

  const mainNavItems = [
    { label: t.nav.dashboard, path: '/app/dashboard', icon: LayoutDashboard },
    { label: t.nav.cropScanner, path: '/app/scanner', icon: ScanSearch, isStar: true },
    { label: t.nav.cropHealth, path: '/app/crop-health', icon: Activity },
    { label: t.nav.irrigation, path: '/app/irrigation', icon: Droplets },
    { label: t.nav.weather, path: '/app/weather', icon: CloudSun },
    { label: t.nav.recommendations, path: '/app/recommendations', icon: ListChecks },
    { label: t.nav.myFarms, path: '/app/farms', icon: Sprout },
    { label: t.nav.history, path: '/app/history', icon: History },
  ];

  const secondaryNavItems = [
    { label: t.nav.notifications, path: '/app/notifications', icon: Bell },
    { label: t.nav.profile, path: '/app/profile', icon: User },
    { label: t.nav.settings, path: '/app/settings', icon: Settings },
    { label: t.nav.help, path: '/app/help', icon: HelpCircle },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#121a14] border-r border-slate-200/80 dark:border-[#223326] h-screen sticky top-0 flex-shrink-0 select-none z-30 transition-colors">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
        <Link to="/" className="block">
          <Logo size="md" showTagline={true} />
        </Link>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Decision Core
          </div>
          <nav className="space-y-1">
            {mainNavItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-900/20 dark:bg-emerald-600'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.isStar && (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400 text-amber-950">
                      <Sparkles className="w-2.5 h-2.5 inline" /> AI
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Account & Support
          </div>
          <nav className="space-y-1">
            {secondaryNavItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Trust & Safety badge bottom */}
      <div className="p-3 m-3 rounded-xl bg-slate-50 dark:bg-[#16221b] border border-slate-200/60 dark:border-slate-800/60 text-center">
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
          Decision Support Mode
        </p>
        <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
          Calibrated for Tomato, Potato & Pepper
        </p>
      </div>
    </aside>
  );
};
