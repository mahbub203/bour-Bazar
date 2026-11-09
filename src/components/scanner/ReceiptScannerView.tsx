import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ScanLine, 
  Upload, 
  Check, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Trash2, 
  Plus, 
  Receipt,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExtractedItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export const ReceiptScannerView: React.FC = () => {
  const { addExpense, togglePurchased, bazarItems, t, language, activeUser, setActiveTab } = useApp();

  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [extractedStore, setExtractedStore] = useState('Shwapno Superstore, Dhanmondi');
  const [extractedDate, setExtractedDate] = useState('2026-11-05');
  const [extractedTotal, setExtractedTotal] = useState(1840);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [successMessage, setSuccessMessage] = useState(false);

  // Sample Receipt 1: Shwapno Supermarket
  const loadShwapnoSample = () => {
    setReceiptImage('https://images.unsplash.com/photo-1554415707-9e49017a4751?auto=format&fit=crop&w=600&q=80');
    runScanSimulation('Shwapno Superstore, Road 27, Dhanmondi', '2026-11-05', 1840, [
      { id: '1', name: 'Miniket Rice (মিনিকেট চাল)', quantity: 5, unit: 'kg', price: 425 },
      { id: '2', name: 'Teer Soyabean Oil (সয়াবিন তেল)', quantity: 2, unit: 'litre', price: 375 },
      { id: '3', name: 'Farm Eggs (ফার্মের লাল ডিম)', quantity: 1, unit: 'dozon', price: 150 },
      { id: '4', name: 'Deshi Onion (দেশি পেঁয়াজ)', quantity: 2, unit: 'kg', price: 220 },
      { id: '5', name: 'ACI Pure Salt (লবণ)', quantity: 1, unit: 'packet', price: 40 },
      { id: '6', name: 'Surf Excel Powder (১ কেজি)', quantity: 1, unit: 'packet', price: 250 },
      { id: '7', name: 'Dettol Handwash Refill', quantity: 1, unit: 'piece', price: 380 },
    ]);
  };

  // Sample Receipt 2: Karwan Bazar Cash Memo
  const loadKarwanBazarSample = () => {
    setReceiptImage('https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=600&q=80');
    runScanSimulation('Karwan Bazar Raw Memo (কাঁচাবাজার ক্যাশ মেমো)', '2026-11-05', 2350, [
      { id: '1', name: 'Fresh River Rui Fish (রুই মাছ)', quantity: 1.5, unit: 'kg', price: 520 },
      { id: '2', name: 'Solid Beef / Goru Mangsho (গরুর মাংস)', quantity: 1, unit: 'kg', price: 780 },
      { id: '3', name: 'Bhogura Alu (আলু)', quantity: 3, unit: 'kg', price: 195 },
      { id: '4', name: 'Kacha Morich (কাঁচা মরিচ)', quantity: 250, unit: 'gram', price: 60 },
      { id: '5', name: 'Deshi Roshun (রসুন)', quantity: 500, unit: 'gram', price: 120 },
      { id: '6', name: 'Fresh Tomato & Salad', quantity: 2, unit: 'kg', price: 180 },
      { id: '7', name: 'Mustard Oil (সরিষার তেল)', quantity: 1, unit: 'piece', price: 495 },
    ]);
  };

  const runScanSimulation = (store: string, date: string, total: number, items: ExtractedItem[]) => {
    setIsScanning(true);
    setScanComplete(false);
    setSuccessMessage(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setExtractedStore(store);
      setExtractedDate(date);
      setExtractedTotal(total);
      setExtractedItems(items);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptImage(reader.result as string);
        loadShwapnoSample(); // Scan the uploaded image
      };
      reader.readAsDataURL(file);
    }
  };

  // Item adjustments
  const handlePriceChange = (id: string, newPrice: number) => {
    setExtractedItems(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, price: newPrice } : item);
      const newTotal = updated.reduce((s, i) => s + i.price, 0);
      setExtractedTotal(newTotal);
      return updated;
    });
  };

  const handleDeleteItem = (id: string) => {
    setExtractedItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      const newTotal = updated.reduce((s, i) => s + i.price, 0);
      setExtractedTotal(newTotal);
      return updated;
    });
  };

  // 1-Click Save to Hisab & Update Bazar List
  const handleConfirmAndSave = () => {
    // 1. Add as an expense in Monthly Hisab
    addExpense({
      title: `${extractedStore} Receipt`,
      amount: extractedTotal,
      category: 'Grocery',
      paymentMethod: 'Card',
      paidBy: activeUser.role === 'bou' ? 'Bou' : 'Bor',
      date: extractedDate,
      description: `Auto-extracted via AI OCR Scanner: ${extractedItems.map(i => i.name).join(', ')}`,
      receiptUrl: receiptImage || undefined,
    });

    // 2. Cross-reference existing pending bazar items and mark matches as bought
    extractedItems.forEach(item => {
      const match = bazarItems.find(b => 
        !b.isPurchased && (
          b.title.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]) ||
          item.name.toLowerCase().includes(b.title.toLowerCase().split(' ')[0])
        )
      );
      if (match) {
        togglePurchased(match.id, item.price);
      }
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSuccessMessage(true);
    setTimeout(() => {
      setActiveTab('hisab');
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <ScanLine className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.scannerTitle}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {t.scannerSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Uploader & Extracted Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload / Camera Capture / Samples (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
            <h3 className="font-extrabold text-slate-900 text-sm mb-3">
              1. Upload Receipt or Bazar Memo
            </h3>

            {/* Drop Zone */}
            <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50/70 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  {t.dropReceipt}
                </p>
                <p className="text-[11px] text-slate-400">
                  PNG, JPG, HEIC up to 10MB
                </p>
              </div>
            </div>

            {/* Instant Sample Receipts for quick test */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                {t.useSampleReceipt}
              </span>
              <div className="space-y-2">
                <button
                  onClick={loadShwapnoSample}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200 text-xs font-bold text-emerald-900 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{t.sampleShwapno}</span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                </button>

                <button
                  onClick={loadKarwanBazarSample}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 text-xs font-bold text-amber-900 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{t.sampleKarwanBazar}</span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                </button>
              </div>
            </div>

            {/* Receipt Preview if uploaded */}
            {receiptImage && (
              <div className="mt-4">
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  Receipt Preview:
                </span>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-56 bg-slate-900">
                  <img
                    src={receiptImage}
                    alt="Receipt preview"
                    className="w-full h-full object-cover opacity-90"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white">
                      <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-emerald-200 animate-pulse">
                        {t.scanning}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Extracted Review Table & Actions (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">
                    2. AI Extracted Items & Prices
                  </h3>
                </div>
                {scanComplete && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Extracted ✓
                  </span>
                )}
              </div>

              {!scanComplete ? (
                <div className="py-20 text-center text-slate-400">
                  <ScanLine className="w-12 h-12 mx-auto stroke-1 text-slate-300 mb-3" />
                  <p className="text-sm font-bold text-slate-600">No receipt scanned yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload an image or click a sample memo on the left to test the scanner!
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {/* Store & Date row */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/70">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Store / Market Name
                      </label>
                      <input
                        type="text"
                        value={extractedStore}
                        onChange={(e) => setExtractedStore(e.target.value)}
                        className="w-full bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Purchase Date
                      </label>
                      <input
                        type="date"
                        value={extractedDate}
                        onChange={(e) => setExtractedDate(e.target.value)}
                        className="w-full bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {extractedItems.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {item.name}
                          </p>
                          <span className="text-[11px] text-slate-500">
                            Qty: {item.quantity} {item.unit}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="relative w-24">
                            <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-bold">৳</span>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => handlePriceChange(item.id, parseFloat(e.target.value) || 0)}
                              className="w-full pl-6 pr-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 text-right"
                            />
                          </div>

                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Bar */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-800">
                      Total Extracted Amount:
                    </span>
                    <span className="text-xl font-black text-emerald-700">
                      ৳{extractedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            {scanComplete && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                {successMessage ? (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Saved to Monthly Hisab! Redirecting...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleConfirmAndSave}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md transition-all"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>{t.confirmAndSave} (৳{extractedTotal.toLocaleString()})</span>
                  </button>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
