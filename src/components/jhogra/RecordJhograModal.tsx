import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Swords, 
  AlertCircle, 
  Clock, 
  Calendar, 
  User, 
  Sparkles,
  ShoppingBag,
  Ear,
  PhoneOff,
  Flame,
  Tv,
  Coins,
  BrainCircuit,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { DisagreementReason, DisagreementSeverity, UserRole } from '../../types';

interface RecordJhograModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecordJhograModal: React.FC<RecordJhograModalProps> = ({ isOpen, onClose }) => {
  const { activeUser, addDisagreement, t, language, activeHousehold } = useApp();

  const [reportedBy, setReportedBy] = useState<UserRole>(activeUser.role);
  const [targetPartner, setTargetPartner] = useState<UserRole>(activeUser.role === 'bou' ? 'bor' : 'bou');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [reason, setReason] = useState<DisagreementReason>('bazar_forgotten');
  const [customReason, setCustomReason] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<DisagreementSeverity>('small');
  const [isResolvedImmediately, setIsResolvedImmediately] = useState(false);
  const [resolutionMethod, setResolutionMethod] = useState('');

  if (!isOpen) return null;

  const reasonsList: { id: DisagreementReason; labelEn: string; labelBn: string; icon: string }[] = [
    { id: 'bazar_forgotten', labelEn: 'Forgot to bring bazar 🛒', labelBn: 'বাজার আনতে ভুলে গেছে 🛒', icon: '🛒' },
    { id: 'didnt_listen', labelEn: "Didn't listen carefully 👂", labelBn: 'মন দিয়ে কথা শোনেনি 👂', icon: '👂' },
    { id: 'came_home_late', labelEn: 'Came home late ⏰', labelBn: 'দেরি করে বাসায় ফেরা ⏰', icon: '⏰' },
    { id: 'phone_usage', labelEn: 'Too much phone usage 📱', labelBn: 'সারাদিন ফোন টেপাটিপি 📱', icon: '📱' },
    { id: 'overspent_budget', labelEn: 'Overspent the budget 💸', labelBn: 'বাজেট ছাড়িয়ে উল্টাপাল্টা খরচ 💸', icon: '💸' },
    { id: 'remote_fight', labelEn: 'Remote control fight 📺', labelBn: 'টিভির রিমোট নিয়ে কাড়াকাড়ি 📺', icon: '📺' },
    { id: 'forgot_important', labelEn: 'Forgot something important 🧠', labelBn: 'গুরুত্বপূর্ণ তারিখ বা কথা ভুলে গেছে 🧠', icon: '🧠' },
    { id: 'other', labelEn: 'Other dramatic reasons 🎭', labelBn: 'অন্যান্য নাটকীয় কারণ 🎭', icon: '🎭' },
  ];

  const presetDescriptions = [
    { en: 'Asked for eggs and coriander, brought mint leaves and sweets!', bn: 'ডিম আর ধনেপাতা চেয়েছিলাম, নিয়ে আসছে পুদিনাপাতা আর মিষ্টি!' },
    { en: 'Scrolling social media with blank stare while being talked to!', bn: 'জরুরি কথা বলছি, আর ও মোবাইলে রিলস দেখে মুচকি হাসছে!' },
    { en: 'Took the remote right during the climax of the cricket match!', bn: 'ম্যাচের শেষ ওভারে রিমোট কেড়ে নিয়ে সিরিয়াল দেখা শুরু করল!' },
    { en: 'Asked for 1 spoon sugar in cha, got 3 spoons of sugar syrup!', bn: 'চায়ে ১ চামচ চিনি চেয়েছিলাম, বানিয়ে দিয়েছে ৩ চামচের শরবত!' },
    { en: 'Went to buy 1 kg fish, came back with huge expensive hilsa!', bn: 'বাজেট ছিল সাধারণ মাছের, নিয়ে আসছে ১৫০০ টাকার বড় নদীর ইলিশ!' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const reportedByName = reportedBy === 'bou' ? 'Nusrat Jahan (Bou)' : reportedBy === 'bor' ? 'Tanvir Ahmed (Bor)' : 'Family Member';
    const targetPartnerName = targetPartner === 'bou' ? 'Nusrat Jahan (Bou)' : targetPartner === 'bor' ? 'Tanvir Ahmed (Bor)' : 'Family Member';

    addDisagreement({
      reportedBy,
      reportedByName,
      targetPartner,
      targetPartnerName,
      date,
      time,
      reason,
      customReason: reason === 'other' ? customReason : undefined,
      description: description.trim(),
      severity,
      status: isResolvedImmediately ? 'resolved' : 'unresolved',
      resolvedAt: isResolvedImmediately ? new Date().toISOString() : undefined,
      resolvedBy: isResolvedImmediately ? reportedBy : undefined,
      resolutionMethod: isResolvedImmediately ? (resolutionMethod || 'উভয়ের হাসিমুখে তাৎক্ষণিক মীমাংসা') : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-rose-500/20">
              🥊
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {language === 'bn' ? 'নতুন খুনসুটি রেকর্ড করুন' : 'Record a Disagreement'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'সংসারের মিষ্টি মান-অভিমানের হিসাব রাখুন 😂' : 'Keep playful records of little household banters'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Who reported vs Who is accused */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'অভিযোগকারী ✍️' : 'Who Reported? ✍️'}
              </label>
              <select
                value={reportedBy}
                onChange={(e) => {
                  const val = e.target.value as UserRole;
                  setReportedBy(val);
                  setTargetPartner(val === 'bou' ? 'bor' : 'bou');
                }}
                className="w-full text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="bou">👰 {t.bou || 'Bou'}</option>
                <option value="bor">🤵 {t.bor || 'Bor'}</option>
                <option value="member">👤 {t.member || 'Member'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'অভিযুক্ত জীবনসঙ্গী 🎯' : 'Target Partner 🎯'}
              </label>
              <select
                value={targetPartner}
                onChange={(e) => setTargetPartner(e.target.value as UserRole)}
                className="w-full text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="bor">🤵 {t.bor || 'Bor'}</option>
                <option value="bou">👰 {t.bou || 'Bou'}</option>
                <option value="member">👤 {t.member || 'Member'}</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'তারিখ 📅' : 'Date 📅'}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs font-semibold rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'সময় ⏰' : 'Time ⏰'}
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs font-semibold rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
          </div>

          {/* Reason Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {language === 'bn' ? 'ঝগড়া বা অভিমানের মূল কারণ 🎯' : 'Primary Disagreement Reason 🎯'}
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200">
              {reasonsList.map((r) => {
                const isSelected = reason === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setReason(r.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <span className="text-sm">{r.icon}</span>
                    <span className="truncate">{language === 'bn' ? r.labelBn : r.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {reason === 'other' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'কাস্টম কারণ লিখুন' : 'Specify Custom Reason'}
              </label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: এসির তাপমাত্রা ১৮ না ২৪ রাখা হবে...' : 'e.g. AC temperature argument (18 vs 24)...'}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          )}

          {/* Severity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {language === 'bn' ? 'ঝগড়ার তীব্রতা / নাটকের মাত্রা 🌡️' : 'Severity Level 🌡️'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSeverity('small')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                  severity === 'small'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-base mb-0.5">🤏</div>
                <div>{language === 'bn' ? 'হালকা মান-অভিমান' : 'Small Sulk'}</div>
              </button>

              <button
                type="button"
                onClick={() => setSeverity('medium')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                  severity === 'medium'
                    ? 'bg-orange-100 text-orange-900 border-orange-300 ring-2 ring-orange-400'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-base mb-0.5">🗣️</div>
                <div>{language === 'bn' ? 'মাঝারি চিল্লাচিল্লি' : 'Heated Talk'}</div>
              </button>

              <button
                type="button"
                onClick={() => setSeverity('big')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                  severity === 'big'
                    ? 'bg-rose-100 text-rose-900 border-rose-300 ring-2 ring-rose-400'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-base mb-0.5">💥</div>
                <div>{language === 'bn' ? 'মহাপ্রলয় / হাড়ি গরম' : 'World War 3'}</div>
              </button>
            </div>
          </div>

          {/* Description & Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                {language === 'bn' ? 'ঘটনার সংক্ষিপ্ত বিবরণ 📝' : 'Short Description 📝'}
              </label>
              <span className="text-[10px] text-slate-400">
                {language === 'bn' ? 'ক্লিক করে দ্রুত প্রিসেট দিন' : 'Click preset below'}
              </span>
            </div>
            
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={language === 'bn' ? 'কী ঘটেছিল সংক্ষেপে লিখুন (হাস্যরসাত্মকভাবে)...' : 'Describe the incident humorously...'}
              className="w-full text-xs font-medium rounded-xl border border-slate-200 p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {presetDescriptions.slice(0, 3).map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDescription(language === 'bn' ? p.bn : p.en)}
                  className="text-[10px] bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 px-2 py-1 rounded-lg border border-slate-200 transition-colors truncate max-w-full text-left"
                >
                  ⚡ {language === 'bn' ? p.bn : p.en}
                </button>
              ))}
            </div>
          </div>

          {/* Already Resolved Checkbox */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isResolvedImmediately}
                onChange={(e) => setIsResolvedImmediately(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-emerald-900">
                {language === 'bn' ? 'ইতিমধ্যে মীমাংসা ও শান্তিচুক্তি হয়ে গেছে! 🕊️' : 'Already resolved with peace! 🕊️'}
              </span>
            </label>

            {isResolvedImmediately && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={resolutionMethod}
                  onChange={(e) => setResolutionMethod(e.target.value)}
                  placeholder={language === 'bn' ? 'কীভাবে মান ভাঙলো? (যেমন: গরম চা, সরি বলা, চকলেট ট্রিট)' : 'How was peace made? (e.g. made hot tea, chocolates, hugs)'}
                  className="w-full text-xs font-medium rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {t.cancel || 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-extrabold text-xs shadow-md shadow-rose-500/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🥊 {language === 'bn' ? 'ঝগড়া সংরক্ষণ করুন' : 'Save Disagreement'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
