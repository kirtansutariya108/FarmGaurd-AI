import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  ShieldCheck, 
  Mail, 
  Phone,
  Sparkles
} from 'lucide-react';

export const HelpSupportPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the AI Crop Disease Scanner work?',
      a: 'The scanner analyzes visual color patterns, lesion geometries, and chlorosis on crop leaves using deep neural net classification heuristics. It outputs multi-class predictions with percentage confidence scores and flags low-confidence or healthy foliage.',
    },
    {
      q: 'Why does FarmGuard AI warn about chemical dosages?',
      a: 'In accordance with agricultural safety principles, FarmGuard provides decision support (e.g. isolating infected leaves, improving furrow drainage) rather than automated chemical recipes. Farmers should consult an authorized agronomist for specific dosage.',
    },
    {
      q: 'How is the Smart Irrigation recommendation calculated?',
      a: 'The system computes your crop growth stage (e.g. flowering requires higher water buffer), recent soil dampness readings, and impending rainfall probability to determine whether to irrigate soon or postpone.',
    },
    {
      q: 'Can I use FarmGuard AI offline in remote farm fields?',
      a: 'The frontend application is architected to cache recent farm metrics and scans in local browser storage, with synchronized cloud telemetry when cellular connectivity resumes.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-emerald-600" />
          Help & Field Support Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Frequently asked questions, agricultural guidelines, and technical support
        </p>
      </div>

      {/* Quick Guide Card */}
      <Card className="p-6 bg-gradient-to-br from-emerald-50 via-white to-green-50/40 dark:from-[#15251c] dark:via-[#16221b] dark:to-[#121c16] border-emerald-200 dark:border-emerald-800">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Field Guide & Best Practices</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Always capture leaf photos during morning or late afternoon daylight. Avoid direct artificial flashlight shadows to maximize AI classification accuracy.
            </p>
          </div>
        </div>
      </Card>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>

        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <Card key={idx} className="p-4 sm:p-5 transition-all">
              <button
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 dark:text-white"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {isOpen && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Contact Helpline */}
      <Card className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Still need assistance?</h4>
          <p className="text-xs text-slate-500">Our agronomy support desk is ready to answer your field questions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Mail className="w-4 h-4" />}>
            support@farmguard.ai
          </Button>
          <Button size="sm" icon={<Phone className="w-4 h-4" />}>
            +91 98765 43210
          </Button>
        </div>
      </Card>
    </div>
  );
};
