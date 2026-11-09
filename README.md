# Bou r Bazar (বউর বাজার) 🛒
> **"Bou List Dibe, Bor Bazar Korbe, Hisab Thakbe Ekshathe!"**  
> *"Bazar er tension kom, Hisab thakuk ekdom clear!"*  
> *"Bou r Bazar: Shongshar choluk smartly, Hisab thakuk ekshathe!"*

A production-quality household shopping, expense management, and couple savings web application designed for Bangladeshi families.

---

## 🌟 Architecture & Implemented Feature Highlights

### 1. Product Identity & Design (Part 1)
- **Palette**: Fresh Green (`#198754` / `#10b981`), Warm Cream (`#FFF9ED`), Warm Orange (`#F4A340`), Soft Off-White Background (`#fcfbf9`), Dark Charcoal typography.
- **Typography**: Dual Google Fonts: *Plus Jakarta Sans* paired with *Hind Siliguri* for clean English & Bengali rendering.
- **Currency**: Bangladeshi Taka (`৳`) standard throughout all calculations.
- **Bilingual**: Instant toggle between **বাংলা** and **English** with localized humor.

### 2. User Authentication & Multi-Household Management (Part 2)
- **Authentication**: Registration, Login, Logout, Forgot Password, and Google Login option.
- **Multi-Household Switching**: Users can belong to multiple households (e.g. *Tanvir & Nusrat Nest* in Dhaka vs *Chowdhury Bari* in village) and switch between them seamlessly.
- **Join by Invite Code**: Instant join via unique 6-character code (e.g. `BOU-BOR-2026`).
- **Configurable Roles**: `Bou` (Chief Bazar Officer), `Bor` (Bazar Commander), and `Family Member`.
- **Top Bar Role Switcher**: 1-click quick-switch between Bou and Bor to experience both perspectives.
- **Real-Time Cross-Tab Sync**: Powered by `BroadcastChannel` — changes made in one browser tab update across all open tabs immediately without page reloads.

### 3. Main Dashboard (Part 3)
- **Financial Overview**: Monthly Household Budget, Total Spending, Remaining Budget, Today's Bazar Spending, Savings Score.
- **Shopping Overview**: Active checklist with pending count, completed count, estimated total, actual total.
- **Live Activity Feed**: Real-time log of who performed which action and when.
- **Quick Action Grid**: 1-click buttons for Add Item, Record Expense, Scan Receipt, View Hisab, and Bazar Performance.

### 4. Smart Bazar Management (Part 4)
- **Full Item Tracking**: Product name, Bengali name, quantity, units (`kg`, `gram`, `litre`, `dozon`, `hali`, `piece`, `packet`, `bundle`), estimated price, actual purchase price, priority (`Normal 🟢`, `Important 🟡`, `Urgent 🔴`), shopper assignment, and notes.
- **4 Item Statuses**:
  1. `pending`: Waiting to be bought.
  2. `purchased`: Bought with exact price recorded.
  3. `unavailable`: Out of stock in the market (shopper is not blamed).
  4. `forgotten`: Shopper missed the item (tracked in performance report).
- **Favorites**: Star items to save them as recurring staples.
- **Market Mode (বাজারে লাইভ মোড)**: High-contrast, full-screen shopping mode for busy bazaars.
- **WhatsApp Share**: One-click formatted checklist generator with checkboxes & emojis.
- **List Duplication**: Re-create past Friday trips in 1 click.

### 5. Signature Feature 1: Bou Alert 🚨 (Part 5)
- **Intelligent Reminder System**: Bou can trigger humorous, timed reminders to Bor at any moment.
- **Urgent Items Callout**: Highlights critically pending groceries (e.g., eggs, fresh fish).
- **Humorous Bengali Reminders**:
  - *"Bou er list ekhono pending! 😂"*
  - *"Bazar e jawar shomoy hoye geche!"*
  - *"Dim ante bhule jaben na!"*
  - *"Bou is waiting for the bazar update!"*
  - *"Bazar complete korle shanti paben! ❤️"*
- **Snooze Option**: Allows the shopper to snooze reminders for 30 minutes.
- **Desktop/Mobile Push Notifications**: Browser notification integration via `Notification.requestPermission()`.

### 6. Signature Feature 2: Bor's Bazar Performance 🛒 (Part 6)
- **Shopping Completion Ring**: Visual completion percentage circular progress gauge.
- **Item Accuracy Breakdown**: Total assigned, total purchased, unavailable products, and forgotten items.
- **Financial Comparison**: Estimated cost vs actual spend with exact Taka saved.
- **Speed & Average Cost**: Shopping completion speed in minutes (benchmark 45m).
- **Weekly Accuracy Chart**: Recharts bar chart tracking weekly shopping accuracy.
- **Forgotten & Unavailable Report**: Dedicated log of items not found or forgotten.
- **Encouraging Feedback**: Friendly, non-punitive messaging (e.g. *"Excellent bazar! You saved ৳150 this time. 🎉"*).

### 7. Signature Feature 3: Shongshar Savings Score 🌟 (Part 7)
- **Score Out of 100**: Live calculated household savings score based on budget discipline, target goals, zero pantry waste, and smart bargaining.
- **Strict Financial Distinction**: Clearly separates **Actual Savings Realized** (e.g. ৳3,450 from discounts & bargaining) from **Unspent Budget** (৳13,550 remaining allowance).
- **Monthly Savings Challenge**: Gamified target (e.g. *Save ৳5,000 this November!*).
- **Streak Days**: Tracks consecutive days staying under daily budget cap.
- **Couple Achievement Badges**:
  - 🏆 *Kipta Bor Award* (Hard bargaining at Karwan Bazar)
  - 👑 *Smart Bou Queen* (Zero food waste in 30 days)
  - 🥷 *Bazar Ninja* (Complete shopping under 45 mins)
  - 🥗 *Green & Healthy* (7 days of seasonal greens)
  - 💛 *Golden Pair* (Save ৳10,000 together with zero arguments!)
- **Confetti Celebration**: One-click celebration button for achieving milestones.

### 8. Monthly Hisab & Reports (Part 8 & 15)
- **13 Expense Categories**: Grocery, Vegetables, Fish and Meat, Electricity, Gas, Water, Rent, Internet, Transportation, Medical, Education, Household maintenance, Other.
- **Payment Methods**: Cash, bKash, Nagad, Bank, Card, Other.
- **Visual Analytics**: Interactive Recharts Donut Chart (category breakdown), Weekly Spending Chart, and 4-Month Historical Comparison.
- **Export Capabilities**: 1-click **Download CSV Report** and **Print Summary / PDF Export**.

### 9. Smart Receipt Scanner (Part 9)
- Upload image or camera capture of receipts.
- **Instant Test Memos**: Includes 1-click demo receipts for **Shwapno Superstore (৳1,840)** and **Karwan Bazar Fresh Memo (৳2,350)**.
- **AI OCR Simulation**: Extracts store name, date, items, quantities, and prices.
- **Review Table**: Allows manual correction before saving; never automatically commits unverified receipts.
- **1-Click Save**: Automatically logs into Monthly Hisab and marks matching bazar items as purchased.

### 10. Pantry Management (Part 10)
- Digital kitchen inventory tracking rice, oil, eggs, onions, garlic, potatoes, milk, and spices.
- Visual stock level progress bars with color-coded status (`In Stock 🟢`, `Low Stock 🟡`, `Out of Stock 🔴`).
- Steppers (`+` / `-`) for kitchen cooking deductions.
- 1-Click "+ Add to Bazar List" for depleted stock.

### 11. Smart Grocery Assistant (Part 11)
- "Bazar Chacha AI" chatbot with conversational Bangladeshi persona.
- **Natural-Language Expense Queries**: Responds to queries like *"Ei mash e grocery te koto khoroch hoise?"*, electricity bills, pantry runouts, and seasonal vegetable prices.
- 1-Click action to add assistant recommendations straight to the shopping list.

### 12. 7-Day Meal Planner (Part 12)
- Weekly meal planning calendar (Friday to Thursday) covering Breakfast, Lunch, and Dinner.
- Authentic Bangladeshi meals: Kacchi Biryani, Shorshe Ilish, Beef Bhuna, Choto Macher Chorchori, Alu Bhorta, etc.
- **Generate Bazar List from Menu**: Cross-references pantry inventory to add missing ingredients without duplicates.

### 13. Shopping History (Part 13)
- Searchable archive of completed market trips with itemized costs.
- **30-Day Staple Price Comparison**: Tracks market price trends for eggs, onions, rui fish, and rice.

### 14. Notifications Center (Part 14)
- Interactive notification center with read/unread states, link triggers, and snoozes.

### 15. Complete 16-Table PostgreSQL Schema with RLS (Part 16)
Included in `src/services/supabaseClient.ts`:
1. `profiles`
2. `households`
3. `household_members`
4. `household_invitations`
5. `shopping_lists`
6. `shopping_items`
7. `expenses`
8. `expense_categories`
9. `receipts`
10. `pantry_items`
11. `meal_plans`
12. `recipes`
13. `savings_goals`
14. `notifications`
15. `shopping_performance`
16. `household_activity`

All tables feature UUID primary keys, foreign key constraints, timestamps, indexes, and PostgreSQL Row Level Security (RLS) policies enforcing household isolation.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended, v24 tested)
- npm (v9+)

### Installation & Run
```bash
# Navigate to project directory
cd "C:\Users\glafi\.gemini\antigravity\scratch\bour-bazar"

# Start the Vite development server
npm run dev
```

Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### Build for Production
```bash
npm run build
```
Generates optimized static assets in the `dist/` directory.

---

## 🧪 Testing the Dual-Partner Shared Experience
1. Open **[http://localhost:5173/](http://localhost:5173/)** in Tab A as **👰 Bou**.
2. Open **[http://localhost:5173/](http://localhost:5173/)** in Tab B (or an Incognito window) and switch the top pill to **🤵 Bor**.
3. In Tab A, add an item (e.g. *1 kg Rui Fish*) or trigger a **Bou Alert**.
4. Notice how Tab B updates immediately in real-time via `BroadcastChannel` without requiring any page reload!
