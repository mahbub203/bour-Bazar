import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UtensilsCrossed, 
  Calendar, 
  Sparkles, 
  Plus, 
  Check, 
  ChevronRight, 
  Coffee, 
  Sun, 
  Moon,
  ShoppingCart
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MealPlannerView: React.FC = () => {
  const { mealPlans, generateBazarFromMealDay, t, language } = useApp();
  const [selectedDay, setSelectedDay] = useState(mealPlans[0]?.day || 'friday');
  const [generatedSuccess, setGeneratedSuccess] = useState<string | null>(null);

  const currentPlan = mealPlans.find(m => m.day === selectedDay) || mealPlans[0];

  const handleGenerate = (day: string) => {
    const count = generateBazarFromMealDay(day);
    setGeneratedSuccess(`Generated ${count} items for today's bazar list!`);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => setGeneratedSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.navMealPlanner}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              সাপ্তাহিক রুটিন
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            "আজকে কী রান্না হবে?" এর চিরন্তন প্রশ্নের সমাধান ও স্বয়ংক্রিয় বাজার ফর্দ!
          </p>
        </div>

        <button
          onClick={() => handleGenerate(selectedDay)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-sm transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Generate Bazar List for {currentPlan.banglaDay.split(' ')[0]}</span>
        </button>
      </div>

      {generatedSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 stroke-[3] text-emerald-700" />
            <span>{generatedSuccess} Check your Bazar List to review!</span>
          </div>
        </div>
      )}

      {/* 7-Day Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {mealPlans.map((m) => {
          const isSelected = m.day === selectedDay;
          return (
            <button
              key={m.day}
              onClick={() => setSelectedDay(m.day)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold shrink-0 transition-all border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="block text-[11px] font-medium opacity-80 uppercase tracking-wider">
                {m.day}
              </span>
              <span className="text-sm font-extrabold mt-0.5 block">
                {m.banglaDay.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Meal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Breakfast */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center gap-2 text-amber-700 mb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center font-bold">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">Breakfast</span>
              <span className="text-sm font-black text-slate-900">সকালের নাস্তা</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 min-h-[90px] flex items-center">
            <p className="text-sm font-bold text-slate-800 leading-snug">
              {currentPlan.breakfast}
            </p>
          </div>
        </div>

        {/* Lunch */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center gap-2 text-emerald-700 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center font-bold">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">Lunch</span>
              <span className="text-sm font-black text-slate-900">দুপুরের খাবার</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 min-h-[90px] flex items-center">
            <p className="text-sm font-bold text-slate-800 leading-snug">
              {currentPlan.lunch}
            </p>
          </div>
        </div>

        {/* Dinner */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center gap-2 text-indigo-700 mb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center font-bold">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">Dinner</span>
              <span className="text-sm font-black text-slate-900">রাতের খাবার</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/70 min-h-[90px] flex items-center">
            <p className="text-sm font-bold text-slate-800 leading-snug">
              {currentPlan.dinner}
            </p>
          </div>
        </div>

      </div>

      {/* Required Ingredients Breakdown & Auto-Bazar Generator */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Required Kitchen Ingredients for {currentPlan.banglaDay}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These items are needed to cook today's breakfast, lunch, and dinner.
            </p>
          </div>

          <button
            onClick={() => handleGenerate(selectedDay)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add All Ingredients to Bazar List</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {currentPlan.ingredients.map((ing, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
            >
              <div>
                <p className="text-xs font-bold text-slate-900">{ing.name}</p>
                <span className="text-[11px] text-slate-500 font-medium">
                  {ing.category}
                </span>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg">
                {ing.quantity} {ing.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
