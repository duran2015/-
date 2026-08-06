import React, { useMemo } from 'react';
import { ChevronRight, LockKeyhole } from 'lucide-react';
import { useAppStore } from '../../client-app/store';
import type { Order, WorkflowTaskType } from '../../types';

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

type TaskDescriptor = {
  statusText: string;
  desc: string;
  btnText: string;
};

const descriptors: Partial<Record<WorkflowTaskType, TaskDescriptor>> = {
  confirm_booking: {
    statusText: '预约等待确认',
    desc: '确认后创建资料收集与入室待办',
    btnText: '确认',
  },
  review_intake: {
    statusText: '前序资料待查阅',
    desc: '用户已填写咨询前资料',
    btnText: '查看',
  },
  enter_session: {
    statusText: '即将开始咨询',
    desc: '咨询室已准备就绪',
    btnText: '进入',
  },
  complete_session_review: {
    statusText: '待确认总结',
    desc: 'AI 草稿已生成 · 提交前结算锁定',
    btnText: '复盘',
  },
  counselor_reflection: {
    statusText: '待完成专业自评',
    desc: '与咨询总结联动提交',
    btnText: '填写',
  },
};

export const WorkbenchTasks: React.FC<WorkbenchTasksProps> = ({
  orders,
  onConfirmOrder,
  onEnterRoom,
  onWriteSummary,
  onViewClientFile,
}) => {
  const workflowTasks = useAppStore((state) => state.consultationWorkflow.tasks);

  const tasks = useMemo(() =>
    workflowTasks
      .filter((task) => task.actorRole === 'counselor' && task.status !== 'completed' && descriptors[task.taskType])
      .map((task) => {
        const order = orders.find((item) => item.id === task.orderId);
        const descriptor = descriptors[task.taskType];
        if (!order || !descriptor) return null;
        const isPrimary = task.taskType === 'enter_session';
        const isReview = task.taskType === 'complete_session_review' || task.taskType === 'counselor_reflection';
        return {
          id: task.id,
          order,
          ...descriptor,
          time: isReview ? '待完成' : order.bookingTimeSlot.split(' ')[0],
          blockingSettlement: task.blockingSettlement,
          btnClass: isPrimary
            ? 'text-white bg-[#6750A4] shadow-xs hover:bg-[#594294]'
            : isReview
              ? 'text-[#4F378B] bg-[#EADDFF] shadow-xs'
              : 'text-[#49463D] bg-[#E7E0EC] hover:bg-[#E0D8E5]',
          onClick: () => {
            if (task.taskType === 'confirm_booking') onConfirmOrder(order.id);
            else if (task.taskType === 'review_intake') onViewClientFile?.(order);
            else if (task.taskType === 'enter_session') onEnterRoom(order);
            else onWriteSummary(order);
          },
        };
      })
      .filter((task): task is NonNullable<typeof task> => task !== null),
    [workflowTasks, orders, onConfirmOrder, onViewClientFile, onEnterRoom, onWriteSummary],
  );

  return (
    <div className="space-y-4 rounded-[28px] border border-[#E6E0D6] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#FAF8F5] pb-3">
        <div>
          <h3 className="text-[16px] font-bold tracking-tight text-[#1D1B16]">业务待办</h3>
          <p className="mt-0.5 text-[10px] text-[#7A756C]">预约、资料、会谈、总结与结算联动</p>
        </div>
        <div className="flex items-center gap-1 text-[13px] font-bold text-[#7A756C]">
          <span>{tasks.length}</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex w-full items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <img src={task.order.clientAvatar} alt="" className="h-12 w-12 shrink-0 rounded-full border border-[#ECE6DC] bg-[#FAF8F5] object-cover" />
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[15px] font-bold text-[#1D1B16]">{task.order.clientName}</span>
                  <span className="shrink-0 text-[12px] font-medium text-[#7A756C]">{task.statusText}</span>
                </div>
                <div className="mt-0.5 truncate text-[12px] text-[#7A756C]">{task.desc}</div>
                {task.blockingSettlement && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#8A5100]"><LockKeyhole size={11} />完成后进入 T+1 结算</div>
                )}
              </div>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <span className="w-[42px] text-right font-mono text-[10px] font-medium text-[#7A756C]">{task.time}</span>
              <button onClick={task.onClick} className={`w-16 shrink-0 rounded-full py-2 text-center text-[13px] font-bold transition active:scale-95 ${task.btnClass}`}>
                {task.btnText}
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <div className="py-6 text-center text-sm text-[#7A756C]">所有业务待办已完成</div>}
      </div>
    </div>
  );
};
