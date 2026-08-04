import React, { useState } from 'react';
import { 
  Clock, CheckCircle2, Video, Sparkles, 
  AlertCircle, Send, MessageCircle
} from 'lucide-react';
import { Order } from '../../types';

interface WorkbenchTasksProps {
  orders: Order[];
  onConfirmOrder: (orderId: string) => void;
  onEnterRoom: (order: Order) => void;
  onWriteSummary: (order: Order) => void;
  onSendReminder: (order: Order) => void;
  onViewClientFile?: (order: Order) => void;
  onOpenChat?: (order: Order) => void;
}

export const WorkbenchTasks: React.FC<WorkbenchTasksProps> = ({
  orders,
  onConfirmOrder,
  onEnterRoom,
  onWriteSummary,
  onSendReminder,
  onViewClientFile,
  onOpenChat,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'scheduled' | 'summary'>('pending');

  const pendingConfirmOrders = orders.filter((o) => o.status === 'pending_confirm');
  const scheduledOrders = orders.filter((o) => o.status === 'scheduled');
  const pendingSummaryOrders = orders.filter((o) => o.status === 'completed' && !o.hasSummary);

  const totalTasks = pendingConfirmOrders.length + scheduledOrders.length + pendingSummaryOrders.length;

  if (totalTasks === 0) {
    return (
      <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-6 sm:p-8 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto mb-2 border border-[#ECE6DC]">
          <CheckCircle2 className="w-8 h-8 text-[#2E521C]" />
        </div>
        <div>
          <h3 className="font-bold text-base text-[#1D1B16] mb-1">当前暂无待办任务</h3>
          <p className="text-xs text-[#7A756C] max-w-sm mx-auto leading-relaxed">
            您已处理完所有待确认订单、咨询及结案小结。在这个空闲时间，您可以去提升一下您的主页吸引力。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-2">
          <button className="p-3 rounded-[16px] bg-[#FAF8F5] border border-[#ECE6DC] text-left hover:bg-[#E8E2D5] transition group">
            <div className="font-bold text-xs text-[#1D1B16] mb-1 group-hover:text-[#2E521C]">分享咨询主页</div>
            <div className="text-[10px] text-[#7A756C]">转发至朋友圈获取新客源</div>
          </button>
          <button className="p-3 rounded-[16px] bg-[#FAF8F5] border border-[#ECE6DC] text-left hover:bg-[#E8E2D5] transition group">
            <div className="font-bold text-xs text-[#1D1B16] mb-1 group-hover:text-[#2E521C]">发布科普动态</div>
            <div className="text-[10px] text-[#7A756C]">展示专业能力提升信任感</div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-2">
        <h3 className="font-bold text-sm text-[#1D1B16]">工作台待办</h3>
        <span className="px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#7A756C] text-[10px] font-bold border border-[#ECE6DC]">
          待处理任务
        </span>
      </div>

      <div className="flex bg-[#FAF8F5] p-1 rounded-full border border-[#ECE6DC]">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-full transition flex items-center justify-center gap-1.5 ${
            activeTab === 'pending' ? 'bg-white text-[#1D1B16] shadow-2xs border border-[#E6E0D6]' : 'text-[#7A756C] hover:text-[#1D1B16]'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>待确认</span>
          {pendingConfirmOrders.length > 0 && (
            <span className="bg-[#A23F1E] text-white px-1.5 rounded-full text-[9px]">{pendingConfirmOrders.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-full transition flex items-center justify-center gap-1.5 ${
            activeTab === 'scheduled' ? 'bg-white text-[#1D1B16] shadow-2xs border border-[#E6E0D6]' : 'text-[#7A756C] hover:text-[#1D1B16]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>待咨询</span>
          {scheduledOrders.length > 0 && (
            <span className="bg-[#2E521C] text-white px-1.5 rounded-full text-[9px]">{scheduledOrders.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-full transition flex items-center justify-center gap-1.5 ${
            activeTab === 'summary' ? 'bg-white text-[#1D1B16] shadow-2xs border border-[#E6E0D6]' : 'text-[#7A756C] hover:text-[#1D1B16]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>待小结</span>
          {pendingSummaryOrders.length > 0 && (
            <span className="bg-[#A23F1E] text-white px-1.5 rounded-full text-[9px]">{pendingSummaryOrders.length}</span>
          )}
        </button>
      </div>

      <div className="pt-2">
        {activeTab === 'pending' && (
          <div className="space-y-2.5">
            {pendingConfirmOrders.length === 0 ? (
              <div className="py-6 text-center text-[#7A756C] text-xs">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 opacity-50" />
                暂无待确认
              </div>
            ) : (
              pendingConfirmOrders.map((order) => (
                <div key={order.id} className="bg-white p-3 rounded-[16px] border border-[#E6E0D6] shadow-2xs space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img src={order.clientAvatar} alt={order.clientName} className="w-9 h-9 rounded-full object-cover ring-1 ring-[#2E521C]/20 shrink-0" />
                      <div>
                        <div className="font-bold text-xs text-[#1D1B16] flex items-center gap-1.5 min-w-0">
                          <span className="truncate">{order.clientName}</span>
                          <span className="text-[10px] bg-[#E8E2D5] text-[#2E521C] px-1.5 py-0.2 rounded-md font-medium shrink-0">{order.serviceTypeName}</span>
                        </div>
                        <div className="text-[10px] text-[#7A756C] font-mono mt-0.5">
                          {order.bookingDate} {order.bookingTimeSlot}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-[#2E521C] font-mono">¥{order.price}</div>
                  </div>

                  <div className="bg-[#FAF8F5] p-2 rounded-[12px] text-[11px] text-[#49463D] border border-[#ECE6DC]">
                    <div className="font-semibold text-[#1D1B16] mb-1">初诊诉求：</div>
                    <p className="line-clamp-2 text-[#7A756C] break-words whitespace-pre-wrap">{order.complaintTopic}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {onOpenChat && (
                      <button onClick={() => onOpenChat(order)} className="p-1.5 rounded-full border border-[#E6E0D6] bg-white text-[#49463D] hover:bg-[#E8E2D5] flex items-center justify-center transition" title="联系来访者">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    )}
                    {onViewClientFile && (
                      <button onClick={() => onViewClientFile(order)} className="px-3 py-1.5 rounded-full border border-[#E6E0D6] bg-white text-[#49463D] text-[11px] font-medium hover:bg-[#E8E2D5]">
                        查看初诊评估
                      </button>
                    )}
                    <button onClick={() => onConfirmOrder(order.id)} className="px-4 py-1.5 rounded-full bg-[#2E521C] text-white text-[11px] font-bold hover:bg-[#234114] shadow-2xs active:scale-95 transition">
                      确认接单并锁定时段
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="space-y-2.5">
            {scheduledOrders.length === 0 ? (
              <div className="py-6 text-center text-[#7A756C] text-xs">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 opacity-50" />
                暂无待咨询
              </div>
            ) : (
              scheduledOrders.map((order) => (
                <div key={order.id} className="bg-white p-3 rounded-[16px] border border-[#E6E0D6] shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={order.clientAvatar} alt={order.clientName} className="w-9 h-9 rounded-full object-cover ring-1 ring-[#2E521C]/20 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#1D1B16] flex items-center gap-1.5 min-w-0">
                          <span className="truncate">{order.clientName}</span>
                          <span className="text-[10px] bg-[#E8E2D5] text-[#2E521C] px-1.5 py-0.2 rounded-md shrink-0">{order.serviceTypeName}</span>
                        </div>
                        <div className="text-[10px] text-[#7A756C] font-mono mt-0.5">
                          {order.bookingDate} {order.bookingTimeSlot}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => onEnterRoom(order)} className="px-3 py-1.5 rounded-full bg-[#2E521C] text-white text-[11px] font-bold hover:bg-[#234114] shadow-2xs active:scale-95 transition flex items-center gap-1 shrink-0">
                      <Video className="w-3.5 h-3.5 text-emerald-200" />
                      <span>进入咨询室</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#ECE6DC] gap-2">
                    <span className="text-[#7A756C] line-clamp-1 break-all" title={order.complaintTopic}>诉求: {order.complaintTopic}</span>
                    <div className="flex gap-2 shrink-0 items-center">
                      {onOpenChat && (
                        <button onClick={() => onOpenChat(order)} className="text-[11px] font-semibold text-[#2E521C] hover:underline flex items-center gap-1 mr-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>私信沟通</span>
                        </button>
                      )}
                      {onViewClientFile && (
                        <button onClick={() => onViewClientFile(order)} className="text-[11px] font-semibold text-[#2E521C] hover:underline">调阅档案</button>
                      )}
                      <button onClick={() => onSendReminder(order)} className="text-[11px] font-semibold text-[#A23F1E] hover:underline flex items-center gap-1">
                        <Send className="w-3 h-3" />
                        <span>发送预检卡</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-2.5">
            {pendingSummaryOrders.length === 0 ? (
              <div className="py-6 text-center text-[#7A756C] text-xs">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 opacity-50" />
                暂无待小结
              </div>
            ) : (
              pendingSummaryOrders.map((order) => (
                <div key={order.id} className="bg-white p-3 rounded-[16px] border border-[#E6E0D6] shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={order.clientAvatar} alt={order.clientName} className="w-9 h-9 rounded-full object-cover ring-1 ring-[#2E521C]/20 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#1D1B16] flex items-center gap-1.5 min-w-0">
                          <span className="truncate">{order.clientName}</span>
                          <span className="text-[10px] bg-[#E8E2D5] text-[#2E521C] px-1.5 py-0.2 rounded-md shrink-0">{order.serviceTypeName}</span>
                        </div>
                        <div className="text-[10px] text-[#7A756C] font-mono mt-0.5">
                          完成时间: {order.bookingDate} {order.bookingTimeSlot}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => onWriteSummary(order)} className="px-3 py-1.5 rounded-full bg-[#2E521C] text-white text-[11px] font-bold hover:bg-[#234114] shadow-2xs active:scale-95 transition flex items-center gap-1 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                      <span>AI 生成 SOAP</span>
                    </button>
                  </div>
                  <div className="bg-[#FAF8F5] p-2 rounded-[12px] text-[10px] text-[#7A756C] flex items-center justify-between border border-[#ECE6DC]">
                    <div className="flex items-center gap-2">
                      {onOpenChat && (
                        <button onClick={() => onOpenChat(order)} className="flex items-center gap-1 text-[#2E521C] hover:underline font-semibold" title="私信沟通">
                          <MessageCircle className="w-3 h-3" />
                          <span>私信沟通</span>
                        </button>
                      )}
                      <span>小结完成后自动解冻入账结算金额。</span>
                    </div>
                    <span className="font-bold font-mono text-[#2E521C]">+¥{order.price}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
