import React from 'react';
import { ChevronRight, TrendingUp } from 'lucide-react';

export const TodaySchedule: React.FC = () => {
  return (
    <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[16px] text-[#1D1B16] tracking-tight">本周收入趋势</h3>
        <ChevronRight className="w-4 h-4 text-[#7A756C]" />
      </div>

      <div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[28px] font-bold text-[#1D1B16] font-mono tracking-tight">¥12,680</span>
        </div>
        <div className="flex items-center gap-1 text-[12px] text-[#4F378B] font-bold bg-[#EADDFF] px-2 py-0.5 rounded-md inline-flex">
          <span>较上周 +8.3%</span>
          <TrendingUp className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Chart area */}
      <div className="mt-8 h-[80px] w-full relative">
        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
          <path 
            d="M 10 70 L 60 50 L 110 65 L 160 40 L 210 60 L 260 45 L 310 15" 
            fill="none" 
            stroke="#6750A4" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Fill under the line */}
          <path 
            d="M 10 70 L 60 50 L 110 65 L 160 40 L 210 60 L 260 45 L 310 15 L 310 80 L 10 80 Z" 
            fill="url(#chartGradient)" 
            opacity="0.2"
          />
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6750A4" stopOpacity="1" />
              <stop offset="100%" stopColor="#6750A4" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Points */}
          <circle cx="10" cy="70" r="4" fill="#6750A4" stroke="white" strokeWidth="2" />
          <circle cx="60" cy="50" r="4" fill="#6750A4" stroke="white" strokeWidth="2" />
          <circle cx="110" cy="65" r="4" fill="#6750A4" stroke="white" strokeWidth="2" />
          <circle cx="160" cy="40" r="4" fill="#6750A4" stroke="white" strokeWidth="2" />
          <circle cx="210" cy="60" r="4" fill="#6750A4" stroke="white" strokeWidth="2" />
          <circle cx="260" cy="45" r="4" fill="#6750A4" stroke="white" strokeWidth="2" />
          <circle cx="310" cy="15" r="5" fill="#6750A4" stroke="white" strokeWidth="2.5" />
        </svg>
        
        <div className="absolute -top-6 right-0 bg-[#4F378B] text-white text-[12px] px-2.5 py-0.5 rounded-full font-mono font-bold shadow-md">
          ¥2,660
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 px-1 text-[11px] text-[#7A756C] font-mono font-medium">
        <span>5/9</span>
        <span>5/10</span>
        <span>5/11</span>
        <span>5/12</span>
        <span>5/13</span>
        <span>5/14</span>
        <span>5/15</span>
      </div>
    </div>
  );
};