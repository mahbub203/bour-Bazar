import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Check, 
  Trash2, 
  ShoppingBag, 
  Receipt, 
  PackageOpen, 
  Trophy, 
  AlertCircle,
  CheckCheck
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsRead, 
    setActiveTab, 
    t, 
    language 
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifs = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'bazar': return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      case 'expense': return <Receipt className="w-5 h-5 text-blue-600" />;
      case 'pantry': return <PackageOpen className="w-5 h-5 text-amber-600" />;
      case 'savings': return <Trophy className="w-5 h-5 text-orange-600" />;
      default: return <AlertCircle className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.navNotifications}
            </h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            পারিবারিক বাজার, খরচ, রিমাইন্ডার এবং রান্নাঘরের এলার্ট
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'unread' ? 'bg-red-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft divide-y divide-slate-100 overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Bell className="w-10 h-10 mx-auto text-slate-300 stroke-1 mb-2" />
            <p className="text-sm font-bold text-slate-700">All caught up!</p>
            <p className="text-xs text-slate-400">No unread notifications at this time.</p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationAsRead(n.id);
                if (n.linkSection) setActiveTab(n.linkSection);
              }}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                !n.isRead ? 'bg-emerald-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 shrink-0">
                  {getIcon(n.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm truncate">
                      {language === 'bn' ? n.banglaTitle : n.title}
                    </h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {language === 'bn' ? n.banglaMessage : n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">
                    {n.timestamp}
                  </span>
                </div>
              </div>

              {n.linkSection && (
                <span className="text-xs font-bold text-emerald-700 hover:text-emerald-800 shrink-0 self-center">
                  View →
                </span>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
