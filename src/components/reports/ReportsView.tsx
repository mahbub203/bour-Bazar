import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Download, 
  Printer, 
  TrendingDown, 
  Calendar, 
  PieChart as PieIcon, 
  BarChart3, 
  CreditCard,
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Legend 
} from 'recharts';

export const ReportsView: React.FC = () => {
  const { expenses, shoppingTrips, household, t, language } = useApp();

  const [dateFilter, setDateFilter] = useState('current_month');

  // Total Calculations
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const groceryExpense = expenses
    .filter(e => ['Grocery', 'Vegetables', 'Fish and Meat', 'Rice and Essentials'].includes(e.category))
    .reduce((s, e) => s + e.amount, 0);
  const utilityExpense = expenses
    .filter(e => ['Electricity', 'Gas', 'Water', 'Internet'].includes(e.category))
    .reduce((s, e) => s + e.amount, 0);
  const fixedExpense = expenses
    .filter(e => ['Rent', 'Education'].includes(e.category))
    .reduce((s, e) => s + e.amount, 0);

  // Category map
  const catMap: { [key: string]: number } = {};
  expenses.forEach(e => {
    catMap[e.category] = (catMap[e.category] || 0) + e.amount;
  });
  const catData = Object.keys(catMap).map(cat => ({
    name: cat,
    value: catMap[cat],
  })).sort((a, b) => b.value - a.value);

  const COLORS = ['#198754', '#0284c7', '#ea580c', '#d97706', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

  const monthlyComparison = [
    { month: 'August', grocery: 14200, utilities: 4600, total: 34500 },
    { month: 'September', grocery: 13800, utilities: 4800, total: 33800 },
    { month: 'October', grocery: 15100, utilities: 4900, total: 35600 },
    { month: 'November (Current)', grocery: groceryExpense, utilities: utilityExpense, total: totalExpense },
  ];

  const handleExportCSV = () => {
    const headers = ['ID,Title,Amount,Category,PaymentMethod,PaidBy,Date,Description'];
    const rows = expenses.map(e => 
      `"${e.id}","${e.title.replace(/"/g, '""')}",${e.amount},"${e.category}","${e.paymentMethod}","${e.paidBy}","${e.date}","${(e.description || '').replace(/"/g, '""')}"`
    );
    const content = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(content));
    link.setAttribute('download', `Bour_Bazar_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.navReports}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              Audit & Accounting
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            পারিবারিক খরচের সামগ্রিক বিশ্লেষণ, মাসভিত্তিক তুলনা ও ডাউনলোডযোগ্য হিসাব
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.downloadReport}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.printReport}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Grocery vs Utilities vs Fixed Rent */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Monthly Spend
          </span>
          <p className="text-2xl font-black text-slate-900">৳{totalExpense.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Budget: ৳{household.monthlyBudget.toLocaleString()}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Grocery & Kitchen
          </span>
          <p className="text-2xl font-black text-emerald-700">৳{groceryExpense.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-800 font-semibold mt-1 block">
            {Math.round((groceryExpense / totalExpense) * 100)}% of household spend
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Utilities & Bills
          </span>
          <p className="text-2xl font-black text-blue-700">৳{utilityExpense.toLocaleString()}</p>
          <span className="text-[11px] text-blue-800 font-semibold mt-1 block">Electricity, Gas, Water, Net</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Fixed Rent & Tuition
          </span>
          <p className="text-2xl font-black text-amber-700">৳{fixedExpense.toLocaleString()}</p>
          <span className="text-[11px] text-amber-800 font-semibold mt-1 block">Fixed commitments</span>
        </div>

      </div>

      {/* Charts: Donut + Monthly Comparison Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
          <h3 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-600" />
            <span>Category Spending Distribution</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={catData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {catData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`৳${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100">
            {catData.slice(0, 6).map((c, idx) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs">
                <div 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }} 
                />
                <span className="truncate text-slate-600 font-medium">{c.name}:</span>
                <span className="font-bold text-slate-900">৳{c.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
          <h3 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Monthly Spending Comparison (Last 4 Months)</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparison}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `৳${v/1000}k`} />
                <Tooltip 
                  formatter={(val: any) => [`৳${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="grocery" name="Grocery" fill="#198754" radius={[4, 4, 0, 0]} />
                <Bar dataKey="utilities" name="Utilities" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" name="Total Spend" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
