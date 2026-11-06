// ==============================================================================
// SR STUDIO — ADMIN LOGIN & FIRST-OWNER BOOTSTRAP SCREEN
// File: src/admin/pages/AdminLogin.tsx
// ==============================================================================

import React, { useState } from 'react';
import { Lock, Mail, User, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../../components/common/Button';

export const AdminLogin: React.FC = () => {
  const { signIn, bootstrapOwner, isConfigured, isBootstrapped } = useAuth();

  const [mode, setMode] = useState<'signin' | 'bootstrap'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      setError(signInError);
    }
  };

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please complete all fields to establish the primary agency owner.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long for security.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: bootstrapErr } = await bootstrapOwner(fullName, email, password);
    setLoading(false);

    if (bootstrapErr) {
      setError(bootstrapErr);
    } else {
      setSuccessMessage('Owner account initialized successfully! Loading workspace...');
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0D10] text-[#F5F1EB] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Subtle Orange Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#F07835]/08 rounded-full blur-[140px] pointer-events-none" />

      {/* Back to Public Site Link */}
      <div className="absolute top-6 left-6">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#A5A5A5] hover:text-[#F5F1EB] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Public Website</span>
        </a>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#17191C] border border-white/10 mb-4 shadow-xl">
            <img
              src="/logo-clean.png"
              alt="SR Studio Logo"
              className="h-9 w-9 object-contain filter drop-shadow-[0_2px_10px_rgba(240,120,53,0.5)]"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#F5F1EB] tracking-tight">
            SR STUDIO
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-[#FFAD76] mt-1">
            Agency Lead Management & Operations
          </p>
        </div>

        {/* Configuration Notice if Supabase is unconfigured */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
            <div className="flex items-center gap-2 font-bold mb-1 text-white">
              <AlertCircle size={16} className="text-[#F07835]" />
              <span>Supabase Environment Pending Setup</span>
            </div>
            <p className="mb-2">
              To connect the live database and authentication system, configure the following variables in your local <code className="bg-black/40 px-1 py-0.5 rounded text-[#FFAD76]">.env</code> or host settings:
            </p>
            <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-[#A5A5A5]">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        )}

        {/* Card Container */}
        <div className="bg-[#141619]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          
          {/* Header Switcher if not yet bootstrapped */}
          {isBootstrapped === false && (
            <div className="flex rounded-xl bg-[#0C0D10] p-1 border border-white/5 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-[#F07835] text-white shadow-md'
                    : 'text-[#A5A5A5] hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('bootstrap');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'bootstrap'
                    ? 'bg-[#F07835] text-white shadow-md'
                    : 'text-[#A5A5A5] hover:text-white'
                }`}
              >
                Claim First Owner
              </button>
            </div>
          )}

          {/* Mode Title & Description */}
          <div className="mb-6">
            <h2 className="text-xl font-display font-bold text-[#F5F1EB]">
              {mode === 'bootstrap' ? 'Initial Owner Setup' : 'Agency Staff Sign In'}
            </h2>
            <p className="text-xs text-[#A5A5A5] mt-1 leading-relaxed">
              {mode === 'bootstrap'
                ? 'Establish the primary agency owner account. Once claimed, this action permanently locks to prevent unauthorized registrations.'
                : 'Enter your verified team credentials to manage inbound leads and client pipelines.'}
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Notice */}
          {successMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'bootstrap' ? handleBootstrap : handleSignIn} className="space-y-4">
            
            {mode === 'bootstrap' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A5A5A5] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Agency Founder"
                    className="w-full bg-[#0C0D10] border border-white/[0.09] focus:border-[#F07835] focus:ring-1 focus:ring-[#F07835]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F5F1EB] placeholder-white/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A5A5A5] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="team@srstudio.agency"
                  className="w-full bg-[#0C0D10] border border-white/[0.09] focus:border-[#F07835] focus:ring-1 focus:ring-[#F07835]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F5F1EB] placeholder-white/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A5A5A5] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0C0D10] border border-white/[0.09] focus:border-[#F07835] focus:ring-1 focus:ring-[#F07835]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F5F1EB] placeholder-white/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading || !isConfigured}
                className="w-full justify-center text-sm font-semibold shadow-[0_4px_20px_rgba(240,120,53,0.35)]"
                icon={<ArrowRight size={16} />}
              >
                {loading
                  ? 'Verifying...'
                  : mode === 'bootstrap'
                  ? 'Bootstrap Agency Owner'
                  : 'Access Dashboard'}
              </Button>
            </div>
          </form>

          {/* Security Note */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-[#737373]">
            <ShieldCheck size={14} className="text-[#FFAD76]" />
            <span>Encrypted Session • Role-Based RLS Protected</span>
          </div>

        </div>

      </div>
    </div>
  );
};

