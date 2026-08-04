import React from 'react';
import { 
  ArrowLeft, Video, User, ChevronRight, FileText, Calendar, 
  Clock, CreditCard, ShieldCheck, Sparkles, CheckCircle2, AlertCircle,
  MessageSquare
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onOpenClientProfile: (order: Order) => void;
  onConfirmOrder: (orderId: string) => void;
  onEnterRoom: (order: Order) => void;
  onWriteSummary: (order: Order) => void;
  onOpenChat?: (order: Order) => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  onBack,
  onOpenClientProfile,
  onConfirmOrder,
  onEnterRoom,
  onWriteSummary,
  onOpenChat,
}) => {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_confirm':
        return <span className="bg-amber-100 text-amber-900 text-xs px-3 py-1 rounded-full font-semibold border border-amber-300">待确认接单</span>;
      case 'scheduled':
        return <span className="bg-[#E8E2D5] text-[#2E521C] text-xs px-3 py-1 rounded-full font-semibold border border-[#CBE6C3]">待咨询</span>;
      case 'in_progress':
        return <span className="bg-[#2E521C] text-white text-xs px-3 py-1 rounded-full font-semibold animate-pulse">服务中</span>;
      case 'completed':
        return <span className="bg-stone-100 text-[#7A756C] text-xs px-3 py-1 rounded-full font-semibold border border-[#ECE6DC]">已完成</span>;
      case 'refunded':
        return <span className="bg-rose-50 text-rose-700 text-xs px-3 py-1 rounded-full font-semibold border border-rose-200">退款/售后</span>;
      default:
        return <span className="bg-stone-100 text-stone-600 text-xs px-3 py-1 rounded-full">已取消</span>;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Top Header with Back Navigation */}
      <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full border border-[#E6E0D6] bg-[#FAF8F5] text-[#1D1B16] hover:bg-[#E8E2D5] transition active:scale-95 flex items-center justify-center"
            title="返回"
          >
            <ArrowLeft className="w-4 h-4 text-[#2E521C]" />
          </button>
          <div className="h-4 w-[1px] bg-[#E6E0D6]" />
          <div>
            <h2 className="font-bold text-base text-[#1D1B16] flex items-center gap-2">
              订单详情
              <span className="text-xs font-mono font-normal text-[#7A756C]">#{order.orderNo}</span>
            </h2>
          </div>
        </div>

        <div>{getStatusBadge(order.status)}</div>
      </div>

      {/* Workflow Progress Stepper Bar */}
      <div className="bg-[#FAF8F5] border border-[#ECE6DC] rounded-[20px] p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#1D1B16] pb-2 border-b border-[#ECE6DC]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#2E521C]" />
            <span>咨询工作流阶段定位 (Workflow Node)</span>
          </span>
          <span className="text-[11px] text-[#7A756C] font-mono">
            {order.status === 'pending_confirm' && '当前节点：阶段 1/4 (被预约·待确认)'}
            {order.status === 'scheduled' && '当前节点：阶段 2/4 (已预约·待开诊)'}
            {order.status === 'in_progress' && '当前节点：阶段 3/4 (咨询中)'}
            {order.status === 'completed' && (order.hasSummary ? '当前节点：阶段 4/4 (已结案&完全归档)' : '当前节点：阶段 4/4 (待生成 SOAP 复盘)')}
            {order.status === 'refunded' && '已退款/售后终止'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-2 pt-1 text-[10px]">
          <div className={`p-2 rounded-[12px] border flex flex-col items-center text-center transition ${
            order.status === 'pending_confirm' 
              ? 'bg-[#2E521C] text-white border-[#2E521C] font-bold shadow-xs' 
              : 'bg-white border-[#ECE6DC] text-[#7A756C]'
          }`}>
            <span>1. 被预约</span>
            <span className="text-[9px] opacity-80 mt-0.5">初诊表单审阅</span>
          </div>

          <div className={`p-2 rounded-[12px] border flex flex-col items-center text-center transition ${
            order.status === 'scheduled' 
              ? 'bg-[#2E521C] text-white border-[#2E521C] font-bold shadow-xs' 
              : 'bg-white border-[#ECE6DC] text-[#7A756C]'
          }`}>
            <span>2. 备诊提醒</span>
            <span className="text-[9px] opacity-80 mt-0.5">建档&情绪预检</span>
          </div>

          <div className={`p-2 rounded-[12px] border flex flex-col items-center text-center transition ${
            order.status === 'in_progress' 
              ? 'bg-[#2E521C] text-white border-[#2E521C] font-bold shadow-xs' 
              : 'bg-white border-[#ECE6DC] text-[#7A756C]'
          }`}>
            <span>3. 会谈咨询</span>
            <span className="text-[9px] opacity-80 mt-0.5">极简音视频连线</span>
          </div>

          <div className={`p-2 rounded-[12px] border flex flex-col items-center text-center transition ${
            order.status === 'completed' 
              ? 'bg-[#2E521C] text-white border-[#2E521C] font-bold shadow-xs' 
              : 'bg-white border-[#ECE6DC] text-[#7A756C]'
          }`}>
            <span>4. 结案解冻</span>
            <span className="text-[9px] opacity-80 mt-0.5">SOAP小结&打款</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Primary Order Info & Client Link (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Client Card Clickable */}
          <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 shadow-2xs flex items-center justify-between">
            <button
              onClick={() => onOpenClientProfile(order)}
              className="flex items-center gap-3.5 text-left group flex-1 min-w-0"
            >
              <img
                src={order.clientAvatar}
                alt={order.clientName}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#386A20]/20 group-hover:ring-[#386A20] transition shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#1D1B16] group-hover:text-[#2E521C] transition">
                    {order.clientName}
                  </h3>
                  <span className="text-xs text-[#2E521C] bg-[#FAF8F5] border border-[#ECE6DC] px-2.5 py-0.5 rounded-full font-semibold group-hover:bg-[#E8E2D5] transition flex items-center gap-0.5">
                    查看档案
                    <ChevronRight className="w-3.5 h-3.5 text-[#2E521C]" />
                  </span>
                </div>
                <p className="text-xs text-[#7A756C] mt-1 truncate">
                  点击直接查看来访者 PHQ-9/GAD-7 量表、既往会谈历史与心理档案
                </p>
              </div>
            </button>
          </div>

          {/* Consultation Schedule & Format Box */}
          <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-5 shadow-2xs space-y-3">
            <h4 className="font-bold text-sm text-[#1D1B16] flex items-center gap-2 pb-2 border-b border-[#ECE6DC]">
              <Calendar className="w-4 h-4 text-[#2E521C]" />
              咨询预约安排与形式
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF8F5] p-3.5 rounded-[16px] border border-[#ECE6DC]">
                <span className="text-[#7A756C] block text-[11px]">预约服务名称</span>
                <span className="font-bold text-sm text-[#2E521C] mt-0.5 block">
                  {order.serviceTypeName}
                </span>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-[16px] border border-[#ECE6DC]">
                <span className="text-[#7A756C] block text-[11px]">预约时间段</span>
                <span className="font-mono font-bold text-sm text-[#1D1B16] mt-0.5 block">
                  {order.bookingDate} {order.bookingTimeSlot}
                </span>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-[16px] border border-[#ECE6DC]">
                <span className="text-[#7A756C] block text-[11px]">沟通媒介方式</span>
                <span className="font-semibold text-xs text-[#1D1B16] mt-0.5 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-[#2E521C]" />
                  {order.consultationFormat === 'video' ? '高清加密视频连线' : '保密语音倾听通话'}
                </span>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-[16px] border border-[#ECE6DC]">
                <span className="text-[#7A756C] block text-[11px]">情绪前置打卡</span>
                <span className="font-mono font-bold text-xs text-[#A23F1E] mt-0.5 block">
                  {order.preMoodScore ? `焦虑指数 ${order.preMoodScore}/10` : '未打卡'}
                </span>
              </div>
            </div>
          </div>

          {/* Intake Form Details */}
          <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-5 shadow-2xs space-y-3">
            <h4 className="font-bold text-sm text-[#1D1B16] flex items-center gap-2 pb-2 border-b border-[#ECE6DC]">
              <FileText className="w-4 h-4 text-[#2E521C]" />
              来访者提交主诉与倾诉说明
            </h4>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[#7A756C] block font-semibold text-[11px] mb-1">主诉困扰及背景：</span>
                <div className="bg-[#FAF8F5] p-3.5 rounded-[16px] border border-[#ECE6DC] text-[#1D1B16] leading-relaxed break-words whitespace-pre-wrap">
                  {order.complaintTopic}
                </div>
              </div>

              {order.intakeForm && (
                <>
                  <div>
                    <span className="text-[#7A756C] block font-semibold text-[11px] mb-1">咨询期待与愿望：</span>
                    <div className="bg-[#FAF8F5] p-3.5 rounded-[16px] border border-[#ECE6DC] text-[#1D1B16] leading-relaxed break-words whitespace-pre-wrap">
                      {order.intakeForm.expectations}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-[14px] border border-[#ECE6DC]">
                    <span className="text-[#7A756C]">危机评估与知情签署：</span>
                    <span className="text-[#2E521C] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> 已签署安全告知书
                    </span>
                  </div>
                </>
              )}

              {order.note && (
                <div>
                  <span className="text-[#7A756C] block font-semibold text-[11px] mb-1">咨询师私密备忘录：</span>
                  <div className="bg-[#FAF8F5] p-3 rounded-[14px] border border-[#ECE6DC] text-[#49463D] font-mono break-words whitespace-pre-wrap">
                    💡 {order.note}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Billing, Payment & Action Tools (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Payment & Settlement Summary Card */}
          <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-5 shadow-2xs space-y-3">
            <h4 className="font-bold text-sm text-[#1D1B16] flex items-center gap-2 pb-2 border-b border-[#ECE6DC]">
              <CreditCard className="w-4 h-4 text-[#2E521C]" />
              账单明细与支付凭证
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#ECE6DC]">
                <span className="text-[#7A756C]">订单编号</span>
                <span className="font-mono text-[#1D1B16] font-semibold">{order.orderNo}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#ECE6DC]">
                <span className="text-[#7A756C]">下单时间</span>
                <span className="font-mono text-[#1D1B16]">{order.createdAt}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#ECE6DC]">
                <span className="text-[#7A756C]">支付通道</span>
                <span className="text-[#1D1B16] font-semibold">{order.paymentMethod || '微信支付'}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#ECE6DC]">
                <span className="text-[#7A756C]">资金托管状态</span>
                <span className="text-[#2E521C] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 平台安全托管中
                </span>
              </div>

              <div className="pt-2 flex items-baseline justify-between">
                <span className="text-xs font-bold text-[#1D1B16]">实付金额</span>
                <div className="text-right">
                  <span className="font-mono font-bold text-lg text-[#2E521C]">
                    ¥{order.price.toFixed(2)}
                  </span>
                  {order.originalPrice && (
                    <span className="text-[11px] text-[#7A756C] line-through font-mono ml-2">
                      ¥{order.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Hub Card */}
          <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-5 shadow-2xs space-y-3">
            <h4 className="font-bold text-sm text-[#1D1B16] pb-2 border-b border-[#ECE6DC]">
              咨询业务捷径操作
            </h4>

            <div className="space-y-2">
              {order.status === 'pending_confirm' && (
                <button
                  onClick={() => onConfirmOrder(order.id)}
                  className="w-full py-3 rounded-full bg-[#2E521C] text-white text-xs font-semibold hover:bg-[#234114] shadow-2xs transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>立即确认接单</span>
                </button>
              )}

              {order.status === 'scheduled' && (
                <button
                  onClick={() => onEnterRoom(order)}
                  className="w-full py-3 rounded-full bg-[#2E521C] text-white text-xs font-semibold hover:bg-[#234114] shadow-2xs transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4 text-emerald-200" />
                  <span>启动加密加密咨询室</span>
                </button>
              )}

              {order.status === 'completed' && (
                <button
                  onClick={() => onWriteSummary(order)}
                  className={`w-full py-3 rounded-full text-xs font-semibold transition active:scale-95 flex items-center justify-center gap-2 ${
                    order.hasSummary
                      ? 'bg-[#FAF8F5] text-[#1D1B16] border border-[#E6E0D6] hover:bg-[#E8E2D5]'
                      : 'bg-[#A23F1E] text-white hover:bg-[#883216] shadow-2xs'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>{order.hasSummary ? '查看/修改 AI 结案小结' : '一键生成 AI 临床结案小结'}</span>
                </button>
              )}

              {onOpenChat && order.status !== 'refunded' && (
                <button
                  onClick={() => onOpenChat(order)}
                  className="w-full py-2.5 rounded-full border border-[#E6E0D6] bg-white text-[#1D1B16] text-xs font-semibold hover:bg-[#FAF8F5] transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-[#A23F1E]" />
                  <span>与来访者私信沟通</span>
                </button>
              )}

              <button
                onClick={() => onOpenClientProfile(order)}
                className="w-full py-2.5 rounded-full border border-[#E6E0D6] bg-[#FAF8F5] text-[#1D1B16] text-xs font-semibold hover:bg-[#E8E2D5] transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <User className="w-4 h-4 text-[#2E521C]" />
                <span>打开该来访者全景心理档案</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
