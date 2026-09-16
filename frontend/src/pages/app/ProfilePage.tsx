import React, { useState } from 'react';
import { useApp } from '../../hooks/useFarmContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Save, 
  CheckCircle2,
  Sprout
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, farms } = useApp();

  const [fullName, setFullName] = useState(user?.fullName || 'Kirtan Sutariya');
  const [email, setEmail] = useState(user?.email || 'kirtan.farmer@farmguard.ai');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [location, setLocation] = useState(user?.location || 'Vadodara, Gujarat');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUser({
        fullName,
        email,
        phone,
        location,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <User className="w-7 h-7 text-emerald-600" />
          Farmer Profile & Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details and linked farm properties
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Profile Avatar Card */}
        <div>
          <Card className="p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-700 to-green-500 text-white font-black text-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-900/20">
              {fullName.charAt(0)}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{fullName}</h3>
              <p className="text-xs text-slate-400">{location}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Registered Farms:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{farms.length} Parcels</span>
              </div>
              <div className="flex justify-between">
                <span>Member Since:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Jan 2026</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 2 Cols: Profile Form */}
        <div className="lg:col-span-2">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Personal Information</h3>
              {saved && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Profile Updated!
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                  required
                />
              </div>

              <Input
                label="Location (District/State)"
                value={location}
                onChange={e => setLocation(e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
                required
              />

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button type="submit" size="md" isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
