import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Search, 
  Share2, 
  Repeat, 
  Sparkles, 
  Clock, 
  Trash2, 
  Edit3, 
  Check, 
  Heart,
  HelpCircle,
  AlertCircle,
  Bell,
  Star
} from 'lucide-react';
import { AddBazarModal } from './AddBazarModal';
import { RecordActualPriceModal } from './RecordActualPriceModal';
import { MarketModeModal } from './MarketModeModal';
import { BouAlertModal } from './BouAlertModal';
import { ItemPriority, ItemCategory, ItemStatus, BazarItem } from '../../types';

export const BazarListView: React.FC = () => {
  const { 
    bazarItems, 
    togglePurchased, 
    setItemStatus,
    toggleFavorite,
    deleteBazarItem, 
    duplicatePreviousBazar, 
    archiveCurrentBazarTrip,
    t, 
    language,
    activeUser 
  } = useApp();

  // Local state
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'pending' | 'purchased' | 'unavailable' | 'forgotten' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | undefined>(undefined);
  const [recordPriceItem, setRecordPriceItem] = useState<BazarItem | null>(null);
  const [isMarketModeOpen, setIsMarketModeOpen] = useState(false);
  const [isBouAlertOpen, setIsBouAlertOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Fast inline add input
  const [quickInput, setQuickInput] = useState('');

  // Calculations
  const pendingItems = bazarItems.filter(i => i.status === 'pending');
  const purchasedItems = bazarItems.filter(i => i.status === 'purchased');
  const unavailableItems = bazarItems.filter(i => i.status === 'unavailable');
  const forgottenItems = bazarItems.filter(i => i.status === 'forgotten');

  const totalEstimated = bazarItems.reduce((acc, curr) => acc + curr.estimatedPrice, 0);
  const totalActual = purchasedItems.reduce((acc, curr) => acc + (curr.actualPrice || curr.estimatedPrice), 0);
  const estForPurchased = purchasedItems.reduce((acc, curr) => acc + curr.estimatedPrice, 0);
  const totalSaved = Math.max(0, estForPurchased - totalActual);

  // Filter items
  const filteredItems = bazarItems.filter(item => {
    // Tab filter
    if (activeFilterTab === 'pending' && item.status !== 'pending') return false;
    if (activeFilterTab === 'purchased' && item.status !== 'purchased') return false;
    if (activeFilterTab === 'unavailable' && item.status !== 'unavailable') return false;
    if (activeFilterTab === 'forgotten' && item.status !== 'forgotten') return false;
    if (activeFilterTab === 'favorites' && !item.isFavorite) return false;

    // Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchBangla = item.banglaTitle ? item.banglaTitle.toLowerCase().includes(q) : false;
      const matchNotes = item.notes ? item.notes.toLowerCase().includes(q) : false;
      if (!matchTitle && !matchBangla && !matchNotes) return false;
    }

    return true;
  });

  // Handle Quick Add inline
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    const text = quickInput.trim();
    let qty = 1;
    let unit: any = 'kg';
    let est = 100;
    let cat: ItemCategory = 'Vegetables';

    if (text.toLowerCase().includes('dim') || text.toLowerCase().includes('egg')) {
      unit = 'dozon';
      est = 150;
      cat = 'Dairy';
    } else if (text.toLowerCase().includes('mach') || text.toLowerCase().includes('fish')) {
      unit = 'kg';
      est = 520;
      cat = 'Fish and Meat';
    } else if (text.toLowerCase().includes('mangsho') || text.toLowerCase().includes('beef')) {
      unit = 'kg';
      est = 780;
      cat = 'Fish and Meat';
    } else if (text.toLowerCase().includes('tel') || text.toLowerCase().includes('oil')) {
      unit = 'litre';
      est = 190;
      cat = 'Rice and Essentials';
    } else if (text.toLowerCase().includes('apple') || text.toLowerCase().includes('kola') || text.toLowerCase().includes('fruit')) {
      unit = 'kg';
      est = 240;
      cat = 'Fruits';
    }

    useApp().addBazarItem({
      title: text,
      quantity: qty,
      unit,
      estimatedPrice: est,
      category: cat,
      priority: 'normal',
      assignedTo: 'bor',
    });

    setQuickInput('');
  };

  // WhatsApp Share generator
  const handleShareWhatsApp = () => {
    const lines = [
      `🛒 *Bou r Bazar List*`,
      `📅 Date: ${new Date().toLocaleDateString()}`,
      `👤 Shopper Assigned: Tanvir (Bor)`,
      `-----------------------------`,
      ...pendingItems.map((item, idx) => 
        `${idx + 1}. [ ] ${item.banglaTitle || item.title} - ${item.quantity} ${item.unit} (Est: ৳${item.estimatedPrice})${item.notes ? ` 📝 "${item.notes}"` : ''}`
      ),
      `-----------------------------`,
      `💰 Total Estimated: ৳${pendingItems.reduce((s, i) => s + i.estimatedPrice, 0)}`,
      `⚡ "Dim ante bhule jaben na! 😂"`
    ];

    const shareText = lines.join('\n');
    navigator.clipboard.writeText(shareText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const getStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case 'purchased':
        return <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Bought ✓</span>;
      case 'unavailable':
        return <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Unavailable in Market</span>;
      case 'forgotten':
        return <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-red-100 text-red-700">Forgotten</span>;
      default:
        return <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Pending</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* 1. Header with Stats & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.todaysBazar}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {pendingItems.length} {t.pending}
            </span>
            {unavailableItems.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {unavailableItems.length} Unavailable
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            "Bou list dibe, Bor bazar korbe, hisab thakbe ekshathe!"
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Bou Alert Button */}
          <button
            onClick={() => setIsBouAlertOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black transition-colors"
          >
            <span className="animate-pulse">🚨</span>
            <span>Bou Alert</span>
          </button>

          {/* Market Mode Button */}
          <button
            onClick={() => setIsMarketModeOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.liveShoppingMode}</span>
          </button>

          {/* Share to WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copySuccess ? 'Copied to WhatsApp!' : t.shareWhatsApp}</span>
          </button>

          {/* Duplicate Last List */}
          <button
            onClick={duplicatePreviousBazar}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors"
            title="Duplicate list from past trips"
          >
            <Repeat className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{t.duplicateList}</span>
          </button>

          {/* Add Bazar Item Modal Button */}
          <button
            onClick={() => {
              setEditingItemId(undefined);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#198754] hover:bg-emerald-700 text-white text-xs font-black shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.createBazarList}</span>
          </button>
        </div>
      </div>

      {/* 2. Total Cost Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
            ৳
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              {t.totalEstimated}
            </span>
            <p className="text-lg font-black text-slate-900">
              ৳{totalEstimated.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
            ✓
          </div>
          <div>
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
              {t.totalActual}
            </span>
            <p className="text-lg font-black text-slate-900">
              ৳{totalActual.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block sm:text-right">
              {t.savedMoney}
            </span>
            <p className="text-lg font-black text-amber-900 sm:text-right">
              ৳{totalSaved.toLocaleString()} 🎉
            </p>
          </div>
          {purchasedItems.length > 0 && (
            <button
              onClick={() => archiveCurrentBazarTrip()}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Finish Trip
            </button>
          )}
        </div>
      </div>

      {/* 3. Fast Add Input Bar */}
      <form onSubmit={handleQuickAdd} className="relative">
        <input
          type="text"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder={t.quickAddPlaceholder}
          className="w-full pl-4 pr-24 py-3.5 rounded-2xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:outline-none shadow-sm text-sm font-semibold text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
        >
          Add Item
        </button>
      </form>

      {/* 4. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Tabs: All / Pending / Completed / Unavailable / Forgotten / Favorites */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => setActiveFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeFilterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.all} ({bazarItems.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeFilterTab === 'pending' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.pending} ({pendingItems.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('purchased')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeFilterTab === 'purchased' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.completed} ({purchasedItems.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('unavailable')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeFilterTab === 'unavailable' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unavailable ({unavailableItems.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('forgotten')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeFilterTab === 'forgotten' ? 'bg-red-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Forgotten ({forgottenItems.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('favorites')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
              activeFilterTab === 'favorites' ? 'bg-amber-100 text-amber-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>Favorites</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All 9 Categories</option>
            <option value="Rice and Essentials">Rice and Essentials</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fish and Meat">Fish and Meat</option>
            <option value="Dairy">Dairy</option>
            <option value="Fruits">Fruits</option>
            <option value="Spices">Spices</option>
            <option value="Household Products">Household Products</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* 5. Main Item Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8">
            <span className="text-4xl block mb-2">🌿</span>
            <h4 className="text-base font-bold text-slate-800">{t.emptyBazar}</h4>
            <p className="text-xs text-slate-500 mt-1">{t.emptyBazarSub}</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
            >
              {t.createBazarList}
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.status === 'purchased'
                  ? 'bg-slate-50/70 border-slate-200/70 opacity-75'
                  : item.status === 'unavailable'
                  ? 'bg-amber-50/40 border-amber-200'
                  : item.status === 'forgotten'
                  ? 'bg-red-50/40 border-red-200'
                  : 'bg-white border-slate-200/90 hover:border-emerald-400 hover:shadow-soft'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                
                {/* Left: Checkbox + Title + Meta */}
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => {
                      if (item.status !== 'purchased') {
                        setRecordPriceItem(item);
                      } else {
                        togglePurchased(item.id);
                      }
                    }}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      item.status === 'purchased'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'border-2 border-slate-300 hover:border-emerald-600 bg-white'
                    }`}
                    title={item.status === 'purchased' ? 'Mark as pending' : 'Mark as purchased'}
                  >
                    {item.status === 'purchased' && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-extrabold truncate ${
                        item.status === 'purchased' ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}>
                        {language === 'bn' && item.banglaTitle ? item.banglaTitle : item.title}
                      </span>
                      
                      {getStatusBadge(item.status)}

                      {item.priority === 'urgent' && (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                          Urgent 🔴
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.quantity} {item.unit}
                      </span>
                      <span>•</span>
                      <span className="text-slate-600">{item.category}</span>
                      <span>•</span>
                      <span className="text-[11px] text-slate-400">
                        For: {item.assignedTo === 'bor' ? '🤵 Bor' : '👰 Bou'}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="mt-2 text-xs text-amber-900 bg-amber-50/70 border border-amber-200/60 px-2.5 py-1 rounded-lg italic">
                        "{item.notes}"
                      </p>
                    )}

                    {/* Status Toggle Row */}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setItemStatus(item.id, 'unavailable')}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-colors ${
                          item.status === 'unavailable' 
                            ? 'bg-amber-100 text-amber-900 border-amber-300' 
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Mark item as unavailable in market"
                      >
                        Market Out of Stock
                      </button>

                      <button
                        onClick={() => setItemStatus(item.id, 'forgotten')}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-colors ${
                          item.status === 'forgotten' 
                            ? 'bg-red-100 text-red-900 border-red-300' 
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Mark item as forgotten by shopper"
                      >
                        Forgotten
                      </button>

                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`p-1 rounded-lg transition-colors ${
                          item.isFavorite ? 'text-amber-500 fill-amber-400' : 'text-slate-300 hover:text-amber-500'
                        }`}
                        title="Toggle Favorite"
                      >
                        <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Price + Action Menu */}
                <div className="text-right shrink-0">
                  <p className="text-base font-black text-slate-900">
                    ৳{item.status === 'purchased' ? (item.actualPrice || item.estimatedPrice) : item.estimatedPrice}
                  </p>
                  <span className="text-[10px] text-slate-400 block">
                    {item.status === 'purchased' ? 'Actual price' : 'Est. price'}
                  </span>

                  <div className="flex items-center justify-end gap-1 mt-2">
                    <button
                      onClick={() => {
                        setEditingItemId(item.id);
                        setIsAddModalOpen(true);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Edit item"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteBazarItem(item.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <AddBazarModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItemId(undefined);
        }}
        editItemId={editingItemId}
      />

      <RecordActualPriceModal
        item={recordPriceItem}
        onClose={() => setRecordPriceItem(null)}
        onConfirm={(actualPrice) => {
          if (recordPriceItem) {
            setItemStatus(recordPriceItem.id, 'purchased', actualPrice);
          }
          setRecordPriceItem(null);
        }}
      />

      <MarketModeModal
        isOpen={isMarketModeOpen}
        onClose={() => setIsMarketModeOpen(false)}
        onRequestRecordPrice={(item) => {
          setRecordPriceItem(item);
        }}
      />

      <BouAlertModal
        isOpen={isBouAlertOpen}
        onClose={() => setIsBouAlertOpen(false)}
      />

    </div>
  );
};
