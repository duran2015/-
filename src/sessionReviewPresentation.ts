import type { SessionReviewDraft } from "./types";

export type ReviewProgress = {
  completed: number;
  total: number;
  percentage: number;
  missingSections: Array<"clinical" | "client" | "reflection">;
};

export function getReviewProgress(draft: SessionReviewDraft): ReviewProgress {
  const clinical = draft.clinicalSummary;
  const client = draft.clientSummary;
  const reflection = draft.counselorReflection;
  const sections = {
    clinical:
      Boolean(clinical.mainConcern.trim()) &&
      Boolean(clinical.clientState.trim()) &&
      clinical.interventions.length > 0 &&
      Boolean(clinical.observations.trim()) &&
      Boolean(clinical.riskReview.trim()) &&
      Boolean(clinical.nextPlan.trim()),
    client:
      Boolean(client.recap.trim()) &&
      client.actionItems.length > 0 &&
      Boolean(client.nextPlan.trim()),
    reflection:
      Boolean(reflection.allianceQuality) &&
      Boolean(reflection.goalProgress) &&
      Boolean(reflection.reflection.trim()),
  };
  const missingSections = (Object.entries(sections) as Array<[keyof typeof sections, boolean]>)
    .filter(([, complete]) => !complete)
    .map(([section]) => section);
  const completed = Object.values(sections).filter(Boolean).length;
  return {
    completed,
    total: 3,
    percentage: Math.round((completed / 3) * 100),
    missingSections,
  };
}

export function getClientReviewProjection(draft: SessionReviewDraft) {
  return {
    recap: draft.clientSummary.recap,
    actionItems: [...draft.clientSummary.actionItems],
    nextPlan: draft.clientSummary.nextPlan,
  };
}
