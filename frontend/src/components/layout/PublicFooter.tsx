import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <Logo size="md" showTagline={false} className="text-white" />
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered agriculture decision support that transforms field signals and crop imagery into timely, actionable farming decisions.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Farming Prototype</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product & Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/features" className="hover:text-emerald-400 transition-colors">AI Crop Disease Scanner</Link></li>
              <li><Link to="/features" className="hover:text-emerald-400 transition-colors">Smart Irrigation Advisor</Link></li>
              <li><Link to="/features" className="hover:text-emerald-400 transition-colors">Weather-Aware Intelligence</Link></li>
              <li><Link to="/features" className="hover:text-emerald-400 transition-colors">Crop Health Score</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company & Impact</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About FarmGuard AI</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Farmer Safety Principles</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Hackathon Presentation</Link></li>
            </ul>
          </div>

          {/* Column 4: Trust & Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Trust & Responsibility
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              FarmGuard AI provides decision-support insights and recommendations based on computer vision heuristics and weather signals. It does not replace professional on-ground agronomic certification.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 FarmGuard AI Technologies. Built for sustainable agriculture.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-400">Terms of Service</Link>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> for Farmers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
