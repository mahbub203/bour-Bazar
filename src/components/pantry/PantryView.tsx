import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PackageOpen, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Minus, 
  ShoppingCart, 
  Calendar,
  Sparkles,
  X
} from 'lucide-react';
import { UnitType, PantryItem } from '../../types';

export const PantryView: React.FC = () => {
  const { 
    pantryItems, 
    adjustPantryQuantity, 
    addPantryItem, 
    sendPantryItemToBazar, 
    t, 
    language 
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'low'>('all');

  // New Pantry Item Form State
  const [name, setName] = useState('');
  const [banglaName, setBanglaName] = useState('');
  const [category, setCategory] = useState('Grains');
  const [currentQty, setCurrentQty] = useState<number>(1);
  const [unit, setUnit] = useState<UnitType>('kg');
  const [minStock, setMinStock] = useState<number>(2);
  const [estPrice, setEstPrice] = useState<number>(100);
  const [icon, setIcon] = useState('🥫');

  // Low stock calculation
  const lowStockItems = pantryItems.filter(p => p.currentQuantity <= p.minStockLevel);

  const displayedItems = filter === 'low' ? lowStockItems : pantryItems;

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addPantryItem({
      name,
      banglaName: banglaName || name,
      category,
      currentQuantity: currentQty,
      unit,
      minStockLevel: minStock,
      lastPurchasedDate: new Date().toISOString().split('T')[0],
      estimatedPrice: estPrice,
      icon,
    });

    setIsAddModalOpen(false);
    setName('');
    setBanglaName('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* 1. Header with Status & Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.pantryTitle}
            </h2>
            {lowStockItems.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{lowStockItems.length} {t.lowStock}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            রান্নাঘরের প্রয়োজনীয় তেল, চাল, ডাল, ডিম ও মসলার লাইভ স্টক
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Low / All */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({pantryItems.length})
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'low' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Low Stock ({lowStockItems.length})
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.addPantryItem}</span>
          </button>
        </div>
      </div>

      {/* 2. Low Stock Quick Banner */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-950">
                {lowStockItems.length} items below minimum safety stock!
              </p>
              <p className="text-[11px] text-amber-800">
                {lowStockItems.map(i => i.banglaName || i.name).join(', ')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              lowStockItems.forEach(i => sendPantryItemToBazar(i.id));
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-xs transition-colors shrink-0"
          >
            + Add All Low Items to Bazar List
          </button>
        </div>
      )}

      {/* 3. Grid of Pantry Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedItems.map((item) => {
          const isLow = item.currentQuantity <= item.minStockLevel;
          const isOut = item.currentQuantity === 0;
          const fillPercent = Math.min(100, Math.round((item.currentQuantity / (item.minStockLevel * 2)) * 100));

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all ${
                isOut
                  ? 'bg-red-50/40 border-red-200'
                  : isLow
                  ? 'bg-amber-50/40 border-amber-300'
                  : 'bg-white border-slate-200/80 shadow-soft'
              }`}
            >
              {/* Item Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-3xl p-1 bg-slate-100 rounded-xl">{item.icon || '📦'}</span>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-900 text-sm truncate">
                      {language === 'bn' && item.banglaName ? item.banglaName : item.name}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isOut
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : isLow
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {isOut ? t.outOfStock : isLow ? t.lowStock : t.inStock}
                </span>
              </div>

              {/* Quantity Meter */}
              <div className="mt-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-slate-500 font-medium">In Stock</span>
                  <span className="text-lg font-black text-slate-900">
                    {item.currentQuantity} <span className="text-xs font-semibold text-slate-500">{item.unit}</span>
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(8, fillPercent)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>Min alert: {item.minStockLevel} {item.unit}</span>
                  <span>Est: ৳{item.estimatedPrice}/{item.unit}</span>
                </div>
              </div>

              {/* Bottom Quick Controls & Add to Bazar Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {/* Steppers (+ / -) */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => adjustPantryQuantity(item.id, -0.5)}
                    className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-xs"
                    title="Use / Deduct 0.5"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-800 px-1">
                    {item.currentQuantity}
                  </span>
                  <button
                    onClick={() => adjustPantryQuantity(item.id, 0.5)}
                    className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-xs"
                    title="Add 0.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 1-Click Send to Bazar List */}
                <button
                  onClick={() => sendPantryItemToBazar(item.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isLow 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title="Add missing quantity to today's bazar list"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>+ Bazar</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Pantry Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {t.addPantryItem}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Item Name (English & Bangla)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Radhuni Shorsher Tel"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Current Quantity
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={currentQty}
                    onChange={(e) => setCurrentQty(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as UnitType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="gram">gram</option>
                    <option value="litre">litre</option>
                    <option value="piece">piece</option>
                    <option value="packet">packet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Min Stock Threshold
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={minStock}
                    onChange={(e) => setMinStock(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Est. Price per unit (৳)
                  </label>
                  <input
                    type="number"
                    required
                    value={estPrice}
                    onChange={(e) => setEstPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs"
                >
                  Add to Pantry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
