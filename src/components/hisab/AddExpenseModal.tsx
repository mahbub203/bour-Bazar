import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Receipt, Upload, Plus } from 'lucide-react';
import { ExpenseCategory, PaymentMethod } from '../../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addExpense, t, activeUser } = useApp();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(500);
  const [category, setCategory] = useState<ExpenseCategory>('Grocery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bKash');
  const [paidBy, setPaidBy] = useState<'Bou' | 'Bor' | 'Shared'>(activeUser.role === 'bou' ? 'Bou' : 'Bor');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [receiptName, setReceiptName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    addExpense({
      title,
      amount,
      category,
      paymentMethod,
      paidBy,
      date,
      description: description || undefined,
      receiptUrl: receiptName ? 'https://images.unsplash.com/photo-1554415707-9e49017a4751?auto=format&fit=crop&w=400&q=80' : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {t.addExpense}
              </h3>
              <p className="text-xs text-slate-500">
                পারিবারিক খরচের হিসাব লিপিবদ্ধ করুন
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.expenseTitle} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Shwapno Grocery, DESCO Electricity Bill, Karwan Bazar Fish"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.amount} (BDT ৳) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-slate-500 font-bold">৳</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.date} *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.category}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="Grocery">Grocery (সুপারশপ/মুদি)</option>
                <option value="Vegetables">Vegetables (শাকসবজি)</option>
                <option value="Fish and Meat">Fish and Meat (মাছ ও মাংস)</option>
                <option value="Rice and Essentials">Rice and Essentials (চাল ও তেল)</option>
                <option value="Electricity">Electricity (বিদ্যুৎ বিল)</option>
                <option value="Gas">Gas (গ্যাস বিল)</option>
                <option value="Water">Water (ওয়াসা পানি বিল)</option>
                <option value="Rent">Rent (বাসা ভাড়া)</option>
                <option value="Internet">Internet (ইন্টারনেট বিল)</option>
                <option value="Transportation">Transportation (যাতায়াত)</option>
                <option value="Medical">Medical (ওষুধ ও চিকিৎসা)</option>
                <option value="Other expenses">Other expenses (অন্যান্য)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.paymentMethod}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="bKash">bKash (বিকাশ)</option>
                <option value="Nagad">Nagad (নগদ)</option>
                <option value="Cash">Cash (নগদ টাকা)</option>
                <option value="Card">Visa / Master Card</option>
                <option value="Rocket">Rocket (রকেট)</option>
                <option value="Bank Transfer">Bank Transfer (ব্যাংক)</option>
              </select>
            </div>
          </div>

          {/* Paid By */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.paidBy}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaidBy('Bor')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  paidBy === 'Bor'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                🤵 Tanvir (Bor)
              </button>
              <button
                type="button"
                onClick={() => setPaidBy('Bou')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  paidBy === 'Bou'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                👰 Nusrat (Bou)
              </button>
              <button
                type="button"
                onClick={() => setPaidBy('Shared')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  paidBy === 'Shared'
                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                🤝 Shared (৫০-৫০)
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              নোট বা বিবরণ (ঐচ্ছিক)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. November gas recharge voucher 84920"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-900"
            />
          </div>

          {/* Receipt Attachment Simulation */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center">
            <input
              type="file"
              id="expense-receipt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setReceiptName(e.target.files[0].name);
                }
              }}
            />
            <label
              htmlFor="expense-receipt"
              className="cursor-pointer flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-emerald-700"
            >
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-semibold">
                {receiptName ? `Attached: ${receiptName}` : 'Attach Receipt Memo (রসিদের ছবি)'}
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-sm transition-all"
            >
              Save Expense
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
