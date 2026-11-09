import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  UserProfile, 
  Household, 
  BazarItem, 
  Expense, 
  PantryItem, 
  MealPlanDay, 
  ShoppingTrip, 
  AppNotification, 
  SavingsChallenge,
  ActivityItem,
  UserRole,
  ItemStatus,
  ShopperPerformance,
  Disagreement,
  Apology,
  PeaceMakingActivity,
  PeaceMakerAward,
  JhograStats,
  ApologyCategory
} from '../types';
import { 
  initialProfiles, 
  initialHouseholds, 
  initialBazarItems, 
  initialExpenses, 
  initialPantryItems, 
  initialMealPlans, 
  initialShoppingTrips, 
  initialNotifications, 
  initialSavingsChallenge,
  initialActivities,
  initialShopperPerformance,
  initialDisagreements,
  initialApologies,
  initialPeaceActivities
} from '../data/initialData';
import { translations, Language } from '../utils/translations';
import confetti from 'canvas-confetti';

interface AppContextType {
  // Profiles & Auth
  activeUser: UserProfile;
  switchActiveUser: (role: UserRole) => void;
  isLoggedIn: boolean;
  loginUser: (email: string) => void;
  logoutUser: () => void;
  registerUser: (name: string, email: string, role: UserRole) => void;

  // Multi-Household Management
  households: Household[];
  activeHousehold: Household;
  household: Household; // Backwards-compatible alias
  switchHousehold: (id: string) => void;
  createHousehold: (name: string, banglaName: string, budget: number) => void;
  joinHouseholdByCode: (inviteCode: string) => boolean;
  updateHousehold: (updates: Partial<Household>) => void;
  
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];

  // Bazar List & Items
  bazarItems: BazarItem[];
  addBazarItem: (item: Omit<BazarItem, 'id' | 'createdAt' | 'status' | 'isPurchased' | 'addedBy' | 'addedByName' | 'householdId'>) => void;
  updateBazarItem: (id: string, updates: Partial<BazarItem>) => void;
  deleteBazarItem: (id: string) => void;
  togglePurchased: (id: string, actualPrice?: number) => void;
  setItemStatus: (id: string, status: ItemStatus, actualPrice?: number) => void;
  toggleFavorite: (id: string) => void;
  duplicatePreviousBazar: () => void;
  addMultipleBazarItems: (items: Omit<BazarItem, 'id' | 'createdAt' | 'status' | 'isPurchased' | 'addedBy' | 'addedByName' | 'householdId'>[]) => void;
  
  // Signature 1: Bou Alert
  triggerBouAlert: (customMsg?: string) => void;
  snoozeBouAlert: (minutes?: number) => void;
  requestBrowserPushNotification: () => Promise<boolean>;

  // Signature 2: Bor's Bazar Performance
  shopperPerformance: ShopperPerformance;

  // Signature 3: Shongshar Savings Score
  savingsChallenge: SavingsChallenge;
  celebrateSavings: () => void;
  
  // Expenses (Monthly Hisab)
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'householdId'>) => void;
  deleteExpense: (id: string) => void;
  
  // Pantry
  pantryItems: PantryItem[];
  adjustPantryQuantity: (id: string, delta: number) => void;
  addPantryItem: (item: Omit<PantryItem, 'id' | 'householdId'>) => void;
  sendPantryItemToBazar: (id: string) => void;
  
  // Meal Planner
  mealPlans: MealPlanDay[];
  generateBazarFromMealDay: (dayOfWeek: string) => number;
  
  // Shopping History
  shoppingTrips: ShoppingTrip[];
  archiveCurrentBazarTrip: (storeName?: string) => void;
  
  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Activity Feed
  activities: ActivityItem[];
  
  // Jhogra Hisab (ঝগড়া হিসাব - Disagreement & Reconciliation Ledger)
  disagreements: Disagreement[];
  apologies: Apology[];
  peaceActivities: PeaceMakingActivity[];
  jhograStats: JhograStats;
  addDisagreement: (disagreement: Omit<Disagreement, 'id' | 'createdAt' | 'householdId'>) => void;
  resolveDisagreement: (id: string, resolutionMethod?: string) => void;
  disputeDisagreement: (id: string, reason: string) => void;
  deleteDisagreement: (id: string) => void;
  sendApology: (message: string, banglaMessage: string, category?: ApologyCategory, disagreementId?: string) => void;
  addPeaceActivity: (activity: Omit<PeaceMakingActivity, 'id' | 'createdAt' | 'householdId'>) => void;
  
  // Active Navigation Tab
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'bour_bazar_v2_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(`${STORAGE_PREFIX}lang`) as Language) || 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(`${STORAGE_PREFIX}lang`, lang);
  };

  const safeLang: Language = (language === 'en' || language === 'bn') ? language : 'bn';
  const t = translations[safeLang] || translations.bn || translations.en;

  // 2. Active Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // 3. Auth & Active User Profile
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return (localStorage.getItem(`${STORAGE_PREFIX}role`) as UserRole) || 'bou';
  });

  const activeUser = useMemo(() => {
    if (activeRole === 'bor') return initialProfiles.bor;
    if (activeRole === 'member') return initialProfiles.member;
    return initialProfiles.bou;
  }, [activeRole]);

  const switchActiveUser = (role: UserRole) => {
    setActiveRole(role);
    localStorage.setItem(`${STORAGE_PREFIX}role`, role);
  };

  const loginUser = (email: string) => {
    setIsLoggedIn(true);
    if (email.includes('bor')) switchActiveUser('bor');
    else if (email.includes('member')) switchActiveUser('member');
    else switchActiveUser('bou');
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
  };

  const registerUser = (name: string, email: string, role: UserRole) => {
    setIsLoggedIn(true);
    switchActiveUser(role);
  };

  // 4. Households Management
  const [households, setHouseholds] = useState<Household[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}households`);
    return saved ? JSON.parse(saved) : initialHouseholds;
  });

  const [activeHouseholdId, setActiveHouseholdId] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_PREFIX}active_hh_id`) || initialHouseholds[0].id;
  });

  const activeHousehold = useMemo(() => {
    return households.find(h => h.id === activeHouseholdId) || households[0];
  }, [households, activeHouseholdId]);

  const switchHousehold = (id: string) => {
    setActiveHouseholdId(id);
    localStorage.setItem(`${STORAGE_PREFIX}active_hh_id`, id);
  };

  const createHousehold = (name: string, banglaName: string, budget: number) => {
    const newHousehold: Household = {
      id: `hh-${Date.now()}`,
      name,
      banglaName: banglaName || name,
      inviteCode: `BOU-${Math.floor(1000 + Math.random() * 9000)}`,
      monthlyBudget: budget || 35000,
      currency: '৳',
      members: [
        { userId: activeUser.id, name: activeUser.name, role: activeRole, avatar: activeUser.avatar, joinedAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString(),
    };

    setHouseholds(prev => {
      const next = [...prev, newHousehold];
      localStorage.setItem(`${STORAGE_PREFIX}households`, JSON.stringify(next));
      return next;
    });

    switchHousehold(newHousehold.id);
  };

  const joinHouseholdByCode = (inviteCode: string): boolean => {
    const target = households.find(h => h.inviteCode.toUpperCase() === inviteCode.trim().toUpperCase());
    if (target) {
      switchHousehold(target.id);
      return true;
    }
    // If not found in local, create a simulation link
    const simulatedHh: Household = {
      id: `hh-joined-${Date.now()}`,
      name: `Joined Household (${inviteCode.toUpperCase()})`,
      banglaName: 'যুক্ত হওয়া নতুন সংসার',
      inviteCode: inviteCode.toUpperCase(),
      monthlyBudget: 35000,
      currency: '৳',
      members: [
        { userId: activeUser.id, name: activeUser.name, role: activeRole, avatar: activeUser.avatar, joinedAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString(),
    };
    setHouseholds(prev => [...prev, simulatedHh]);
    switchHousehold(simulatedHh.id);
    return true;
  };

  const updateHousehold = (updates: Partial<Household>) => {
    setHouseholds(prev => {
      const next = prev.map(h => h.id === activeHousehold.id ? { ...h, ...updates } : h);
      localStorage.setItem(`${STORAGE_PREFIX}households`, JSON.stringify(next));
      broadcastChange('households', next);
      return next;
    });
  };

  // 5. Bazar Items
  const [bazarItems, setBazarItems] = useState<BazarItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}bazar`);
    return saved ? JSON.parse(saved) : initialBazarItems;
  });

  // 6. Expenses
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}expenses`);
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  // 7. Pantry Items
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}pantry`);
    return saved ? JSON.parse(saved) : initialPantryItems;
  });

  // 8. Meal Plans
  const [mealPlans] = useState<MealPlanDay[]>(initialMealPlans);

  // 9. Shopping Trips
  const [shoppingTrips, setShoppingTrips] = useState<ShoppingTrip[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}trips`);
    return saved ? JSON.parse(saved) : initialShoppingTrips;
  });

  // 10. Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}notifs`);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // 11. Activity Log
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}activities`);
    return saved ? JSON.parse(saved) : initialActivities;
  });

  // Cross-Tab Broadcast Channel setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('bour_bazar_v2_channel');
      channel.onmessage = (event) => {
        const { type, data } = event.data;
        if (type === 'bazar') setBazarItems(data);
        if (type === 'expenses') setExpenses(data);
        if (type === 'pantry') setPantryItems(data);
        if (type === 'households') setHouseholds(data);
        if (type === 'notifs') setNotifications(data);
        if (type === 'activities') setActivities(data);
      };
      return () => channel.close();
    }
  }, []);

  const broadcastChange = (type: string, data: any) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('bour_bazar_v2_channel');
      channel.postMessage({ type, data });
      channel.close();
    }
  };

  // Helper to record activity
  const recordActivity = (action: string, banglaAction: string, iconType: ActivityItem['iconType']) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      user: activeUser.name,
      userRole: activeRole,
      action,
      banglaAction,
      timestamp: 'Just now',
      iconType,
    };
    setActivities(prev => {
      const next = [newAct, ...prev.slice(0, 25)];
      localStorage.setItem(`${STORAGE_PREFIX}activities`, JSON.stringify(next));
      broadcastChange('activities', next);
      return next;
    });
  };

  // Helper to push notification
  const pushNotification = (
    title: string, 
    banglaTitle: string, 
    message: string, 
    banglaMessage: string, 
    type: AppNotification['type'], 
    linkSection?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      banglaTitle,
      message,
      banglaMessage,
      type,
      timestamp: 'Just now',
      isRead: false,
      linkSection,
    };
    setNotifications(prev => {
      const next = [newNotif, ...prev];
      localStorage.setItem(`${STORAGE_PREFIX}notifs`, JSON.stringify(next));
      broadcastChange('notifs', next);
      return next;
    });

    // Native browser notification if allowed
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/logo.svg'
        });
      } catch (err) {
        console.warn('Browser notification failed:', err);
      }
    }
  };

  // Bazar CRUD
  const addBazarItem = (item: Omit<BazarItem, 'id' | 'createdAt' | 'status' | 'isPurchased' | 'addedBy' | 'addedByName' | 'householdId'>) => {
    const newItem: BazarItem = {
      ...item,
      id: `biz-${Date.now()}`,
      householdId: activeHousehold.id,
      addedBy: activeRole,
      addedByName: activeUser.name,
      status: 'pending',
      isPurchased: false,
      createdAt: new Date().toISOString(),
    };

    setBazarItems(prev => {
      const next = [newItem, ...prev];
      localStorage.setItem(`${STORAGE_PREFIX}bazar`, JSON.stringify(next));
      broadcastChange('bazar', next);
      return next;
    });

    recordActivity(
      `added "${item.title}" to today's bazar list`,
      `আজকের বাজার ফর্দে "${item.banglaTitle || item.title}" যোগ করেছেন`,
      'cart'
    );

    pushNotification(
      `New Bazar Item from ${activeUser.name}`,
      `${activeUser.banglaName} নতুন বাজার আইটেম যোগ করেছে`,
      `${item.title} (${item.quantity} ${item.unit}) added to list`,
      `তালিকায় ${item.banglaTitle || item.title} (${item.quantity} ${item.unit}) যুক্ত হয়েছে`,
      'bazar',
      'bazar'
    );
  };

  const addMultipleBazarItems = (items: Omit<BazarItem, 'id' | 'createdAt' | 'status' | 'isPurchased' | 'addedBy' | 'addedByName' | 'householdId'>[]) => {
    const newItems: BazarItem[] = items.map((item, idx) => ({
      ...item,
      id: `biz-${Date.now()}-${idx}`,
      householdId: activeHousehold.id,
      addedBy: activeRole,
      addedByName: activeUser.name,
      status: 'pending',
      isPurchased: false,
      createdAt: new Date().toISOString(),
    }));

    setBazarItems(prev => {
      const next = [...newItems, ...prev];
      localStorage.setItem(`${STORAGE_PREFIX}bazar`, JSON.stringify(next));
      broadcastChange('bazar', next);
      return next;
    });

    recordActivity(
      `added ${items.length} items to the bazar list`,
      `বাজার ফর্দে ${items.length}টি পদ যোগ করেছেন`,
      'cart'
    );
  };

  const updateBazarItem = (id: string, updates: Partial<BazarItem>) => {
    setBazarItems(prev => {
      const next = prev.map(item => item.id === id ? { ...item, ...updates } : item);
      localStorage.setItem(`${STORAGE_PREFIX}bazar`, JSON.stringify(next));
      broadcastChange('bazar', next);
      return next;
    });
  };

  const deleteBazarItem = (id: string) => {
    setBazarItems(prev => {
      const next = prev.filter(item => item.id !== id);
      localStorage.setItem(`${STORAGE_PREFIX}bazar`, JSON.stringify(next));
      broadcastChange('bazar', next);
      return next;
    });
  };

  const toggleFavorite = (id: string) => {
    setBazarItems(prev => {
      const next = prev.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item);
      localStorage.setItem(`${STORAGE_PREFIX}bazar`, JSON.stringify(next));
      broadcastChange('bazar', next);
      return next;
    });
  };

  const setItemStatus = (id: string, status: ItemStatus, actualPrice?: number) => {
    setBazarItems(prev => {
      const target = prev.find(item => item.id === id);
      if (!target) return prev;

      const isPurchasedNow = status === 'purchased';
      const finalPrice = actualPrice !== undefined ? actualPrice : (target.actualPrice || target.estimatedPrice);

      const next = prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status,
            isPurchased: isPurchasedNow,
            actualPrice: isPurchasedNow ? finalPrice : undefined,
            purchasedBy: isPurchasedNow ? activeUser.name : undefined,
            purchasedAt: isPurchasedNow ? new Date().toISOString() : undefined,
          };
        }
        return item;
      });

      localStorage.setItem(`${STORAGE_PREFIX}bazar`, JSON.stringify(next));
      broadcastChange('bazar', next);

      if (isPurchasedNow) {
        recordActivity(
          `purchased "${target.title}" for ৳${finalPrice}`,
          `৳${finalPrice} টাকায় "${target.banglaTitle || target.title}" কিনেছেন`,
          'check'
        );
      } else if (status === 'unavailable') {
        recordActivity(
          `marked "${target.title}" as unavailable in market`,
          `বাজারে "${target.banglaTitle || target.title}" মেলেনি`,
          'alert'
        );
      } else if (status === 'forgotten') {
        recordActivity(
          `marked "${target.title}" as forgotten`,
          `"${target.banglaTitle || target.title}" আনতে মনে ছিল না`,
          'alert'
        );
      }

      return next;
    });
  };

  const togglePurchased = (id: string, actualPrice?: number) => {
    const item = bazarItems.find(i => i.id === id);
    if (!item) return;
    const nextStatus: ItemStatus = item.status === 'purchased' ? 'pending' : 'purchased';
    setItemStatus(id, nextStatus, actualPrice);
  };

  const duplicatePreviousBazar = () => {
    if (shoppingTrips.length === 0) return;
    const lastTrip = shoppingTrips[0];
    const duplicatedItems: BazarItem[] = lastTrip.items.map((item, idx) => ({
      id: `biz-${Date.now()}-${idx}`,
      householdId: activeHousehold.id,
      title: item.name,
      quantity: item.quantity,
      unit: (item.unit as any) || 'kg',
      estimatedPrice: item.estimatedPrice || item.actualPrice,
      category: 'Vegetables',
      priority: 'normal',
      status: 'pending',
      isPurchased: false,
      notes: `Duplicated from ${lastTrip.title}`,
      addedBy: activeRole,
      addedByName: activeUser.name,
      assignedTo: 'bor',
      createdAt: new Date().toISOString(),
    }));

    setBazarItems(prev => {
      const next = [...duplicatedItems, ...prev];
      localStorage.setItem(`${STORAGE_PREFIX}bazar`, JSON.stringify(next));
      broadcastChange('bazar', next);
      return next;
    });

    recordActivity(
      `duplicated past bazar list with ${duplicatedItems.length} items`,
      `আগের ট্রিপ থেকে ${duplicatedItems.length}টি বাজার আইটেম রিক্রিয়েট করেছেন`,
      'cart'
    );
  };

  // Signature 1: Bou Alert
  const triggerBouAlert = (customMsg?: string) => {
    const defaultMsg = 'Bou: "Bazar e jawar shomoy hoye geche! Dim ante bhule jaben na! 😂"';
    const alertMessage = customMsg || defaultMsg;

    pushNotification(
      'Bou Alert 🚨',
      'বউ এলার্ট 🚨',
      alertMessage,
      alertMessage,
      'bou_alert',
      'bazar'
    );

    recordActivity(
      `triggered a Bou Alert: "${alertMessage}"`,
      `একটি বউ এলার্ট পাঠিয়েছেন: "${alertMessage}"`,
      'alert'
    );
  };

  const snoozeBouAlert = (minutes: number = 30) => {
    pushNotification(
      'Bou Alert Snoozed ⏰',
      'বউ এলার্ট স্থগিত ⏰',
      `Reminder snoozed for ${minutes} minutes. Don't forget the bazar!`,
      `${minutes} মিনিটের জন্য রিমাইন্ডার বন্ধ রাখা হয়েছে। বাজার ভুলবেন না!`,
      'alert',
      'bazar'
    );
  };

  const requestBrowserPushNotification = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  // Signature 2: Bor's Bazar Performance Calculations
  const shopperPerformance: ShopperPerformance = useMemo(() => {
    const assignedItems = bazarItems;
    const totalAssigned = assignedItems.length;
    const totalPurchased = assignedItems.filter(i => i.status === 'purchased').length;
    const totalUnavailable = assignedItems.filter(i => i.status === 'unavailable').length;
    const totalForgotten = assignedItems.filter(i => i.status === 'forgotten').length;

    const completionRate = totalAssigned > 0 
      ? Math.round((totalPurchased / totalAssigned) * 100) 
      : 87;

    const totalEst = assignedItems.reduce((s, i) => s + i.estimatedPrice, 0);
    const totalAct = assignedItems
      .filter(i => i.status === 'purchased')
      .reduce((s, i) => s + (i.actualPrice || i.estimatedPrice), 0);

    const estForPurchased = assignedItems
      .filter(i => i.status === 'purchased')
      .reduce((s, i) => s + i.estimatedPrice, 0);

    const totalSavings = Math.max(0, estForPurchased - totalAct);

    let encouragementMessage = "Excellent bazar! You completed the list and saved money! 🎉";
    let banglaEncouragementMessage = "দারুণ বাজার হয়েছে! হিসাব মতো কেনাকাটা সম্পন্ন করেছেন। সাবাশ! 🎉";

    if (totalUnavailable > 0 && totalForgotten === 0) {
      encouragementMessage = "Great job! A product was unavailable in market, but zero items were forgotten! 🌟";
      banglaEncouragementMessage = "চমৎকার! বাজারে পণ্য শেষ হয়ে গিয়েছিল, কিন্তু আপনি কোনো কিছু ভুলে যাননি! 🌟";
    } else if (totalForgotten > 0) {
      encouragementMessage = "Good effort! Just 1 item forgotten, easily picked up on the next trip. 👍";
      banglaEncouragementMessage = "ভালো হয়েছে! শুধু ১টি পদ বাদ পড়েছে, পরের বার এনে নিলেই হবে। 👍";
    }

    return {
      shopperName: 'Tanvir Ahmed (Bor)',
      role: 'bor',
      totalAssigned: totalAssigned || 15,
      totalPurchased: totalPurchased || 13,
      totalUnavailable: totalUnavailable || 1,
      totalForgotten: totalForgotten || 1,
      completionRate: totalAssigned > 0 ? completionRate : 87,
      totalEstimated: totalEst || 2000,
      totalActual: totalAct || 1850,
      totalSavings: totalSavings || 150,
      avgTripCost: 1850,
      avgCompletionTimeMins: 42,
      monthlyTripsCount: shoppingTrips.length || 4,
      encouragementMessage,
      banglaEncouragementMessage,
      weeklyHistory: initialShopperPerformance.weeklyHistory,
    };
  }, [bazarItems, shoppingTrips]);

  // Signature 3: Shongshar Savings Score Calculations
  const savingsChallenge: SavingsChallenge = useMemo(() => {
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const unusedBudget = Math.max(0, activeHousehold.monthlyBudget - totalSpent);
    const actualSavings = shopperPerformance.totalSavings + 3300; // combined discounts & smart buying

    // Score out of 100 calculation
    const budgetFactor = totalSpent <= activeHousehold.monthlyBudget ? 40 : Math.max(10, 40 - Math.round(((totalSpent - activeHousehold.monthlyBudget) / activeHousehold.monthlyBudget) * 50));
    const completionFactor = Math.min(30, Math.round((shopperPerformance.completionRate / 100) * 30));
    const pantryFactor = 15;
    const consistencyFactor = 15;
    const finalScore = Math.min(100, budgetFactor + completionFactor + pantryFactor + consistencyFactor);

    return {
      ...initialSavingsChallenge,
      savingsScore: finalScore,
      actualSavings,
      unusedBudget,
    };
  }, [expenses, activeHousehold, shopperPerformance]);

  const celebrateSavings = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#198754', '#10b981', '#f59e0b', '#fbbf24', '#f4a340']
    });

    pushNotification(
      'Shongshar Milestone Celebrated! 🎉',
      'সংসার সঞ্চয় উদযাপন! 🎉',
      `Congratulations! Savings score is ${savingsChallenge.savingsScore}/100! Shabbaash!`,
      `অভিনন্দন! আপনার সংসার সেভিংস স্কোর ${savingsChallenge.savingsScore}/১০০! চমৎকার সঞ্চয় হয়েছে!`,
      'savings',
      'savings'
    );
  };

  // Expenses CRUD
  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'householdId'>) => {
    const newExp: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
      householdId: activeHousehold.id,
      createdAt: new Date().toISOString(),
    };

    setExpenses(prev => {
      const next = [newExp, ...prev];
      localStorage.setItem(`${STORAGE_PREFIX}expenses`, JSON.stringify(next));
      broadcastChange('expenses', next);
      return next;
    });

    recordActivity(
      `recorded an expense: "${expense.title}" of ৳${expense.amount}`,
      `"${expense.title}" বাবদ ৳${expense.amount} খরচের হিসাব লিখেছেন`,
      'money'
    );

    pushNotification(
      `New Expense: ৳${expense.amount}`,
      `নতুন খরচ: ৳${expense.amount}`,
      `${expense.title} paid by ${expense.paidBy} (${expense.paymentMethod})`,
      `${expense.title} পরিশোধ করেছেন ${expense.paidBy} (${expense.paymentMethod})`,
      'expense',
      'hisab'
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => {
      const next = prev.filter(e => e.id !== id);
      localStorage.setItem(`${STORAGE_PREFIX}expenses`, JSON.stringify(next));
      broadcastChange('expenses', next);
      return next;
    });
  };

  // Pantry Actions
  const adjustPantryQuantity = (id: string, delta: number) => {
    setPantryItems(prev => {
      const next = prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, Math.round((item.currentQuantity + delta) * 10) / 10);
          return { ...item, currentQuantity: newQty };
        }
        return item;
      });
      localStorage.setItem(`${STORAGE_PREFIX}pantry`, JSON.stringify(next));
      broadcastChange('pantry', next);
      return next;
    });
  };

  const addPantryItem = (item: Omit<PantryItem, 'id' | 'householdId'>) => {
    const newItem: PantryItem = {
      ...item,
      id: `p-${Date.now()}`,
      householdId: activeHousehold.id,
    };
    setPantryItems(prev => {
      const next = [newItem, ...prev];
      localStorage.setItem(`${STORAGE_PREFIX}pantry`, JSON.stringify(next));
      broadcastChange('pantry', next);
      return next;
    });
  };

  const sendPantryItemToBazar = (id: string) => {
    const item = pantryItems.find(p => p.id === id);
    if (!item) return;

    addBazarItem({
      title: item.name,
      banglaTitle: item.banglaName,
      quantity: Math.max(1, item.minStockLevel),
      unit: item.unit,
      estimatedPrice: item.estimatedPrice * Math.max(1, item.minStockLevel),
      category: 'Rice and Essentials',
      priority: 'urgent',
      notes: `Restock needed: Current stock is only ${item.currentQuantity} ${item.unit}`,
      assignedTo: 'bor',
    });
  };

  // Meal Planner Action
  const generateBazarFromMealDay = (dayOfWeek: string): number => {
    const meal = mealPlans.find(m => m.day === dayOfWeek);
    if (!meal || !meal.ingredients) return 0;

    const existingTitles = new Set(bazarItems.filter(b => b.status === 'pending').map(b => b.title.toLowerCase()));

    const itemsToAdd = meal.ingredients
      .filter(ing => !existingTitles.has(ing.name.toLowerCase()))
      .map(ing => ({
        title: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        estimatedPrice: ing.category === 'Fish and Meat' ? 450 : 80,
        category: ing.category,
        priority: 'important' as const,
        notes: `Generated for ${meal.banglaDay} menu`,
        assignedTo: 'bor' as const,
      }));

    if (itemsToAdd.length > 0) {
      addMultipleBazarItems(itemsToAdd);
    }
    return itemsToAdd.length;
  };

  // Shopping Trips (Archiving completed bazar)
  const archiveCurrentBazarTrip = (storeName = 'Local Bazaar') => {
    const purchased = bazarItems.filter(i => i.status === 'purchased');
    if (purchased.length === 0) return;

    const estTotal = purchased.reduce((sum, i) => sum + i.estimatedPrice, 0);
    const actTotal = purchased.reduce((sum, i) => sum + (i.actualPrice || i.estimatedPrice), 0);

    const trip: ShoppingTrip = {
      id: `trip-${Date.now()}`,
      householdId: activeHousehold.id,
      date: new Date().toISOString().split('T')[0],
      title: `${storeName} Bazar`,
      itemsCount: purchased.length,
      assignedCount: bazarItems.length,
      purchasedCount: purchased.length,
      unavailableCount: bazarItems.filter(i => i.status === 'unavailable').length,
      forgottenCount: bazarItems.filter(i => i.status === 'forgotten').length,
      estimatedTotal: estTotal,
      actualTotal: actTotal,
      purchasedBy: activeUser.name,
      storeName,
      completionTimeMins: 45,
      items: purchased.map(p => ({
        name: p.title,
        quantity: p.quantity,
        unit: p.unit,
        estimatedPrice: p.estimatedPrice,
        actualPrice: p.actualPrice || p.estimatedPrice,
        status: p.status,
      }))
    };

    setShoppingTrips(prev => {
      const next = [trip, ...prev];
      localStorage.setItem(`${STORAGE_PREFIX}trips`, JSON.stringify(next));
      return next;
    });

    addExpense({
      title: `${storeName} Grocery Bazar (${purchased.length} items)`,
      amount: actTotal,
      category: 'Grocery',
      paymentMethod: 'Cash',
      paidBy: activeRole === 'bou' ? 'Bou' : 'Bor',
      date: new Date().toISOString().split('T')[0],
      description: `Auto-recorded from completed trip: ${purchased.map(i => i.title).join(', ')}`,
    });

    setBazarItems(prev => {
      const remaining = prev.filter(i => i.status !== 'purchased');
      localStorage.setItem(`${STORAGE_PREFIX}bazar`, JSON.stringify(remaining));
      broadcastChange('bazar', remaining);
      return remaining;
    });

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      localStorage.setItem(`${STORAGE_PREFIX}notifs`, JSON.stringify(next));
      broadcastChange('notifs', next);
      return next;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, isRead: true }));
      localStorage.setItem(`${STORAGE_PREFIX}notifs`, JSON.stringify(next));
      broadcastChange('notifs', next);
      return next;
    });
  };

  // ==============================================================================
  // JHOGRA HISAB (ঝগড়া হিসাব - Playful Disagreement & Reconciliation Ledger)
  // ==============================================================================
  const [disagreements, setDisagreements] = useState<Disagreement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}disagreements`);
    return saved ? JSON.parse(saved) : initialDisagreements;
  });

  const [apologies, setApologies] = useState<Apology[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}apologies`);
    return saved ? JSON.parse(saved) : initialApologies;
  });

  const [peaceActivities, setPeaceActivities] = useState<PeaceMakingActivity[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}peace_activities`);
    return saved ? JSON.parse(saved) : initialPeaceActivities;
  });

  const addDisagreement = (item: Omit<Disagreement, 'id' | 'createdAt' | 'householdId'>) => {
    const newItem: Disagreement = {
      ...item,
      id: `jh-${Date.now()}`,
      householdId: activeHousehold.id,
      createdAt: new Date().toISOString()
    };
    setDisagreements(prev => {
      const next = [newItem, ...prev];
      localStorage.setItem(`${STORAGE_PREFIX}disagreements`, JSON.stringify(next));
      broadcastChange('disagreements', next);
      return next;
    });

    const actEn = `${item.reportedByName} recorded a playful disagreement: "${item.description.slice(0, 35)}..."`;
    const actBn = `${item.reportedByName} একটি খুনসুটি রেকর্ড করেছেন: "${item.description.slice(0, 35)}..."`;
    recordActivity(actEn, actBn, 'alert');
  };

  const addPeaceActivity = (item: Omit<PeaceMakingActivity, 'id' | 'createdAt' | 'householdId'>) => {
    const newActivity: PeaceMakingActivity = {
      ...item,
      id: `pa-${Date.now()}`,
      householdId: activeHousehold.id,
      createdAt: new Date().toISOString()
    };
    setPeaceActivities(prev => {
      const next = [newActivity, ...prev];
      localStorage.setItem(`${STORAGE_PREFIX}peace_activities`, JSON.stringify(next));
      broadcastChange('peace_activities', next);
      return next;
    });
  };

  const resolveDisagreement = (id: string, resolutionMethod?: string) => {
    setDisagreements(prev => {
      const next = prev.map(d => {
        if (d.id === id) {
          return {
            ...d,
            status: 'resolved' as const,
            resolvedAt: new Date().toISOString(),
            resolvedBy: activeRole,
            resolutionMethod: resolutionMethod || 'মিষ্টি কথায় আপোষ ও শান্তিচুক্তি'
          };
        }
        return d;
      });
      localStorage.setItem(`${STORAGE_PREFIX}disagreements`, JSON.stringify(next));
      broadcastChange('disagreements', next);
      return next;
    });

    addPeaceActivity({
      disagreementId: id,
      madeBy: activeRole,
      madeByName: activeUser.name,
      targetRole: activeRole === 'bou' ? 'bor' : 'bou',
      activityType: 'sweet_talk',
      title: 'Disagreement Resolved',
      banglaTitle: 'মান-অভিমান ভেঙে শান্তিচুক্তি সম্পন্ন',
      notes: resolutionMethod || 'উভয়ের সম্মতিতে শান্তি প্রতিষ্ঠিত হয়েছে',
      points: 15
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const disputeDisagreement = (id: string, reason: string) => {
    setDisagreements(prev => {
      const next = prev.map(d => {
        if (d.id === id) {
          return {
            ...d,
            status: 'disputed' as const,
            disputedBy: activeRole,
            disputeReason: reason
          };
        }
        return d;
      });
      localStorage.setItem(`${STORAGE_PREFIX}disagreements`, JSON.stringify(next));
      broadcastChange('disagreements', next);
      return next;
    });

    recordActivity(
      `${activeUser.name} disputed a recorded disagreement`,
      `${activeUser.name} একটি খুনসুটির বিরুদ্ধে আপিল/ডিসপিউট করেছেন`,
      'alert'
    );
  };

  const deleteDisagreement = (id: string) => {
    setDisagreements(prev => {
      const next = prev.filter(d => d.id !== id);
      localStorage.setItem(`${STORAGE_PREFIX}disagreements`, JSON.stringify(next));
      broadcastChange('disagreements', next);
      return next;
    });
  };

  const sendApology = (message: string, banglaMessage: string, category: ApologyCategory = 'cute', disagreementId?: string) => {
    const receiverRole: UserRole = activeRole === 'bou' ? 'bor' : 'bou';
    const newApology: Apology = {
      id: `ap-${Date.now()}`,
      householdId: activeHousehold.id,
      disagreementId,
      senderRole: activeRole,
      senderName: activeUser.name,
      receiverRole,
      message,
      banglaMessage,
      category,
      accepted: true,
      createdAt: new Date().toISOString()
    };

    setApologies(prev => {
      const next = [newApology, ...prev];
      localStorage.setItem(`${STORAGE_PREFIX}apologies`, JSON.stringify(next));
      broadcastChange('apologies', next);
      return next;
    });

    const notif: AppNotification = {
      id: `notif-ap-${Date.now()}`,
      title: activeRole === 'bou' ? "Bou's Sweet Apology! 👰" : "Bor's Sweet Apology! 🤵",
      banglaTitle: activeRole === 'bou' ? '👰 বউয়ের মিষ্টি সরি!' : '🤵 বরের মিষ্টি সরি!',
      message: message || banglaMessage,
      banglaMessage: banglaMessage || message,
      type: 'alert',
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    addPeaceActivity({
      disagreementId,
      madeBy: activeRole,
      madeByName: activeUser.name,
      targetRole: receiverRole,
      activityType: 'said_sorry',
      title: 'Sent Heartfelt Apology',
      banglaTitle: 'মিষ্টি সরি ও মান ভাঙানোর বার্তা',
      notes: banglaMessage,
      points: 15
    });

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  const jhograStats = useMemo<JhograStats>(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthDisagreements = disagreements.filter(d => d.date.startsWith(currentMonth) || true);

    const bouReported = currentMonthDisagreements.filter(d => d.reportedBy === 'bou').length;
    const borReported = currentMonthDisagreements.filter(d => d.reportedBy === 'bor').length;
    const resolvedCount = currentMonthDisagreements.filter(d => d.status === 'resolved').length;
    const pendingCount = currentMonthDisagreements.filter(d => d.status === 'unresolved').length;
    const disputedCount = currentMonthDisagreements.filter(d => d.status === 'disputed').length;

    const reasonCounts: Record<string, number> = {};
    currentMonthDisagreements.forEach(d => {
      reasonCounts[d.reason] = (reasonCounts[d.reason] || 0) + 1;
    });
    let topReason = 'bazar_forgotten';
    let topCount = 0;
    Object.entries(reasonCounts).forEach(([r, count]) => {
      if (count > topCount) {
        topCount = count;
        topReason = r;
      }
    });

    const reasonLabelMap: Record<string, { en: string; bn: string }> = {
      bazar_forgotten: { en: 'Forgot to bring bazar', bn: 'বাজার আনতে ভুলে যাওয়া 🛒' },
      didnt_listen: { en: "Didn't listen carefully", bn: 'মন দিয়ে কথা না শোনা 👂' },
      came_home_late: { en: 'Came home late', bn: 'দেরি করে বাসায় ফেরা ⏰' },
      phone_usage: { en: 'Too much phone usage', bn: 'সারাদিন ফোন টেপাটিপি 📱' },
      overspent_budget: { en: 'Overspent the budget', bn: 'বাজেট ছাড়িয়ে খরচ 💸' },
      remote_fight: { en: 'Remote control fight', bn: 'টিভির রিমোট নিয়ে কাড়াকাড়ি 📺' },
      forgot_important: { en: 'Forgot something important', bn: 'জরুরি তারিখ বা কথা ভুলে যাওয়া 🧠' },
      other: { en: 'Other dramatic reasons', bn: 'অন্যান্য নাটকীয় কারণ 🎭' }
    };

    const bouApologies = apologies.filter(a => a.senderRole === 'bou').length;
    const borApologies = apologies.filter(a => a.senderRole === 'bor').length;

    const bouPeacePoints = peaceActivities.filter(p => p.madeBy === 'bou').reduce((s, p) => s + p.points, 0);
    const borPeacePoints = peaceActivities.filter(p => p.madeBy === 'bor').reduce((s, p) => s + p.points, 0);

    const peaceMakerLeader: UserRole = borPeacePoints >= bouPeacePoints ? 'bor' : 'bou';

    const awards: PeaceMakerAward[] = [
      {
        id: 'aw-01',
        title: 'Chief Peace Envoy',
        banglaTitle: 'শান্তির দূত 🕊️',
        description: 'Made the most sincere efforts to restore peace and happiness in the home.',
        banglaDescription: 'সংসারে শান্তি ফিরিয়ে আনতে যিনি সবচেয়ে বেশি মান ভাঙানোর উদ্যোগ নিয়েছেন।',
        icon: '🕊️',
        winnerRole: peaceMakerLeader,
        winnerName: peaceMakerLeader === 'bor' ? 'তানভীর (বর)' : 'নুসরাত (বউ)',
        funnyComment: 'He/she will do anything for peace (even washing dishes)!',
        banglaFunnyComment: 'শান্তির জন্য ইনি সব করতে রাজি, এমনকি রাতের সব থালাবাসন মাজতেও দ্বিধা করেন না!'
      },
      {
        id: 'aw-02',
        title: 'Sorry Specialist',
        banglaTitle: 'সরি স্পেশালিস্ট 🙇',
        description: 'Fastest to apologize and drop the ego for family harmony.',
        banglaDescription: 'ইগো ভুলে পরিবারের সুখের জন্য সবার আগে চটপট সরি বলেন যিনি।',
        icon: '🙇',
        winnerRole: borApologies >= bouApologies ? 'bor' : 'bou',
        winnerName: borApologies >= bouApologies ? 'তানভীর (বর)' : 'নুসরাত (বউ)',
        funnyComment: 'Practice makes perfect: Sorry is their favorite superpower!',
        banglaFunnyComment: 'সরি বলায় এনার কোনো তুলনা নেই—ভালোবাসা বজায় রাখতে একাই একশো!'
      },
      {
        id: 'aw-03',
        title: 'Bazar Forgetting Champion',
        banglaTitle: 'বাজার ভুলে যাওয়ার মহারাজ 🛒',
        description: 'Master of coming back with everything except the main grocery item.',
        banglaDescription: 'লিস্টের সব আনে কিন্তু আসল জিনিসটাই ভুলে রেখে আসার অনন্য প্রতিভা!',
        icon: '🛒',
        winnerRole: 'bor',
        winnerName: 'তানভীর (বর)',
        funnyComment: 'Asked for coriander, brought mint leaves; but loved nonetheless!',
        banglaFunnyComment: 'ধনেপাতা চাইলে পুদিনাপাতা আনেন, ডিম ভুলে গিয়ে মিষ্টি আনেন—তবুও প্রিয়!'
      },
      {
        id: 'aw-04',
        title: 'Drama King / Queen',
        banglaTitle: 'সংসারের ড্রামা সম্রাজ্ঞী / সম্রাট 👑',
        description: 'Brings Bollywood-level expressions to simple household disagreements.',
        banglaDescription: 'হালকা একটু চা ঠান্ডা হলেই পুরো বাংলা সিনেমার ডায়লগ দিয়ে মাত করে দেন!',
        icon: '👑',
        winnerRole: bouReported >= borReported ? 'bou' : 'bor',
        winnerName: bouReported >= borReported ? 'নুসরাত (বউ)' : 'তানভীর (বর)',
        funnyComment: 'Life is never boring with this superstar in the house!',
        banglaFunnyComment: 'এনার খুনসুটি ও অভিমান না থাকলে সংসার একদম পানসে হয়ে যেত!'
      },
      {
        id: 'aw-05',
        title: 'Best Partner of the Month',
        banglaTitle: 'মাসের সেরা জীবনসঙ্গী 🌟',
        description: 'Maintained the highest average score of affection, smiles, and tea dates.',
        banglaDescription: 'ঝগড়ার মাঝেও ভালোবাসা, হাসি আর একসাথে চা খাওয়ার সুন্দর বন্ধন ধরে রেখেছেন।',
        icon: '🌟',
        winnerRole: 'bou',
        winnerName: 'নুসরাত ও তানভীর (যৌথ)',
        funnyComment: 'A perfect match where love always wins after every sulk!',
        banglaFunnyComment: 'যত খুনসুটিই হোক না কেন, দিনশেষে ভালোবাসা আর শান্তির জয় অনিবার্য!'
      }
    ];

    return {
      totalThisMonth: currentMonthDisagreements.length,
      bouReported,
      borReported,
      resolvedCount,
      pendingCount,
      disputedCount,
      mostCommonReason: reasonLabelMap[topReason]?.en || topReason,
      banglaMostCommonReason: reasonLabelMap[topReason]?.bn || topReason,
      bouApologies,
      borApologies,
      bouPeacePoints,
      borPeacePoints,
      peaceMakerLeader,
      awards
    };
  }, [disagreements, apologies, peaceActivities]);

  return (
    <AppContext.Provider
      value={{
        activeUser,
        switchActiveUser,
        isLoggedIn,
        loginUser,
        logoutUser,
        registerUser,
        households,
        activeHousehold,
        household: activeHousehold,
        switchHousehold,
        createHousehold,
        joinHouseholdByCode,
        updateHousehold,
        language,
        setLanguage,
        t,
        bazarItems,
        addBazarItem,
        updateBazarItem,
        deleteBazarItem,
        togglePurchased,
        setItemStatus,
        toggleFavorite,
        duplicatePreviousBazar,
        addMultipleBazarItems,
        triggerBouAlert,
        snoozeBouAlert,
        requestBrowserPushNotification,
        shopperPerformance,
        savingsChallenge,
        celebrateSavings,
        expenses,
        addExpense,
        deleteExpense,
        pantryItems,
        adjustPantryQuantity,
        addPantryItem,
        sendPantryItemToBazar,
        mealPlans,
        generateBazarFromMealDay,
        shoppingTrips,
        archiveCurrentBazarTrip,
        notifications,
        markNotificationAsRead,
        markAllNotificationsRead,
        activities,
        disagreements,
        apologies,
        peaceActivities,
        jhograStats,
        addDisagreement,
        resolveDisagreement,
        disputeDisagreement,
        deleteDisagreement,
        sendApology,
        addPeaceActivity,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
