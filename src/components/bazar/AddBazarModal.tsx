import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { UnitType, ItemCategory, ItemPriority, UserRole } from '../../types';

interface AddBazarModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItemId?: string;
}

export const AddBazarModal: React.FC<AddBazarModalProps> = ({ isOpen, onClose, editItemId }) => {
  const { bazarItems, addBazarItem, updateBazarItem, t, language, activeUser } = useApp();

  const editItem = editItemId ? bazarItems.find(i => i.id === editItemId) : null;

  const [title, setTitle] = useState(editItem ? editItem.title : '');
  const [banglaTitle, setBanglaTitle] = useState(editItem ? editItem.banglaTitle || '' : '');
  const [quantity, setQuantity] = useState<number>(editItem ? editItem.quantity : 1);
  const [unit, setUnit] = useState<UnitType>(editItem ? editItem.unit : 'kg');
  const [estimatedPrice, setEstimatedPrice] = useState<number>(editItem ? editItem.estimatedPrice : 100);
  const [category, setCategory] = useState<ItemCategory>(editItem ? editItem.category : 'Vegetables');
  const [priority, setPriority] = useState<ItemPriority>(editItem ? editItem.priority : 'normal');
  const [notes, setNotes] = useState(editItem ? editItem.notes || '' : '');
  const [assignedTo, setAssignedTo] = useState<UserRole>(editItem ? editItem.assignedTo : 'bor');

  // Quick suggestion tags for Bangladeshi kitchen
  const quickSuggestions = [
    { title: 'Farm Eggs (ফার্মের ডিম)', bangla: 'ফার্মের লাল ডিম', unit: 'dozon' as UnitType, est: 150, cat: 'Dairy' as ItemCategory, note: 'Khobordar! Vanga dim anba na!' },
    { title: 'Deshi Onion (দেশি পেঁয়াজ)', bangla: 'দেশি পেঁয়াজ', unit: 'kg' as UnitType, est: 110, cat: 'Vegetables' as ItemCategory, note: 'Choto size dekhba' },
    { title: 'Rui Fish (রুই মাছ)', bangla: 'তাজা নদীর রুই মাছ', unit: 'kg' as UnitType, est: 480, cat: 'Fish & Meat' as ItemCategory, note: 'Pet kete anba' },
    { title: 'Beef / Mangsho (গরুর মাংস)', bangla: 'গরুর মাংস সলিড', unit: 'kg' as UnitType, est: 780, cat: 'Fish & Meat' as ItemCategory, note: 'Holar chara' },
    { title: 'Kacha Morich (কাঁচা মরিচ)', bangla: 'কাঁচা মরিচ', unit: 'gram' as UnitType, est: 60, cat: 'Vegetables' as ItemCategory, note: 'Besi jhal' },
    { title: 'Miniket Rice (মিনিকেট চাল)', bangla: 'মিনিকেট চাল', unit: 'kg' as UnitType, est: 85, cat: 'Rice & Essentials' as ItemCategory, note: 'Rashid brand' },
    { title: 'Soyabean Oil (সয়াবিন তেল)', bangla: 'তীর সয়াবিন তেল', unit: 'litre' as UnitType, est: 190, cat: 'Rice & Essentials' as ItemCategory, note: '2 Litre bottle' },
    { title: 'Bhogura Alu (বগুড়ার আলু)', bangla: 'বগুড়ার গোল আলু', unit: 'kg' as UnitType, est: 65, cat: 'Vegetables' as ItemCategory, note: 'Gol size' }
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editItemId) {
      updateBazarItem(editItemId, {
        title,
        banglaTitle: banglaTitle || undefined,
        quantity,
        unit,
        estimatedPrice,
        category,
        priority,
        notes: notes || undefined,
        assignedTo,
      });
    } else {
      addBazarItem({
        title,
        banglaTitle: banglaTitle || undefined,
        quantity,
        unit,
        estimatedPrice,
        category,
        priority,
        notes: notes || undefined,
        assignedTo,
      });
    }

    onClose();
  };

  const handleSelectSuggestion = (s: typeof quickSuggestions[0]) => {
    setTitle(s.title);
    setBanglaTitle(s.bangla);
    setUnit(s.unit);
    setEstimatedPrice(s.est);
    setCategory(s.cat);
    setNotes(s.note);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {editItemId ? t.edit : t.createBazarList}
              </h3>
              <p className="text-xs text-slate-500">
                {activeUser.role === 'bou' ? 'Bou\'s instructions for Bor' : 'Bor\'s shopping plan'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!editItemId && (
          <div className="mt-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Popular Bengali Kitchen Staples (১ ক্লিকে যোগ করুন):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(s)}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 transition-colors"
                >
                  {s.title.split(' ')[0]} {s.bangla.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.itemName} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Farm Eggs (ফার্মের ডিম) or Rui Fish"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Bangla Title (optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              বাংলা নাম (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={banglaTitle}
              onChange={(e) => setBanglaTitle(e.target.value)}
              placeholder="যেমন: ফার্মের লাল ডিম বা রুই মাছ"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
            />
          </div>

          {/* Quantity, Unit & Estimated Price */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.quantity} *
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                required
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.unit} *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-900 bg-white"
              >
                <option value="kg">kg (কেজি)</option>
                <option value="gram">gram (গ্রাম)</option>
                <option value="litre">litre (লিটার)</option>
                <option value="dozon">dozon (ডজন)</option>
                <option value="hali">hali (হালি)</option>
                <option value="piece">piece (পিস)</option>
                <option value="packet">packet (প্যাকেট)</option>
                <option value="bundle">bundle (আঁটি)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.estPrice} *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-slate-500 font-bold">৳</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.category}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="Vegetables">Vegetables (শাকসবজি)</option>
                <option value="Fish & Meat">Fish & Meat (মাছ ও মাংস)</option>
                <option value="Rice & Essentials">Rice & Essentials (চাল ও তেল)</option>
                <option value="Spices">Spices (মসলা ও লবণ)</option>
                <option value="Dairy">Dairy (দুধ ও ডিম)</option>
                <option value="Bakery">Bakery (বেকারি ও পাউরুটি)</option>
                <option value="Snacks">Snacks (নাস্তা)</option>
                <option value="Toiletries">Toiletries (প্রসাধন ও সাবান)</option>
                <option value="Other">Other (অন্যান্য)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.priority}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ItemPriority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold text-slate-900 bg-white"
              >
                <option value="normal">Normal (স্বাভাবিক 🟢)</option>
                <option value="important">Important (জরুরি 🟡)</option>
                <option value="urgent">Urgent (খুব জরুরি 🔴)</option>
              </select>
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.assignedTo}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAssignedTo('bor')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  assignedTo === 'bor'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                🤵 Tanvir (Bor) - বাজার কমান্ডার
              </button>
              <button
                type="button"
                onClick={() => setAssignedTo('bou')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  assignedTo === 'bou'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                👰 Nusrat (Bou) - নিজে কিনবে
              </button>
            </div>
          </div>

          {/* Notes for Bor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.notes}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all"
            >
              {editItemId ? t.save : t.createBazarList}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
