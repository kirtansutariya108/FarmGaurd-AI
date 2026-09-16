import React from 'react';
import { useApp } from '../../hooks/useFarmContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LanguageCode, languageNames } from '../../locales';
import { 
  Settings, 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  Sliders, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, language, setLanguage, user, updateUser } = useApp();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-emerald-600" />
          Application Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize language, visual theme, measurement units, and alert notifications
        </p>
      </div>

      {/* 1. Language Preferences */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Multilingual Localization</h3>
            <p className="text-xs text-slate-500">Choose your preferred agricultural interface language</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {(Object.keys(languageNames) as LanguageCode[]).map(langKey => {
            const isSelected = language === langKey;
            const info = languageNames[langKey];
            return (
              <button
                key={langKey}
                onClick={() => setLanguage(langKey)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{info.nativeName}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="text-xs text-slate-500 block mt-1">{info.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 2. Visual Theme (Dark/Light) */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Appearance & Theme Mode</h3>
            <p className="text-xs text-slate-500">Switch between light farm aesthetic and deep dark cockpit mode</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              theme === 'light'
                ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Light Theme</span>
              {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <span className="text-xs text-slate-500 block mt-1">Warm off-white neutral</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              theme === 'dark'
                ? 'border-emerald-600 bg-emerald-950/60 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-100">Dark Cockpit Theme</span>
              {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <span className="text-xs text-slate-400 block mt-1">Agricultural night contrast</span>
          </button>
        </div>
      </Card>

      {/* 3. Measurement Units */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Measurement Units</h3>
            <p className="text-xs text-slate-500">Temperature, soil dampness, and land parcel area units</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-emerald-500/60">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">Metric (°C, Acres, km/h)</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Standard Indian Agriculture calibration</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 opacity-60">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Imperial (°F, Acres, mph)</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Optional overseas mode</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
