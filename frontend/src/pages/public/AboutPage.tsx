import React from 'react';
import { Card } from '../../components/common/Card';
import { ShieldCheck, Heart, Leaf, Target, Users, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          Our Mission & Ethics
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Empowering smallholder and commercial farmers with trustworthy AI
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          FarmGuard AI was founded on a simple premise: advanced agricultural intelligence should be accessible, transparent, and focused on practical decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Sustainable Yields</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Reducing water waste and crop damage through early detection and precise decision support.
          </p>
        </Card>

        <Card className="p-6 space-y-3 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Trust & Honesty</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No exaggerated "100% accuracy" claims. We present clear confidence scores and low-confidence warnings.
          </p>
        </Card>

        <Card className="p-6 space-y-3 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Farmer Centric</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Designed for real field conditions with multilingual support in English, Hindi, and Gujarati.
          </p>
        </Card>
      </div>

      <Card className="p-8 space-y-4 bg-emerald-900 text-white border-0">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Award className="w-6 h-6 text-lime-300" />
          Hackathon & Prototype Context
        </h3>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          FarmGuard AI is presented as a high-fidelity frontend prototype engineered to demonstrate future integration with FastAPI microservices, MobileNetV2 vision models, MySQL databases, and IoT soil moisture telemetry.
        </p>
      </Card>
    </div>
  );
};
