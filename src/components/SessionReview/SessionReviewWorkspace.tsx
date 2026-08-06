import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileLock2,
  LockKeyhole,
  MessageSquareText,
  Save,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { useAppStore } from "../../client-app/store";
import { getReviewProgress } from "../../sessionReviewPresentation";
import type { SessionReviewDraft, SessionInsight } from "../../types";

type ReviewTab = "evidence" | "clinical" | "client";

interface SessionReviewWorkspaceProps {
  draftId: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

const tabItems: Array<{ id: ReviewTab; label: string; shortLabel: string }> = [
  { id: "evidence", label: "AI 证据", shortLabel: "证据" },
  { id: "clinical", label: "临床总结", shortLabel: "临床" },
  { id: "client", label: "用户回顾", shortLabel: "分享" },
];

const fieldClass =
  "mt-2 w-full rounded-[18px] border border-[#CAC4D0] bg-white px-4 py-3 text-[13px] leading-6 text-[#1D1B20] outline-none transition focus:border-[#6750A4] focus:ring-2 focus:ring-[#6750A4]/15 disabled:bg-[#F2F0F4] disabled:text-[#79747E]";

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  hint?: string;
}) => (
  <label className="block">
    <span className="text-[12px] font-bold text-[#49454F]">{label}</span>
    {hint && <span className="ml-2 text-[10px] text-[#79747E]">{hint}</span>}
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={fieldClass}
    />
  </label>
);

const EvidenceCard = ({
  insight,
  active,
  onClick,
}: {
  insight: SessionInsight;
  active: boolean;
  onClick: () => void;
}) => {
  const categoryLabel = {
    topic: "核心议题",
    emotion: "情绪线索",
    intervention: "干预效果",
    risk: "风险观察",
    plan: "后续计划",
  }[insight.category];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[22px] border p-4 text-left transition ${
        active
          ? "border-[#6750A4] bg-[#F3EDF7] shadow-sm"
          : "border-[#E7E0EC] bg-white active:bg-[#F7F2FA]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex rounded-full bg-[#EADDFF] px-2.5 py-1 text-[10px] font-black text-[#4F378B]">
            {categoryLabel}
          </div>
          <h3 className="text-[14px] font-black text-[#1D1B20]">{insight.title}</h3>
        </div>
        <span className="shrink-0 text-[10px] font-bold text-[#79747E]">
          {Math.round(insight.confidence * 100)}%
        </span>
      </div>
      <p className="mt-2 text-[12px] leading-5 text-[#49454F]">{insight.detail}</p>
      <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[#6750A4]">
        查看 {insight.sourceIds.length} 条来源 <ChevronRight size={13} />
      </div>
    </button>
  );
};

export function SessionReviewWorkspace({ draftId, onClose, onSubmitted }: SessionReviewWorkspaceProps) {
  const {
    consultationWorkflow,
    orders,
    saveSessionReview,
    submitSessionReview,
  } = useAppStore();
  const storedDraft = consultationWorkflow.reviewDrafts.find((item) => item.id === draftId);
  const [draft, setDraft] = useState<SessionReviewDraft | null>(storedDraft || null);
  const [activeTab, setActiveTab] = useState<ReviewTab>("evidence");
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (storedDraft) setDraft(storedDraft);
  }, [storedDraft?.version, storedDraft?.status]);

  const snapshot = storedDraft
    ? consultationWorkflow.snapshots[storedDraft.sessionId]
    : undefined;
  const order = storedDraft
    ? orders.find((item) => item.id === storedDraft.orderId)
    : undefined;
  const isSubmitted = draft?.status === "submitted";
  const progress = draft ? getReviewProgress(draft) : null;
  const selectedInsight = snapshot?.insights.find((item) => item.id === selectedInsightId);
  const selectedSourceIds = useMemo(
    () => new Set(selectedInsight?.sourceIds || []),
    [selectedInsight],
  );

  if (!draft || !storedDraft) {
    return (
      <div className="fixed inset-0 z-[300] grid place-items-center bg-[#FFFBFE] p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto text-[#BA1A1A]" />
          <p className="mt-3 text-sm font-bold">未找到本次咨询总结</p>
          <button onClick={onClose} className="mt-4 rounded-full bg-[#6750A4] px-5 py-2.5 text-sm font-bold text-white">
            返回工作台
          </button>
        </div>
      </div>
    );
  }

  const updateClinical = (patch: Partial<SessionReviewDraft["clinicalSummary"]>) =>
    setDraft((current) =>
      current
        ? { ...current, clinicalSummary: { ...current.clinicalSummary, ...patch } }
        : current,
    );
  const updateClient = (patch: Partial<SessionReviewDraft["clientSummary"]>) =>
    setDraft((current) =>
      current ? { ...current, clientSummary: { ...current.clientSummary, ...patch } } : current,
    );
  const handleSave = () => {
    saveSessionReview(draft.id, {
      clinicalSummary: draft.clinicalSummary,
      clientSummary: draft.clientSummary,
    });
    setFeedback("草稿已保存，结算将在正式提交后解锁");
    window.setTimeout(() => setFeedback(""), 2200);
  };

  const handleSubmit = () => {
    const result = submitSessionReview(draft.id, {
      clinicalSummary: draft.clinicalSummary,
      clientSummary: draft.clientSummary,
    });
    if (!result.ok) {
      setFeedback(result.errors.join("；"));
      setShowSubmitDialog(false);
      return;
    }
    setShowSubmitDialog(false);
    setFeedback("总结已归档，用户回顾已发送，T+1 结算已解锁");
    onSubmitted?.();
  };

  return (
    <div className="fixed inset-0 z-[300] flex justify-center bg-[#E7E0EC]/70 sm:p-4">
      <div className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden bg-[#FFFBFE] sm:rounded-[28px] sm:shadow-2xl">
        <header className="shrink-0 border-b border-[#E7E0EC] bg-[#FFFBFE]/95 px-4 pb-3 pt-[max(14px,env(safe-area-inset-top))] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button onClick={onClose} aria-label="返回" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#49454F] active:bg-[#E8DEF8]">
              <ArrowLeft size={22} />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-[18px] font-black text-[#1D1B20]">咨询总结</h1>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${isSubmitted ? "bg-[#C4EED0] text-[#163723]" : "bg-[#EADDFF] text-[#4F378B]"}`}>
                  {isSubmitted ? "已提交" : "AI 草稿"}
                </span>
              </div>
              <p className="truncate text-[11px] text-[#79747E]">
                {order?.clientName} · {order?.bookingDate} {order?.bookingTimeSlot}
              </p>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-black text-[#6750A4]">{progress?.percentage}%</div>
              <div className="text-[9px] text-[#79747E]">{progress?.completed}/2 已完整</div>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E8DEF8]">
            <div className="h-full rounded-full bg-[#6750A4] transition-all" style={{ width: `${progress?.percentage || 0}%` }} />
          </div>
        </header>

        <div className={`mx-4 mt-3 flex shrink-0 items-start gap-3 rounded-[20px] border p-3.5 ${isSubmitted ? "border-[#A8D5B5] bg-[#E6F5EA]" : "border-[#FFDDB3] bg-[#FFF4E4]"}`}>
          {isSubmitted ? <CheckCircle2 className="mt-0.5 shrink-0 text-[#25683B]" size={19} /> : <LockKeyhole className="mt-0.5 shrink-0 text-[#8A5100]" size={19} />}
          <div>
            <p className={`text-[12px] font-black ${isSubmitted ? "text-[#163723]" : "text-[#5D3A00]"}`}>
              {isSubmitted ? "总结已归档 · T+1 结算已解锁" : "待完成总结 · 本单结算暂锁定"}
            </p>
            <p className={`mt-1 text-[10px] leading-4 ${isSubmitted ? "text-[#376847]" : "text-[#765725]"}`}>
              {isSubmitted ? "用户仅收到“用户回顾”内容，内部临床记录不会对外展示。" : "保存草稿不会发送给用户；正式提交后将同步 IM 卡片并进入结算。"}
            </p>
          </div>
        </div>

        <nav className="mx-4 mt-3 grid shrink-0 grid-cols-3 rounded-full bg-[#F3EDF7] p-1">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-1 py-2 text-[11px] font-black transition ${activeTab === tab.id ? "bg-white text-[#4F378B] shadow-sm" : "text-[#79747E]"}`}
              title={tab.label}
            >
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto px-4 pb-32 pt-4">
          {activeTab === "evidence" && (
            <div className="space-y-4">
              <section className="rounded-[24px] bg-[#EADDFF] p-5 text-[#21005D]">
                <div className="flex items-center gap-2"><Sparkles size={18} /><h2 className="text-[15px] font-black">AI 会谈线索</h2></div>
                <p className="mt-2 text-[11px] leading-5 opacity-80">所有结论均保留转录或随手记来源。AI 内容仅供辅助，提交前需由咨询师复核。</p>
              </section>
              <div className="space-y-3">
                {snapshot?.insights.map((insight) => (
                  <EvidenceCard key={insight.id} insight={insight} active={selectedInsightId === insight.id} onClick={() => setSelectedInsightId(selectedInsightId === insight.id ? null : insight.id)} />
                ))}
              </div>
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-[14px] font-black"><MessageSquareText size={17} className="text-[#6750A4]" />实时转录</h2>
                  <span className="text-[10px] text-[#79747E]">Mock · {snapshot?.transcript.length || 0} 条</span>
                </div>
                <div className="space-y-2">
                  {snapshot?.transcript.map((segment) => (
                    <div key={segment.id} className={`rounded-[18px] border p-3.5 transition ${selectedSourceIds.has(segment.id) ? "border-[#6750A4] bg-[#F3EDF7]" : "border-[#E7E0EC] bg-white"}`}>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-black text-[#49454F]">{segment.speakerName}</span>
                        <span className="text-[#79747E]">{Math.floor(segment.startsAtSeconds / 60).toString().padStart(2, "0")}:{(segment.startsAtSeconds % 60).toString().padStart(2, "0")}</span>
                      </div>
                      <p className="mt-1.5 text-[12px] leading-5 text-[#1D1B20]">{segment.text}</p>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-[14px] font-black"><ClipboardCheck size={17} className="text-[#6750A4]" />咨询师随手记</h2>
                <div className="space-y-2">
                  {snapshot?.notes.map((note) => (
                    <div key={note.id} className={`rounded-[18px] border p-3.5 text-[12px] leading-5 ${selectedSourceIds.has(note.id) ? "border-[#6750A4] bg-[#F3EDF7]" : "border-[#E7E0EC] bg-white"}`}>{note.text}</div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === "clinical" && (
            <div className="space-y-5">
              <section className="rounded-[22px] border border-[#D0BCFF] bg-[#F7F2FA] p-4">
                <div className="flex items-center gap-2 text-[#4F378B]"><FileLock2 size={18} /><h2 className="text-[14px] font-black">内部临床记录</h2></div>
                <p className="mt-2 text-[11px] leading-5 text-[#6750A4]">仅咨询师及获授权的专业支持角色可见，不会通过用户 IM 分享。</p>
              </section>
              <Field label="主要议题" value={draft.clinicalSummary.mainConcern} onChange={(value) => updateClinical({ mainConcern: value })} disabled={isSubmitted} />
              <Field label="来访者状态" value={draft.clinicalSummary.clientState} onChange={(value) => updateClinical({ clientState: value })} disabled={isSubmitted} />
              <Field label="干预方式" hint="每行一项" value={draft.clinicalSummary.interventions.join("\n")} onChange={(value) => updateClinical({ interventions: value.split("\n").map((item) => item.trim()).filter(Boolean) })} disabled={isSubmitted} />
              <Field label="专业观察" value={draft.clinicalSummary.observations} onChange={(value) => updateClinical({ observations: value })} disabled={isSubmitted} />
              <Field label="风险复核" value={draft.clinicalSummary.riskReview} onChange={(value) => updateClinical({ riskReview: value })} disabled={isSubmitted} />
              <Field label="后续专业计划" value={draft.clinicalSummary.nextPlan} onChange={(value) => updateClinical({ nextPlan: value })} disabled={isSubmitted} />
            </div>
          )}

          {activeTab === "client" && (
            <div className="space-y-5">
              <section className="rounded-[22px] border border-[#A8D5B5] bg-[#EAF7EE] p-4">
                <div className="flex items-center gap-2 text-[#25683B]"><UserRound size={18} /><h2 className="text-[14px] font-black">用户可见回顾</h2></div>
                <p className="mt-2 text-[11px] leading-5 text-[#376847]">正式提交后将作为消息卡片发送给用户，请使用清晰、支持性且避免诊断标签的表达。</p>
              </section>
              <Field label="本次回顾" value={draft.clientSummary.recap} onChange={(value) => updateClient({ recap: value })} disabled={isSubmitted} rows={5} />
              <Field label="会后行动" hint="每行一项" value={draft.clientSummary.actionItems.join("\n")} onChange={(value) => updateClient({ actionItems: value.split("\n").map((item) => item.trim()).filter(Boolean) })} disabled={isSubmitted} />
              <Field label="下次计划" value={draft.clientSummary.nextPlan} onChange={(value) => updateClient({ nextPlan: value })} disabled={isSubmitted} />
              <div className="rounded-[22px] border border-[#E7E0EC] bg-white p-4">
                <div className="mb-3 flex items-center gap-2 text-[12px] font-black text-[#49454F]"><MessageSquareText size={16} />IM 卡片预览</div>
                <div className="rounded-[20px] bg-[#F3EDF7] p-4">
                  <div className="text-[11px] font-black text-[#6750A4]">来自林木青咨询师</div>
                  <div className="mt-1 text-[15px] font-black">本次咨询回顾</div>
                  <p className="mt-2 line-clamp-3 text-[11px] leading-5 text-[#49454F]">{draft.clientSummary.recap}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-[#D0BCFF] pt-3 text-[11px] font-black text-[#6750A4]">查看回顾并评价 <ChevronRight size={15} /></div>
                </div>
              </div>
            </div>
          )}

        </main>

        <footer className="absolute inset-x-0 bottom-0 border-t border-[#E7E0EC] bg-[#FFFBFE]/95 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
          {feedback && <div className={`mb-2 rounded-[14px] px-3 py-2 text-center text-[11px] font-bold ${feedback.includes("请") ? "bg-[#FFDAD6] text-[#93000A]" : "bg-[#E6F5EA] text-[#25683B]"}`}>{feedback}</div>}
          {isSubmitted ? (
            <button onClick={onClose} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#6750A4] text-[14px] font-black text-white"><Check size={18} />完成并返回</button>
          ) : (
            <div className="flex gap-3">
              <button onClick={handleSave} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#79747E] text-[13px] font-black text-[#6750A4]"><Save size={17} />保存稍后完成</button>
              <button onClick={() => setShowSubmitDialog(true)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#6750A4] text-[13px] font-black text-white shadow-lg shadow-[#6750A4]/20"><Send size={17} />提交并分享</button>
            </div>
          )}
        </footer>

        {showSubmitDialog && (
          <div className="absolute inset-0 z-20 flex items-end bg-black/35 p-4 backdrop-blur-sm sm:items-center">
            <div className="w-full rounded-[28px] bg-[#FFFBFE] p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-[16px] bg-[#EADDFF] text-[#4F378B]"><Send size={21} /></div>
                <button onClick={() => setShowSubmitDialog(false)} aria-label="关闭" className="grid h-10 w-10 place-items-center rounded-full active:bg-[#F3EDF7]"><X size={19} /></button>
              </div>
              <h2 className="mt-5 text-[20px] font-black">提交本次咨询总结？</h2>
              <p className="mt-2 text-[12px] leading-5 text-[#49454F]">提交后内部临床记录将归档，用户可见回顾会通过 IM 推送，同时本单进入 T+1 可结算状态。</p>
              <div className="mt-4 rounded-[18px] bg-[#FFF4E4] p-3 text-[11px] leading-5 text-[#765725]">请再次确认“用户回顾”中不含诊断标签、敏感专业判断或仅供内部使用的信息。</div>
              <button onClick={handleSubmit} className="mt-5 h-12 w-full rounded-full bg-[#6750A4] text-[14px] font-black text-white">确认提交并分享</button>
              <button onClick={() => setShowSubmitDialog(false)} className="mt-2 h-11 w-full rounded-full text-[13px] font-bold text-[#6750A4]">继续检查</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
