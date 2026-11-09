import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Flame, 
  PiggyBank, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  HeartHandshake,
  TrendingDown,
  Gift
} from 'lucide-react';

export const SavingsChallengeView: React.FC = () => {
  const { savingsChallenge, celebrateSavings, household, expenses, t, language, activeUser } = useApp();

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = household.monthlyBudget - totalSpent;
  const progressPercent = Math.min(100, Math.round((savingsChallenge.savedSoFar / savingsChallenge.targetAmount) * 100));

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white p-6 rounded-3xl shadow-card relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full text-amber-200">
                {savingsChallenge.monthName} Challenge
              </span>
              <span className="text-xs font-bold text-amber-100 flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Couple Teamwork</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t.monthlyChallenge}
            </h2>
            <p className="text-xs text-amber-100 mt-1 max-w-lg">
              Every Taka saved on smart bargaining and zero waste goes straight to your couple vacation or emergency fund!
            </p>
          </div>

          <button
            onClick={celebrateSavings}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 font-black text-xs hover:bg-amber-50 shadow-lg hover:scale-105 transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{t.celebrateBtn}</span>
          </button>
        </div>
      </div>

      {/* Progress & Streak Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Savings Progress Card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft sm:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Monthly Savings Goal
              </span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">
                ৳{savingsChallenge.savedSoFar.toLocaleString()} <span className="text-sm font-semibold text-slate-400">/ ৳{savingsChallenge.targetAmount.toLocaleString()}</span>
              </p>
            </div>
            <span className="text-lg font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-3">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 font-medium">
            <span>Remaining to hit goal: <strong>৳{(savingsChallenge.targetAmount - savingsChallenge.savedSoFar).toLocaleString()}</strong></span>
            <span>Projected savings: ৳6,200</span>
          </div>
        </div>

        {/* Savings Streak Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 shadow-soft">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">{t.streakDays}</span>
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
          </div>
          <p className="text-3xl font-black text-amber-950">
            {savingsChallenge.streakDays} Days!
          </p>
          <p className="text-xs text-amber-800 mt-2 font-medium">
            Both partners haven't overspent their daily cap for 2 solid weeks! Shabbaash! 🔥
          </p>
        </div>

      </div>

      {/* Couple Badges & Achievements */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Couple Badges & Milestones (দাম্পত্য মেডেল)
              </h3>
              <p className="text-xs text-slate-500">
                Unlock humorous Bangladeshi achievements by shopping smartly and saving together
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
            {savingsChallenge.badges.filter(b => b.earned).length} / {savingsChallenge.badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savingsChallenge.badges.map((b) => (
            <div
              key={b.id}
              className={`p-5 rounded-2xl border transition-all ${
                b.earned 
                  ? 'bg-gradient-to-br from-emerald-50/50 to-white border-emerald-200 shadow-soft' 
                  : 'bg-slate-50/50 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl p-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  {b.icon}
                </span>
                {b.earned ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-slate-900 text-sm mt-3">
                {language === 'bn' ? b.banglaName : b.name}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {language === 'bn' ? b.banglaDescription : b.description}
              </p>

              {b.earnedDate && (
                <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                  Earned on: {b.earnedDate}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
