import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginUser, registerUser, t, activeUser } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('bou');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      loginUser(email || 'nusrat.bou@gmail.com');
      onClose();
    } else if (mode === 'register') {
      registerUser(name || 'New Member', email || 'member@gmail.com', role);
      onClose();
    } else {
      setStatusMsg('Password reset link sent to your email address!');
      setTimeout(() => {
        setMode('login');
        setStatusMsg('');
      }, 2500);
    }
  };

  const handleGoogleLogin = () => {
    loginUser('tanvir.bor@gmail.com');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👰🤵</span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {mode === 'login' ? t.login : mode === 'register' ? t.register : t.forgotPassword}
              </h3>
              <p className="text-xs text-slate-500">
                Bou r Bazar Account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Google Quick Login Button */}
        {mode !== 'forgot' && (
          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{t.googleLogin}</span>
            </button>

            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[10px] text-slate-400 uppercase font-bold">Or with email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
          </div>
        )}

        {statusMsg && (
          <p className="p-3 mb-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            {statusMsg}
          </p>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed or Nusrat Jahan"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@family.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Household Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('bou')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    role === 'bou' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  👰 Bou
                </button>
                <button
                  type="button"
                  onClick={() => setRole('bor')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    role === 'bor' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  🤵 Bor
                </button>
                <button
                  type="button"
                  onClick={() => setRole('member')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    role === 'member' ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  👨‍👩‍👧 Member
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs mt-2"
          >
            {mode === 'login' ? t.login : mode === 'register' ? t.register : 'Send Reset Link'}
          </button>
        </form>

        {/* Toggle between Login / Register / Forgot */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          {mode === 'login' ? (
            <>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="hover:text-emerald-700 font-semibold"
              >
                {t.forgotPassword}
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-700 font-bold hover:underline"
              >
                Need account? Register →
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-emerald-700 font-bold hover:underline mx-auto block"
            >
              ← Back to Login
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
