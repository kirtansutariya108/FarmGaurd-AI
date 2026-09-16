import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Camera, 
  Brain, 
  Droplets, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Add Your Farm & Crops',
      desc: 'Register your land parcel, location coordinates, crop type (e.g. Tomato, Potato, Bell Pepper), soil texture, and current growth stage.',
      icon: Sprout,
    },
    {
      num: '02',
      title: 'Scan Your Crop Leaf',
      desc: 'Use your smartphone camera or upload a clear photo of an affected foliage leaf in natural lighting conditions.',
      icon: Camera,
    },
    {
      num: '03',
      title: 'AI Visual & Signal Analysis',
      desc: 'Our deep learning vision model analyzes lesion shape, color, and texture, while background services pull microclimate weather and moisture buffers.',
      icon: Brain,
    },
    {
      num: '04',
      title: 'Review Field Conditions',
      desc: 'Cross-reference disease probability with current soil dampness, ambient heat, and forecasted precipitation windows.',
      icon: Droplets,
    },
    {
      num: '05',
      title: 'Receive Actionable Recommendations',
      desc: 'Get structured, prioritized tasks: isolate diseased foliage, hold off on watering before rain, or check drip emitters.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          Process Overview
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How FarmGuard AI turns data into decisions
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          A seamless 5-step workflow designed to be intuitive for farmers and agronomists in the field.
        </p>
      </div>

      {/* Visual Step Cards with Connecting Indicators */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx} hoverable className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex items-center gap-4 sm:flex-col sm:items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-900/20 flex-shrink-0">
                  {s.num}
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{s.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Demo CTA */}
      <div className="text-center pt-6">
        <Link to="/app/scanner">
          <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
            Try The Scanner Now
          </Button>
        </Link>
      </div>
    </div>
  );
};
