import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  TrendingDown, 
  Sparkles, 
  Clock, 
  ShoppingBag, 
  ThumbsUp, 
  Heart,
  BarChart2,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

export const BorPerformanceView: React.FC = () => {
  const { shopperPerformance, bazarItems, t, language } = useApp();

  const forgottenItems = bazarItems.filter(i => i.status === 'forgotten');
  const unavailableItems = bazarItems.filter(i => i.status === 'unavailable');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-6 rounded-3xl shadow-card relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full text-emerald-200">
                Signature Feature 2
              </span>
              <span className="text-xs font-bold text-emerald-100 flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Encouraging Family Analytics</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t.performanceTitle}
            </h2>
            <p className="text-xs text-emerald-100 mt-1 max-w-lg">
              {t.performanceSubtitle} — celebrate great bargaining without blaming for out-of-stock market goods!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center shrink-0">
            <span className="text-[11px] font-bold text-amber-300 block uppercase">Shopper of the Month</span>
            <span className="text-lg font-black text-white">{shopperPerformance.shopperName}</span>
          </div>
        </div>
      </div>

      {/* 2. Feedback Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 flex items-center gap-3 shadow-soft">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 text-xl font-bold">
          🎉
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-black text-amber-900 uppercase tracking-wider block">
            {t.encouragingFeedback}:
          </span>
          <p className="text-sm font-bold text-amber-950 mt-0.5">
            "{language === 'bn' ? shopperPerformance.banglaEncouragementMessage : shopperPerformance.encouragementMessage}"
          </p>
        </div>
      </div>

      {/* 3. Performance Metrics Grid (Completion Ring + 4 KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Completion Ring Card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.completionRate}
          </span>

          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * shopperPerformance.completionRate) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900">
                {shopperPerformance.completionRate}%
              </span>
              <span className="text-[10px] font-bold text-emerald-800">Bazar Done</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 mt-3 font-semibold">
            {shopperPerformance.totalPurchased} of {shopperPerformance.totalAssigned} items purchased
          </p>
        </div>

        {/* Financial Comparison */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Estimated vs Actual</span>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-400">Total estimated: ৳{shopperPerformance.totalEstimated}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              ৳{shopperPerformance.totalActual}
            </p>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-extrabold flex items-center justify-between">
            <span>Money Saved:</span>
            <span className="text-sm font-black text-emerald-800">৳{shopperPerformance.totalSavings} 🎉</span>
          </div>
        </div>

        {/* Speed & Average Cost */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">{t.avgTripSpeed}</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">
              {shopperPerformance.avgCompletionTimeMins} mins
            </p>
            <p className="text-xs text-slate-600 mt-1 font-medium">Bazar efficiency benchmark: 45m</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">{t.avgTripCost}:</span>
            <span className="font-extrabold text-slate-900">৳{shopperPerformance.avgTripCost}</span>
          </div>
        </div>

        {/* Item Accuracy Breakdown */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Trip Accuracy Stats
          </span>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Purchased:</span>
              </span>
              <span className="font-bold text-emerald-700">{shopperPerformance.totalPurchased}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Market Out of Stock:</span>
              </span>
              <span className="font-bold text-amber-700">{shopperPerformance.totalUnavailable}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <span>Forgotten:</span>
              </span>
              <span className="font-bold text-red-700">{shopperPerformance.totalForgotten}</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 italic">
            Zero blame policy: Out of stock items do not reduce score.
          </div>
        </div>

      </div>

      {/* 4. Weekly Accuracy Chart & Forgotten Items Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Accuracy Chart */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                {t.weeklyPerformance}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Last 4 Weeks</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shopperPerformance.weeklyHistory}>
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="purchased" name="Purchased Items" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="assigned" name="Assigned Items" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forgotten & Unavailable Items Report */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>{t.forgottenReport} & Unavailable Goods</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Live Checklist Status</span>
            </div>

            <div className="space-y-2 mt-2">
              {forgottenItems.length === 0 && unavailableItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2 stroke-1" />
                  <p className="text-xs font-bold text-slate-700">Perfect Trip!</p>
                  <p className="text-[11px] text-slate-400">No items currently marked as forgotten or unavailable.</p>
                </div>
              ) : (
                <>
                  {forgottenItems.map(item => (
                    <div key={item.id} className="p-3 rounded-2xl bg-red-50/70 border border-red-200 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-red-950">{item.banglaTitle || item.title}</p>
                        <p className="text-[11px] text-red-700">{item.notes || 'Forgot to buy at the counter'}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                        Forgotten
                      </span>
                    </div>
                  ))}

                  {unavailableItems.map(item => (
                    <div key={item.id} className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-amber-950">{item.banglaTitle || item.title}</p>
                        <p className="text-[11px] text-amber-700">{item.notes || 'Stock out in bazaar today'}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Unavailable
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Tip: These items automatically carry forward to the next bazar trip checklist.
          </div>
        </div>

      </div>

    </div>
  );
};
