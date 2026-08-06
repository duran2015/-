import React, { useState } from 'react';
import { Sparkles, X, Check, FileText, RefreshCw, Save, MessageCircle } from 'lucide-react';
import { Order, SessionSummary } from '../types';

interface AISummaryModalProps {
  order: Order;
  initialScratchpad?: string;
  onClose: () => void;
  onSaveSummary: (summary: SessionSummary) => void;
  onOpenChat?: (order: Order) => void;
}

export const AISummaryModal: React.FC<AISummaryModalProps> = ({
  order,
  initialScratchpad = '',
  onClose,
  onSaveSummary,
  onOpenChat,
}) => {
  const [rawNotes, setRawNotes] = useState<string>(
    initialScratchpad || '会谈前半段伴有明显焦虑，肩颈紧绷。使用了4-7-8呼吸法引导，并做认知重新归因。'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedSummary, setGeneratedSummary] = useState<any | null>(null);

  const handleGenerateAI = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/session-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: order.clientName,
          sessionTopic: order.complaintTopic,
          sessionNumber: 4,
          rawNotes,
        }),
      });
      const data = await res.json();
      if (data.success && data.summary) {
        setGeneratedSummary(data.summary);
      }
    } catch (err) {
      console.error('Error in AI summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    const finalSummary: SessionSummary = {
      id: `sum_${Date.now()}`,
      orderId: order.id,
      clientName: order.clientName,
      date: order.bookingDate,
      sessionNumber: 4,
      clientMood: generatedSummary?.clientMood || '会谈情绪逐步由紧绷放缓至平静。',
      mainComplaint: generatedSummary?.mainComplaint || order.complaintTopic,
      interventions: generatedSummary?.interventions || ['人本主义共情', 'CBT 认知重构', '腹式呼吸'],
      insights: generatedSummary?.insights || '来访者意识到完美主义倾向带来的压力。',
      homework: generatedSummary?.homework || '每日记录1次情绪触发事件。',
      nextPlan: generatedSummary?.nextPlan || '巩固边界建立与自我慈悲表达。',
      createdAt: new Date().toISOString().split('T')[0],
    };
    onSaveSummary(finalSummary);
    alert('咨询结案小结已保存至来访者电子档案！');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-t-[28px] sm:rounded-[28px] max-w-xl w-full p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-none">
        
        {/* M3 Drag Handle */}
        <div className="w-10 h-1 bg-[#E6E0D6] rounded-full mx-auto mb-3" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#7A756C] hover:text-[#1D1B16] hover:bg-[#E8E2D5] transition active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-[#6750A4] text-white flex items-center justify-center font-bold shadow-2xs shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-200" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base text-[#1D1B16]">【{order.clientName}】AI 咨询小结</h3>
            <p className="text-[11px] text-[#7A756C]">一键整理速记笔记为临床规范结案小结</p>
          </div>
          {onOpenChat && (
            <button
              onClick={() => onOpenChat(order)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E6E0D6] text-[#6750A4] text-[11px] font-bold hover:bg-[#FAF8F5] transition active:scale-95 shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>查阅私信</span>
            </button>
          )}
        </div>

        {/* Input Raw Notes */}
        <div className="space-y-2.5 mb-4">
          <label className="block text-xs font-semibold text-[#1D1B16]">
            速记草稿笔记：
          </label>
          <textarea
            rows={3}
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            className="w-full bg-white border border-[#E6E0D6] rounded-[16px] p-3 text-xs text-[#1D1B16] focus:outline-hidden focus:ring-2 focus:ring-[#386A20]/30"
          />

          <button
            onClick={handleGenerateAI}
            disabled={isLoading}
            className="w-full py-2.5 rounded-full bg-[#6750A4] text-white text-xs font-semibold hover:bg-[#594294] transition shadow-2xs flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-emerald-200" />
            )}
            <span>{isLoading ? 'AI 分析生成中...' : '一键生成标准结案小结'}</span>
          </button>
        </div>

        {/* Generated Result Preview */}
        {generatedSummary && (
          <div className="space-y-3 bg-white p-4 rounded-[18px] border border-[#E6E0D6] text-xs text-[#1D1B16] shadow-2xs">
            <div className="font-bold text-xs text-[#6750A4] pb-2 border-b border-[#ECE6DC] flex items-center justify-between">
              <span>生成的结构化小结</span>
              <span className="text-[10px] bg-[#EADDFF] text-[#21005D] px-2 py-0.2 rounded-full font-bold">
                符合注册系统标准
              </span>
            </div>

            <div>
              <strong className="text-[#7A756C] block mb-0.5 text-[11px]">情绪及躯体状态：</strong>
              <input
                type="text"
                value={generatedSummary.clientMood}
                onChange={(e) => setGeneratedSummary({ ...generatedSummary, clientMood: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#ECE6DC] rounded-full px-3 py-1.5 text-xs text-[#1D1B16]"
              />
            </div>

            <div>
              <strong className="text-[#7A756C] block mb-0.5 text-[11px]">核心主诉概括：</strong>
              <input
                type="text"
                value={generatedSummary.mainComplaint}
                onChange={(e) => setGeneratedSummary({ ...generatedSummary, mainComplaint: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#ECE6DC] rounded-full px-3 py-1.5 text-xs text-[#1D1B16]"
              />
            </div>

            <div>
              <strong className="text-[#7A756C] block mb-0.5 text-[11px]">干预技术与策略：</strong>
              <ul className="list-disc pl-4 space-y-0.5 text-[#1D1B16] text-[11px]">
                {generatedSummary.interventions?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong className="text-[#7A756C] block mb-0.5 text-[11px]">来访者觉察突破：</strong>
              <p className="bg-[#FAF8F5] p-2.5 rounded-[12px] border border-[#ECE6DC] text-[11px]">{generatedSummary.insights}</p>
            </div>

            <div>
              <strong className="text-[#7A756C] block mb-0.5 text-[11px]">课后觉察练习：</strong>
              <p className="bg-[#FAF8F5] p-2.5 rounded-[12px] border border-[#ECE6DC] text-[11px]">{generatedSummary.homework}</p>
            </div>

            <div>
              <strong className="text-[#7A756C] block mb-0.5 text-[11px]">下一次咨询方向与建议：</strong>
              <p className="bg-[#FAF8F5] p-2.5 rounded-[12px] border border-[#ECE6DC] text-[11px]">{generatedSummary.nextPlan}</p>
            </div>

            {/* Post Consultation Automated Actions */}
            <div className="pt-2 border-t border-[#ECE6DC] space-y-2">
              <div className="text-[10px] font-bold text-[#6750A4] flex items-center justify-between">
                <span>咨询结案自动触发闭环：</span>
                <span className="text-[#A23F1E]">系统自动打款解冻</span>
              </div>

              <div className="bg-white border border-[#E6E0D6] rounded-[20px] p-4 shadow-2xs space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6750A4]/5 rounded-full blur-2xl pointer-events-none" />
                
                <h4 className="text-xs font-bold text-[#7A756C] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#6750A4]" />
                  AI 智能推荐下一步 (SOP)
                </h4>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => alert(`已为来访者【${order.clientName}】布置课后行为观察作业！`)}
                    className="p-2 rounded-[12px] bg-[#FAF8F5] text-[#6750A4] border border-[#ECE6DC] font-medium text-left hover:bg-[#E8E2D5] transition"
                  >
                    <div className="font-bold">1. 布置课后作业</div>
                    <div className="text-[9px] opacity-80 mt-0.5">行为观察/情绪日记</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`已为来访者【${order.clientName}】生成并推荐《下次咨询 (9折优惠卡)》！`)}
                    className="p-2 rounded-[12px] bg-[#FAF8F5] text-[#6750A4] border border-[#D0BCFF] font-medium text-left hover:bg-[#E8E2D5] transition"
                  >
                    <div className="font-bold">2. 发送复诊推荐卡</div>
                    <div className="text-[9px] opacity-80 mt-0.5">推荐下次咨询</div>
                  </button>
                </div>
              </div>

              <div className="p-2 rounded-[12px] bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] flex items-center justify-between font-mono">
                <span>自动财务结算解冻：</span>
                <strong className="text-[#6750A4]">+¥{(order.price * 0.9).toFixed(2)} (已扣除平台10%服务费)</strong>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[#ECE6DC]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-[#E6E0D6] bg-white text-xs font-semibold text-[#49463D] hover:bg-[#E8E2D5]"
          >
            取消
          </button>

          {generatedSummary && (
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-full bg-[#6750A4] text-white text-xs font-semibold hover:bg-[#594294] shadow-2xs flex items-center gap-1.5 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>保存至电子档案</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
