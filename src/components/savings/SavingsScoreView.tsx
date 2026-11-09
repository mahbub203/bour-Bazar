import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Sparkles, 
  PiggyBank, 
  Flame, 
  CheckCircle2, 
  Lock, 
  TrendingDown, 
  HeartHandshake, 
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

export const SavingsScoreView: React.FC = () => {
  const { savingsChallenge, celebrateSavings, household, expenses, t, language } = useApp();

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = household.monthlyBudget - totalSpent;
  const progressPercent = Math.min(100, Math.round((savingsChallenge.savedSoFar / savingsChallenge.targetAmount) * 100));

  // Savings history chart data
  const historyData = [
    { month: 'Jul', score: 82, saved: 3200, budget: 35000 },
    { month: 'Aug', score: 85, saved: 4100, budget: 35000 },
    { month: 'Sep', score: 79, saved: 2800, budget: 35000 },
    { month: 'Oct', score: 91, saved: 5200, budget: 35000 },
    { month: 'Nov (Now)', score: savingsChallenge.savingsScore, saved: savingsChallenge.savedSoFar, budget: household.monthlyBudget },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* 1. Master Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white p-6 rounded-3xl shadow-card relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full text-amber-200">
                Signature Feature 3
              </span>
              <span className="text-xs font-bold text-amber-100 flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Couple Financial Health</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t.savingsScoreTitle}
            </h2>
            <p className="text-xs text-amber-100 mt-1 max-w-lg">
              {t.savingsScoreSubtitle} — rewarding disciplined household shopping and smart bargaining!
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

      {/* 2. Top Savings Score Gauge & Key Financial Split (Actual Savings vs Unused Budget) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Score Out of 100 Circular Gauge */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.scoreOutof100}
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-slate-100"
                strokeWidth="9"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-amber-500 transition-all duration-1000 ease-out"
                strokeWidth="9"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * savingsChallenge.savingsScore) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900">
                {savingsChallenge.savingsScore}
              </span>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-200">
            {savingsChallenge.savingsScore >= 80 ? 'Grade A: Master Shongshari 🌟' : 'Grade B: Solid Progress 👍'}
          </span>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Based on budget discipline, zero grocery waste, and target goals.
          </p>
        </div>

        {/* Clear Distinction: Actual Savings vs Unused Budget */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Savings Breakdown</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 mb-3">
              <span className="text-xs font-bold text-emerald-800 block">
                {t.actualSavingsRealized}
              </span>
              <span className="text-2xl font-black text-emerald-900">
                ৳{savingsChallenge.actualSavings.toLocaleString()}
              </span>
              <p className="text-[10px] text-emerald-700 mt-0.5">
                Saved through smart bazaar bargaining, discount vouchers, and bulk purchase.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block">
                {t.unusedBudgetNote}
              </span>
              <span className="text-2xl font-black text-slate-900">
                ৳{savingsChallenge.unusedBudget.toLocaleString()}
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Unspent budget remaining in the household monthly allowance.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-2 italic">
            *Strict financial distinction: Actual savings is not confused with unspent budget.
          </div>
        </div>

        {/* Monthly Challenge & Streak */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-amber-900 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">{t.streakDays}</span>
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
            </div>
            <p className="text-3xl font-black text-amber-950">
              {savingsChallenge.streakDays} Days Streak!
            </p>
            <p className="text-xs text-amber-800 mt-1 font-semibold">
              Both partners stayed within their daily cap for 2 solid weeks!
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200/80">
            <span className="text-[11px] font-bold text-amber-900 block uppercase">
              {savingsChallenge.monthName} Challenge:
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm font-extrabold text-amber-950">Save ৳{savingsChallenge.targetAmount.toLocaleString()}</span>
              <span className="text-xs font-bold text-emerald-700">{progressPercent}% Achieved</span>
            </div>
            <div className="w-full bg-white h-2.5 rounded-full overflow-hidden mt-1.5 border border-amber-200">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* 3. Monthly Savings History Area Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              Household Savings History & Previous Month Comparison
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Last 5 Months</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `৳${v/1000}k`} />
              <Tooltip 
                formatter={(val: any) => [`৳${Number(val).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="saved" name="Savings Achieved" stroke="#10b981" fill="#ecfdf5" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Couple Badges & Milestones */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Couple Badges & Milestones (দাম্পত্য মেডেল)
              </h3>
              <p className="text-xs text-slate-500">
                Humorous Bangladeshi badges unlocked through mutual financial responsibility
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
