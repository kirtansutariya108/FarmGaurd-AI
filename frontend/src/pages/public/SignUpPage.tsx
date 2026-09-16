import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useApp } from '../../hooks/useFarmContext';
import { mockAuthService } from '../../services/mockAuthService';
import { User, Mail, Lock, MapPin, Sprout, CheckCircle2 } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [farmName, setFarmName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await mockAuthService.signup({
        fullName,
        email,
        phone,
        location,
        farmName,
        password,
      });

      if (res.success) {
        navigate('/app/dashboard');
      } else {
        setError(res.error || 'Unable to register account.');
      }
    } catch (err) {
      setError('An error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-[#223326] bg-white dark:bg-[#152019]">
        {/* Left: Info */}
        <div className="bg-gradient-to-br from-emerald-800 via-green-900 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between">
          <div className="space-y-4">
            <Logo size="md" className="text-white" />
            <h2 className="text-2xl font-extrabold tracking-tight mt-6">
              Empower your farm with intelligent AI signals.
            </h2>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Create an account to start scanning crop diseases, optimizing irrigation routines, and receiving local weather alerts.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-emerald-100 space-y-2 mt-8">
            <span className="font-bold text-white block">What You'll Get:</span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Dedicated farm plot dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Multi-pathogen disease confidence scanner</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Smart irrigation window calculator</span>
            </div>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-5">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Create Account</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Join FarmGuard AI for modern farm decision support
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              placeholder="e.g. Kirtan Sutariya"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@farm.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
              <Input
                label="Location (City/District)"
                placeholder="Vadodara, Gujarat"
                value={location}
                onChange={e => setLocation(e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
                required
              />
            </div>

            <Input
              label="Farm Name (Optional)"
              placeholder="e.g. Green Valley Farm"
              value={farmName}
              onChange={e => setFarmName(e.target.value)}
              leftIcon={<Sprout className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <Button type="submit" size="md" className="w-full font-bold mt-2" isLoading={isLoading}>
              Register Account & Launch Cockpit
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
