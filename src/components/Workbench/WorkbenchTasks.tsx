import React, { useMemo } from 'react';
import { Check, ChevronRight, LockKeyhole, Minus } from 'lucide-react';
import { useAppStore } from '../../client-app/store';
import { buildCounselorJourneys } from '../../workbenchJourney';
import type { CounselorJourneyStep } from '../../workbenchJourney';
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
  desc: string;
  btnText: string;
};

const currentTaskDescriptors: Partial<Record<WorkflowTaskType, CurrentTaskDescriptor>> = {
  confirm_booking: {
    desc: '确认后创建资料收集与入室待办',
    btnText: '确认',
  },
  review_intake: {
    desc: '用户已填写咨询前资料',
    btnText: '查看',
  },
  enter_session: {
    desc: '咨询室已准备就绪',
    btnText: '进入',
  },
  complete_session_review: {
    desc: 'AI 草稿已生成 · 提交前结算锁定',
    btnText: '确认总结',
  },
};

const stepNodeClasses: Record<CounselorJourneyStep['status'], string> = {
  completed: 'border-[#6750A4] bg-[#6750A4] text-white',
  skipped: 'border-[#CAC4D0] bg-[#F4EFF4] text-[#938F99]',
  current: 'border-[#6750A4] bg-white text-[#6750A4] ring-4 ring-[#EADDFF]',
  locked: 'border-[#CAC4D0] bg-white text-[#938F99]',
};

const connectorClasses: Record<CounselorJourneyStep['status'], string> = {
  completed: 'bg-[#6750A4]',
  skipped: 'bg-[#D8D1DD]',
  current: 'bg-[#D8D1DD]',
  locked: 'bg-[#E7E0EC]',
};

const StepNode: React.FC<{ step: CounselorJourneyStep; index: number }> = ({ step, index }) => (
  <span
    aria-label={`${step.label}：${step.status}`}
    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-bold ${stepNodeClasses[step.status]}`}
  >
    {step.status === 'completed' && <Check size={15} strokeWidth={3} />}
    {step.status === 'skipped' && <Minus size={15} strokeWidth={3} />}
    {step.status === 'current' && index + 1}
    {step.status === 'locked' && <LockKeyhole size={13} />}
  </span>
);

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

      <div className="space-y-4">
        {journeys.map((journey) => {
          const descriptor = currentTaskDescriptors[journey.currentTask.taskType];
          const { order, currentTask } = journey;
          const handleCurrentTask = () => {
            if (currentTask.taskType === 'confirm_booking') onConfirmOrder(order.id);
            else if (currentTask.taskType === 'review_intake') onViewClientFile?.(order);
            else if (currentTask.taskType === 'enter_session') onEnterRoom(order);
            else if (currentTask.taskType === 'complete_session_review') onWriteSummary(order);
          };

          return (
            <article key={order.id} className="rounded-2xl border border-[#E7E0EC] bg-[#FFFBFE] p-4">
              <div className="flex min-w-0 items-center gap-3">
                <img src={order.clientAvatar} alt="" className="h-10 w-10 shrink-0 rounded-full border border-[#ECE6DC] bg-white object-cover" />
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-bold text-[#1D1B16]">{order.clientName}</div>
                  <div className="mt-0.5 truncate text-[11px] text-[#7A756C]">{journey.appointmentLabel}</div>
                </div>
              </div>

              <ol className="mt-5 flex w-full" aria-label={`${order.clientName} 的咨询流程`}>
                {journey.steps.map((step, index) => (
                  <li key={step.taskType} className="flex min-w-0 flex-1 items-center last:flex-none">
                    <div className="flex min-w-0 flex-col items-center gap-1 text-center">
                      <StepNode step={step} index={index} />
                      <span className={`whitespace-nowrap text-[10px] font-medium ${step.status === 'current' ? 'text-[#4F378B]' : 'text-[#7A756C]'}`}>
                        {step.label}
                      </span>
                    </div>
                    {index < journey.steps.length - 1 && (
                      <span className={`mx-1 mb-4 h-px min-w-2 flex-1 ${connectorClasses[step.status]}`} aria-hidden="true" />
                    )}
                  </li>
                ))}
              </ol>

              {descriptor && (
                <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#E7E0EC] pt-3">
                  <div className="min-w-0">
                    <p className="text-[12px] text-[#49454F]">{descriptor.desc}</p>
                    {currentTask.blockingSettlement && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#8A5100]">
                        <LockKeyhole size={11} />完成后进入 T+1 结算
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleCurrentTask}
                    className="shrink-0 rounded-full bg-[#6750A4] px-4 py-2 text-[13px] font-bold text-white shadow-xs transition hover:bg-[#594294] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6750A4] active:scale-95"
                  >
                    {descriptor.btnText}
                  </button>
                </div>
              )}
            </article>
          );
        })}
        {journeys.length === 0 && <div className="py-6 text-center text-sm text-[#7A756C]">所有业务待办已完成</div>}
      </div>
    </div>
  );
};
