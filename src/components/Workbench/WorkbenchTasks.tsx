import React, { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { Order } from '../../types';

interface WorkbenchTasksProps {
  orders: Order[];
  onConfirmOrder: (orderId: string) => void;
  onEnterRoom: (order: Order) => void;
  onWriteSummary: (order: Order) => void;
  onSendReminder: (order: Order) => void;
  onViewClientFile?: (order: Order) => void;
  onOpenChat?: (order: Order) => void;
  onProcessOrder?: (order: Order) => void;
}

export const WorkbenchTasks: React.FC<WorkbenchTasksProps> = ({
  orders,
  onConfirmOrder,
  onEnterRoom,
  onWriteSummary,
  onOpenChat,
  onProcessOrder,
}) => {
  // Generate tasks from orders
  const tasks = useMemo(() => {
    const list: any[] = [];
    
    // Find pending confirm orders
    orders.filter(o => o.status === 'pending_confirm').forEach(order => {
      list.push({
        id: `pending_${order.id}`,
        order,
        clientName: order.clientName,
        clientAvatar: order.clientAvatar,
        statusText: '预约等待确认',
        desc: order.serviceTypeName,
        time: order.bookingTimeSlot.split(' ')[0], // e.g. "14:00"
        btnText: '处理',
        btnClass: 'text-[#4F378B] bg-[#EADDFF] shadow-xs hover:shadow-sm',
        onClick: () => onProcessOrder?.(order)
      });
    });

    // Find scheduled orders that are close (for now just all scheduled)
    orders.filter(o => o.status === 'scheduled').slice(0, 1).forEach(order => {
      list.push({
        id: `scheduled_${order.id}`,
        order,
        clientName: order.clientName,
        clientAvatar: order.clientAvatar,
        statusText: '即将开始咨询',
        desc: '咨询室已准备就绪',
        time: order.bookingTimeSlot.split(' ')[0],
        btnText: '进入',
        btnClass: 'text-white bg-[#6750A4] shadow-xs hover:bg-[#594294]',
        onClick: () => onEnterRoom(order)
      });
    });

    // Find completed orders without summary
    orders.filter(o => o.status === 'completed' && !o.hasSummary).forEach(order => {
      list.push({
        id: `summary_${order.id}`,
        order,
        clientName: order.clientName,
        clientAvatar: order.clientAvatar,
        statusText: '待写小结',
        desc: '咨询已结束，待补充记录',
        time: '昨天',
        btnText: '撰写',
        btnClass: 'text-[#49463D] bg-[#E7E0EC] hover:bg-[#E0D8E5]',
        onClick: () => onWriteSummary(order)
      });
    });

    // Add a mock message task to match user's screenshot
    list.push({
      id: 'mock_msg_1',
      clientName: '李先生',
      clientAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=80',
      statusText: '发送了新消息',
      desc: '您咨询关于焦虑的问...',
      time: '09:30',
      btnText: '查看',
      btnClass: 'text-[#49463D] bg-[#E7E0EC] hover:bg-[#E0D8E5]',
      onClick: () => {
        // mock click: open chat with the first order
        onOpenChat?.(orders[0]);
      }
    });

    return list;
  }, [orders, onProcessOrder, onEnterRoom, onWriteSummary, onOpenChat]);

  return (
    <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#FAF8F5]">
        <h3 className="font-bold text-[16px] text-[#1D1B16] tracking-tight">待处理事项</h3>
        <div className="flex items-center gap-1 text-[#7A756C] text-[13px] font-bold">
          <span>{tasks.length}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between group w-full">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 shrink-0">
                <img src={task.clientAvatar} alt="" className="w-full h-full rounded-full object-cover bg-[#FAF8F5] border border-[#ECE6DC]" />
              </div>
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[15px] text-[#1D1B16] truncate">{task.clientName}</span>
                  <span className="text-[12px] text-[#7A756C] font-medium shrink-0">{task.statusText}</span>
                </div>
                <div className="text-[12px] text-[#7A756C] mt-0.5 truncate">{task.desc}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-auto">
              <span className="text-[12px] text-[#7A756C] font-mono font-medium text-right w-[42px]">{task.time}</span>
              <button 
                onClick={task.onClick}
                className={`text-[13px] font-bold w-16 py-2 rounded-full active:scale-95 transition text-center shrink-0 ${task.btnClass}`}
              >
                {task.btnText}
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-6 text-[#7A756C] text-sm">
            暂无待处理事项
          </div>
        )}
      </div>
    </div>
  );
};