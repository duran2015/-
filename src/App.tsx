import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { TabNavigation, MainTabType } from './components/TabNavigation';
import { NextSessionCard } from './components/Workbench/NextSessionCard';
import { TodaySchedule } from './components/Workbench/TodaySchedule';
import { WorkbenchTasks } from './components/Workbench/WorkbenchTasks';
import { OrdersTab } from './components/Orders/OrdersTab';
import { GrowthTab } from './components/Growth/GrowthTab';
import { ProfileTab } from './components/Profile/ProfileTab';
import { ActiveSessionModal } from './components/ConsultationRoom/ActiveSessionModal';
import { AISummaryModal } from './components/AISummaryModal';
import { AIQuoteModal } from './components/AIQuoteModal';
import { ChatDrawer } from './components/IM/ChatDrawer';

import { 
  INITIAL_CONSULTANT, INITIAL_ORDERS, INITIAL_SERVICE_PRODUCTS, 
  INITIAL_SETTLEMENTS, INITIAL_VIRAL_VOUCHERS 
} from './data/mockData';
import { Order, ServiceProduct, ViralVoucher, SessionSummary, ConsultantProfile } from './types';
import { X } from 'lucide-react';

export default function App() {
  const [consultant, setConsultant] = useState(INITIAL_CONSULTANT);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState<ServiceProduct[]>(INITIAL_SERVICE_PRODUCTS);
  const [settlements] = useState(INITIAL_SETTLEMENTS);
  const [vouchers, setVouchers] = useState<ViralVoucher[]>(INITIAL_VIRAL_VOUCHERS);

  const [activeTab, setActiveTab] = useState<MainTabType>('workbench');
  const [isSubPage, setIsSubPage] = useState<boolean>(false);

  // Reset isSubPage when tab changes
  React.useEffect(() => {
    setIsSubPage(false);
  }, [activeTab]);

  // Modals & Drawers
  const [activeLiveOrder, setActiveLiveOrder] = useState<Order | null>(null);
  const [selectedOrderForSummary, setSelectedOrderForSummary] = useState<Order | null>(null);
  const [selectedOrderForFile, setSelectedOrderForFile] = useState<Order | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [activeChatOrder, setActiveChatOrder] = useState<Order | null>(null);

  // Dev Toggle
  const [isMockEmpty, setIsMockEmpty] = useState<boolean>(false);

  const displayedOrders = isMockEmpty ? [] : orders;

  // Helper counts
  const pendingSummaryCount = displayedOrders.filter((o) => o.status === 'completed' && !o.hasSummary).length;
  const pendingOrderCount = displayedOrders.filter((o) => o.status === 'pending_confirm').length;

  // Next upcoming session
  const nextScheduledOrder = displayedOrders.find((o) => o.status === 'scheduled');

  // Action Handlers
  const handleToggleListening = () => {
    setConsultant((prev) => ({ ...prev, isListeningActive: !prev.isListeningActive }));
  };

  const handleConfirmOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'scheduled' } : o))
    );
    alert('已成功确认接单，已为您安排入班提醒！');
  };

  const handleWriteSummary = (order: Order) => {
    setSelectedOrderForSummary(order);
  };

  const handleSendReminder = (order: Order) => {
    alert(`已为【${order.clientName}】发送微信及短信【极简咨询室入室提醒】！`);
  };

  const handleSaveSummary = (summary: SessionSummary) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === summary.orderId ? { ...o, hasSummary: true } : o))
    );
  };

  const handleUpdateConsultant = (updated: ConsultantProfile) => {
    setConsultant(updated);
  };

  const handleToggleProductPublish = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isPublished: !p.isPublished } : p))
    );
  };

  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
    );
  };

  const handleAddVoucher = (voucher: ViralVoucher) => {
    setVouchers((prev) => [voucher, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#EAE5DB] text-[#1D1B16] font-sans flex flex-col items-center justify-start p-0 sm:p-2 md:p-4">
      
      {/* Main Container Wrapper */}
      <div className="w-full max-w-md bg-[#FAF8F5] min-h-screen sm:min-h-[840px] sm:rounded-[28px] sm:border sm:border-[#ECE6DC] shadow-xl overflow-hidden flex flex-col relative">
        
        {/* Top App Navbar - Only shown on Workbench (首页) tab per user design */}
        {activeTab === 'workbench' && (
          <Navbar
            consultant={consultant}
            onToggleListening={handleToggleListening}
            onOpenLiveSession={() => {
              const target = nextScheduledOrder || orders[0];
              setActiveLiveOrder(target);
            }}
            onOpenAiQuoteModal={() => setIsQuoteModalOpen(true)}
          />
        )}

        {/* Main View Area */}
        <main className="flex-1 px-4 py-3 pb-24 overflow-y-auto space-y-4 scrollbar-none">
          
          {/* TAB 1: WORKBENCH (工作台) */}
          {activeTab === 'workbench' && (
            <div className="space-y-5">
              
              {/* Hero Card: Next Session Focus */}
              <NextSessionCard
                nextOrder={nextScheduledOrder}
                onEnterRoom={(order) => setActiveLiveOrder(order)}
                onViewClientFile={(order) => setSelectedOrderForFile(order)}
                onOpenChat={(order) => setActiveChatOrder(order)}
              />

              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setIsMockEmpty(!isMockEmpty)}
                  className="text-[10px] text-[#A23F1E] bg-[#FAF2ED] px-3 py-1.5 rounded-full border border-[#F3E3DA] font-bold hover:bg-[#F3E3DA] transition"
                >
                  {isMockEmpty ? '演示：恢复模拟订单' : '演示：清空待办列表'}
                </button>
              </div>

              {/* Actionable Workbench Tasks */}
              <WorkbenchTasks
                orders={displayedOrders}
                onConfirmOrder={handleConfirmOrder}
                onEnterRoom={(order) => setActiveLiveOrder(order)}
                onWriteSummary={handleWriteSummary}
                onSendReminder={handleSendReminder}
                onViewClientFile={(order) => setSelectedOrderForFile(order)}
                onOpenChat={(order) => setActiveChatOrder(order)}
              />

              {/* Today Schedule Grid */}
              <TodaySchedule />

            </div>
          )}

          {/* TAB 2: ORDERS (订单) */}
          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              onConfirmOrder={handleConfirmOrder}
              onEnterRoom={(order) => setActiveLiveOrder(order)}
              onWriteSummary={handleWriteSummary}
              onSendReminder={handleSendReminder}
              onOpenChat={(order) => setActiveChatOrder(order)}
              onSubPageChange={setIsSubPage}
            />
          )}

          {/* TAB 3: GROWTH (增长) */}
          {activeTab === 'growth' && (
            <GrowthTab
              consultant={consultant}
              vouchers={vouchers}
              onAddVoucher={handleAddVoucher}
              onOpenAiQuoteModal={() => setIsQuoteModalOpen(true)}
            />
          )}

          {/* TAB 4: PROFILE (我的) */}
          {activeTab === 'profile' && (
            <ProfileTab
              consultant={consultant}
              products={products}
              settlements={settlements}
              onToggleProductPublish={handleToggleProductPublish}
              onUpdateProductPrice={handleUpdateProductPrice}
              onUpdateConsultant={handleUpdateConsultant}
              onSubPageChange={setIsSubPage}
            />
          )}

        </main>

        {/* Mobile Bottom Navigation */}
        {!isSubPage && (
          <TabNavigation
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            pendingSummaryCount={pendingSummaryCount}
            pendingOrderCount={pendingOrderCount}
          />
        )}

      </div>

      {/* MODAL 1: Minimalist Active Consultation Room */}
      {activeLiveOrder && (
        <ActiveSessionModal
          order={activeLiveOrder}
          onClose={() => setActiveLiveOrder(null)}
          onFinishSessionAndSummary={(order, scratchpad) => {
            setActiveLiveOrder(null);
            setSelectedOrderForSummary(order);
          }}
        />
      )}

      {/* MODAL 2: AI Session Summary Generator */}
      {selectedOrderForSummary && (
        <AISummaryModal
          order={selectedOrderForSummary}
          onClose={() => setSelectedOrderForSummary(null)}
          onSaveSummary={handleSaveSummary}
          onOpenChat={(order) => setActiveChatOrder(order)}
        />
      )}

      {/* MODAL 3: AI Social Quote / Moments Poster Generator */}
      {isQuoteModalOpen && (
        <AIQuoteModal
          consultant={consultant}
          onClose={() => setIsQuoteModalOpen(false)}
        />
      )}

      {/* MODAL 4: Client File Quick View Drawer */}
      {selectedOrderForFile && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#F9F7F2] border border-[#E5E0D5] rounded-t-[32px] sm:rounded-[32px] max-w-md w-full p-6 shadow-xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrderForFile(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-[#EAE5DB]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-1 bg-[#E5E0D5] rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-center gap-3 mb-4">
              <img
                src={selectedOrderForFile.clientAvatar}
                alt={selectedOrderForFile.clientName}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#5A6A50]/30"
              />
              <div>
                <h3 className="font-serif font-bold text-base text-[#4A5344]">{selectedOrderForFile.clientName} 的来访者档案</h3>
                <span className="text-xs text-[#5A6A50] font-medium">连续咨询第 4 次 · 专属建档</span>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-white p-4 rounded-2xl border border-[#E5E0D5]">
              <div>
                <strong className="text-[#8C877E] block mb-1">主诉与议题：</strong>
                <p className="text-[#3D3B38] font-medium">{selectedOrderForFile.complaintTopic}</p>
              </div>
              <div>
                <strong className="text-[#8C877E] block mb-1">预问卷首诊测验结果：</strong>
                <div className="bg-[#F2EDE4] p-3 rounded-xl border border-[#E5E0D5] space-y-1.5 text-[#4A5344]">
                  <div>• 广义焦虑量表 (GAD-7): <strong className="text-[#D48C70]">12分 (中度焦虑)</strong></div>
                  <div>• 躯体化紧绷定位: <strong>肩颈紧绷、睡眠中断</strong></div>
                  <div>• 咨询期望: <strong>学会建立界限，缓解抉择恐惧</strong></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setSelectedOrderForFile(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#5A6A50] text-white text-xs font-semibold hover:bg-[#4D5B44] transition shadow-xs"
              >
                关闭档案
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: IM Chat Drawer */}
      {activeChatOrder && (
        <ChatDrawer 
          order={activeChatOrder}
          isOpen={!!activeChatOrder}
          onClose={() => setActiveChatOrder(null)}
          onViewClientProfile={(order) => setSelectedOrderForFile(order)}
        />
      )}

    </div>
  );
}

