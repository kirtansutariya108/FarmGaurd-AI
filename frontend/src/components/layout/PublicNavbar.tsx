import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';
import { useApp } from '../../hooks/useFarmContext';
import { Sun, Moon, Globe, Menu, X, ArrowRight } from 'lucide-react';
import { LanguageCode } from '../../locales';

export const PublicNavbar: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage, t } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.features, path: '/features' },
    { label: t.nav.howItWorks, path: '/how-it-works' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.contact, path: '/contact' },
  ];

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as LanguageCode);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-[#223326]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Logo size="md" showTagline={false} />
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors duration-150 ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Switchers */}
        <div className="hidden md:flex items-center gap-3.5">
          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <select
              value={language}
              onChange={handleLangChange}
              className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="dark:bg-slate-900">EN (English)</option>
              <option value="hi" className="dark:bg-slate-900">HI (हिन्दी)</option>
              <option value="gu" className="dark:bg-slate-900">GU (ગુજરાતી)</option>
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

          {/* Auth buttons */}
          <Link to="/login">
            <Button variant="ghost" size="sm">
              {t.nav.login}
            </Button>
          </Link>

          <Link to="/app/dashboard">
            <Button size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Open Demo App
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open mobile menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-[#223326] bg-white dark:bg-[#121a14] px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <nav className="space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Language
              </span>
              <select
                value={language}
                onChange={handleLangChange}
                className="bg-transparent text-xs font-semibold focus:outline-none"
              >
                <option value="en" className="dark:bg-slate-900">English</option>
                <option value="hi" className="dark:bg-slate-900">हिन्दी</option>
                <option value="gu" className="dark:bg-slate-900">ગુજરાતી</option>
              </select>
            </div>

            <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full">
              <Button variant="outline" className="w-full" size="md">
                {t.nav.login}
              </Button>
            </Link>

            <Link to="/app/dashboard" onClick={() => setMobileOpen(false)} className="w-full">
              <Button className="w-full" size="md">
                Open Demo Application
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
