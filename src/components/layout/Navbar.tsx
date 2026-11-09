import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  ShoppingBag, 
  Globe, 
  Users, 
  Sparkles, 
  Menu,
  ChevronDown,
  User,
  LogOut,
  LogIn,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenMarketMode?: () => void;
  onOpenBouAlert?: () => void;
  onOpenHouseholdSwitcher?: () => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onToggleSidebar, 
  onOpenMarketMode,
  onOpenBouAlert,
  onOpenHouseholdSwitcher,
  onOpenAuthModal
}) => {
  const { 
    activeUser, 
    switchActiveUser, 
    activeHousehold, 
    language, 
    setLanguage, 
    t, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsRead,
    bazarItems,
    setActiveTab,
    isLoggedIn,
    logoutUser
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const pendingBazarCount = bazarItems.filter(i => i.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile Menu Trigger + Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#198754] to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Bou r Bazar
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    বউর বাজার
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  {t.taglineShort}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Household Switcher Badge & Dual-Role Switcher */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Household Switcher Badge */}
            <div 
              onClick={onOpenHouseholdSwitcher}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-200 text-xs text-amber-900 font-bold hover:bg-amber-100/70 cursor-pointer transition-colors shadow-xs"
              title="Click to switch or invite to household"
            >
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span className="max-w-[150px] truncate">{activeHousehold.banglaName || activeHousehold.name}</span>
              <span className="font-mono bg-white px-1.5 py-0.2 rounded text-[10px] text-slate-600 border border-amber-200">
                {activeHousehold.inviteCode}
              </span>
              <ChevronDown className="w-3 h-3 text-amber-700" />
            </div>

            {/* Quick Dual-Role Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-inner">
              <span className="text-[11px] font-semibold text-slate-500 px-2">
                {t.activeAs}:
              </span>
              <button
                onClick={() => switchActiveUser('bou')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeUser.role === 'bou'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>👰 {t.bou}</span>
              </button>
              <button
                onClick={() => switchActiveUser('bor')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeUser.role === 'bor'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>🤵 {t.bor}</span>
              </button>
            </div>
          </div>

          {/* Right Actions: Bou Alert, Market Mode, Language, Notifications, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Bou Alert Button */}
            {onOpenBouAlert && (
              <button
                onClick={onOpenBouAlert}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all shadow-xs"
                title="Send funny Bou Alert to Bor"
              >
                <span className="animate-pulse">🚨</span>
                <span>Bou Alert</span>
              </button>
            )}

            {/* Market Mode Quick Button */}
            {onOpenMarketMode && (
              <button
                onClick={onOpenMarketMode}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
                title={t.liveShoppingMode}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.liveShoppingMode}</span>
                {pendingBazarCount > 0 && (
                  <span className="ml-1 bg-amber-700 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                    {pendingBazarCount}
                  </span>
                )}
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/90 py-2 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{t.navNotifications}</h4>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No notifications yet!
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.linkSection) setActiveTab(n.linkSection);
                            setShowNotifDropdown(false);
                          }}
                          className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.isRead ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="text-lg">
                              {n.type === 'bazar' ? '🛒' : n.type === 'expense' ? '💸' : n.type === 'savings' ? '🏆' : '🚨'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {language === 'bn' ? n.banglaTitle : n.title}
                              </p>
                              <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                                {language === 'bn' ? n.banglaMessage : n.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {n.timestamp}
                              </span>
                            </div>
                            {!n.isRead && (
                              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setActiveTab('notifications');
                        setShowNotifDropdown(false);
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      View all notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown / Auth Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-500/40"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{activeUser.name}</p>
                    <p className="text-[11px] text-slate-500">{activeUser.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setActiveTab('settings');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      if (onOpenHouseholdSwitcher) onOpenHouseholdSwitcher();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Switch Household</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        logoutUser();
                        if (onOpenAuthModal) onOpenAuthModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.logout}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        if (onOpenAuthModal) onOpenAuthModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{t.login} / Register</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
