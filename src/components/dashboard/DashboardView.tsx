import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  TrendingDown, 
  PiggyBank, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Receipt, 
  PackageOpen, 
  AlertTriangle,
  Send,
  Check,
  ChevronRight,
  Flame,
  ScanLine,
  BarChart2,
  Trophy
} from 'lucide-react';
import { ItemPriority } from '../../types';

interface DashboardViewProps {
  onOpenAddBazar: () => void;
  onOpenAddExpense: () => void;
  onOpenMarketMode: () => void;
  onOpenBouAlert?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddBazar,
  onOpenAddExpense,
  onOpenMarketMode,
  onOpenBouAlert
}) => {
  const { 
    activeHousehold, 
    bazarItems, 
    expenses, 
    activities, 
    togglePurchased, 
    setActiveTab, 
    t, 
    language,
    triggerBouAlert,
    savingsChallenge,
    shopperPerformance,
    activeUser
  } = useApp();

  // Financial calculations
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = activeHousehold.monthlyBudget - totalSpent;
  const budgetPercentUsed = Math.min(100, Math.round((totalSpent / activeHousehold.monthlyBudget) * 100));

  // Today's bazar calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses
    .filter(e => e.date === todayStr && e.category === 'Grocery')
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingItems = bazarItems.filter(i => i.status === 'pending');
  const completedItems = bazarItems.filter(i => i.status === 'purchased');

  const fallbackQuotes = [
    {
      en: "Bou er list ekhono pending! 😂",
      bn: "বউ এর লিস্ট এখনো পেন্ডিং! 😂",
      icon: "📝"
    },
    {
      en: "Bazar e jawar shomoy hoye geche!",
      bn: "বাজারে যাওয়ার সময় হয়ে গেছে!",
      icon: "🛵"
    },
    {
      en: "Dim ante bhule jaben na! (Remember the eggs!)",
      bn: "ডিম আনতে ভুলে যাবেন না!",
      icon: "🥚"
    },
    {
      en: "Bou is waiting for the bazar update!",
      bn: "বউ বাজারের আপডেটের জন্য অপেক্ষা করছে!",
      icon: "⏳"
    },
    {
      en: "Bazar complete korle shanti paben! ❤️",
      bn: "বাজার কমপ্লিট করলে শান্তি পাবেন! ❤️",
      icon: "❤️"
    }
  ];

  const quotes = [
    { 
      text: t?.alertQuote1 || t?.reminder1 || (language === 'bn' ? fallbackQuotes[0].bn : fallbackQuotes[0].en), 
      icon: "📝" 
    },
    { 
      text: t?.alertQuote2 || t?.reminder2 || (language === 'bn' ? fallbackQuotes[1].bn : fallbackQuotes[1].en), 
      icon: "🛵" 
    },
    { 
      text: t?.alertQuote3 || t?.reminder3 || (language === 'bn' ? fallbackQuotes[2].bn : fallbackQuotes[2].en), 
      icon: "🥚" 
    },
    { 
      text: t?.alertQuote4 || t?.reminder4 || (language === 'bn' ? fallbackQuotes[3].bn : fallbackQuotes[3].en), 
      icon: "⏳" 
    },
    { 
      text: t?.alertQuote5 || t?.reminder5 || (language === 'bn' ? fallbackQuotes[4].bn : fallbackQuotes[4].en), 
      icon: "❤️" 
    }
  ];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const priorityBadge = (priority: ItemPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">Urgent 🔴</span>;
      case 'important':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Important 🟡</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Normal 🟢</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* 1. Signature Feature 1: Bou Alert Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#198754] via-emerald-600 to-teal-700 text-white p-5 shadow-card">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 border border-white/20">
              {quotes[currentQuoteIndex]?.icon || "📝"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-amber-300">
                  {t?.bouAlertTitle || t?.reminderTitle || (language === 'bn' ? 'বউ এলার্ট 🚨' : 'Bou Alert 🚨')}
                </span>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
                  {activeUser.role === 'bou' 
                    ? (language === 'bn' ? 'বরের জন্য 🤵' : 'To Bor 🤵') 
                    : (language === 'bn' ? 'বউয়ের পক্ষ থেকে 👰' : 'From Bou 👰')}
                </span>
              </div>
              <p className="text-base sm:text-lg font-bold text-white mt-0.5">
                "{quotes[currentQuoteIndex]?.text || fallbackQuotes[0][language === 'bn' ? 'bn' : 'en']}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-xs transition-colors border border-white/20 cursor-pointer"
            >
              {language === 'bn' ? 'পরের উক্তি 🔄' : 'Next Quote 🔄'}
            </button>
            <button
              onClick={() => {
                const activeText = quotes[currentQuoteIndex]?.text || fallbackQuotes[0][language === 'bn' ? 'bn' : 'en'];
                if (onOpenBouAlert) onOpenBouAlert();
                else triggerBouAlert(activeText);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t?.sendBouAlertNow || (language === 'bn' ? 'এখনই বউ এলার্ট পাঠান 🔔' : 'Trigger Bou Alert Now 🔔')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Overview Metric Cards (PART 3: Financial Overview) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Monthly Household Budget */}
        <div className="col-span-1 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.monthlyBudget}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ৳{activeHousehold.monthlyBudget.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center text-[11px] text-slate-500 font-medium">
            <span>Target for {savingsChallenge.monthName}</span>
          </div>
        </div>

        {/* Total Spending */}
        <div className="col-span-1 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:border-red-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.totalSpent}</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ৳{totalSpent.toLocaleString()}
          </p>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                budgetPercentUsed > 85 ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${budgetPercentUsed}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-slate-500 font-medium text-right">
            {budgetPercentUsed}% {t.budgetProgress}
          </p>
        </div>

        {/* Remaining Budget */}
        <div className="col-span-1 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.remainingBudget}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-xl sm:text-2xl font-black tracking-tight ${
            remainingBudget < 0 ? 'text-red-600' : 'text-emerald-700'
          }`}>
            ৳{remainingBudget.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>{savingsChallenge.streakDays} days budget streak</span>
          </div>
        </div>

        {/* Today's Shopping Expenses */}
        <div className="col-span-1 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.todayBazar}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ৳{todayExpenses.toLocaleString()}
          </p>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            <span>{completedItems.length} items purchased today</span>
          </div>
        </div>

        {/* Savings Progress / Score */}
        <div 
          onClick={() => setActiveTab('savings')}
          className="col-span-2 lg:col-span-1 p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 shadow-soft cursor-pointer hover:border-amber-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900">Savings Score</span>
            <div className="w-8 h-8 rounded-lg bg-amber-200/70 text-amber-800 flex items-center justify-center font-bold text-xs">
              <Trophy className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              {savingsChallenge.savingsScore}
            </p>
            <span className="text-xs font-bold text-amber-800">/ 100</span>
          </div>
          <p className="mt-2 text-xs font-bold text-amber-900 flex items-center justify-between">
            <span>View Score & Badges</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

      </div>

      {/* 3. Quick Actions Grid (PART 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={onOpenAddBazar}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
              {t.createBazarList}
            </p>
            <p className="text-[10px] text-slate-400 truncate">Add to shopping list</p>
          </div>
        </button>

        <button
          onClick={onOpenAddExpense}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-red-400 hover:shadow-md transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 group-hover:text-red-700 truncate">
              {t.addExpense}
            </p>
            <p className="text-[10px] text-slate-400 truncate">Record bill or expense</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-400 hover:shadow-md transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ScanLine className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700 truncate">
              Scan Receipt
            </p>
            <p className="text-[10px] text-slate-400 truncate">AI OCR scanner</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('hisab')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
              {t.navMonthlyHisab}
            </p>
            <p className="text-[10px] text-slate-400 truncate">Financial ledger</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('performance')}
          className="col-span-2 sm:col-span-1 flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700 truncate">
              Performance
            </p>
            <p className="text-[10px] text-slate-400 truncate">{shopperPerformance.completionRate}% completion</p>
          </div>
        </button>
      </div>

      {/* 4. Two-Column Layout: Today's Bazar Section & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Today's Bazar Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {t.todaysBazar}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {pendingItems.length} {t.pending}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Check off items as you buy them at the bazaar or supermarket
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenMarketMode}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs font-bold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.liveShoppingMode}</span>
              </button>
              <button
                onClick={() => setActiveTab('bazar')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Full List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List items */}
          <div className="divide-y divide-slate-100 mt-2">
            {bazarItems.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-base font-bold text-slate-700">{t.emptyBazar}</p>
                <p className="text-xs text-slate-500 mt-1">{t.emptyBazarSub}</p>
                <button
                  onClick={onOpenAddBazar}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  {t.createBazarList}
                </button>
              </div>
            ) : (
              bazarItems.slice(0, 6).map((item) => (
                <div 
                  key={item.id}
                  className={`py-3 px-2 flex items-center justify-between gap-3 rounded-xl hover:bg-slate-50 transition-colors ${
                    item.status === 'purchased' ? 'opacity-60 bg-slate-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => togglePurchased(item.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        item.status === 'purchased'
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'border-2 border-slate-300 hover:border-emerald-600 bg-white'
                      }`}
                      aria-label="Toggle purchase"
                    >
                      {item.status === 'purchased' && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold truncate ${
                          item.status === 'purchased' ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}>
                          {language === 'bn' && item.banglaTitle ? item.banglaTitle : item.title}
                        </span>
                        {priorityBadge(item.priority)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-700">
                          {item.quantity} {item.unit}
                        </span>
                        <span>•</span>
                        <span>{item.category}</span>
                        {item.notes && (
                          <>
                            <span>•</span>
                            <span className="text-amber-800 italic truncate max-w-[180px]">
                              "{item.notes}"
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-slate-900">
                      ৳{item.status === 'purchased' ? (item.actualPrice || item.estimatedPrice) : item.estimatedPrice}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {item.status === 'purchased' ? 'Bought ✓' : 'Est. cost'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing top 6 items • {completedItems.length} completed
            </span>
            <button
              onClick={onOpenAddBazar}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{t.createBazarList}</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Recent Household Activity Stream */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Recent Activity Feed
              </h3>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                Live Feed
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm ${
                    act.userRole === 'bou' 
                      ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}>
                    {act.userRole === 'bou' ? '👰' : '🤵'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-800 leading-snug">
                      <strong className="text-slate-900 font-bold">{act.user}</strong>{' '}
                      {language === 'bn' ? act.banglaAction : act.action}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {act.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bor's Performance Mini Widget */}
          <div 
            onClick={() => setActiveTab('performance')}
            className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 cursor-pointer hover:border-emerald-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">
                Bor's Bazar Performance
              </span>
              <span className="text-xs font-black text-emerald-800 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                {shopperPerformance.completionRate}%
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-1 line-clamp-2">
              "{shopperPerformance.encouragementMessage}"
            </p>
            <span className="mt-2 text-xs font-bold text-emerald-900 underline decoration-emerald-400 block">
              Open Full Performance Dashboard →
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
