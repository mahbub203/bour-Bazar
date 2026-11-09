import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Receipt, 
  Plus, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  TrendingDown, 
  Wallet, 
  Trash2, 
  Calendar,
  CreditCard,
  PieChart as PieIcon,
  BarChart3,
  ArrowUpRight,
  Sparkles
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
import { AddExpenseModal } from './AddExpenseModal';
import { ExpenseCategory } from '../../types';

export const MonthlyHisabView: React.FC = () => {
  const { expenses, deleteExpense, household, t, language, activeUser } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [payerFilter, setPayerFilter] = useState('all');

  // Calculations
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = household.monthlyBudget - totalSpent;
  const budgetPercentUsed = Math.min(100, Math.round((totalSpent / household.monthlyBudget) * 100));

  // Category breakdown for Donut chart
  const categoryMap: { [key: string]: number } = {};
  expenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const categoryChartData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat],
  })).sort((a, b) => b.value - a.value);

  const COLORS = ['#059669', '#0284c7', '#ea580c', '#d97706', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

  // Weekly spending trend simulation data
  const weeklyData = [
    { week: 'Week 1', grocery: 4200, utilities: 3420, rent: 22000 },
    { week: 'Week 2', grocery: 3800, utilities: 1200, rent: 0 },
    { week: 'Week 3 (Current)', grocery: 2450, utilities: 800, rent: 0 },
    { week: 'Week 4 (Proj)', grocery: 3200, utilities: 500, rent: 0 },
  ];

  // Filtering expenses
  const filteredExpenses = expenses.filter(e => {
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    if (payerFilter !== 'all' && e.paidBy !== payerFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchCat = e.category.toLowerCase().includes(q);
      const matchDesc = e.description ? e.description.toLowerCase().includes(q) : false;
      if (!matchTitle && !matchCat && !matchDesc) return false;
    }

    return true;
  });

  // CSV Export function
  const handleDownloadCSV = () => {
    const headers = ['ID,Title,Amount (BDT),Category,Payment Method,Paid By,Date,Description'];
    const rows = expenses.map(e => 
      `"${e.id}","${e.title.replace(/"/g, '""')}",${e.amount},"${e.category}","${e.paymentMethod}","${e.paidBy}","${e.date}","${(e.description || '').replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bour_Bazar_Hisab_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* 1. Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.navMonthlyHisab}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              November 2026
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            "Bazar er tension kom, hisab thakuk ekdom clear!"
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.downloadReport}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.printReport}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.addExpense}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Monthly Budget */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">{t.monthlyBudget}</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            ৳{household.monthlyBudget.toLocaleString()}
          </p>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Daily Budget Cap</span>
            <span className="font-bold text-slate-700">৳{Math.round(household.monthlyBudget / 30)}/day</span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">{t.totalSpent}</span>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            ৳{totalSpent.toLocaleString()}
          </p>
          <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                budgetPercentUsed > 85 ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${budgetPercentUsed}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>{budgetPercentUsed}% used</span>
            <span>{expenses.length} transactions</span>
          </div>
        </div>

        {/* Remaining Balance */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">{t.remainingBudget}</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className={`text-2xl sm:text-3xl font-black ${
            remainingBudget < 0 ? 'text-red-600' : 'text-emerald-700'
          }`}>
            ৳{remainingBudget.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-emerald-800 font-semibold">
            Safe spending zone for next 25 days!
          </p>
        </div>

      </div>

      {/* 3. Interactive Visual Charts (Category Donut & Weekly Bars) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown (Donut) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                {t.categoryBreakdown}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">By percentage</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Spent']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category legend grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100">
            {categoryChartData.slice(0, 6).map((c, idx) => (
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

        {/* Weekly Spending Trend (Stacked Bar) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                {t.weeklySpending}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Grocery vs Fixed</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `৳${val/1000}k`} />
                <Tooltip 
                  formatter={(val: any) => [`৳${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="grocery" name="Grocery & Food" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="utilities" name="Utilities & Bills" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rent" name="Apartment Rent" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 text-xs text-slate-500 text-center">
            Notice: Week 1 includes initial rent & electricity payments. Grocery spending is steady.
          </div>
        </div>

      </div>

      {/* 4. Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expenses by title or memo..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Grocery">Grocery</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fish and Meat">Fish & Meat</option>
            <option value="Electricity">Electricity</option>
            <option value="Gas">Gas</option>
            <option value="Rent">Rent</option>
            <option value="Internet">Internet</option>
            <option value="Medical">Medical</option>
          </select>

          <select
            value={payerFilter}
            onChange={(e) => setPayerFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Payers</option>
            <option value="Bor">Bor (তানভীর)</option>
            <option value="Bou">Bou (নুসরাত)</option>
            <option value="Shared">Shared (৫০-৫০)</option>
          </select>
        </div>
      </div>

      {/* 5. Expense Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Expense Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Paid By</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No expense records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Title & Description */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>
                        <p className="font-bold text-slate-900">{exp.title}</p>
                        {exp.description && (
                          <p className="text-[11px] text-slate-500 font-normal line-clamp-1">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {exp.category}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 font-black text-slate-900 text-sm">
                      ৳{exp.amount.toLocaleString()}
                    </td>

                    {/* Method */}
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        <span>{exp.paymentMethod}</span>
                      </span>
                    </td>

                    {/* Paid By */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        exp.paidBy === 'Bou' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : exp.paidBy === 'Bor'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {exp.paidBy}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {exp.date}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

    </div>
  );
};
