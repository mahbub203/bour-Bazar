import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  History, 
  Search, 
  Calendar, 
  ShoppingBag, 
  TrendingDown, 
  ArrowUpRight, 
  Store, 
  Receipt,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const ShoppingHistoryView: React.FC = () => {
  const { shoppingTrips, t, language } = useApp();

  const [search, setSearch] = useState('');
  const [expandedTripId, setExpandedTripId] = useState<string | null>(shoppingTrips[0]?.id || null);

  // Price trends data for staples
  const priceTrends = [
    { name: 'Farm Eggs (ডিম)', octPrice: 140, novPrice: 150, change: '+7%', isUp: true },
    { name: 'Deshi Onion (পেঁয়াজ)', octPrice: 125, novPrice: 110, change: '-12%', isUp: false },
    { name: 'Rui Fish (রুই মাছ)', octPrice: 460, novPrice: 480, change: '+4%', isUp: true },
    { name: 'Miniket Rice (চাল)', octPrice: 85, novPrice: 85, change: '0%', isUp: false },
  ];

  const filteredTrips = shoppingTrips.filter(trip => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = trip.title.toLowerCase().includes(q);
      const matchStore = trip.storeName ? trip.storeName.toLowerCase().includes(q) : false;
      const matchItems = trip.items.some(i => i.name.toLowerCase().includes(q));
      if (!matchTitle && !matchStore && !matchItems) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.navShoppingHistory}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {shoppingTrips.length} Completed Trips
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            বাজারের বিগত খরচের খাতা এবং দরদামের পরিবর্তন পর্যালোচনা করুন
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past trips or items..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Staple Price Trends Tracker */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              Dhaka Market Price Comparison (দরদামের পরিবর্তন)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Last 30 Days</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {priceTrends.map((pt, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-bold text-slate-900 truncate block">{pt.name}</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-base font-black text-slate-900">৳{pt.novPrice}</span>
                <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                  pt.isUp ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {pt.change}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Was ৳{pt.octPrice} in Oct</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Trips Timeline */}
      <div className="space-y-4">
        {filteredTrips.map((trip) => {
          const isExpanded = expandedTripId === trip.id;
          const saved = trip.estimatedTotal - trip.actualTotal;

          return (
            <div
              key={trip.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden transition-all"
            >
              {/* Trip Header Summary */}
              <div
                onClick={() => setExpandedTripId(isExpanded ? null : trip.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-lg shrink-0">
                    <Store className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-900 text-base truncate">
                      {trip.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{trip.date}</span>
                      </span>
                      <span>•</span>
                      <span>Shopper: <strong>{trip.purchasedBy}</strong></span>
                      <span>•</span>
                      <span>{trip.itemsCount} items</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Total Spent</span>
                    <p className="text-lg font-black text-slate-900">
                      ৳{trip.actualTotal.toLocaleString()}
                    </p>
                    {saved > 0 && (
                      <span className="text-[11px] font-bold text-emerald-700">
                        Saved ৳{saved} 🎉
                      </span>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Itemized Breakdown */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/40">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-3">
                    Purchased Items & Price Breakdown:
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {trip.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 truncate">{item.name}</p>
                          <span className="text-slate-400 text-[11px] font-medium">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-extrabold text-slate-900">৳{item.actualPrice}</span>
                          {item.estimatedPrice !== item.actualPrice && (
                            <span className="text-[10px] text-slate-400 block">
                              Est: ৳{item.estimatedPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {trip.storeName && (
                    <div className="mt-4 text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <span>Store:</span>
                      <span className="font-bold text-slate-700">{trip.storeName}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
