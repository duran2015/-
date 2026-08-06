import assert from "node:assert/strict";
import test from "node:test";

import {
  emptyWorkflowState,
  endSessionWorkflow,
  saveReviewDraft,
  seedWorkflowFromOrders,
  submitReviewDraft,
} from "./consultationWorkflow";
import type { Order, SessionReviewDraft, SessionSnapshot } from "./types";

const now = "2026-08-06T10:00:00.000Z";

const fixtureOrder: Order = {
  id: "order-1",
  orderNo: "KL20260806001",
  clientId: "client-1",
  clientName: "周明宇",
  clientAvatar: "avatar.png",
  serviceType: "50min_video",
  serviceTypeName: "50分钟视频咨询",
  bookingDate: "2026-08-06",
  bookingTimeSlot: "16:00 - 16:50",
  price: 500,
  status: "completed",
  complaintTopic: "工作压力与持续失眠",
  hasSummary: false,
  createdAt: now,
};

const fixtureSnapshot: SessionSnapshot = {
  durationSeconds: 50 * 60,
  transcript: [
    {
      id: "segment-1",
      sessionId: "session-order-1",
      speakerRole: "client",
      speakerName: "周明宇",
      text: "每天晚上都在想第二天的事情，完全失眠。",
      startsAtSeconds: 198,
      endsAtSeconds: 205,
      confidence: 0.96,
      highlightTerms: ["失眠"],
    },
  ],
  notes: [
    {
      id: "note-1",
      text: "工作压力导致失眠，自我价值感偏低。",
    },
  ],
  insights: [
    {
      id: "insight-1",
      sessionId: "session-order-1",
      category: "topic",
      title: "工作压力",
      detail: "持续工作压力影响睡眠。",
      sourceType: "transcript",
      sourceIds: ["segment-1"],
      confidence: 0.93,
    },
  ],
};

const validDraftPatch: Partial<SessionReviewDraft> = {
  clinicalSummary: {
    mainConcern: "工作要求变化引发焦虑与持续失眠。",
    clientState: "会谈初期紧绷，后半程逐渐稳定。",
    interventions: ["CBT 认知重构", "腹式呼吸"],
    observations: "能够识别自动化负面想法并尝试替代解释。",
    riskReview: "未发现即时自伤或他伤风险。",
    nextPlan: "继续练习边界表达并记录睡前自动想法。",
  },
  clientSummary: {
    recap: "本次梳理了工作压力、失眠与自我评价之间的联系。",
    actionItems: ["睡前记录一次自动想法", "练习 4-7-8 呼吸法"],
    nextPlan: "下次继续练习稳定表达需求。",
  },
  counselorReflection: {
    allianceQuality: "stable",
    goalProgress: "partial",
    reflection: "需要减少解释，增加情绪体验停留时间。",
  },
};

test("ending a session creates one review, two counselor tasks, one card, and a settlement hold", () => {
  const ended = endSessionWorkflow(
    emptyWorkflowState(),
    fixtureOrder,
    fixtureSnapshot,
    now,
  );

  assert.equal(ended.reviewDrafts.length, 1);
  assert.deepEqual(
    ended.tasks.map((task) => task.taskType),
    ["complete_session_review", "counselor_reflection"],
  );
  assert.equal(ended.messages[0].audience, "counselor");
  assert.equal(ended.messages[0].draftId, ended.reviewDrafts[0].id);
  assert.equal(ended.settlements[fixtureOrder.id], "blocked_by_summary");
});

test("saving a review keeps settlement locked and does not create a client card", () => {
  const ended = endSessionWorkflow(emptyWorkflowState(), fixtureOrder, fixtureSnapshot, now);
  const saved = saveReviewDraft(ended, "draft-order-1", validDraftPatch, now);

  assert.equal(saved.reviewDrafts[0].status, "draft");
  assert.equal(saved.messages.some((message) => message.audience === "client"), false);
  assert.equal(saved.settlements[fixtureOrder.id], "blocked_by_summary");
});

test("submitting a valid review atomically updates tasks, cards, archive, and settlement", () => {
  const ended = endSessionWorkflow(emptyWorkflowState(), fixtureOrder, fixtureSnapshot, now);
  const saved = saveReviewDraft(ended, "draft-order-1", validDraftPatch, now);
  const result = submitReviewDraft(saved, "draft-order-1", now);

  assert.equal(result.ok, true);
  assert.equal(result.state.settlements[fixtureOrder.id], "eligible_t1");
  assert.equal(
    result.state.tasks
      .filter((task) => task.actorRole === "counselor")
      .every((task) => task.status === "completed"),
    true,
  );
  assert.equal(result.state.messages.filter((message) => message.audience === "client").length, 1);
  assert.equal(result.state.messages.filter((message) => message.audience === "counselor").length, 1);
  assert.equal(result.state.messages.find((message) => message.audience === "counselor")?.status, "submitted");
  assert.equal(result.state.archivedReviews.length, 1);
});

test("submitting an incomplete review preserves the draft and settlement hold", () => {
  const ended = endSessionWorkflow(emptyWorkflowState(), fixtureOrder, fixtureSnapshot, now);
  const result = submitReviewDraft(ended, "draft-order-1", now);

  assert.equal(result.ok, false);
  assert.equal(result.errors.includes("请完善临床总结"), true);
  assert.equal(result.state.reviewDrafts[0].status, "draft");
  assert.equal(result.state.settlements[fixtureOrder.id], "blocked_by_summary");
});

test("submitting twice is idempotent", () => {
  const ended = endSessionWorkflow(emptyWorkflowState(), fixtureOrder, fixtureSnapshot, now);
  const saved = saveReviewDraft(ended, "draft-order-1", validDraftPatch, now);
  const once = submitReviewDraft(saved, "draft-order-1", now).state;
  const twice = submitReviewDraft(once, "draft-order-1", now).state;

  assert.equal(twice.messages.length, once.messages.length);
  assert.equal(twice.archivedReviews.length, once.archivedReviews.length);
});

test("order states seed the matching actor tasks", () => {
  const pending = { ...fixtureOrder, id: "pending", status: "pending_confirm" as const };
  const scheduled = { ...fixtureOrder, id: "scheduled", status: "scheduled" as const };
  const state = seedWorkflowFromOrders([pending, scheduled, fixtureOrder], now);
  const types = state.tasks.map((task) => task.taskType);

  assert.equal(types.includes("confirm_booking"), true);
  assert.equal(types.includes("complete_intake"), true);
  assert.equal(types.includes("enter_session"), true);
  assert.equal(types.includes("complete_session_review"), true);
  assert.equal(types.includes("counselor_reflection"), true);
});
