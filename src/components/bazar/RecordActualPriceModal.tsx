import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, TrendingDown, Sparkles } from 'lucide-react';
import { BazarItem } from '../../types';

interface RecordActualPriceModalProps {
  item: BazarItem | null;
  onClose: () => void;
  onConfirm: (actualPrice: number) => void;
}

export const RecordActualPriceModal: React.FC<RecordActualPriceModalProps> = ({ item, onClose, onConfirm }) => {
  const { t, language } = useApp();
  const [price, setPrice] = useState<number>(item ? item.estimatedPrice : 0);

  if (!item) return null;

  const diff = item.estimatedPrice - price;
  const isSaved = diff > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛍️</span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Record Actual Price
              </h3>
              <p className="text-xs text-slate-500">
                কত টাকায় কিনেছেন?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-xs font-bold text-slate-500">Item</p>
            <p className="text-sm font-black text-slate-900 mt-0.5">
              {language === 'bn' && item.banglaTitle ? item.banglaTitle : item.title}
            </p>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-slate-600">Quantity: <strong>{item.quantity} {item.unit}</strong></span>
              <span className="text-slate-600">Est. Price: <strong>৳{item.estimatedPrice}</strong></span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.actualPrice} *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-base font-bold text-slate-500">৳</span>
              <input
                type="number"
                min="0"
                required
                autoFocus
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg font-black text-slate-900"
              />
            </div>
          </div>

          {diff !== 0 && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between ${
              isSaved ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <span>{isSaved ? '🎉 Saashroy (Saved):' : '⚠️ Over estimate:'}</span>
              <span className="font-extrabold text-sm">৳{Math.abs(diff)}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm"
            >
              Confirm Purchase ✓
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
