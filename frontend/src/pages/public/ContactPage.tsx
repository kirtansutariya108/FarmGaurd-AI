import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          We'd love to hear from farmers and partners
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Have feedback on disease diagnosis results or want to connect your regional weather station? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Headquarters & Lab</h3>
            
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Agricultural Innovation Hub, Vadodara, Gujarat, 390001</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>contact@farmguard.ai</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>+91 98765 43210 (Toll-Free Agri Helpline)</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/40">
            <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-1">
              Agronomy Specialist Support
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If your crops are facing severe blight expansion, consult with local state university extension centers in Anand or Junagadh.
            </p>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Message Received!</h3>
              <p className="text-xs text-slate-500">
                Thank you for reaching out. Our agricultural team will respond within 24 hours.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline" size="sm">
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Send us a Message</h3>
              
              <Input
                label="Full Name"
                placeholder="Farmer Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address / Mobile"
                placeholder="name@farm.com or +91..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Message / Question
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#121c15] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 dark:text-white"
                  placeholder="Describe your crop query or feedback..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" size="md" className="w-full" icon={<Send className="w-4 h-4" />}>
                Submit Inquiry
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
