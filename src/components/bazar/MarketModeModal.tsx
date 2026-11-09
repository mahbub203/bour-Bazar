import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, ShoppingBag, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

interface MarketModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestRecordPrice: (item: any) => void;
}

export const MarketModeModal: React.FC<MarketModeModalProps> = ({
  isOpen,
  onClose,
  onRequestRecordPrice
}) => {
  const { 
    bazarItems, 
    togglePurchased, 
    archiveCurrentBazarTrip, 
    t, 
    language,
    activeUser 
  } = useApp();

  if (!isOpen) return null;

  const pending = bazarItems.filter(i => !i.isPurchased);
  const completed = bazarItems.filter(i => i.isPurchased);

  const estPendingTotal = pending.reduce((sum, i) => sum + i.estimatedPrice, 0);
  const actualCompletedTotal = completed.reduce((sum, i) => sum + (i.actualPrice || i.estimatedPrice), 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg text-white">
                Market Mode (বাজারে লাইভ মোড)
              </h2>
              <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase">
                High Contrast
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Shopping as {activeUser.name} • Tap to mark purchased
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Floating Status Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 block">Pending Items</span>
          <span className="text-lg font-black text-amber-400">
            {pending.length} items (৳{estPendingTotal})
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block">Total Spent so far</span>
          <span className="text-lg font-black text-emerald-400">
            ৳{actualCompletedTotal}
          </span>
        </div>
      </div>

      {/* Item List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-w-2xl mx-auto w-full">
        {pending.length === 0 && completed.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xl font-bold text-slate-300">No bazar items pending!</p>
          </div>
        ) : (
          <>
            {/* Pending Section */}
            {pending.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  To Buy ({pending.length}):
                </span>
                {pending.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onRequestRecordPrice(item)}
                    className="p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 hover:border-amber-400/80 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl border-2 border-amber-400/60 bg-amber-400/10 flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5 text-amber-400/40" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-white truncate">
                            {language === 'bn' && item.banglaTitle ? item.banglaTitle : item.title}
                          </h4>
                          {item.priority === 'urgent' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/40">
                              URGENT
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-300 mt-0.5">
                          {item.quantity} {item.unit} • {item.category}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-amber-300 italic mt-1 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 block">Est.</span>
                      <span className="text-base font-black text-amber-400">
                        ৳{item.estimatedPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Section */}
            {completed.length > 0 && (
              <div className="space-y-2 pt-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Purchased ({completed.length}):
                </span>
                {completed.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => togglePurchased(item.id)}
                    className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 flex items-center justify-between gap-3 opacity-70"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-bold line-through text-slate-400">
                          {language === 'bn' && item.banglaTitle ? item.banglaTitle : item.title}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">
                      ৳{item.actualPrice || item.estimatedPrice}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
        <button
          onClick={onClose}
          className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
        >
          {t.exitLiveMode}
        </button>

        {completed.length > 0 && (
          <button
            onClick={() => {
              archiveCurrentBazarTrip();
              onClose();
            }}
            className="flex-1 max-w-sm flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Finish Bazar & Save Trip ({completed.length})</span>
          </button>
        )}
      </div>

    </div>
  );
};
