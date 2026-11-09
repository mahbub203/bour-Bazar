import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Check, 
  Plus, 
  Lightbulb, 
  ShoppingBag, 
  Clock, 
  Wallet 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  banglaText?: string;
  timestamp: string;
  suggestedItems?: {
    title: string;
    quantity: number;
    unit: any;
    est: number;
    cat: any;
  }[];
}

export const GroceryAssistantView: React.FC = () => {
  const { 
    addMultipleBazarItems, 
    pantryItems, 
    expenses, 
    activeHousehold, 
    t, 
    language 
  } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-01',
      sender: 'assistant',
      text: "Salam Bhabi & Bhai! I'm Bazar Chacha, your household grocery & expense advisor. You can ask me natural queries like 'Ei mash e grocery te koto khoroch hoise?' or get weekend feast recipes!",
      banglaText: "আসসালামু আলাইকুম ভাবি ও ভাই! আমি আপনাদের 'বাজার চাচা এআই'। আমাকে সরাসরি প্রশ্ন করতে পারেন: 'এই মাসে গ্রোসারিতে কত খরচ হয়েছে?' কিংবা শুক্রবারের স্পেশাল মেনুর ফর্দ চাইতে পারেন!",
      timestamp: '10:00 AM'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemsMap, setAddedItemsMap] = useState<{ [key: string]: boolean }>({});

  // Real-time calculation helpers for queries
  const groceryTotal = expenses
    .filter(e => ['Grocery', 'Vegetables', 'Fish and Meat', 'Rice and Essentials'].includes(e.category))
    .reduce((s, e) => s + e.amount, 0);

  const electricityTotal = expenses
    .filter(e => e.category === 'Electricity')
    .reduce((s, e) => s + e.amount, 0);

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remainingBudget = activeHousehold.monthlyBudget - totalSpent;

  // Prompts including exact query from Part 11
  const prompts = [
    { label: "Ei mash e grocery te koto khoroch hoise?", query: "Ei mash e grocery te koto khoroch hoise?" },
    { label: "What should we cook for Friday family lunch?", query: "Friday lunch recommendations and bazar list" },
    { label: "Which pantry items are running low right now?", query: "Which pantry items are running out soon?" },
    { label: "How can we cut ৳3,000 from this month's budget?", query: "How to save ৳3,000 this month in groceries?" },
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply: Message;
      const q = query.toLowerCase();

      // PART 11 Natural-Language Expense Queries
      if (q.includes('grocery') && (q.includes('khoroch') || q.includes('spend') || q.includes('খরচ') || q.includes('koto'))) {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `This month, your grocery spending is ৳${groceryTotal.toLocaleString()}. Your total monthly budget is ৳${activeHousehold.monthlyBudget.toLocaleString()}, with ৳${remainingBudget.toLocaleString()} remaining.`,
          banglaText: `এই মাসে আপনার গ্রোসারি ও কাঁচাবাজারে মোট খরচ হয়েছে ৳${groceryTotal.toLocaleString()}। সংসারের মোট বাজেট ৳${activeHousehold.monthlyBudget.toLocaleString()} এবং এখনো অবশিষ্ট আছে ৳${remainingBudget.toLocaleString()}।`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else if (q.includes('electricity') || q.includes('current') || q.includes('বিদ্যুৎ')) {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `Your electricity bill expense this month is ৳${electricityTotal.toLocaleString()} (paid via bKash DESCO postpaid).`,
          banglaText: `এই মাসে আপনার ডেসকো বিদ্যুৎ বিল বাবদ পরিশোধ হয়েছে ৳${electricityTotal.toLocaleString()} (বিকাশে পরিশোধিত)।`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else if (q.includes('friday') || q.includes('menu') || q.includes('lunch') || q.includes('শুক্রবার')) {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: "For this Friday, I suggest a classic Dhaka feast: Bhuna Khichuri with Beef Bhuna, Eggplant Fry (Begun Bhaja), and Dim Bhaji! Based on your pantry, you already have Rice and Salt, but you need fresh Beef, Mustard Oil, and Eggplants.",
          banglaText: "এই শুক্রবারের জন্য সেরা প্ল্যান: ভুনা খিচুড়ি, গরুর মাংস ভুনা ও মচমচে বেগুন ভাজা! আপনার রান্নাঘরে চাল ও লবণ আছে, শুধু টাটকা মাংস ও বেগুন কিনলেই চলবে। আমি ফর্দ বানিয়ে দিয়েছি!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedItems: [
            { title: 'Beef / Goru Mangsho (গরুর মাংস)', quantity: 1, unit: 'kg', est: 780, cat: 'Fish and Meat' },
            { title: 'Gol Begun (গোল বেগুন)', quantity: 1, unit: 'kg', est: 80, cat: 'Vegetables' },
            { title: 'Radhuni Mustard Oil (সরিষার তেল)', quantity: 500, unit: 'gram', est: 160, cat: 'Rice and Essentials' },
            { title: 'Salad Cucumber & Lemon', quantity: 1, unit: 'packet', est: 60, cat: 'Vegetables' },
          ]
        };
      } else if (q.includes('pantry') || q.includes('low') || q.includes('স্টক') || q.includes('sesh')) {
        const low = pantryItems.filter(p => p.currentQuantity <= p.minStockLevel);
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `Critical Alert: You have ${low.length} items running low: ${low.map(i => i.name).join(', ')}. Especially Eggs and Soyabean Oil will run out in 2 days!`,
          banglaText: `জরুরি স্টক সতর্কতা: আপনার রান্নাঘরের ${low.length}টি জিনিস প্রায় শেষ! বিশেষ করে ডিম ও সয়াবিন তেল আগামী ২ দিনের মধ্যে শেষ হয়ে যাবে। নিচে ১ ক্লিকে বাজারের ফর্দে যোগ করুন:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedItems: low.map(l => ({
            title: l.name,
            quantity: Math.max(1, l.minStockLevel),
            unit: l.unit,
            est: l.estimatedPrice * Math.max(1, l.minStockLevel),
            cat: 'Rice and Essentials'
          }))
        };
      } else if (q.includes('save') || q.includes('budget') || q.includes('খরচ') || q.includes('সঞ্চয়')) {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: "Here is Chacha's 3-Step Strategy to save ৳3,500 this month:\n1. Buy whole Rui or Katla fish at Karwan Bazar on Saturday mornings (saves ~৳120/kg compared to superstores).\n2. Purchase 5kg onions and potatoes in bulk once a month.\n3. Avoid ordering food via takeaway on Tuesday nights — try Egg Fried Rice instead!",
          banglaText: "বাজার খরচে ৩,৫০০ টাকা সাশ্রয় করার ৩টি মাস্টার টিপস:\n১. শনিবার সকালে কারওয়ান বাজার থেকে আস্ত মাছ কিনুন (কেজিতে ১২০ টাকা সাশ্রয়)।\n২. পেঁয়াজ ও আলু মাসের শুরুতে একসাথে ৫ কেজি বস্তা কিনলে ২৫% কম পড়ে।\n৩. সপ্তাহে একদিন বাইরের ফুড ডেলিভারি বন্ধ করে ঘরের ডিম খিচুড়ি খান!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `Market Insight: Your household has completed ${expenses.length} expense transactions this month totaling ৳${totalSpent.toLocaleString()}. Seasonal vegetables like cauliflower and winter spinach (palong shak) are now very fresh and cost-effective in Dhaka markets.`,
          banglaText: `বাজার তথ্য: আপনার সংসারে এই মাসে মোট ${expenses.length}টি খরচের হিসাবে ৳${totalSpent.toLocaleString()} ব্যয় হয়েছে। শীতকালীন ফুলকপি ও পালং শাকের সরবরাহ ভালো এবং দাম সাশ্রয়ী।`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedItems: [
            { title: 'Fresh Cauliflower (ফুলকপি)', quantity: 2, unit: 'piece', est: 80, cat: 'Vegetables' },
            { title: 'Winter Palong Shak (পালং শাক)', quantity: 2, unit: 'bundle', est: 50, cat: 'Vegetables' }
          ]
        };
      }

      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const handleAddSuggestedItems = (msgId: string, items: NonNullable<Message['suggestedItems']>) => {
    addMultipleBazarItems(items.map(i => ({
      title: i.title,
      quantity: i.quantity,
      unit: i.unit,
      estimatedPrice: i.est,
      category: i.cat,
      priority: 'important' as const,
      assignedTo: 'bor' as const,
      notes: 'Added via Bazar Chacha AI recommendation'
    })));

    setAddedItemsMap(prev => ({ ...prev, [msgId]: true }));

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-600/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {t.assistantName}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Dhaka AI Engine
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {t.assistantSubtitle}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Natural Language Enabled</span>
          </div>
        </div>
      </div>

      {/* Suggested Prompts Bar */}
      <div className="flex flex-wrap gap-2">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.query)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 text-slate-700 border border-slate-200 shadow-soft transition-all text-left flex items-center gap-1.5"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>"{p.label}"</span>
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-5 min-h-[420px] flex flex-col justify-between">
        
        {/* Messages Feed */}
        <div className="space-y-4 overflow-y-auto max-h-[480px] pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm text-sm">
                  👴🏽
                </div>
              )}

              <div className={`max-w-xl rounded-2xl p-4 text-xs ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-xs'
                  : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-none shadow-xs'
              }`}>
                <p className="font-semibold leading-relaxed whitespace-pre-line text-sm">
                  {language === 'bn' && m.banglaText ? m.banglaText : m.text}
                </p>

                {/* Suggested Items Card with 1-Click Action */}
                {m.suggestedItems && m.suggestedItems.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <span className="text-[11px] font-extrabold text-emerald-900 block mb-2 uppercase tracking-wider">
                      Recommended Bazar List (স্বয়ংক্রিয় ফর্দ):
                    </span>
                    <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-200">
                      {m.suggestedItems.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">{item.title}</span>
                          <span className="text-slate-500 font-semibold">{item.quantity} {item.unit} • ৳{item.est}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2.5">
                      {addedItemsMap[m.id] ? (
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Added to Bazar List! ✓</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddSuggestedItems(m.id, m.suggestedItems!)}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>+ Add All {m.suggestedItems.length} Items to Bazar List</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <span className={`text-[10px] mt-2 block text-right ${
                  m.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                }`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Chacha is querying household records...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.askAssistantPlaceholder}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
};
