import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  ShoppingBasket, 
  Receipt, 
  History,
  Menu,
  Plus,
  BarChart2,
  Trophy,
  PackageOpen,
  UtensilsCrossed,
  ScanLine,
  Bot,
  Settings,
  Bell,
  HeartHandshake,
  X
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenQuickAdd: () => void;
  onOpenBouAlert?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  onOpenQuickAdd,
  onOpenBouAlert
}) => {
  const { activeTab, setActiveTab, bazarItems, notifications, t } = useApp();
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);

  const pendingBazarCount = bazarItems.filter(i => i.status === 'pending').length;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const moreNavItems = [
    { id: 'jhogra', label: t.navJhogra || 'ঝগড়া হিসাব 🥊', icon: HeartHandshake },
    { id: 'performance', label: t.navPerformance, icon: BarChart2 },
    { id: 'savings', label: t.navSavingsScore, icon: Trophy },
    { id: 'pantry', label: t.navPantry, icon: PackageOpen },
    { id: 'meals', label: t.navMealPlanner, icon: UtensilsCrossed },
    { id: 'scanner', label: t.navScanner, icon: ScanLine },
    { id: 'assistant', label: t.navAssistant, icon: Bot },
    { id: 'reports', label: t.navReports, icon: Receipt },
    { id: 'notifications', label: t.navNotifications, icon: Bell, badge: unreadCount },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer for More Items */}
      {isMoreDrawerOpen && (
        <div 
          onClick={() => setIsMoreDrawerOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl w-full p-5 shadow-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">
                More Sections & Tools
              </h3>
              <button
                onClick={() => setIsMoreDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {moreNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMoreDrawerOpen(false);
                    }}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center text-xs font-bold transition-all border ${
                      isActive 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                        : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-emerald-700" />
                    <span className="truncate w-full text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {onOpenBouAlert && (
              <button
                onClick={() => {
                  setIsMoreDrawerOpen(false);
                  onOpenBouAlert();
                }}
                className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-black text-center shadow-xs"
              >
                🚨 Open Bou Alert System
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-1 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          
          {/* 1. Dashboard / Home */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Home</span>
          </button>

          {/* 2. Bazar */}
          <button
            onClick={() => setActiveTab('bazar')}
            className={`relative flex flex-col items-center py-1 px-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'bazar' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <ShoppingBasket className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{t.navBazarList}</span>
            {pendingBazarCount > 0 && (
              <span className="absolute top-0 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {pendingBazarCount}
              </span>
            )}
          </button>

          {/* Center (+) Floating Button */}
          <div className="relative -top-4">
            <button
              onClick={onOpenQuickAdd}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#198754] to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30 hover:scale-105 active:scale-95 transition-transform"
              aria-label="Add Item or Expense"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* 3. Monthly Hisab */}
          <button
            onClick={() => setActiveTab('hisab')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'hisab' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Receipt className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{t.navMonthlyHisab}</span>
          </button>

          {/* 4. More Menu Drawer Trigger */}
          <button
            onClick={() => setIsMoreDrawerOpen(true)}
            className="flex flex-col items-center py-1 px-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">More</span>
          </button>

        </div>
      </nav>
    </>
  );
};
