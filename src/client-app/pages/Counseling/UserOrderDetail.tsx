import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAppStore } from "../../store";
import { ArrowLeft, MessageSquare, Video, Clock, Lock, ShieldAlert, CalendarX } from "lucide-react";
import { mockCounselors } from "../../data";
import { MissingDataPage } from "../../components/EmptyState";

export function UserOrderDetail() {
  const { popView, pushView, bookingOrder, updateOrder, setActiveCallSession, setIsCallMinimized } = useAppStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  let paymentTimeLeft = 0;
  if (bookingOrder?.status === "pending" && bookingOrder.createdAt) {
    const createdTime = new Date(bookingOrder.createdAt).getTime();
    const expiryTime = createdTime + 30 * 60000;
    paymentTimeLeft = Math.max(0, Math.floor((expiryTime - now.getTime()) / 1000));
  }

  useEffect(() => {
    if (bookingOrder?.status === "pending" && paymentTimeLeft === 0 && bookingOrder.createdAt) {
      updateOrder(bookingOrder.id, { status: "cancelled" });
    }
  }, [paymentTimeLeft, bookingOrder?.status, bookingOrder?.id, bookingOrder?.createdAt, updateOrder]);

  if (!bookingOrder) {
    return <MissingDataPage icon={CalendarX} title="找不到这笔预约" description="订单可能已被清理或链接已经失效，可以返回预约列表重新查看。" onBack={popView} actionLabel="返回预约列表" />;
  }

  const formatPaymentTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const counselor = mockCounselors.find((c) => c.id === bookingOrder.counselorId) || mockCounselors[0];

  const getLockStatus = () => {
    if (bookingOrder.type === "text") return { isLocked: false, lockMessage: "" };
    
    let scheduledTime = new Date();
    const timeStr = bookingOrder.time;
    const dateStr = bookingOrder.date;

    if (timeStr && timeStr.includes(":")) {
      const [hourStr, minStr] = timeStr.split("-")[0].split(":");
      scheduledTime.setHours(parseInt(hourStr), parseInt(minStr), 0, 0);
    }
    
    if (dateStr && dateStr.includes("-")) {
      const [month, day] = dateStr.split("-");
      scheduledTime.setMonth(parseInt(month) - 1);
      scheduledTime.setDate(parseInt(day));
    } else if (dateStr === "明天") {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const diffMinutes = (scheduledTime.getTime() - now.getTime()) / 60000;
    if (diffMinutes > 10) {
      const openTime = new Date(scheduledTime.getTime() - 10 * 60000);
      const openDateStr = `${openTime.getMonth() + 1}月${openTime.getDate()}日`;
      const openTimeStr = `${openTime.getHours().toString().padStart(2, '0')}:${openTime.getMinutes().toString().padStart(2, '0')}`;
      return { isLocked: true, lockMessage: `预计 ${openDateStr} ${openTimeStr} 开放` };
    }
    return { isLocked: false, lockMessage: "" };
  };

  const handleEnterConsultation = () => {
    const { isLocked, lockMessage } = getLockStatus();
    if (isLocked) {
      alert(`咨询室将在开始前10分钟开放，请稍后再试\n（${lockMessage}）`);
      return;
    }
    if (bookingOrder.type === "text") {
      pushView("counseling-text-chat");
    } else {
      setActiveCallSession(bookingOrder);
      setIsCallMinimized(false);
    }
  };

  const handleCancelOrder = () => {
    const isConfirm = window.confirm("确定要取消该预约吗？");
    if (isConfirm) {
      const newStatus = bookingOrder.status === "paid" ? "refunded" : "cancelled";
      updateOrder(bookingOrder.id, { status: newStatus });
      popView();
    }
  };

  const { isLocked, lockMessage } = getLockStatus();

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 bg-[#f8f9fa] z-[60] flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
        <button
          onClick={popView}
          className="w-8 h-8 flex items-center justify-center active:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-900" />
        </button>
        <span className="font-bold text-gray-900 text-[16px]">预约详情</span>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto w-full pb-32 px-4 pt-4">
        <div className="bg-white rounded-[1.25rem] p-5 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
            <span className="text-gray-500 text-[14px]">订单状态</span>
            <span className={`font-bold text-[15px] flex items-center ${
              bookingOrder.status === 'paid' ? 'text-primary' :
              bookingOrder.status === 'pending' ? 'text-orange-500' :
              'text-gray-400'
            }`}>
              {bookingOrder.status === "paid" ? "待咨询" : 
               bookingOrder.status === "pending" ? (
                 <>
                   待支付 <span className="ml-2 bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[11px] font-bold flex items-center"><Clock size={10} className="mr-1"/> {formatPaymentTime(paymentTimeLeft)}</span>
                 </>
               ) : 
               bookingOrder.status === "completed" ? "履约完成" : 
               bookingOrder.status === "cancelled" ? "已取消" : 
               bookingOrder.status === "failed" ? "预约/支付失败" : "已退款"}
            </span>
          </div>

          <div className="flex items-start space-x-4 mb-6">
            <img
              src={counselor.avatar}
              alt=""
              className="w-14 h-14 rounded-[1.25rem] object-cover shadow-sm shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-gray-900 text-[16px]">{counselor.name}</p>
                <div className="flex items-center text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                  累计服务 {counselor.serviceHours || (counselor.type === "pro" ? 5000 : 1000)}+ 小时
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                {counselor.specialties?.slice(0, 1).map((spec, i) => (
                  <span key={`spec-${i}`} className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100/50 px-1.5 py-0.5 rounded font-medium mb-1">
                    擅长: {spec}
                  </span>
                ))}
                {counselor.styles?.slice(0, 1).map((style, i) => (
                  <span key={`style-${i}`} className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100/50 px-1.5 py-0.5 rounded font-medium mb-1">
                    风格: {style}
                  </span>
                ))}
                {counselor.credentials?.slice(0, 1).map((cred, i) => (
                  <span key={`cred-${i}`} className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100/50 px-1.5 py-0.5 rounded font-medium mb-1">
                    资质: {cred}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 text-[14px]">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">咨询方式</span>
              <span className="font-medium text-gray-900 flex items-center">
                {bookingOrder.type === "text" ? (
                  <><MessageSquare size={14} className="mr-1 text-blue-500"/> 文字沟通</>
                ) : bookingOrder.type === "voice" ? (
                  <><Video size={14} className="mr-1 text-indigo-500"/> 语音咨询</>
                ) : (
                  <><Video size={14} className="mr-1 text-green-500"/> 视频咨询</>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">预约时间</span>
              <span className="font-bold text-gray-900">
                {bookingOrder.date} {bookingOrder.time}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">咨询时长</span>
              <span className="font-medium text-gray-900">
                {bookingOrder.type === "text" ? "全天随时可留言" : "50 分钟"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">实付款</span>
              <span className="font-bold text-gray-900">
                ¥{bookingOrder.price}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">订单编号</span>
              <span className="font-medium text-gray-400 text-[13px]">
                {bookingOrder.id}
              </span>
            </div>
          </div>
        </div>

        {bookingOrder.status === "completed" && bookingOrder.counselorAdvice && (
          <div className="bg-white rounded-[1.25rem] p-5 shadow-sm border border-gray-100 mb-4">
            <h3 className="text-[15px] font-bold text-gray-900 flex items-center mb-3">
              <MessageSquare size={16} className="text-primary mr-1.5" />
              本次服务总结与建议
            </h3>
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <p className="text-[13px] text-gray-700 leading-relaxed font-medium">
                {bookingOrder.counselorAdvice}
              </p>
            </div>
          </div>
        )}
        
        {(bookingOrder.status === "paid" || bookingOrder.status === "pending") && (
          <div className="bg-orange-50 rounded-[1rem] p-4 flex items-start space-x-2">
            <ShieldAlert size={16} className="text-orange-500 mt-0.5 shrink-0" />
            <p className="text-[12px] text-orange-700 leading-relaxed">
              支持在预约开始前 24 小时免费取消；距预约开始不足 24 小时取消，将收取 50% 违约金；开始后取消不予退款。
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-20">
        <div className="flex space-x-3">
          {(bookingOrder.status === "paid" || bookingOrder.status === "pending") && (
            <button
              onClick={handleCancelOrder}
              className="flex-1 py-3.5 rounded-full font-bold bg-gray-50 text-gray-600 active:bg-gray-100 transition-colors border border-gray-200"
            >
              取消预约
            </button>
          )}

          {bookingOrder.status === "paid" && (
            <div className="flex-1 relative">
              <button
                onClick={() => pushView("counseling-text-chat")}
                className={`w-full py-3.5 rounded-full font-bold flex items-center justify-center transition-all bg-gray-900 text-white active:scale-[0.98]`}
              >
                联系咨询师
              </button>
            </div>
          )}

          {bookingOrder.status === "completed" && !bookingOrder.isEvaluated && (
            <button 
              onClick={() => pushView("user-evaluation" as any)}
              className="flex-1 py-3.5 rounded-full font-bold bg-gray-900 text-white active:scale-[0.98] transition-all"
            >
              评价咨询师
            </button>
          )}
          {bookingOrder.status === "completed" && bookingOrder.isEvaluated && (
            <button 
              disabled
              className="flex-1 py-3.5 rounded-full font-bold bg-gray-100 text-gray-400 cursor-not-allowed"
            >
              已评价
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
