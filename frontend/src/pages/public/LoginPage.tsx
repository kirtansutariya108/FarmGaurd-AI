import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { useApp } from '../../hooks/useFarmContext';
import { Mail, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('kirtan.farmer@farmguard.ai');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const ok = await login(identifier, password);
      if (ok) {
        navigate('/app/dashboard');
      } else {
        setError('Invalid credentials. Please enter email and password.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIdentifier('kirtan.farmer@farmguard.ai');
    setPassword('demo123');
    setIsLoading(true);
    await login('kirtan.farmer@farmguard.ai', 'demo123');
    setIsLoading(false);
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-[#223326] bg-white dark:bg-[#152019]">
        {/* Left: Brand Visual Column */}
        <div className="bg-gradient-to-br from-emerald-800 via-green-900 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <Logo size="md" className="text-white" />
            <h2 className="text-2xl font-extrabold tracking-tight mt-6">
              Welcome back to your precision farming cockpit.
            </h2>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Log in to monitor crop leaf scans, review sensor moisture levels, and track actionable tasks.
            </p>
          </div>

          <div className="space-y-2.5 pt-8 relative z-10 text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Multi-crop pathogen classification</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Smart irrigation window calculator</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Multilingual English, Hindi & Gujarati</span>
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Sign In</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your credentials or click Quick Demo Access
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email or Mobile Number"
              type="text"
              placeholder="name@farm.com or +91..."
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                <span>Remember me</span>
              </label>
              <a href="#" className="font-semibold text-emerald-600 hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" size="md" className="w-full font-bold" isLoading={isLoading}>
              Sign In to FarmGuard
            </Button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full text-xs font-bold"
              onClick={handleDemoLogin}
              icon={<Sparkles className="w-4 h-4 text-emerald-600" />}
            >
              1-Click Demo Login (Evaluator Mode)
            </Button>

            <p className="text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-emerald-600 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
