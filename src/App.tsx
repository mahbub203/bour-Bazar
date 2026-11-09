import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { BazarListView } from './components/bazar/BazarListView';
import { MonthlyHisabView } from './components/hisab/MonthlyHisabView';
import { BorPerformanceView } from './components/performance/BorPerformanceView';
import { SavingsScoreView } from './components/savings/SavingsScoreView';
import { PantryView } from './components/pantry/PantryView';
import { MealPlannerView } from './components/meal/MealPlannerView';
import { ReceiptScannerView } from './components/scanner/ReceiptScannerView';
import { ShoppingHistoryView } from './components/history/ShoppingHistoryView';
import { ReportsView } from './components/reports/ReportsView';
import { GroceryAssistantView } from './components/assistant/GroceryAssistantView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { FamilySettingsView } from './components/settings/FamilySettingsView';
import { JhograHisabView } from './components/jhogra/JhograHisabView';
import { AddBazarModal } from './components/bazar/AddBazarModal';
import { AddExpenseModal } from './components/hisab/AddExpenseModal';
import { MarketModeModal } from './components/bazar/MarketModeModal';
import { BouAlertModal } from './components/bazar/BouAlertModal';
import { HouseholdSwitcherModal } from './components/household/HouseholdSwitcherModal';
import { AuthModal } from './components/auth/AuthModal';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  // Mobile drawer & Navigation state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isAddBazarModalOpen, setIsAddBazarModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isMarketModeOpen, setIsMarketModeOpen] = useState(false);
  const [isBouAlertOpen, setIsBouAlertOpen] = useState(false);
  const [isHouseholdSwitcherOpen, setIsHouseholdSwitcherOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQuickAddChoiceOpen, setIsQuickAddChoiceOpen] = useState(false);

  // Route coordinator for all 11 core routes
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenAddBazar={() => setIsAddBazarModalOpen(true)}
            onOpenAddExpense={() => setIsAddExpenseModalOpen(true)}
            onOpenMarketMode={() => setIsMarketModeOpen(true)}
            onOpenBouAlert={() => setIsBouAlertOpen(true)}
          />
        );
      case 'bazar':
        return <BazarListView />;
      case 'hisab':
        return <MonthlyHisabView />;
      case 'performance':
        return <BorPerformanceView />;
      case 'jhogra':
        return <JhograHisabView />;
      case 'savings':
        return <SavingsScoreView />;
      case 'pantry':
        return <PantryView />;
      case 'meals':
        return <MealPlannerView />;
      case 'scanner':
        return <ReceiptScannerView />;
      case 'history':
        return <ShoppingHistoryView />;
      case 'reports':
        return <ReportsView />;
      case 'assistant':
        return <GroceryAssistantView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <FamilySettingsView />;
      default:
        return (
          <DashboardView
            onOpenAddBazar={() => setIsAddBazarModalOpen(true)}
            onOpenAddExpense={() => setIsAddExpenseModalOpen(true)}
            onOpenMarketMode={() => setIsMarketModeOpen(true)}
            onOpenBouAlert={() => setIsBouAlertOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Top Header Navbar */}
      <Navbar
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onOpenMarketMode={() => setIsMarketModeOpen(true)}
        onOpenBouAlert={() => setIsBouAlertOpen(true)}
        onOpenHouseholdSwitcher={() => setIsHouseholdSwitcherOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop & Mobile Sidebar (11 Core Routes) */}
        <Sidebar
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenBouAlert={() => setIsBouAlertOpen(true)}
          onOpenHouseholdSwitcher={() => setIsHouseholdSwitcherOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenQuickAdd={() => setIsQuickAddChoiceOpen(true)}
        onOpenBouAlert={() => setIsBouAlertOpen(true)}
      />

      {/* Quick Add Modal Choice (for mobile floating '+' button) */}
      {isQuickAddChoiceOpen && (
        <div 
          onClick={() => setIsQuickAddChoiceOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
          >
            <h3 className="text-base font-extrabold text-slate-900 mb-3 text-center">
              What would you like to add?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setIsQuickAddChoiceOpen(false);
                  setIsAddBazarModalOpen(true);
                }}
                className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex flex-col items-center gap-2 text-emerald-900 font-bold text-xs text-center transition-colors"
              >
                <span className="text-2xl">🛒</span>
                <span>{t.createBazarList}</span>
              </button>

              <button
                onClick={() => {
                  setIsQuickAddChoiceOpen(false);
                  setIsAddExpenseModalOpen(true);
                }}
                className="p-4 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 flex flex-col items-center gap-2 text-red-900 font-bold text-xs text-center transition-colors"
              >
                <span className="text-2xl">💸</span>
                <span>{t.addExpense}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bazar Item Modal */}
      <AddBazarModal
        isOpen={isAddBazarModalOpen}
        onClose={() => setIsAddBazarModalOpen(false)}
      />

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
      />

      {/* Live Market Mode Modal */}
      <MarketModeModal
        isOpen={isMarketModeOpen}
        onClose={() => setIsMarketModeOpen(false)}
        onRequestRecordPrice={() => {}}
      />

      {/* Signature 1: Bou Alert Modal */}
      <BouAlertModal
        isOpen={isBouAlertOpen}
        onClose={() => setIsBouAlertOpen(false)}
      />

      {/* Household Switcher & Invite Modal */}
      <HouseholdSwitcherModal
        isOpen={isHouseholdSwitcherOpen}
        onClose={() => setIsHouseholdSwitcherOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
