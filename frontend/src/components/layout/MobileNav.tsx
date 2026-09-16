import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../hooks/useFarmContext';
import { Logo } from '../common/Logo';
import { 
  X, 
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
  Activity 
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { t } = useApp();

  if (!isOpen) return null;

  const navItems = [
    { label: t.nav.dashboard, path: '/app/dashboard', icon: LayoutDashboard },
    { label: t.nav.cropScanner, path: '/app/scanner', icon: ScanSearch },
    { label: t.nav.cropHealth, path: '/app/crop-health', icon: Activity },
    { label: t.nav.irrigation, path: '/app/irrigation', icon: Droplets },
    { label: t.nav.weather, path: '/app/weather', icon: CloudSun },
    { label: t.nav.recommendations, path: '/app/recommendations', icon: ListChecks },
    { label: t.nav.myFarms, path: '/app/farms', icon: Sprout },
    { label: t.nav.history, path: '/app/history', icon: History },
    { label: t.nav.notifications, path: '/app/notifications', icon: Bell },
    { label: t.nav.profile, path: '/app/profile', icon: User },
    { label: t.nav.settings, path: '/app/settings', icon: Settings },
    { label: t.nav.help, path: '/app/help', icon: HelpCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-[#121a14] border-r border-slate-200 dark:border-[#223326] shadow-2xl z-10">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
