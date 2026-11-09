export type UserRole = 'bou' | 'bor' | 'member';

export interface UserProfile {
  id: string;
  name: string;
  banglaName: string;
  role: UserRole;
  avatar: string;
  email: string;
  phone?: string;
  title: string;
  banglaTitle: string;
  householdIds: string[];
  activeHouseholdId: string;
  notificationPreferences: {
    urgentAlerts: boolean;
    dailyReminders: boolean;
    savingsMilestones: boolean;
    soundEnabled: boolean;
    browserPushEnabled: boolean;
  };
}

export interface Household {
  id: string;
  name: string;
  banglaName: string;
  inviteCode: string;
  monthlyBudget: number;
  currency: string;
  members: {
    userId: string;
    name: string;
    role: UserRole;
    avatar: string;
    joinedAt: string;
  }[];
  createdAt: string;
}

export type UnitType = 
  | 'kg' 
  | 'gram' 
  | 'litre' 
  | 'piece' 
  | 'packet' 
  | 'dozon' 
  | 'hali' 
  | 'bundle';

export type ItemPriority = 'urgent' | 'important' | 'normal';

export type ItemStatus = 'pending' | 'purchased' | 'unavailable' | 'forgotten';

export type ItemCategory = 
  | 'Rice and Essentials'
  | 'Vegetables'
  | 'Fish and Meat'
  | 'Dairy'
  | 'Fruits'
  | 'Spices'
  | 'Household Products'
  | 'Personal Care'
  | 'Other';

export interface BazarItem {
  id: string;
  title: string;
  banglaTitle?: string;
  quantity: number;
  unit: UnitType;
  estimatedPrice: number;
  actualPrice?: number;
  category: ItemCategory;
  priority: ItemPriority;
  status: ItemStatus;
  notes?: string;
  addedBy: UserRole;
  addedByName: string;
  purchasedBy?: string;
  assignedTo: UserRole;
  isPurchased: boolean; // backwards compatible helper
  isFavorite?: boolean;
  purchasedAt?: string;
  createdAt: string;
  householdId: string;
}

export type ExpenseCategory =
  | 'Grocery'
  | 'Vegetables'
  | 'Fish and Meat'
  | 'Electricity'
  | 'Gas'
  | 'Water'
  | 'Rent'
  | 'Internet'
  | 'Transportation'
  | 'Medical'
  | 'Education'
  | 'Household maintenance'
  | 'Other';

export type PaymentMethod = 'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Card' | 'Other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  paidBy: 'Bou' | 'Bor' | 'Family Member' | 'Shared';
  date: string;
  description?: string;
  receiptUrl?: string;
  createdAt: string;
  householdId: string;
}

export interface PantryItem {
  id: string;
  name: string;
  banglaName: string;
  category: string;
  currentQuantity: number;
  unit: UnitType;
  minStockLevel: number;
  lastPurchasedDate: string;
  expiryDate?: string;
  estimatedPrice: number;
  icon?: string;
  householdId: string;
}

export type DayOfWeek = 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface MealPlanDay {
  day: DayOfWeek;
  banglaDay: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: UnitType;
    category: ItemCategory;
  }[];
}

export interface ShoppingTrip {
  id: string;
  date: string;
  title: string;
  itemsCount: number;
  assignedCount: number;
  purchasedCount: number;
  unavailableCount: number;
  forgottenCount: number;
  estimatedTotal: number;
  actualTotal: number;
  purchasedBy: string;
  storeName?: string;
  receiptUrl?: string;
  completionTimeMins?: number;
  items: {
    name: string;
    quantity: number;
    unit: string;
    estimatedPrice: number;
    actualPrice: number;
    status: ItemStatus;
  }[];
  householdId: string;
}

export interface AppNotification {
  id: string;
  title: string;
  banglaTitle: string;
  message: string;
  banglaMessage: string;
  type: 'bazar' | 'expense' | 'pantry' | 'savings' | 'alert' | 'bou_alert';
  timestamp: string;
  isRead: boolean;
  linkSection?: string;
  snoozedUntil?: string;
}

export interface Badge {
  id: string;
  name: string;
  banglaName: string;
  description: string;
  banglaDescription: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface SavingsChallenge {
  monthName: string;
  banglaMonthName: string;
  targetAmount: number;
  savedSoFar: number;
  streakDays: number;
  savingsScore: number; // Score out of 100
  actualSavings: number; // Realized savings through discounts & smart buying
  unusedBudget: number; // Remaining unspent budget
  badges: Badge[];
}

export interface ActivityItem {
  id: string;
  user: string;
  userRole: UserRole;
  action: string;
  banglaAction: string;
  timestamp: string;
  iconType: 'cart' | 'money' | 'pantry' | 'check' | 'alert';
}

export interface ShopperPerformance {
  shopperName: string;
  role: UserRole;
  totalAssigned: number;
  totalPurchased: number;
  totalUnavailable: number;
  totalForgotten: number;
  completionRate: number; // percentage e.g. 87%
  totalEstimated: number;
  totalActual: number;
  totalSavings: number;
  avgTripCost: number;
  avgCompletionTimeMins: number;
  monthlyTripsCount: number;
  encouragementMessage: string;
  banglaEncouragementMessage: string;
  weeklyHistory: {
    week: string;
    purchased: number;
    assigned: number;
    savings: number;
  }[];
}

// ==============================================================================
// JHOGRA HISAB (ঝগড়া হিসাব - PLAYFUL DISAGREEMENT & RECONCILIATION LEDGER)
// ==============================================================================

export type DisagreementSeverity = 'small' | 'medium' | 'big';

export type DisagreementStatus = 'unresolved' | 'resolved' | 'disputed';

export type DisagreementReason = 
  | 'bazar_forgotten' 
  | 'didnt_listen' 
  | 'came_home_late' 
  | 'phone_usage' 
  | 'overspent_budget' 
  | 'remote_fight' 
  | 'forgot_important' 
  | 'other';

export interface Disagreement {
  id: string;
  householdId: string;
  reportedBy: UserRole;
  reportedByName: string;
  targetPartner: UserRole;
  targetPartnerName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason: DisagreementReason;
  customReason?: string;
  description: string;
  severity: DisagreementSeverity;
  status: DisagreementStatus;
  resolvedAt?: string;
  resolvedBy?: UserRole;
  resolutionMethod?: string;
  disputeReason?: string;
  disputedBy?: UserRole;
  createdAt: string;
}

export type ApologyCategory = 'cute' | 'food' | 'promise' | 'funny' | 'surrender';

export interface Apology {
  id: string;
  householdId: string;
  disagreementId?: string;
  senderRole: UserRole;
  senderName: string;
  receiverRole: UserRole;
  message: string;
  banglaMessage: string;
  category: ApologyCategory;
  accepted: boolean;
  createdAt: string;
}

export type PeaceActivityType = 
  | 'made_cha' 
  | 'brought_food' 
  | 'said_sorry' 
  | 'did_housework' 
  | 'gave_gift' 
  | 'sweet_talk';

export interface PeaceMakingActivity {
  id: string;
  householdId: string;
  disagreementId?: string;
  madeBy: UserRole;
  madeByName: string;
  targetRole: UserRole;
  activityType: PeaceActivityType;
  title: string;
  banglaTitle: string;
  notes?: string;
  points: number;
  createdAt: string;
}

export interface PeaceMakerAward {
  id: string;
  title: string;
  banglaTitle: string;
  description: string;
  banglaDescription: string;
  icon: string;
  winnerRole: UserRole;
  winnerName: string;
  funnyComment: string;
  banglaFunnyComment: string;
}

export interface JhograStats {
  totalThisMonth: number;
  bouReported: number;
  borReported: number;
  resolvedCount: number;
  pendingCount: number;
  disputedCount: number;
  mostCommonReason: string;
  banglaMostCommonReason: string;
  bouApologies: number;
  borApologies: number;
  bouPeacePoints: number;
  borPeacePoints: number;
  peaceMakerLeader: UserRole;
  awards: PeaceMakerAward[];
}
