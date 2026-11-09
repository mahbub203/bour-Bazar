import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Users, 
  Copy, 
  Check, 
  Database, 
  ShieldCheck, 
  QrCode, 
  UserCheck, 
  Sparkles, 
  Code2, 
  ExternalLink,
  Save,
  Link
} from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, SUPABASE_SQL_SCHEMA } from '../../services/supabaseClient';
import { UserRole } from '../../types';

export const FamilySettingsView: React.FC = () => {
  const { 
    household, 
    updateHousehold, 
    activeUser, 
    switchActiveUser, 
    t, 
    language 
  } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [householdName, setHouseholdName] = useState(household.name);
  const [banglaHouseholdName, setBanglaHouseholdName] = useState(household.banglaName || '');
  const [monthlyBudget, setMonthlyBudget] = useState(household.monthlyBudget);

  // Supabase state
  const config = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(config.supabaseUrl);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(config.supabaseAnonKey);
  const [supabaseSaved, setSupabaseSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlSchema, setShowSqlSchema] = useState(false);

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(household.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSaveHousehold = (e: React.FormEvent) => {
    e.preventDefault();
    updateHousehold({
      name: householdName,
      banglaName: banglaHouseholdName,
      monthlyBudget: monthlyBudget,
    });
    alert('Household settings saved!');
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    setSupabaseSaved(true);
    setTimeout(() => setSupabaseSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.householdTitle}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Manage family pairing, roles, budgets, and cloud database synchronization
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Household Details & Partner Invitation */}
        <div className="space-y-6">
          
          {/* Household Details Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
            <h3 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Household Profile (সংসার বিবরণ)</span>
            </h3>

            <form onSubmit={handleSaveHousehold} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Household Name (English)
                </label>
                <input
                  type="text"
                  required
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  পরিবারের নাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={banglaHouseholdName}
                  onChange={(e) => setBanglaHouseholdName(e.target.value)}
                  placeholder="যেমন: তানভীর ও নুসরাতের সংসার"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Monthly Household Budget (BDT ৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">৳</span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Save Household Details
              </button>
            </form>
          </div>

          {/* Partner Invitation Card */}
          <div className="bg-gradient-to-br from-cream-50 to-amber-50/60 p-6 rounded-3xl border border-amber-200/80 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                Partner Invitation Link
              </span>
              <span className="text-lg">🤝</span>
            </div>

            <p className="text-xs text-amber-950 font-semibold mb-3">
              Share this unique invitation code with your partner (Bou or Bor) to synchronize both your devices in real-time:
            </p>

            <div className="p-3.5 bg-white rounded-2xl border border-amber-300 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">
                  Household Invite Code
                </span>
                <span className="text-lg font-black font-mono text-slate-900 tracking-wider">
                  {household.inviteCode}
                </span>
              </div>

              <button
                onClick={handleCopyInviteCode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : t.copyCode}</span>
              </button>
            </div>

            <p className="text-[11px] text-amber-800 mt-2">
              Tip: Open this app in another private tab or device with this code to see live dual-partner shopping sync!
            </p>
          </div>

          {/* Household Members List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
            <h3 className="font-extrabold text-slate-900 text-sm mb-3">
              Connected Household Members ({household.members.length})
            </h3>
            <div className="space-y-3">
              {household.members.map((m: any) => (
                <div key={m.userId || m.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-xs text-slate-900">
                        {m.banglaName || m.name}
                      </p>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {m.role === 'bou' ? '👰 Bou (Chief Bazar Officer)' : '🤵 Bor (Finance & Shopping)'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => switchActiveUser(m.role as UserRole)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                      activeUser.role === m.role
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {activeUser.role === m.role ? 'Active View' : 'Switch'}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Supabase PostgreSQL & RLS Integration */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {t.supabaseSettings}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                PostgreSQL + RLS
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {t.supabaseDesc} Antigravity includes out-of-the-box local reactive synchronization with multi-tab BroadcastChannel, and is 100% ready for Supabase cloud deployment.
            </p>

            <form onSubmit={handleSaveSupabase} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-project-id.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Supabase Anon Public API Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  {config.supabaseUrl ? 'Custom Supabase Connected' : 'Running on Local Persistent Engine'}
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  {supabaseSaved ? 'Saved!' : 'Save Supabase Config'}
                </button>
              </div>
            </form>

            {/* SQL Migration & RLS Policies Viewer */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>PostgreSQL Row Level Security (RLS) Schema</span>
                </span>

                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowSqlSchema(!showSqlSchema)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 text-left flex items-center justify-between"
              >
                <span>{showSqlSchema ? 'Hide Database Schema' : 'View Complete PostgreSQL Tables & Policies'}</span>
                <span className="text-[10px] text-slate-400">SQL DDL</span>
              </button>

              {showSqlSchema && (
                <div className="mt-3 p-3 bg-slate-950 text-emerald-400 rounded-2xl font-mono text-[11px] max-h-64 overflow-y-auto border border-slate-800 leading-relaxed">
                  <pre>{SUPABASE_SQL_SCHEMA}</pre>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
