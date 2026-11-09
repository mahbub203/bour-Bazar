import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  ShoppingBasket, 
  Receipt, 
  PackageOpen, 
  UtensilsCrossed, 
  History, 
  Trophy, 
  Bot, 
  ScanLine, 
  Settings, 
  Bell, 
  FileText,
  BarChart2,
  Sparkles,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenBouAlert?: () => void;
  onOpenHouseholdSwitcher?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpenMobile, 
  onCloseMobile,
  onOpenBouAlert,
  onOpenHouseholdSwitcher
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    t, 
    language,
    bazarItems, 
    pantryItems, 
    notifications, 
    activeHousehold,
    activeUser 
  } = useApp();

  const pendingBazarCount = bazarItems.filter(i => i.status === 'pending').length;
  const lowPantryCount = pantryItems.filter(p => p.currentQuantity <= p.minStockLevel).length;
  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  // 11 Core Navigation Routes from PART 15
  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { 
      id: 'bazar', 
      label: t.navBazarList, 
      icon: ShoppingBasket, 
      badge: pendingBazarCount > 0 ? pendingBazarCount : undefined,
      badgeColor: 'bg-emerald-600 text-white'
    },
    { id: 'hisab', label: t.navMonthlyHisab, icon: Receipt },
    { 
      id: 'performance', 
      label: t.navPerformance, 
      icon: BarChart2,
      isNew: true,
      highlight: true
    },
    { 
      id: 'jhogra', 
      label: t.navJhogra || (language === 'bn' ? 'ঝগড়া হিসাব 🥊' : 'Jhogra Hisab 🥊'), 
      icon: HeartHandshake,
      badge: 'NEW',
      badgeColor: 'bg-rose-500 text-white',
      highlight: true
    },
    { 
      id: 'savings', 
      label: t.navSavingsScore, 
      icon: Trophy,
      badge: '88/100',
      badgeColor: 'bg-amber-500 text-white'
    },
    { 
      id: 'pantry', 
      label: t.navPantry, 
      icon: PackageOpen, 
      badge: lowPantryCount > 0 ? lowPantryCount : undefined,
      badgeColor: 'bg-amber-600 text-white'
    },
    { id: 'meals', label: t.navMealPlanner, icon: UtensilsCrossed },
    { id: 'history', label: t.navShoppingHistory, icon: History },
    { id: 'reports', label: t.navReports, icon: FileText },
    { id: 'scanner', label: t.navScanner, icon: ScanLine },
    { id: 'assistant', label: t.navAssistant, icon: Bot, isNew: true },
    { 
      id: 'notifications', 
      label: t.navNotifications, 
      icon: Bell, 
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
      badgeColor: 'bg-red-500 text-white'
    },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top Header / Profile Info */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
            <img 
              src={activeUser.avatar} 
              alt={activeUser.name} 
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/30"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-slate-900 truncate">
                  {activeUser.banglaName || activeUser.name}
                </span>
                <span className="text-xs">
                  {activeUser.role === 'bou' ? '👑' : '🛒'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 font-semibold truncate">
                {activeUser.banglaTitle || activeUser.title}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'bg-[#198754] text-white shadow-sm shadow-emerald-700/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-700'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.isNew && (
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      New
                    </span>
                  )}
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Bou Alert Trigger & Active Household Card */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {/* Bou Alert Quick Action */}
          {onOpenBouAlert && (
            <button
              onClick={onOpenBouAlert}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-extrabold shadow-sm hover:from-rose-600 hover:to-amber-600 transition-all hover:scale-[1.01] active:scale-[0.99]"
              title="Send Bou Alert to Partner"
            >
              <span className="text-sm">🚨</span>
              <span>Bou Alert (বউ এলার্ট)</span>
            </button>
          )}

          {/* Household summary card with switcher trigger */}
          <div 
            onClick={onOpenHouseholdSwitcher}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 text-xs text-slate-500 flex items-center justify-between cursor-pointer transition-colors"
            title="Click to switch household"
          >
            <span className="truncate font-bold text-slate-800">
              {activeHousehold.banglaName || activeHousehold.name}
            </span>
            <span className="font-mono text-[10px] bg-white px-1.5 py-0.2 rounded border border-slate-200 font-bold text-slate-700">
              {activeHousehold.inviteCode}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
