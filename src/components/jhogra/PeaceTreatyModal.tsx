import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Printer, 
  Heart, 
  Award, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  FileCheck 
} from 'lucide-react';

interface PeaceTreatyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PeaceTreatyModal: React.FC<PeaceTreatyModalProps> = ({ isOpen, onClose }) => {
  const { activeHousehold, jhograStats, language } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-300 max-h-[95vh] overflow-y-auto print:p-0 print:border-none print:shadow-none">
        
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden mb-4">
          <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm">
            <Award className="w-5 h-5 text-amber-600" />
            <span>{language === 'bn' ? 'পারিবারিক শান্তি চুক্তিপত্র ও সনদ' : 'Family Peace Treaty & Honor Certificate'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'প্রিন্ট বা সেভ করুন' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Certificate Design */}
        <div className="relative p-6 sm:p-10 rounded-2xl bg-[#FFFDF7] border-2 border-amber-200 text-center space-y-5 overflow-hidden">
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-amber-400 text-2xl select-none">❧</div>
          <div className="absolute top-2 right-2 text-amber-400 text-2xl select-none">☙</div>
          <div className="absolute bottom-2 left-2 text-amber-400 text-2xl select-none">❧</div>
          <div className="absolute bottom-2 right-2 text-amber-400 text-2xl select-none">☙</div>

          {/* Crest / Header */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30 mb-2">
              🕊️
            </div>
            <span className="text-xs font-black tracking-widest text-amber-800 uppercase bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              {language === 'bn' ? 'পবিত্র দাম্পত্য শান্তি সনদ' : 'Official Household Peace Concordat'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-serif">
              {language === 'bn' ? 'পারিবারিক শান্তি চুক্তিপত্র' : 'Family Peace Treaty'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {activeHousehold.banglaName || activeHousehold.name} • {language === 'bn' ? 'সংসার কোড:' : 'Household Code:'} {activeHousehold.inviteCode}
            </p>
          </div>

          {/* Preamble */}
          <div className="max-w-lg mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed font-serif italic border-y border-amber-200/80 py-3">
            {language === 'bn' 
              ? 'আমরা অত্র সংসারের সম্মানিত পক্ষদ্বয় (বউ ও বর) একমত হইয়া অঙ্গীকার করিতেছি যে, বাজারে ডিম বা ধনেপাতা ভুলিয়া যাওয়া, টিভিতে ক্রিকেট ম্যাচ চলাকালে রিমোট কাড়াকাড়ি, কিংবা চায়ে বেশি চিনি দেওয়ার মতো জাতীয় সংকটাবস্থা অবিলম্বে ক্ষমা-সুন্দর দৃষ্টিতে মীমাংসা করা হইবে।'
              : 'We, the esteemed high contracting parties of this household, solemnly pledge that all grocery forgetfulness, remote control disputes, and tea sweetness disagreements shall be resolved with love, hot tea, and immediate hugs.'}
          </div>

          {/* Key Treaty Articles (Humorous & Affectionate) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <span>🛒 ধারা ১: বাজার প্রতিরক্ষা</span>
              </h4>
              <p className="text-[11px] text-amber-900 mt-1 leading-normal">
                {language === 'bn' 
                  ? 'বর বাজার থেকে কিছু ভুলিয়া আসিলে বউ তাহাকে বকা না দিয়া মিষ্টি হাসিমুখে বুঝাইয়া বলিবে।' 
                  : 'If Bor forgets an item from bazar, Bou shall respond with affectionate advice instead of scolding.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <span>☕ ধারা ২: সন্ধি চা নীতি</span>
              </h4>
              <p className="text-[11px] text-amber-900 mt-1 leading-normal">
                {language === 'bn' 
                  ? 'যাহার দোষ বেশি প্রমাণিত হইবে, সে অবিলম্বে স্পেশাল মসলা চা বানাইয়া পরিবেশন করিতে বাধ্য থাকিবে।' 
                  : 'Whosoever is proven at fault shall brew special cardamom tea for the other party.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <span>📱 ধারা ৩: ডিজিটাল নীরবতা</span>
              </h4>
              <p className="text-[11px] text-amber-900 mt-1 leading-normal">
                {language === 'bn' 
                  ? 'কথা বলিবার সময় মোবাইলে রিলস দেখা নিষিদ্ধ ঘোষিত হইল। চোখের দিকে তাকাইয়া কথা বলিতে হইবে।' 
                  : 'Phone scrolling during family conversation is hereby restricted; eye contact is mandatory.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <span>🍧 ধারা ৪: ফুচকা ক্ষতিপূরণ</span>
              </h4>
              <p className="text-[11px] text-amber-900 mt-1 leading-normal">
                {language === 'bn' 
                  ? 'যে কোনো মান-অভিমান সর্বোচ্চ ২ ঘণ্টার মধ্যে ফুচকা বা আইসক্রিম ট্রিট দ্বারা মীমাংসা করিতে হইবে।' 
                  : 'Any sulk lasting over 2 hours must be unconditionally resolved with evening street food.'}
              </p>
            </div>
          </div>

          {/* Month's Peace Statistics Banner */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center justify-around">
            <div>
              <span>মোট খুনসুটি: </span>
              <span className="font-mono text-emerald-800">{jhograStats.totalThisMonth} টি</span>
            </div>
            <div>
              <span>শান্তিচুক্তি সম্পন্ন: </span>
              <span className="font-mono text-emerald-800">{jhograStats.resolvedCount} টি</span>
            </div>
            <div>
              <span>শান্তির দূত: </span>
              <span className="font-mono text-emerald-800">{jhograStats.peaceMakerLeader === 'bor' ? 'তানভীর (বর)' : 'নুসরাত (বউ)'}</span>
            </div>
          </div>

          {/* Seal & Signatures */}
          <div className="pt-6 border-t border-amber-200 flex items-end justify-between px-4 sm:px-8">
            <div className="text-center">
              <div className="font-serif italic font-bold text-slate-800 text-sm border-b border-slate-400 pb-1 px-4">
                Nusrat Jahan
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-1">
                {language === 'bn' ? 'স্বাক্ষর: বউ (প্রধান বিচারক)' : 'Signed: Bou (Chief Judge)'}
              </p>
            </div>

            {/* Golden Wax Seal */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 border-2 border-white shadow-md flex items-center justify-center text-white flex-col">
              <ShieldCheck className="w-6 h-6" />
              <span className="text-[8px] font-black uppercase tracking-tighter">PEACE SEAL</span>
            </div>

            <div className="text-center">
              <div className="font-serif italic font-bold text-slate-800 text-sm border-b border-slate-400 pb-1 px-4">
                Tanvir Ahmed
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-1">
                {language === 'bn' ? 'স্বাক্ষর: বর (শান্তির দূত)' : 'Signed: Bor (Peace Envoy)'}
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            {language === 'bn' ? 'চুক্তি সম্পাদিত তারিখ:' : 'Concordat Executed on:'} {todayStr}
          </div>

        </div>

      </div>
    </div>
  );
};
