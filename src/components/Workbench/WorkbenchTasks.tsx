import React, { useMemo } from 'react';
import { ChevronRight, LockKeyhole } from 'lucide-react';
import { useAppStore } from '../../client-app/store';
import { buildCounselorJourneys } from '../../workbenchJourney';
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

type CurrentTaskDescriptor = {
  statusText: string;
  desc: string;
  btnText: string;
};

const currentTaskDescriptors: Partial<Record<WorkflowTaskType, CurrentTaskDescriptor>> = {
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
    btnText: '确认总结',
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
  const journeys = useMemo(
    () => buildCounselorJourneys(orders, workflowTasks),
    [orders, workflowTasks],
  );

  return (
    <div className="space-y-4 rounded-[28px] border border-[#E6E0D6] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#FAF8F5] pb-3">
        <div>
          <h3 className="text-[16px] font-bold tracking-tight text-[#1D1B16]">业务待办</h3>
          <p className="mt-0.5 text-[10px] text-[#7A756C]">预约、资料、会谈、总结与结算联动</p>
        </div>
        <div className="flex items-center gap-1 text-[13px] font-bold text-[#7A756C]">
          <span>{journeys.length}</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      <div className="divide-y divide-[#F0ECE6]">
        {journeys.map((journey) => {
          const descriptor = currentTaskDescriptors[journey.currentTask.taskType];
          const { order, currentTask } = journey;
          const buttonClassForCurrentTask = currentTask.taskType === 'enter_session'
            ? 'rounded-full bg-[#6750A4] px-4 py-2 text-[13px] font-bold text-white shadow-xs transition hover:bg-[#594294] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6750A4] active:scale-95'
            : currentTask.taskType === 'complete_session_review'
              ? 'rounded-full bg-[#EADDFF] px-4 py-2 text-[13px] font-bold text-[#4F378B] transition hover:bg-[#D8BFFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6750A4] active:scale-95'
              : 'rounded-full bg-[#F4EFF4] px-4 py-2 text-[13px] font-bold text-[#49454F] transition hover:bg-[#E7E0EC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6750A4] active:scale-95';
          const handleCurrentTask = () => {
            if (currentTask.taskType === 'confirm_booking') onConfirmOrder(order.id);
            else if (currentTask.taskType === 'review_intake') onViewClientFile?.(order);
            else if (currentTask.taskType === 'enter_session') onEnterRoom(order);
            else if (currentTask.taskType === 'complete_session_review') onWriteSummary(order);
          };

          if (!descriptor) return null;

          return (
            <article key={order.id} className="flex w-full items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={order.clientAvatar}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-full border border-[#ECE6DC] bg-[#FAF8F5] object-cover"
                />
                <div className="min-w-0 pr-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-[15px] font-bold text-[#1D1B16]">{order.clientName}</span>
                    <span className="shrink-0 text-[12px] font-medium text-[#7A756C]">{descriptor.statusText}</span>
                  </div>
                  <div className="mt-0.5 truncate text-[12px] text-[#7A756C]">{descriptor.desc}</div>
                  {currentTask.taskType === 'complete_session_review' && currentTask.blockingSettlement && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#8A5100]">
                      <LockKeyhole size={11} />完成后进入 T+1 结算
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <time
                  aria-label={`预约时间：${journey.appointmentLabel}`}
                  title={journey.appointmentLabel}
                  className="w-[46px] truncate text-right font-mono text-[10px] font-medium text-[#7A756C]"
                >
                  {order.bookingTimeSlot.split(' ')[0]}
                </time>
                <button type="button" onClick={handleCurrentTask} className={buttonClassForCurrentTask}>
                  {descriptor.btnText}
                </button>
              </div>
            </article>
          );
        })}
        {journeys.length === 0 && <div className="py-6 text-center text-sm text-[#7A756C]">所有业务待办已完成</div>}
      </div>
    </div>
  );
};
