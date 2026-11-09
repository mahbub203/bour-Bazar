import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Bell, 
  Send, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  Heart,
  Volume2
} from 'lucide-react';

interface BouAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BouAlertModal: React.FC<BouAlertModalProps> = ({ isOpen, onClose }) => {
  const { 
    bazarItems, 
    triggerBouAlert, 
    snoozeBouAlert, 
    requestBrowserPushNotification,
    t, 
    language,
    activeUser 
  } = useApp();

  const defaultQuote = t?.alertQuote1 || t?.reminder1 || (language === 'bn' ? "বউ এর লিস্ট এখনো পেন্ডিং! 😂" : "Bou er list ekhono pending! 😂");
  const [customQuote, setCustomQuote] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(defaultQuote);
  const [pushStatus, setPushStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const urgentPending = bazarItems.filter(i => !i.isPurchased && i.priority === 'urgent');
  const allPending = bazarItems.filter(i => !i.isPurchased);

  const quotes = [
    t?.alertQuote1 || t?.reminder1 || (language === 'bn' ? "বউ এর লিস্ট এখনো পেন্ডিং! 😂" : "Bou er list ekhono pending! 😂"),
    t?.alertQuote2 || t?.reminder2 || (language === 'bn' ? "বাজারে যাওয়ার সময় হয়ে গেছে!" : "Bazar e jawar shomoy hoye geche!"),
    t?.alertQuote3 || t?.reminder3 || (language === 'bn' ? "ডিম আনতে ভুলে যাবেন না!" : "Dim ante bhule jaben na! (Remember the eggs!)"),
    t?.alertQuote4 || t?.reminder4 || (language === 'bn' ? "বউ বাজারের আপডেটের জন্য অপেক্ষা করছে!" : "Bou is waiting for the bazar update!"),
    t?.alertQuote5 || t?.reminder5 || (language === 'bn' ? "বাজার কমপ্লিট করলে শান্তি পাবেন! ❤️" : "Bazar complete korle shanti paben! ❤️"),
  ];

  const handleSendAlert = () => {
    const messageToSend = customQuote.trim() || selectedQuote;
    triggerBouAlert(messageToSend);
    onClose();
  };

  const handleEnablePush = async () => {
    const granted = await requestBrowserPushNotification();
    if (granted) {
      setPushStatus(t.pushPermissionGranted);
    } else {
      setPushStatus("Push notification permission was denied or not supported in this browser.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {t?.bouAlertTitle || t?.reminderTitle || (language === 'bn' ? 'বউ এলার্ট 🚨' : 'Bou Alert 🚨')}
              </h3>
              <p className="text-xs text-slate-500">
                {t?.bouAlertSubtitle || (language === 'bn' ? 'বাজার মনে করিয়ে দেওয়ার বুদ্ধিমান ও হাস্যরসাত্মক সিস্টেম' : 'Intelligent pending reminder & partner notification system')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Urgent Items Summary */}
        <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Pending Bazar Items: {allPending.length}</span>
            </span>
            {urgentPending.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700">
                {urgentPending.length} Urgent!
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {allPending.slice(0, 5).map(item => (
              <span key={item.id} className="px-2.5 py-1 rounded-xl bg-white border border-amber-200 text-xs font-semibold text-slate-800">
                {item.priority === 'urgent' ? '🔴 ' : ''}{item.banglaTitle || item.title}
              </span>
            ))}
            {allPending.length > 5 && (
              <span className="text-xs text-amber-800 font-bold self-center">
                +{allPending.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Funny Quote Options */}
        <div className="mt-4">
          <label className="text-xs font-bold text-slate-700 block mb-2">
            Select a Humorous Bangladeshi Reminder:
          </label>
          <div className="space-y-2">
            {quotes.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedQuote(q);
                  setCustomQuote('');
                }}
                className={`w-full text-left p-3 rounded-2xl text-xs font-bold border transition-all ${
                  selectedQuote === q && !customQuote
                    ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* Custom Message Input */}
        <div className="mt-4">
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Or Write Your Own Custom Note for Bor:
          </label>
          <input
            type="text"
            value={customQuote}
            onChange={(e) => setCustomQuote(e.target.value)}
            placeholder="e.g. Karwan Bazar jawar age phone dio..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Browser Push Notification Permission */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Desktop / Mobile Browser Push
            </span>
            <span className="text-[10px] text-slate-500">
              Shopper will get alert even if screen is locked
            </span>
          </div>
          <button
            type="button"
            onClick={handleEnablePush}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            {t.enablePushNotifications}
          </button>
        </div>

        {pushStatus && (
          <p className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
            {pushStatus}
          </p>
        )}

        {/* Bottom Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              snoozeBouAlert(30);
              onClose();
            }}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            {t.snoozeReminder}
          </button>

          <button
            type="button"
            onClick={handleSendAlert}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t?.sendBouAlertNow || (language === 'bn' ? 'এখনই বউ এলার্ট পাঠান 🔔' : 'Trigger Bou Alert Now 🔔')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
