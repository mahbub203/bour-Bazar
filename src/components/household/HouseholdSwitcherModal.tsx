import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Users, Plus, Check, Link, Copy, Home } from 'lucide-react';

interface HouseholdSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HouseholdSwitcherModal: React.FC<HouseholdSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { 
    households, 
    activeHousehold, 
    switchHousehold, 
    createHousehold, 
    joinHouseholdByCode, 
    t 
  } = useApp();

  const [mode, setMode] = useState<'list' | 'create' | 'join'>('list');
  const [newName, setNewName] = useState('');
  const [newBanglaName, setNewBanglaName] = useState('');
  const [newBudget, setNewBudget] = useState(30000);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createHousehold(newName, newBanglaName, newBudget);
    onClose();
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    const success = joinHouseholdByCode(inviteCodeInput.trim());
    if (success) {
      onClose();
    } else {
      setJoinError('Could not find a household with this invite code.');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeHousehold.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {mode === 'list' ? t.switchHousehold : mode === 'create' ? t.createHousehold : t.joinHousehold}
              </h3>
              <p className="text-xs text-slate-500">
                পারিবারিক সংসার নির্বাচন ও পার্টনার কানেকশন
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

        {/* Content based on Mode */}
        {mode === 'list' && (
          <div className="mt-4 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Your Households ({households.length}):
            </span>

            <div className="space-y-2">
              {households.map((h) => {
                const isActive = h.id === activeHousehold.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => {
                      switchHousehold(h.id);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 text-xs">
                          {h.banglaName || h.name}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Budget: ৳{h.monthlyBudget.toLocaleString()} • Code: {h.inviteCode}
                      </p>
                    </div>

                    <div className="text-xs font-bold text-emerald-700">
                      {isActive ? '✓ Selected' : 'Select'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current Active Invite Code Pill */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs mt-3">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Active Invite Code</span>
                <span className="font-mono font-black text-amber-950 text-sm">{activeHousehold.inviteCode}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-lg bg-amber-200/80 text-amber-900 hover:bg-amber-200 font-bold text-xs"
              >
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            {/* Actions: Create or Join */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setMode('create')}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center"
              >
                + Create New
              </button>
              <button
                onClick={() => setMode('join')}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center"
              >
                🔗 Join by Code
              </button>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <form onSubmit={handleCreate} className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Household Name (English) *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Tanvir & Nusrat Nest"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                পরিবারের নাম (বাংলা)
              </label>
              <input
                type="text"
                value={newBanglaName}
                onChange={(e) => setNewBanglaName(e.target.value)}
                placeholder="যেমন: চৌধুরী বাড়ি"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Monthly Budget (BDT ৳) *
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                required
                value={newBudget}
                onChange={(e) => setNewBudget(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMode('list')}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
              >
                Create Household
              </button>
            </div>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={handleJoin} className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.enterInviteCode} *
              </label>
              <input
                type="text"
                required
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value)}
                placeholder="e.g. BOU-BOR-2026 or CHOWDHURY-BARI"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {joinError && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-xl">
                {joinError}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMode('list')}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs"
              >
                Join Household
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
