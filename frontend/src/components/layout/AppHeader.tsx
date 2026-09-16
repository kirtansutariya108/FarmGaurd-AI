import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useFarmContext';
import { initialMockNotifications } from '../../data/mockNotifications';
import { 
  Bell, 
  Sun, 
  Moon, 
  Globe, 
  MapPin, 
  ChevronDown, 
  Sparkles, 
  CheckCircle2, 
  LogOut,
  User as UserIcon,
  Settings,
  Layers
} from 'lucide-react';
import { LanguageCode } from '../../locales';

interface AppHeaderProps {
  onMobileMenuToggle: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onMobileMenuToggle }) => {
  const { 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    t, 
    farms, 
    selectedFarm, 
    setSelectedFarm,
    user,
    logout
  } = useApp();

  const navigate = useNavigate();
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialMockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#121c15]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-[#223326] px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile trigger & Farm Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle navigation"
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* Farm Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setFarmDropdownOpen(!farmDropdownOpen);
              setNotifDropdownOpen(false);
              setProfileDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {selectedFarm?.name || 'Select Farm'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                {selectedFarm?.location || 'Gujarat, India'}
              </p>
            </div>
          </button>

          {/* Farm Switcher Menu */}
          {farmDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#16221b] rounded-2xl border border-slate-200 dark:border-[#243729] shadow-xl p-2 z-50 animate-fade-in">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Switch Active Farm
              </div>
              <div className="space-y-1">
                {farms.map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFarm(f);
                      setFarmDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      selectedFarm?.id === f.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{f.name}</div>
                      <div className="text-[10px] text-slate-400">{f.crop} • {f.areaAcres} acres</div>
                    </div>
                    {selectedFarm?.id === f.id && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/app/farms"
                  onClick={() => setFarmDropdownOpen(false)}
                  className="block text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 py-1"
                >
                  + Manage All Farms
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Quick Tools, Notifications, Theme, Language & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language switch */}
        <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1 text-xs text-slate-700 dark:text-slate-300">
          <Globe className="w-3.5 h-3.5 mr-1 text-slate-400" />
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as LanguageCode)}
            className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
          >
            <option value="en" className="dark:bg-slate-900">EN</option>
            <option value="hi" className="dark:bg-slate-900">HI</option>
            <option value="gu" className="dark:bg-slate-900">GU</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setFarmDropdownOpen(false);
              setProfileDropdownOpen(false);
            }}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#16221b] rounded-2xl border border-slate-200 dark:border-[#243729] shadow-2xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-semibold text-emerald-600 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto my-2">
                {notifications.map(n => (
                  <div key={n.id} className={`py-2.5 px-2 rounded-xl transition-colors ${n.isRead ? 'opacity-80' : 'bg-emerald-50/50 dark:bg-emerald-950/30'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link
                  to="/app/notifications"
                  onClick={() => setNotifDropdownOpen(false)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setFarmDropdownOpen(false);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {user?.fullName?.charAt(0) || 'K'}
            </div>
            <span className="hidden md:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
              {user?.fullName?.split(' ')[0] || 'Farmer'}
            </span>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#16221b] rounded-2xl border border-slate-200 dark:border-[#243729] shadow-xl p-2 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.fullName || 'Farmer Kirtan'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'kirtan@farmguard.ai'}</p>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  to="/app/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  {t.nav.profile}
                </Link>
                <Link
                  to="/app/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  {t.nav.settings}
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t.nav.logout}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
