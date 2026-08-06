# Task 3 report — Counselor workbench journey cards

## Modification summary

- Replaced the flattened counselor task list with `buildCounselorJourneys(orders, workflowTasks)` inside `useMemo`; the heading counter now reports journey count.
- Rendered one Material 3-styled card per journey, each with the complete four-stage track and connectors.
- Represented completed, skipped, current, and locked phases with `Check`, muted `Minus`, numbered node, and `LockKeyhole`, respectively.
- Rendered only the current phase description and one action button. The callback mapping is confirmation → `onConfirmOrder`, intake → `onViewClientFile`, session → `onEnterRoom`, and summary → `onWriteSummary`.
- Renamed the summary action to `确认总结`; this component contains neither `复盘` nor `专业自评` wording.

## Verification

| Command | Result |
| --- | --- |
| `node --import tsx --test src/workbenchJourney.test.ts` | Pass — 5/5 journey projection tests passed. |
| `npm run lint` | Pass — `tsc --noEmit` completed without errors. |
| `npm run build` | Pass — Vite production build and server bundle completed. |
| `git diff --check` | Pass — no whitespace errors. |

## Files

- `src/components/Workbench/WorkbenchTasks.tsx`
- `.superpowers/sdd/2026-08-06-counselor-workbench-journey/task-3-report.md`

## Commit

- `fddc9b6 feat: render counselor workbench journeys`

## Self-review

- The component consumes the existing journey projection rather than duplicating the state-ordering logic.
- Every rendered journey contains exactly the four projected steps; future states have no button, so only `currentTask` is actionable.
- The four required action mappings and summary label were checked against the brief.
- The empty state remains when no active counselor journey is available.
- The existing focused projection tests cover task-order precedence, skipped intake, per-order isolation, confirmation, and summary states. No DOM test dependency was added, per task constraint.

## Concerns

- `npm run build` retains Vite's existing warning about a JavaScript chunk exceeding 500 kB after minification; the build exits successfully and this task does not alter bundling configuration.
