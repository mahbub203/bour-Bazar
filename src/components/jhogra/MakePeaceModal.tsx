import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Heart, 
  Send, 
  Sparkles, 
  Coffee, 
  Utensils, 
  Smile, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { ApologyCategory } from '../../types';

interface MakePeaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  disagreementId?: string;
}

export const MakePeaceModal: React.FC<MakePeaceModalProps> = ({ 
  isOpen, 
  onClose,
  disagreementId 
}) => {
  const { activeUser, sendApology, language, t } = useApp();

  const predefinedMessages = [
    {
      category: 'food' as ApologyCategory,
      icon: '☕',
      en: 'Rag koro na, cholo ekshathe gorom cha khai! ❤️',
      bn: 'রাগ করো না গো, চলো একসাথে গরম ধোঁয়া ওঠা চা খাই! ❤️'
    },
    {
      category: 'food' as ApologyCategory,
      icon: '🍲',
      en: 'Bazar e jaite bhule gechi, ekhon fushkā aar mishti khawabo!',
      bn: 'বাজারে যেতে ভুল করেছি, চলো আজ সন্ধ্যায় স্পেশাল ফুচকা আর মিষ্টি খাওয়াই! 🍧'
    },
    {
      category: 'promise' as ApologyCategory,
      icon: '📱',
      en: 'Shotti bolchi ar phone tipbo na, ebar ektu hasho na!',
      bn: 'সত্যি বলছি আর অকারণে ফোন টিপব না, এবার একটু মিষ্টি করে হাসো তো! 📱❌'
    },
    {
      category: 'surrender' as ApologyCategory,
      icon: '🙇',
      en: 'Tumi shobshomoy thik, ami bhul! Maaf kore dao bou rani!',
      bn: 'তুমি সবসময় ১০০% ঠিক, আমিই ভুল! দুই কান ধরে মাফ চাইছি! 🙇❤️'
    },
    {
      category: 'cute' as ApologyCategory,
      icon: '🍳',
      en: 'Ajker ranna aar thalbashon ami dhobo, shanti chai!',
      bn: 'আজকের রাতের সব রান্না আর থালাবাসন আমি নিজ দায়িত্বে ধোবো, শান্তি চাই! 🧽'
    },
    {
      category: 'cute' as ApologyCategory,
      icon: '🥚',
      en: 'Dhonēpātā bhule mishti enechi, ekhon mishti kheye shanti koro!',
      bn: 'ধনেপাতা আনতে ভুলে মিষ্টি নিয়ে এসেছি, এখন মিষ্টি খেয়ে রাগটা কমাও প্লিজ! 🍬'
    }
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [customMsg, setCustomMsg] = useState('');
  const [category, setCategory] = useState<ApologyCategory>('cute');

  if (!isOpen) return null;

  const handleSend = () => {
    const selected = predefinedMessages[selectedIndex];
    const messageEn = customMsg.trim() || selected.en;
    const messageBn = customMsg.trim() || selected.bn;

    sendApology(messageEn, messageBn, category, disagreementId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-rose-500/20">
              🕊️
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <span>{language === 'bn' ? 'মান ভাঙাও ও সন্ধি করো' : 'Make Peace & Apologize'}</span>
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                  ❤️ Peace Maker
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'একটি মিষ্টি সরি ও ভালোবাসার বার্তার শক্তি অপরিসীম' : 'A sweet apology turns quarrels into affection'}
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

        {/* Selected Message Banner Carousel */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border border-rose-200/80 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>{predefinedMessages[selectedIndex].icon}</span>
              <span>{language === 'bn' ? 'মিষ্টি সন্ধির বার্তা' : 'Peace-Making Note'}</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedIndex((prev) => (prev + 1) % predefinedMessages.length)}
              className="text-xs font-bold text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'bn' ? 'আরেকটি দেখাও' : 'Next Quote'}</span>
            </button>
          </div>

          <p className="text-base font-extrabold text-slate-900 leading-snug">
            "{language === 'bn' ? predefinedMessages[selectedIndex].bn : predefinedMessages[selectedIndex].en}"
          </p>
        </div>

        {/* Preset Carousel Chips */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {language === 'bn' ? 'অথবা পছন্দের বার্তা নির্বাচন করুন 👇' : 'Or choose from loving presets 👇'}
          </label>
          <div className="space-y-2">
            {predefinedMessages.map((msg, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setCategory(msg.category);
                    setCustomMsg('');
                  }}
                  className={`p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-rose-300'
                  }`}
                >
                  <span className="text-lg shrink-0">{msg.icon}</span>
                  <span className="flex-1">
                    {language === 'bn' ? msg.bn : msg.en}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Message Area */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {language === 'bn' ? 'অথবা নিজের ভাষায় মিষ্টি করে লিখুন ✍️' : 'Or write your own loving apology ✍️'}
          </label>
          <textarea
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            rows={2}
            placeholder={language === 'bn' ? 'নিজের মতো করে রোমান্টিক বা মজার কিছু লিখুন...' : 'Write your own cute message...'}
            className="w-full text-xs font-medium rounded-xl border border-slate-200 p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+15 {language === 'bn' ? 'শান্তি পয়েন্ট অর্জিত হবে!' : 'Peace points will be awarded!'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {t.cancel || 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs shadow-md shadow-rose-500/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সন্ধি বার্তা পাঠান 🕊️' : 'Send Peace Message 🕊️'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
