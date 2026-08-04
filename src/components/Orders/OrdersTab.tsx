import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, CheckCircle2, AlertCircle, 
  Video, FileText, ChevronRight, Sparkles, User,
  CreditCard, ShieldCheck, Heart, MessageSquare
} from 'lucide-react';
import { Order, OrderStatus, ClientProfile } from '../../types';
import { INITIAL_CLIENT_PROFILES } from '../../data/mockData';
import { OrderDetailView } from './OrderDetailView';
import { ClientProfileView } from './ClientProfileView';

interface OrdersTabProps {
  orders: Order[];
  onConfirmOrder: (orderId: string) => void;
  onEnterRoom: (order: Order) => void;
  onWriteSummary: (order: Order) => void;
  onSendReminder: (order: Order) => void;
  onOpenChat?: (order: Order) => void;
  onSubPageChange?: (isSubPage: boolean) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onConfirmOrder,
  onEnterRoom,
  onWriteSummary,
  onSendReminder,
  onOpenChat,
  onSubPageChange,
}) => {
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'order_detail' | 'client_profile'>('list');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedClient, setSelectedClient] = useState<{
    profile: ClientProfile;
    order?: Order;
  } | null>(null);

  useEffect(() => {
    if (onSubPageChange) {
      onSubPageChange(viewMode !== 'list');
    }
  }, [viewMode, onSubPageChange]);

  const statusTabs = [
    { key: 'all', label: '全部订单', count: orders.length },
    { key: 'pending_confirm', label: '待确认接单', count: orders.filter((o) => o.status === 'pending_confirm').length },
    { key: 'scheduled', label: '待咨询', count: orders.filter((o) => o.status === 'scheduled').length },
    { key: 'completed', label: '已完成', count: orders.filter((o) => o.status === 'completed').length },
    { key: 'refunded', label: '退款/售后', count: orders.filter((o) => o.status === 'refunded').length },
  ];

  const filteredOrders = orders.filter((order) => {
    return activeStatus === 'all' || order.status === activeStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_confirm':
        return <span className="bg-amber-100 text-amber-900 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border border-amber-300">待确认接单</span>;
      case 'scheduled':
        return <span className="bg-[#E8E2D5] text-[#2E521C] text-[11px] px-2.5 py-0.5 rounded-full font-semibold border border-[#CBE6C3]">待咨询</span>;
      case 'in_progress':
        return <span className="bg-[#2E521C] text-white text-[11px] px-2.5 py-0.5 rounded-full font-semibold animate-pulse">服务中</span>;
      case 'completed':
        return <span className="bg-stone-100 text-[#7A756C] text-[11px] px-2.5 py-0.5 rounded-full font-semibold border border-[#ECE6DC]">已完成</span>;
      case 'refunded':
        return <span className="bg-rose-50 text-rose-700 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border border-rose-200">退款/售后</span>;
      default:
        return <span className="bg-stone-100 text-stone-600 text-[11px] px-2.5 py-0.5 rounded-full">已取消</span>;
    }
  };

  const handleOpenClientProfile = (order: Order) => {
    const foundProfile = INITIAL_CLIENT_PROFILES[order.clientId] || {
      id: order.clientId || 'cli_default',
      name: order.clientName,
      avatar: order.clientAvatar,
      gender: '保密',
      age: 28,
      occupation: '来访者',
      city: '中国',
      phone: '138****0000',
      emergencyContact: { name: '紧急联系人', relation: '亲属', phone: '138****0000' },
      intakeDate: order.bookingDate,
      riskLevel: 'low',
      tags: ['心理咨询来访'],
      historySummary: {
        totalSessions: 1,
        attendanceRate: '100%',
        primaryGoals: ['情绪调节与表达'],
        counselorWorkingNotes: '初步建立安全接纳信任关系。'
      },
      sessionLogs: [],
      preSessionCheckIns: []
    };

    setSelectedClient({
      profile: foundProfile,
      order: order
    });
    setViewMode('client_profile');
  };

  const handleOpenOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setViewMode('order_detail');
  };

  // Sub-view Page Render: Order Details Page
  if (viewMode === 'order_detail' && selectedOrder) {
    return (
      <OrderDetailView
        order={selectedOrder}
        onBack={() => {
          setViewMode('list');
          setSelectedOrder(null);
        }}
        onOpenClientProfile={(ord) => handleOpenClientProfile(ord)}
        onConfirmOrder={onConfirmOrder}
        onEnterRoom={onEnterRoom}
        onWriteSummary={onWriteSummary}
      />
    );
  }

  // Sub-view Page Render: Client Profile Page
  if (viewMode === 'client_profile' && selectedClient) {
    return (
      <ClientProfileView
        client={selectedClient.profile}
        relatedOrder={selectedClient.order}
        onBack={() => {
          // If we came from order detail, go back to order detail if available, else list
          if (selectedOrder) {
            setViewMode('order_detail');
          } else {
            setViewMode('list');
            setSelectedClient(null);
          }
        }}
        onEnterRoom={onEnterRoom}
      />
    );
  }

  // Primary View Render: Orders List
  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between px-1 pt-1">
        <h1 className="text-base font-bold text-[#1D1B16]">咨询订单</h1>
        <span className="text-xs text-[#7A756C] font-mono">共 {orders.length} 笔记录</span>
      </div>

      {/* M3 Filter Chips Bar */}
      <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveStatus(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 active:scale-95 ${
                activeStatus === tab.key
                  ? 'bg-[#2E521C] text-white shadow-2xs'
                  : 'bg-[#FAF8F5] text-[#49463D] border border-[#ECE6DC] hover:bg-[#E8E2D5]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                  activeStatus === tab.key ? 'bg-white/20 text-white' : 'bg-[#E8E2D5] text-[#2E521C]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-8 text-center text-[#7A756C]">
            <Calendar className="w-8 h-8 text-[#2E521C] mx-auto mb-2 opacity-50" />
            <h4 className="font-bold text-sm text-[#1D1B16]">暂无符合条件的订单</h4>
            <p className="text-xs text-[#7A756C] mt-1">请切换上方状态分类标签查看。</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('button')) return;
                handleOpenOrderDetail(order);
              }}
              className="bg-white border border-[#E6E0D6] rounded-[20px] p-4 shadow-2xs hover:shadow-xs hover:border-[#386A20]/50 transition space-y-3 cursor-pointer group flex flex-col"
            >
              {/* Top Row: Client & Time */}
              <div className="flex items-start justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenClientProfile(order);
                  }}
                  className="flex items-center gap-3 text-left transition active:scale-95"
                  title="点击打开来访者档案"
                >
                  <img
                    src={order.clientAvatar}
                    alt={order.clientName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-[#386A20]/20 group-hover:ring-[#386A20] transition"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-sm text-[#1D1B16] group-hover:text-[#2E521C] transition">
                        {order.clientName}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="text-[11px] font-mono text-[#7A756C] flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{order.bookingDate} {order.bookingTimeSlot}</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Middle Row: Topic Summary */}
              <div className="bg-[#FAF8F5] px-3 py-2 rounded-[12px] border border-[#ECE6DC]">
                <p className="text-[11px] text-[#49463D] line-clamp-1">
                  <span className="font-semibold text-[#1D1B16]">议题：</span>
                  {order.complaintTopic}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#E6E0D6]/50">
                {onOpenChat && order.status !== 'refunded' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenChat(order);
                    }}
                    className="p-1.5 rounded-full bg-[#FAF8F5] border border-[#ECE6DC] text-[#1D1B16] hover:bg-[#E8E2D5] transition active:scale-95"
                    title="私信沟通"
                  >
                    <MessageSquare className="w-4 h-4 text-[#2E521C]" />
                  </button>
                )}

                {order.status === 'pending_confirm' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfirmOrder(order.id);
                    }}
                    className="px-4 py-1.5 rounded-full bg-[#2E521C] text-white text-xs font-semibold hover:bg-[#234114] shadow-2xs transition active:scale-95"
                  >
                    确认接单
                  </button>
                )}

                {order.status === 'scheduled' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEnterRoom(order);
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2E521C] text-white text-xs font-semibold hover:bg-[#234114] shadow-2xs transition active:scale-95"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-200" />
                    <span>进入咨询室</span>
                  </button>
                )}

                {order.status === 'completed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onWriteSummary(order);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold shadow-2xs transition active:scale-95 ${
                      order.hasSummary
                        ? 'bg-[#FAF8F5] text-[#49463D] border border-[#E6E0D6] hover:bg-[#E8E2D5]'
                        : 'bg-[#2E521C] text-white hover:bg-[#234114]'
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${order.hasSummary ? 'text-[#7A756C]' : 'text-emerald-200'}`} />
                    <span>{order.hasSummary ? '修改小结' : '撰写AI小结'}</span>
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
