import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment or localStorage
export const getSupabaseConfig = () => {
  const localUrl = localStorage.getItem('bour_bazar_supabase_url');
  const localKey = localStorage.getItem('bour_bazar_supabase_anon_key');

  const supabaseUrl = localUrl || import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = localKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return { supabaseUrl, supabaseAnonKey };
};

export const saveSupabaseConfig = (url: string, key: string) => {
  if (url) localStorage.setItem('bour_bazar_supabase_url', url);
  else localStorage.removeItem('bour_bazar_supabase_url');

  if (key) localStorage.setItem('bour_bazar_supabase_anon_key', key);
  else localStorage.removeItem('bour_bazar_supabase_anon_key');
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
    if (!clientInstance) {
      try {
        clientInstance = createClient(supabaseUrl, supabaseAnonKey);
      } catch (err) {
        console.warn('Failed to initialize Supabase client:', err);
        return null;
      }
    }
    return clientInstance;
  }
  return null;
};

// ==============================================================================
// COMPLETE 16-TABLE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS) FOR SUPABASE
// ==============================================================================
export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- BOU R BAZAR (বউর বাজার) - MASTER DATABASE SCHEMA
-- Complies with Part 16: 16 Relational Tables with RLS & Referential Integrity
-- ==============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    bangla_name TEXT,
    role TEXT CHECK (role IN ('bou', 'bor', 'member')) NOT NULL DEFAULT 'bou',
    avatar_url TEXT,
    phone TEXT,
    notification_preferences JSONB DEFAULT '{"urgentAlerts": true, "dailyReminders": true, "soundEnabled": true, "browserPushEnabled": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOUSEHOLDS TABLE
CREATE TABLE IF NOT EXISTS public.households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    bangla_name TEXT,
    invite_code TEXT UNIQUE NOT NULL,
    monthly_budget NUMERIC(12, 2) NOT NULL DEFAULT 35000.00,
    currency TEXT NOT NULL DEFAULT 'BDT',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HOUSEHOLD MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.household_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('bou', 'bor', 'member')) NOT NULL DEFAULT 'member',
    custom_title TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(household_id, user_id)
);

-- 4. HOUSEHOLD INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS public.household_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    invite_code TEXT NOT NULL,
    invited_email TEXT,
    role TEXT CHECK (role IN ('bou', 'bor', 'member')) DEFAULT 'member',
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    is_claimed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SHOPPING LISTS TABLE
CREATE TABLE IF NOT EXISTS public.shopping_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'completed', 'archived')) DEFAULT 'active',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SHOPPING ITEMS TABLE (With all 4 item statuses & 9 categories)
CREATE TABLE IF NOT EXISTS public.shopping_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopping_list_id UUID REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    bangla_title TEXT,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
    unit TEXT NOT NULL DEFAULT 'kg',
    category TEXT CHECK (category IN (
        'Rice and Essentials', 'Vegetables', 'Fish and Meat', 'Dairy',
        'Fruits', 'Spices', 'Household Products', 'Personal Care', 'Other'
    )) NOT NULL DEFAULT 'Vegetables',
    estimated_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    actual_price NUMERIC(10, 2),
    priority TEXT CHECK (priority IN ('normal', 'important', 'urgent')) DEFAULT 'normal',
    status TEXT CHECK (status IN ('pending', 'purchased', 'unavailable', 'forgotten')) DEFAULT 'pending',
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    added_by_role TEXT NOT NULL DEFAULT 'bou',
    added_by_name TEXT NOT NULL,
    assigned_to_role TEXT NOT NULL DEFAULT 'bor',
    purchased_by TEXT,
    purchased_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EXPENSES TABLE (Monthly Hisab)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    category TEXT CHECK (category IN (
        'Grocery', 'Vegetables', 'Fish and Meat', 'Electricity', 'Gas', 'Water',
        'Rent', 'Internet', 'Transportation', 'Medical', 'Education', 'Household maintenance', 'Other'
    )) NOT NULL DEFAULT 'Grocery',
    payment_method TEXT CHECK (payment_method IN ('Cash', 'bKash', 'Nagad', 'Bank', 'Card', 'Other')) DEFAULT 'Cash',
    paid_by TEXT NOT NULL DEFAULT 'Bor',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    receipt_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. EXPENSE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    bangla_name TEXT NOT NULL,
    icon TEXT,
    color TEXT
);

-- 9. RECEIPTS TABLE
CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    store_name TEXT,
    total_amount NUMERIC(12, 2),
    purchase_date DATE DEFAULT CURRENT_DATE,
    image_url TEXT,
    raw_ocr_json JSONB,
    verified BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PANTRY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.pantry_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    bangla_name TEXT,
    category TEXT NOT NULL DEFAULT 'Grains',
    current_quantity NUMERIC(10, 2) NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT 'kg',
    min_stock_level NUMERIC(10, 2) NOT NULL DEFAULT 1,
    last_purchased_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    estimated_price NUMERIC(10, 2) DEFAULT 0,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. MEAL PLANS TABLE
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    day_of_week TEXT CHECK (day_of_week IN ('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday')),
    bangla_day TEXT,
    breakfast TEXT,
    lunch TEXT,
    dinner TEXT,
    ingredients JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. RECIPES TABLE
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    bangla_title TEXT,
    prep_time_mins INT,
    ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SAVINGS GOALS TABLE (Shongshar Savings Score)
CREATE TABLE IF NOT EXISTS public.savings_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    month_name TEXT NOT NULL,
    target_amount NUMERIC(12, 2) NOT NULL,
    actual_saved NUMERIC(12, 2) DEFAULT 0,
    streak_days INT DEFAULT 0,
    score INT DEFAULT 85 CHECK (score BETWEEN 0 AND 100),
    badges_earned JSONB DEFAULT '[]'::jsonb,
    status TEXT CHECK (status IN ('in_progress', 'achieved', 'missed')) DEFAULT 'in_progress',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. NOTIFICATIONS TABLE (Bou Alert & System Notifications)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    recipient_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    bangla_title TEXT,
    message TEXT NOT NULL,
    bangla_message TEXT,
    type TEXT CHECK (type IN ('bazar', 'expense', 'pantry', 'savings', 'alert', 'bou_alert')) DEFAULT 'alert',
    is_read BOOLEAN DEFAULT FALSE,
    snoozed_until TIMESTAMPTZ,
    link_section TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. SHOPPING PERFORMANCE TABLE (Bor's Performance Metrics)
CREATE TABLE IF NOT EXISTS public.shopping_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    shopper_name TEXT NOT NULL,
    trip_date DATE DEFAULT CURRENT_DATE,
    total_assigned INT NOT NULL DEFAULT 0,
    total_purchased INT NOT NULL DEFAULT 0,
    total_unavailable INT NOT NULL DEFAULT 0,
    total_forgotten INT NOT NULL DEFAULT 0,
    completion_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
    estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    actual_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    money_saved NUMERIC(10, 2) DEFAULT 0,
    completion_time_mins INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. HOUSEHOLD ACTIVITY TABLE
CREATE TABLE IF NOT EXISTS public.household_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    bangla_action TEXT NOT NULL,
    icon_type TEXT DEFAULT 'cart',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR FAST PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_shopping_items_household ON public.shopping_items(household_id);
CREATE INDEX IF NOT EXISTS idx_expenses_household ON public.expenses(household_id);
CREATE INDEX IF NOT EXISTS idx_pantry_household ON public.pantry_items(household_id);
CREATE INDEX IF NOT EXISTS idx_notifications_household ON public.notifications(household_id);
CREATE INDEX IF NOT EXISTS idx_performance_household ON public.shopping_performance(household_id);
CREATE INDEX IF NOT EXISTS idx_household_members_user ON public.household_members(user_id);

-- 17. DISAGREEMENTS TABLE (ঝগড়া হিসাব - Playful Ledger)
CREATE TABLE IF NOT EXISTS public.disagreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    reported_by TEXT CHECK (reported_by IN ('bou', 'bor', 'member')) NOT NULL,
    reported_by_name TEXT NOT NULL,
    target_partner TEXT CHECK (target_partner IN ('bou', 'bor', 'member')) NOT NULL,
    target_partner_name TEXT NOT NULL,
    incident_date DATE NOT NULL DEFAULT CURRENT_DATE,
    incident_time TIME NOT NULL DEFAULT CURRENT_TIME,
    reason TEXT NOT NULL,
    custom_reason TEXT,
    description TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('small', 'medium', 'big')) NOT NULL DEFAULT 'small',
    status TEXT CHECK (status IN ('unresolved', 'resolved', 'disputed')) NOT NULL DEFAULT 'unresolved',
    resolved_at TIMESTAMPTZ,
    resolved_by TEXT,
    resolution_method TEXT,
    dispute_reason TEXT,
    disputed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. DISAGREEMENT RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.disagreement_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disagreement_id UUID NOT NULL REFERENCES public.disagreements(id) ON DELETE CASCADE,
    responder_role TEXT NOT NULL,
    responder_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    reaction TEXT, -- 'peace_offering', 'apology', 'dispute'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. APOLOGIES TABLE (সরি কাউন্টার)
CREATE TABLE IF NOT EXISTS public.apologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    disagreement_id UUID REFERENCES public.disagreements(id) ON DELETE SET NULL,
    sender_role TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    receiver_role TEXT NOT NULL,
    message TEXT NOT NULL,
    bangla_message TEXT,
    category TEXT CHECK (category IN ('cute', 'food', 'promise', 'funny', 'surrender')) DEFAULT 'cute',
    accepted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. PEACE MAKING ACTIVITIES TABLE (মান ভাঙানোর কাউন্টার)
CREATE TABLE IF NOT EXISTS public.peace_making_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    disagreement_id UUID REFERENCES public.disagreements(id) ON DELETE SET NULL,
    made_by TEXT NOT NULL,
    made_by_name TEXT NOT NULL,
    target_role TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    title TEXT NOT NULL,
    bangla_title TEXT,
    notes TEXT,
    points INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disagreements_household ON public.disagreements(household_id);
CREATE INDEX IF NOT EXISTS idx_apologies_household ON public.apologies(household_id);
CREATE INDEX IF NOT EXISTS idx_peace_activities_household ON public.peace_making_activities(household_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures strictly isolated data access per household
-- ==============================================================================
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disagreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disagreement_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peace_making_activities ENABLE ROW LEVEL SECURITY;

-- Helper Function to check if user belongs to household
CREATE OR REPLACE FUNCTION public.user_belongs_to_household(h_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.household_members
        WHERE household_id = h_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policy: Shopping Items
CREATE POLICY "Users can access shopping items of their household"
    ON public.shopping_items FOR ALL
    USING (public.user_belongs_to_household(household_id));

-- RLS Policy: Expenses
CREATE POLICY "Users can access expenses of their household"
    ON public.expenses FOR ALL
    USING (public.user_belongs_to_household(household_id));

-- RLS Policy: Pantry
CREATE POLICY "Users can access pantry of their household"
    ON public.pantry_items FOR ALL
    USING (public.user_belongs_to_household(household_id));

-- RLS Policy: Notifications
CREATE POLICY "Users can access notifications of their household"
    ON public.notifications FOR ALL
    USING (public.user_belongs_to_household(household_id));

-- RLS Policy: Disagreements (ঝগড়া হিসাব)
CREATE POLICY "Users can access disagreements of their household"
    ON public.disagreements FOR ALL
    USING (public.user_belongs_to_household(household_id));

-- RLS Policy: Apologies
CREATE POLICY "Users can access apologies of their household"
    ON public.apologies FOR ALL
    USING (public.user_belongs_to_household(household_id));

-- RLS Policy: Peace Making Activities
CREATE POLICY "Users can access peace making activities of their household"
    ON public.peace_making_activities FOR ALL
    USING (public.user_belongs_to_household(household_id));
`;
