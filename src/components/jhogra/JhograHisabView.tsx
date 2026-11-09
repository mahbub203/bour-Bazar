import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartHandshake, 
  Plus, 
  Calendar as CalendarIcon, 
  Trophy, 
  Heart, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Trash2, 
  Flag, 
  Check, 
  X, 
  Filter, 
  ChevronRight, 
  RefreshCw, 
  Award,
  Coffee,
  Utensils,
  Smile,
  Flame,
  Info
} from 'lucide-react';
import { 
  Disagreement, 
  DisagreementReason, 
  DisagreementSeverity, 
  DisagreementStatus, 
  UserRole,
  PeaceActivityType 
} from '../../types';
import { RecordJhograModal } from './RecordJhograModal';
import { MakePeaceModal } from './MakePeaceModal';
import { PeaceTreatyModal } from './PeaceTreatyModal';

export const JhograHisabView: React.FC = () => {
  const { 
    disagreements, 
    apologies, 
    peaceActivities, 
    jhograStats, 
    resolveDisagreement, 
    disputeDisagreement, 
    deleteDisagreement, 
    addPeaceActivity,
    activeUser, 
    activeHousehold, 
    language, 
    t 
  } = useApp();

  // Modals state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isMakePeaceModalOpen, setIsMakePeaceModalOpen] = useState(false);
  const [isTreatyModalOpen, setIsTreatyModalOpen] = useState(false);
  const [targetDisagreementForPeace, setTargetDisagreementForPeace] = useState<string | undefined>(undefined);

  // Quick Resolve Dialog state
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionMethod, setResolutionMethod] = useState('');

  // Quick Dispute Dialog state
  const [disputingId, setDisputingId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  // Main Active Tab inside Jhogra Hisab
  // 'dashboard' | 'history' | 'calendar' | 'leaderboard' | 'report'
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'history' | 'calendar' | 'leaderboard' | 'report'>('dashboard');

  // Filters for History / Incidents
  const [filterPartner, setFilterPartner] = useState<'all' | 'bou' | 'bor'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unresolved' | 'resolved' | 'disputed'>('all');
  const [filterReason, setFilterReason] = useState<string>('all');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  // Filtered Disagreements
  const filteredDisagreements = useMemo(() => {
    return disagreements.filter(d => {
      if (filterPartner !== 'all' && d.reportedBy !== filterPartner) return false;
      if (filterStatus !== 'all' && d.status !== filterStatus) return false;
      if (filterReason !== 'all' && d.reason !== filterReason) return false;
      if (selectedCalendarDate && d.date !== selectedCalendarDate) return false;
      return true;
    });
  }, [disagreements, filterPartner, filterStatus, filterReason, selectedCalendarDate]);

  // Reason mapping helper
  const getReasonLabel = (reason: DisagreementReason) => {
    switch (reason) {
      case 'bazar_forgotten': return language === 'bn' ? 'বাজার আনতে ভুলে যাওয়া 🛒' : 'Forgot to bring bazar 🛒';
      case 'didnt_listen': return language === 'bn' ? 'মন দিয়ে কথা না শোনা 👂' : "Didn't listen carefully 👂";
      case 'came_home_late': return language === 'bn' ? 'দেরি করে বাসায় ফেরা ⏰' : 'Came home late ⏰';
      case 'phone_usage': return language === 'bn' ? 'সারাদিন ফোন টেপাটিপি 📱' : 'Too much phone usage 📱';
      case 'overspent_budget': return language === 'bn' ? 'বাজেট ছাড়িয়ে খরচ 💸' : 'Overspent the budget 💸';
      case 'remote_fight': return language === 'bn' ? 'টিভির রিমোট নিয়ে কাড়াকাড়ি 📺' : 'Remote control fight 📺';
      case 'forgot_important': return language === 'bn' ? 'জরুরি তারিখ বা কথা ভুলে যাওয়া 🧠' : 'Forgot something important 🧠';
      default: return language === 'bn' ? 'অন্যান্য নাটকীয় কারণ 🎭' : 'Other dramatic reason 🎭';
    }
  };

  const getSeverityBadge = (sev: DisagreementSeverity) => {
    switch (sev) {
      case 'big':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300">মহাপ্রলয় 💥</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-300">মাঝারি 🗣️</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">হালকা 🤏</span>;
    }
  };

  const getStatusBadge = (status: DisagreementStatus) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{language === 'bn' ? 'শান্তিচুক্তি সম্পন্ন 🕊️' : 'Resolved 🕊️'}</span>
          </span>
        );
      case 'disputed':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-800 border border-purple-300">
            <Flag className="w-3 h-3 text-purple-600" />
            <span>{language === 'bn' ? 'ভুয়া অভিযোগ 🚩' : 'Disputed 🚩'}</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>{language === 'bn' ? 'চলমান যুদ্ধ 🪖' : 'Active 🪖'}</span>
          </span>
        );
    }
  };

  // Quick activity adder for Man Vanganor
  const handleQuickPeaceActivity = (type: PeaceActivityType, titleBn: string, titleEn: string, pts: number) => {
    addPeaceActivity({
      madeBy: activeUser.role,
      madeByName: activeUser.name,
      targetRole: activeUser.role === 'bou' ? 'bor' : 'bou',
      activityType: type,
      title: titleEn,
      banglaTitle: titleBn,
      points: pts
    });
  };

  // Days in month calculation for the Jhogra Calendar
  const calendarDays = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= numDays; i++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayDisagreements = disagreements.filter(d => d.date === dStr);
      days.push({
        dayNum: i,
        dateStr: dStr,
        items: dayDisagreements
      });
    }
    return days;
  }, [disagreements]);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      
      {/* 1. Playful Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white p-6 shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">🥊</span>
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-amber-200 border border-white/20">
                {language === 'bn' ? 'নতুন মডিউল • খুনসুটি হিসাব' : 'Fun Feature • Disagreement Ledger'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {language === 'bn' ? 'ঝগড়া হিসাব (খুনসুটি লেজার)' : 'Jhogra Hisab (Disagreement Ledger)'}
            </h1>
            <p className="text-sm font-semibold text-rose-100 mt-1 max-w-xl">
              "{language === 'bn' ? 'সংসারে কে কয়বার ঝগড়া করলো, সব হিসাব আছে! 😂' : "Who fought how many times in the family, it's all accounted for! 😂"}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                setTargetDisagreementForPeace(undefined);
                setIsMakePeaceModalOpen(true);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-slate-950" />
              <span>{language === 'bn' ? 'মান ভাঙাও / সন্ধি করো 🕊️' : 'Make Peace / Apologize 🕊️'}</span>
            </button>

            <button
              onClick={() => setIsRecordModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 font-black text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-rose-700" />
              <span>{language === 'bn' ? 'নতুন ঝগড়া তুলুন ✍️' : 'Record a Jhogra ✍️'}</span>
            </button>

            <button
              onClick={() => setIsTreatyModalOpen(true)}
              className="px-3 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs backdrop-blur-xs transition-colors cursor-pointer"
              title="Family Peace Treaty"
            >
              📜 {language === 'bn' ? 'শান্তি চুক্তিপত্র' : 'Peace Treaty'}
            </button>
          </div>
        </div>

        {/* Ethical / Affectionate Guardrail Banner */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-2 text-xs text-rose-100 font-medium">
          <Info className="w-4 h-4 shrink-0 text-amber-300" />
          <span>
            {language === 'bn' 
              ? '⚠️ এটি একান্তই পারিবারিক বিনোদন, স্মৃতিচারণ ও খুনসুটির জন্য তৈরি! কোনো গুরুতর দাম্পত্য কলহ নয় ❤️' 
              : '⚠️ Strictly an opt-in entertainment feature for affectionate couple banters, not serious conflict monitoring! ❤️'}
          </span>
        </div>
      </div>

      {/* 2. Top Overview Cards (Requirement 1: Jhogra Dashboard) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Disagreements this month */}
        <div className="col-span-1 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-500">{language === 'bn' ? 'এই মাসে খুনসুটি' : 'Total Disagreements'}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm font-bold">
              🥊
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{jhograStats.totalThisMonth}</div>
          <span className="text-[11px] text-slate-400 font-semibold">{language === 'bn' ? 'চলতি মাসের হিসাব' : 'Current month'}</span>
        </div>

        {/* Bou's Reports */}
        <div className="col-span-1 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-500">{language === 'bn' ? 'বউয়ের নালিশ 👰' : "Bou's Reports 👰"}</span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center text-sm font-bold">
              👰
            </div>
          </div>
          <div className="text-2xl font-black text-pink-700">{jhograStats.bouReported}</div>
          <span className="text-[11px] text-slate-400 font-semibold">{language === 'bn' ? 'বউয়ের পক্ষ থেকে' : 'Reported by Bou'}</span>
        </div>

        {/* Bor's Reports */}
        <div className="col-span-1 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-500">{language === 'bn' ? 'বরের নালিশ 🤵' : "Bor's Reports 🤵"}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
              🤵
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700">{jhograStats.borReported}</div>
          <span className="text-[11px] text-slate-400 font-semibold">{language === 'bn' ? 'বরের পক্ষ থেকে' : 'Reported by Bor'}</span>
        </div>

        {/* Resolved with Peace */}
        <div className="col-span-1 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-emerald-700">{language === 'bn' ? 'শান্তিচুক্তি সম্পন্ন 🕊️' : 'Resolved 🕊️'}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
              🕊️
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">{jhograStats.resolvedCount}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {jhograStats.totalThisMonth > 0 ? `${Math.round((jhograStats.resolvedCount / jhograStats.totalThisMonth) * 100)}% মীমাংসিত` : 'শান্তিময়'}
          </span>
        </div>

        {/* Pending / Active Sulking */}
        <div className="col-span-1 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-amber-700">{language === 'bn' ? 'চলমান যুদ্ধ 🪖' : 'Active Sulk 🪖'}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold">
              ⏳
            </div>
          </div>
          <div className="text-2xl font-black text-amber-800">{jhograStats.pendingCount}</div>
          <span className="text-[11px] text-amber-600 font-semibold">{language === 'bn' ? 'মান ভাঙানো বাকি' : 'Needs sweet tea'}</span>
        </div>

        {/* Top Disagreement Reason */}
        <div className="col-span-1 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-500">{language === 'bn' ? 'শীর্ষ কারণ 🎯' : 'Top Trigger 🎯'}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold">
              🛒
            </div>
          </div>
          <div className="text-xs font-black text-purple-900 truncate">
            {language === 'bn' ? jhograStats.banglaMostCommonReason : jhograStats.mostCommonReason}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">{language === 'bn' ? 'সবচেয়ে ঘনঘন ঘটে' : 'Most repeated'}</span>
        </div>

      </div>

      {/* 3. Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'dashboard'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🥊 {language === 'bn' ? 'খুনসুটি ও আপোষ' : 'Disagreements & Peace'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'calendar'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'ঝগড়া ক্যালেন্ডার 📅' : 'Jhogra Calendar 📅'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'leaderboard'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'মান ভাঙানোর লিডারবোর্ড 🍧' : 'Man Vanganor Leaderboard 🍧'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('report')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'report'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'মাসিক রিপোর্ট ও শান্তি পদক 🏆' : 'Monthly Report & Awards 🏆'}</span>
        </button>
      </div>

      {/* 4. Tab 1: Dashboard (Disagreements Feed + Sorry Counter + Quick Peace) */}
      {activeSubTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Disagreements Feed */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Filter Bar */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === 'bn' ? 'ফিল্টার:' : 'Filter:'}</span>
                </span>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700"
                >
                  <option value="all">{language === 'bn' ? 'সকল অবস্থা' : 'All Status'}</option>
                  <option value="unresolved">{language === 'bn' ? 'চলমান যুদ্ধ 🪖' : 'Active Sulk 🪖'}</option>
                  <option value="resolved">{language === 'bn' ? 'শান্তিচুক্তি সম্পন্ন 🕊️' : 'Resolved 🕊️'}</option>
                  <option value="disputed">{language === 'bn' ? 'ভুয়া অভিযোগ 🚩' : 'Disputed 🚩'}</option>
                </select>

                {/* Partner Filter */}
                <select
                  value={filterPartner}
                  onChange={(e) => setFilterPartner(e.target.value as any)}
                  className="text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700"
                >
                  <option value="all">{language === 'bn' ? 'উভয় পার্টনার' : 'All Partners'}</option>
                  <option value="bou">{language === 'bn' ? 'বউয়ের অভিযোগ' : "Bou's Reports"}</option>
                  <option value="bor">{language === 'bn' ? 'বরের অভিযোগ' : "Bor's Reports"}</option>
                </select>
              </div>

              <span className="text-xs font-bold text-slate-500">
                {language === 'bn' ? `মোট ${filteredDisagreements.length} টি ঘটনা` : `${filteredDisagreements.length} incidents found`}
              </span>
            </div>

            {/* List of Disagreements */}
            {filteredDisagreements.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-3">
                  🕊️
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {language === 'bn' ? 'বর্তমানে কোনো ঝগড়া বা মান-অভিমান নেই! পরম শান্তি! 🌿' : 'No disagreements found! Pure family bliss! 🌿'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {language === 'bn' ? 'সংসারে চলছে শান্তির সুবাতাস। মিষ্টি চা আর ফুচকা খেয়ে দিনটি উপভোগ করুন।' : 'Peace and affection reign in the house! Enjoy a hot cup of tea together.'}
                </p>
                <button
                  onClick={() => setIsRecordModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  + {language === 'bn' ? 'নতুন খুনসুটি তুলুন' : 'Record New Banter'}
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredDisagreements.map((d) => (
                  <div
                    key={d.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:border-rose-300 transition-all space-y-3"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-base shrink-0 border border-rose-100">
                          {d.reportedBy === 'bou' ? '👰' : '🤵'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {d.reportedByName}
                            </span>
                            <span className="text-xs text-slate-400">➔</span>
                            <span className="font-bold text-slate-600 text-xs">
                              {d.targetPartnerName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{d.date} • {d.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {getSeverityBadge(d.severity)}
                        {getStatusBadge(d.status)}
                      </div>
                    </div>

                    {/* Reason & Description */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <div className="text-xs font-black text-rose-900 mb-1 flex items-center gap-1.5">
                        <span>🎯 {getReasonLabel(d.reason)}</span>
                        {d.customReason && <span className="font-normal text-slate-500">({d.customReason})</span>}
                      </div>
                      <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                        "{d.description}"
                      </p>
                    </div>

                    {/* Resolution Note if resolved */}
                    {d.status === 'resolved' && (
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-black">শান্তিচুক্তি: </span>
                          <span className="font-medium">{d.resolutionMethod || 'মিষ্টি কথায় মীমাংসিত'}</span>
                        </div>
                      </div>
                    )}

                    {/* Dispute Note if disputed */}
                    {d.status === 'disputed' && (
                      <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center gap-2">
                        <Flag className="w-4 h-4 text-purple-600 shrink-0" />
                        <div>
                          <span className="font-black">আপিল/ডিসপিউট বক্তব্য: </span>
                          <span className="font-medium">{d.disputeReason}</span>
                        </div>
                      </div>
                    )}

                    {/* Quick Resolution Input Box if clicking resolve */}
                    {resolvingId === d.id && (
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 animate-in fade-in">
                        <label className="text-xs font-bold text-amber-950 block">
                          {language === 'bn' ? 'কীভাবে মান ভাঙলো? (যেমন: গরম চা, ফুচকা ট্রিট, সরি বলা)' : 'How was peace made?'}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={resolutionMethod}
                            onChange={(e) => setResolutionMethod(e.target.value)}
                            placeholder={language === 'bn' ? 'যেমন: রাতের বেলা গরম কফি বানিয়ে খাইয়েছে' : 'e.g. Made special tea and apologized'}
                            className="flex-1 text-xs rounded-xl border border-amber-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <button
                            onClick={() => {
                              resolveDisagreement(d.id, resolutionMethod);
                              setResolvingId(null);
                              setResolutionMethod('');
                            }}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                          >
                            {language === 'bn' ? 'সম্পন্ন 🕊️' : 'Done 🕊️'}
                          </button>
                          <button
                            onClick={() => setResolvingId(null)}
                            className="px-2.5 py-2 rounded-xl text-slate-500 hover:bg-slate-200 text-xs font-bold"
                          >
                            {t.cancel}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Quick Dispute Input Box if clicking dispute */}
                    {disputingId === d.id && (
                      <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 animate-in fade-in">
                        <label className="text-xs font-bold text-purple-950 block">
                          {language === 'bn' ? 'কেন এটি সঠিক নয় বা অতিরঞ্জিত? (হাস্যরসাত্মক আপিল)' : 'Why is this claim exaggerated or false?'}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={disputeReason}
                            onChange={(e) => setDisputeReason(e.target.value)}
                            placeholder={language === 'bn' ? 'যেমন: বাজারে ধনেপাতাই ছিল না, পুদিনা ছাড়া উপায় ছিল না!' : 'e.g. Market had no coriander, mint was the only choice!'}
                            className="flex-1 text-xs rounded-xl border border-purple-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <button
                            onClick={() => {
                              disputeDisagreement(d.id, disputeReason || 'ভুয়া ও অতিরঞ্জিত অভিযোগ!');
                              setDisputingId(null);
                              setDisputeReason('');
                            }}
                            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                          >
                            {language === 'bn' ? 'আপিল করুন 🚩' : 'Dispute 🚩'}
                          </button>
                          <button
                            onClick={() => setDisputingId(null)}
                            className="px-2.5 py-2 rounded-xl text-slate-500 hover:bg-slate-200 text-xs font-bold"
                          >
                            {t.cancel}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        {d.status === 'unresolved' && (
                          <>
                            <button
                              onClick={() => {
                                setResolvingId(d.id);
                                setResolutionMethod('');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{language === 'bn' ? 'মীমাংসা করুন 🕊️' : 'Resolve 🕊️'}</span>
                            </button>

                            <button
                              onClick={() => {
                                setTargetDisagreementForPeace(d.id);
                                setIsMakePeaceModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Heart className="w-3.5 h-3.5 text-rose-600" />
                              <span>{language === 'bn' ? 'মান ভাঙাও ❤️' : 'Make Peace ❤️'}</span>
                            </button>

                            <button
                              onClick={() => {
                                setDisputingId(d.id);
                                setDisputeReason('');
                              }}
                              className="px-2.5 py-1.5 rounded-xl text-purple-700 hover:bg-purple-50 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Flag className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'ডিসপিউট 🚩' : 'Dispute 🚩'}</span>
                            </button>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm(language === 'bn' ? 'এই খুনসুটির রেকর্ডটি মুছে ফেলতে চান?' : 'Delete this record?')) {
                            deleteDisagreement(d.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right Col: Sorry Counter & Man Vanganor Quick Actions */}
          <div className="space-y-5">
            
            {/* Requirement 3: Sorry Counter */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-base">
                    🙇
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {language === 'bn' ? 'সরি কাউন্টার' : 'Sorry Counter'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {language === 'bn' ? 'কে কয়বার আগে সরি বলেছে!' : 'Who apologized first!'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMakePeaceModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'চটপট সরি বলুন 💖' : 'Say Sorry! 💖'}
                </button>
              </div>

              {/* Progress Bar of Apologies */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-pink-700 flex items-center gap-1">
                    <span>👰 বউ:</span>
                    <span className="font-mono">{jhograStats.bouApologies} বার</span>
                  </span>
                  <span className="text-blue-700 flex items-center gap-1">
                    <span>🤵 বর:</span>
                    <span className="font-mono">{jhograStats.borApologies} বার</span>
                  </span>
                </div>

                {/* Visual Comparative Bar */}
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex border border-slate-200">
                  <div 
                    className="h-full bg-pink-500 transition-all duration-500"
                    style={{ 
                      width: `${
                        jhograStats.bouApologies + jhograStats.borApologies > 0
                          ? Math.round((jhograStats.bouApologies / (jhograStats.bouApologies + jhograStats.borApologies)) * 100)
                          : 50
                      }%` 
                    }}
                  />
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ 
                      width: `${
                        jhograStats.bouApologies + jhograStats.borApologies > 0
                          ? Math.round((jhograStats.borApologies / (jhograStats.bouApologies + jhograStats.borApologies)) * 100)
                          : 50
                      }%` 
                    }}
                  />
                </div>

                <p className="text-[11px] text-center font-semibold text-slate-500 italic mt-1">
                  {jhograStats.borApologies >= jhograStats.bouApologies
                    ? (language === 'bn' ? '🤵 বর বর্তমানে সরি বলায় এগিয়ে আছেন (শান্তির দূত)!' : '🤵 Bor is leading in apologies (Peace Champion)!')
                    : (language === 'bn' ? '👰 বউ বর্তমানে মিষ্টি সরি বলায় এগিয়ে আছেন!' : '👰 Bou is leading in apologies!')}
                </p>
              </div>

              {/* Recent Apology Feed */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {language === 'bn' ? 'সাম্প্রতিক সন্ধি বার্তা' : 'Recent Peace Notes'}
                </span>

                {apologies.slice(0, 3).map((ap) => (
                  <div key={ap.id} className="p-2.5 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-rose-900 mb-0.5">
                      <span>{ap.senderRole === 'bou' ? '👰 বউ ➔ বর' : '🤵 বর ➔ বউ'}</span>
                      <span className="text-[10px] text-rose-500">❤️ Apology</span>
                    </div>
                    <p className="text-slate-800 font-semibold italic text-[11px]">
                      "{language === 'bn' ? ap.banglaMessage : ap.message}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirement 4: Man Vanganor Counter Quick Actions */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
                    🍧
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {language === 'bn' ? 'মান ভাঙানোর পয়েন্ট' : 'Peace Making Points'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {language === 'bn' ? 'শান্তি ফিরিয়ে আনার প্রচেষ্টা' : 'Efforts to restore peace'}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  {language === 'bn' ? `বর: ${jhograStats.borPeacePoints} | বউ: ${jhograStats.bouPeacePoints}` : `Bor: ${jhograStats.borPeacePoints} | Bou: ${jhograStats.bouPeacePoints}`}
                </div>
              </div>

              <label className="text-[11px] font-bold text-slate-500 block">
                {language === 'bn' ? '১-ক্লিকে নিজের মান ভাঙানোর উদ্যোগ রেকর্ড করুন 👇' : '1-Click record your peace gesture 👇'}
              </label>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  onClick={() => handleQuickPeaceActivity('made_cha', 'স্পেশাল এলাচি চা খাওয়ালো', 'Made Special Cardamom Tea', 10)}
                  className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 flex items-center gap-2 transition-all cursor-pointer text-left"
                >
                  <span className="text-base">☕</span>
                  <div className="truncate">
                    <div className="font-bold">{language === 'bn' ? 'গরম চা' : 'Hot Tea'}</div>
                    <div className="text-[10px] text-amber-700">+১০ পয়েন্ট</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickPeaceActivity('brought_food', 'ফুচকা বা মিষ্টি ট্রিট', 'Fuchka / Mishti Treat', 20)}
                  className="p-2.5 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-950 flex items-center gap-2 transition-all cursor-pointer text-left"
                >
                  <span className="text-base">🍧</span>
                  <div className="truncate">
                    <div className="font-bold">{language === 'bn' ? 'ফুচকা ট্রিট' : 'Fuchka Treat'}</div>
                    <div className="text-[10px] text-pink-700">+২০ পয়েন্ট</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickPeaceActivity('did_housework', 'রাতের সব থালাবাসন ধোয়া', 'Night Dishes / Cleaning', 30)}
                  className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 flex items-center gap-2 transition-all cursor-pointer text-left"
                >
                  <span className="text-base">🧽</span>
                  <div className="truncate">
                    <div className="font-bold">{language === 'bn' ? 'থালাবাসন ধোয়া' : 'Dishwashing'}</div>
                    <div className="text-[10px] text-emerald-700">+৩০ পয়েন্ট</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickPeaceActivity('sweet_talk', 'মিষ্টি প্রশংসা ও আদর', 'Sweet Compliments', 15)}
                  className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 flex items-center gap-2 transition-all cursor-pointer text-left"
                >
                  <span className="text-base">🌸</span>
                  <div className="truncate">
                    <div className="font-bold">{language === 'bn' ? 'মিষ্টি প্রশংসা' : 'Sweet Talk'}</div>
                    <div className="text-[10px] text-purple-700">+১৫ পয়েন্ট</div>
                  </div>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 5. Tab 2: Jhogra Calendar (Requirement 6: Jhogra Calendar) */}
      {activeSubTab === 'calendar' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-rose-500" />
                <span>{language === 'bn' ? 'মাসিক ঝগড়া ও খুনসুটি ক্যালেন্ডার' : 'Monthly Disagreement Calendar'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn' ? 'কোন তারিখে কী নিয়ে মান-অভিমান হয়েছিল তা ক্যালেন্ডারে দেখুন' : 'See which day had sulking and how it was resolved'}
              </p>
            </div>

            {selectedCalendarDate && (
              <button
                onClick={() => setSelectedCalendarDate(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                ✕ {language === 'bn' ? 'ফিল্টার মুছুন' : 'Clear Date Filter'} ({selectedCalendarDate})
              </button>
            )}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'].map((d, i) => (
              <div key={i} className="text-center text-xs font-black text-slate-400 py-1 uppercase">
                {d}
              </div>
            ))}

            {calendarDays.map((item) => {
              const hasIncidents = item.items.length > 0;
              const isSelected = selectedCalendarDate === item.dateStr;
              return (
                <div
                  key={item.dateStr}
                  onClick={() => {
                    if (hasIncidents) setSelectedCalendarDate(item.dateStr);
                  }}
                  className={`min-h-[72px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-400 shadow-sm'
                      : hasIncidents
                      ? 'border-rose-200 bg-rose-50/40 hover:bg-rose-50 cursor-pointer shadow-xs'
                      : 'border-slate-100 bg-slate-50/50 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${hasIncidents ? 'text-slate-900' : 'text-slate-400'}`}>
                      {item.dayNum}
                    </span>
                    {hasIncidents && (
                      <span className="text-[10px] bg-rose-500 text-white font-mono px-1 rounded-full font-bold">
                        {item.items.length}
                      </span>
                    )}
                  </div>

                  {hasIncidents && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.items.map(inc => (
                        <span key={inc.id} title={inc.description} className="text-xs">
                          {inc.status === 'resolved' ? '🕊️' : inc.severity === 'big' ? '💥' : '🤏'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Date Details */}
          {selectedCalendarDate && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900">
                {language === 'bn' ? `${selectedCalendarDate} তারিখের খুনসুটি তালিকা:` : `Disagreements on ${selectedCalendarDate}:`}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {disagreements.filter(d => d.date === selectedCalendarDate).map(d => (
                  <div key={d.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{d.reportedByName}</span>
                      {getStatusBadge(d.status)}
                    </div>
                    <p className="font-semibold text-slate-800">"{d.description}"</p>
                    {d.status === 'resolved' && (
                      <p className="text-[11px] text-emerald-700 font-bold">🕊️ {d.resolutionMethod}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 6. Tab 3: Man Vanganor Leaderboard (Requirement 4: Man Vanganor Counter) */}
      {activeSubTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <span>🍧</span>
                  <span>{language === 'bn' ? 'মান ভাঙানোর মাসিক লিডারবোর্ড' : 'Monthly Man Vanganor Leaderboard'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'কে কতবার ভালোবাসা ও মিষ্টি উদ্যোগ দিয়ে মান ভাঙিয়েছে' : 'Ranking of peace-making efforts and loving treats'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  🏆 {language === 'bn' ? 'মাসের শান্তিদূত:' : 'Leader:'} {jhograStats.peaceMakerLeader === 'bor' ? 'তানভীর (বর)' : 'নুসরাত (বউ)'}
                </span>
              </div>
            </div>

            {/* Couple Scoreboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Bou's Score Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-pink-50 via-rose-50 to-white border border-pink-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-pink-500/20">
                      👰
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">নুসরাত জাহান (বউ)</h4>
                      <p className="text-xs text-pink-700 font-bold">Chief Finance & Emotion Officer</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-pink-700 font-mono">{jhograStats.bouPeacePoints}</span>
                    <span className="text-xs font-bold text-slate-400 block">পয়েন্ট</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 border border-pink-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">সরি বলা হয়েছে:</span>
                    <span className="font-mono font-bold text-pink-700">{jhograStats.bouApologies} বার</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">মোট সন্ধির উদ্যোগ:</span>
                    <span className="font-mono font-bold text-pink-700">
                      {peaceActivities.filter(p => p.madeBy === 'bou').length} বার
                    </span>
                  </div>
                </div>
              </div>

              {/* Bor's Score Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-white border border-blue-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-blue-600/20">
                      🤵
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">তানভীর আহমেদ (বর)</h4>
                      <p className="text-xs text-blue-700 font-bold">Chief Bazar Commander & Envoy</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-blue-700 font-mono">{jhograStats.borPeacePoints}</span>
                    <span className="text-xs font-bold text-slate-400 block">পয়েন্ট</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 border border-blue-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">সরি বলা হয়েছে:</span>
                    <span className="font-mono font-bold text-blue-700">{jhograStats.borApologies} বার</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">মোট সন্ধির উদ্যোগ:</span>
                    <span className="font-mono font-bold text-blue-700">
                      {peaceActivities.filter(p => p.madeBy === 'bor').length} বার
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Peace Activity History Feed */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span>📜</span>
                <span>{language === 'bn' ? 'মান ভাঙানোর কার্যকলাপের ইতিহাস' : 'Peace-Making Activities History'}</span>
              </h4>

              <div className="space-y-2">
                {peaceActivities.map((pa) => (
                  <div key={pa.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">
                        {pa.activityType === 'made_cha' ? '☕' : pa.activityType === 'brought_food' ? '🍧' : pa.activityType === 'did_housework' ? '🧽' : '🌸'}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900">
                          {language === 'bn' ? pa.banglaTitle : pa.title}
                        </span>
                        <span className="text-[11px] text-slate-500 ml-2">({pa.madeByName})</span>
                        {pa.notes && <p className="text-[10px] text-slate-400 mt-0.5">{pa.notes}</p>}
                      </div>
                    </div>

                    <span className="font-mono font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-xs shrink-0">
                      +{pa.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 7. Tab 4: Monthly Report & Peace Maker Awards (Requirement 5 & 8) */}
      {activeSubTab === 'report' && (
        <div className="space-y-6">
          
          {/* Awards Showcase (Requirement 5: Peace Maker Award) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <span>🏆</span>
                  <span>{language === 'bn' ? 'চলতি মাসের শান্তি পদক ও অ্যাওয়ার্ড' : 'Monthly Peace Maker Awards'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'সংসারের ভালোবাসা ও খুনসুটির রসালো স্বীকৃতি' : 'Humorous and friendly couple recognitions'}
                </p>
              </div>

              <button
                onClick={() => setIsTreatyModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <span>📜</span>
                <span>{language === 'bn' ? 'শান্তি চুক্তিপত্র দেখুন ও ডাউনলোড করুন' : 'View Peace Treaty'}</span>
              </button>
            </div>

            {/* 5 Playful Awards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jhograStats.awards.map((aw) => (
                <div
                  key={aw.id}
                  className="p-5 rounded-3xl bg-gradient-to-b from-[#FFFDF9] to-amber-50/40 border border-amber-200 shadow-soft hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-2xl shadow-md shadow-amber-400/20">
                      {aw.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                      MONTHLY AWARD
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-sm">
                      {language === 'bn' ? aw.banglaTitle : aw.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {language === 'bn' ? aw.banglaDescription : aw.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-amber-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {language === 'bn' ? 'পদকপ্রাপ্ত বিজয়ী:' : 'Awardee:'}
                    </span>
                    <span className="font-extrabold text-slate-900 text-xs text-amber-800">
                      {aw.winnerName}
                    </span>
                    <p className="text-[11px] text-slate-600 italic mt-1">
                      "{language === 'bn' ? aw.banglaFunnyComment : aw.funnyComment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Monthly Statistics Summary (Requirement 8) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-5">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>{language === 'bn' ? 'মাসিক খুনসুটি ও আপোষ রিপোর্ট' : 'Monthly Disagreement & Peace Report'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500">মীমাংসার হার (Resolution Rate)</span>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  {jhograStats.totalThisMonth > 0 ? `${Math.round((jhograStats.resolvedCount / jhograStats.totalThisMonth) * 100)}%` : '100%'}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">সব খুনসুটির সিংহভাগই তাৎক্ষণিক আপোষ হয়</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500">গড় মীমাংসার সময় (Avg. Peace Time)</span>
                <div className="text-2xl font-black text-slate-900 mt-1">১.৮ ঘণ্টা</div>
                <p className="text-[11px] text-slate-400 mt-0.5">সর্বোচ্চ ২ ঘণ্টার মধ্যে ফুচকা বা চা দিয়ে সমাধান</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500">গত মাসের সাথে তুলনা</span>
                <div className="text-2xl font-black text-rose-600 mt-1">-২৫% খুনসুটি 🌿</div>
                <p className="text-[11px] text-slate-400 mt-0.5">সংসার আগের মাসের চেয়ে ২৫% বেশি শান্তিময়</p>
              </div>
            </div>

            {/* Verdict */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs text-emerald-950 font-semibold leading-relaxed">
              💡 {language === 'bn'
                ? 'পারিবারিক সারসংক্ষেপ: সংসারে হালকা মান-অভিমান আর খুনসুটিই ভালোবাসার আসল মশলা! আপনারা একে অপরকে দ্রুত মাফ করতে জানেন এবং গরম চা ও ফুচকা দিয়ে মান ভাঙাতে পারেন। সংসার চলুক স্মার্টলি, ভালোবাসা থাকুক চিরকাল! ❤️'
                : 'Family Summary: Little banters are the true spice of a loving home! You know how to forgive quickly and make peace over hot tea and fuchka dates. May love and happiness always prosper! ❤️'}
            </div>
          </div>

        </div>
      )}

      {/* Modals */}
      <RecordJhograModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />

      <MakePeaceModal
        isOpen={isMakePeaceModalOpen}
        onClose={() => setIsMakePeaceModalOpen(false)}
        disagreementId={targetDisagreementForPeace}
      />

      <PeaceTreatyModal
        isOpen={isTreatyModalOpen}
        onClose={() => setIsTreatyModalOpen(false)}
      />

    </div>
  );
};
