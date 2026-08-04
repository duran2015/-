import React, { useState } from 'react';
import { Clock, Lock, CheckCircle2 } from 'lucide-react';

interface ScheduleSlot {
  id: string;
  time: string;
  status: 'booked' | 'available' | 'blocked';
  clientName?: string;
  serviceType?: string;
}

export const TodaySchedule: React.FC = () => {
  const [slots, setSlots] = useState<ScheduleSlot[]>([
    { id: '1', time: '09:00', status: 'blocked' },
    { id: '2', time: '10:30', status: 'booked', clientName: '林海燕', serviceType: '50min 视频' },
    { id: '3', time: '14:00', status: 'booked', clientName: '陈子健', serviceType: '15min 倾听' },
    { id: '4', time: '15:00', status: 'available' },
    { id: '5', time: '16:30', status: 'available' },
    { id: '6', time: '19:00', status: 'available' },
    { id: '7', time: '20:30', status: 'blocked' },
  ]);

  const toggleSlot = (id: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === id) {
          if (slot.status === 'available') return { ...slot, status: 'blocked' };
          if (slot.status === 'blocked') return { ...slot, status: 'available' };
        }
        return slot;
      })
    );
  };

  return (
    <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-sm text-[#1D1B16]">今日排班与时段状态</h3>
          <p className="text-[11px] text-[#7A756C]">点击可快速开放或关闭时段</p>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#7A756C]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#2E521C]" /> 已约
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> 可约
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-stone-300" /> 锁定
          </span>
        </div>
      </div>

      {/* M3 Horizontal Scroll / Grid Schedule Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => slot.status !== 'booked' && toggleSlot(slot.id)}
            disabled={slot.status === 'booked'}
            className={`p-3 rounded-[16px] border text-left flex flex-col justify-between h-20 transition active:scale-95 ${
              slot.status === 'booked'
                ? 'bg-[#2E521C] text-white border-[#2E521C] shadow-2xs cursor-default'
                : slot.status === 'available'
                ? 'bg-[#FAF8F5] border-[#CBE6C3] text-[#1D1B16] hover:bg-[#F2EDE4]'
                : 'bg-[#F5F2EC] border-[#E6E0D6] text-[#7A756C]'
            }`}
          >
            <div className="flex items-center justify-between w-full text-xs font-mono font-semibold">
              <span>{slot.time}</span>
              {slot.status === 'booked' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
              {slot.status === 'available' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
              {slot.status === 'blocked' && <Lock className="w-3 h-3 text-stone-400" />}
            </div>

            <div>
              {slot.status === 'booked' ? (
                <>
                  <div className="text-xs font-bold truncate">{slot.clientName}</div>
                  <div className="text-[9px] text-emerald-200 truncate">{slot.serviceType}</div>
                </>
              ) : slot.status === 'available' ? (
                <div className="text-[10px] text-[#2E521C] font-semibold">开放中 (点击锁)</div>
              ) : (
                <div className="text-[10px] text-[#7A756C]">已锁 (点击开)</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

