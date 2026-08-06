# Task 1 report — Simplify workflow to required summary tasks

## 修改摘要

- 会谈结束后仅创建 `complete_session_review` 咨询师总结任务。
- 总结提交仅校验 `clinicalSummary` 与 `clientSummary`；专业自评不再阻塞提交。
- 移除 `WorkflowTaskType` 中的 `counselor_reflection`，并在读取本地持久化工作流时清理遗留的该类任务。
- 为上述行为添加回归测试。

## RED

命令：`node --import tsx --test src/consultationWorkflow.test.ts`

预期失败：旧实现会创建 `counselor_reflection`，空自评会阻塞提交，且 `normalizeConsultationWorkflow` 尚未导出。

实际结果：失败，因模块未导出 `normalizeConsultationWorkflow`（`SyntaxError: ... does not provide an export named 'normalizeConsultationWorkflow'`），证明新接口在实现前不存在。

## GREEN

命令：`node --import tsx --test src/consultationWorkflow.test.ts`

结果：11/11 通过。

附加验证：`npm test` 通过，31/31 测试通过；`git diff --check` 通过。

## 文件清单

- `src/consultationWorkflow.test.ts`
- `src/consultationWorkflow.ts`
- `src/types.ts`
- `src/client-app/store.ts`
- `.superpowers/sdd/2026-08-06-counselor-workbench-journey/task-1-report.md`

## Commit

`5d11978 simplify counselor summary workflow`

## Self-review

- 结束会谈的任务列表由测试精确断言为仅一个必需总结任务。
- 空专业自评下提交成功由真实工作流 API 覆盖。
- 遗留任务由 normalizer 的输出行为覆盖，并已接入结构校验后的本地存储加载路径。
- 实现仅包含 brief 要求的最小改动，没有更改专业自评草稿字段或其 UI。

## Concerns

`npm run lint` 仍失败：`src/components/Workbench/WorkbenchTasks.tsx` 有两处对已移除 `counselor_reflection` 类型的引用。该文件不在本 Task brief 指定的可修改范围内，故未改动；后续任务需要同步移除其 descriptor 和任务类型比较，才能恢复 TypeScript 全量检查。

## Fix round 1 — Workbench legacy task cleanup

### 修改摘要

- 移除 `WorkbenchTasks` 中遗留的 `counselor_reflection` descriptor。
- 将 `isReview` 限定为仅识别 `complete_session_review`。
- 未实现旅程卡或任何 Task 4 页面改造。

### RED / 根因复现

命令：`npm run lint`

结果：失败（退出码 2）。`tsc --noEmit` 报告 `WorkbenchTasks.tsx` 第 44 行的未知 descriptor 键（TS2353）及第 68 行的无重叠任务类型比较（TS2367）。根因是 `WorkflowTaskType` 已移除 `counselor_reflection`，而工作台仍引用该旧值。

### 验证

命令：

```sh
npm run lint
node --import tsx --test src/consultationWorkflow.test.ts
```

完整结果：

- `npm run lint`：通过（退出码 0，`tsc --noEmit` 无诊断）。
- `node --import tsx --test src/consultationWorkflow.test.ts`：11/11 通过，0 失败：
  - ending a session creates only the required counselor summary task
  - professional reflection does not block summary submission
  - normalizing stored workflow removes legacy counselor reflection tasks
  - saving a review keeps settlement locked and does not create a client card
  - submitting a valid review atomically updates tasks, cards, archive, and settlement
  - submitting an incomplete review preserves the draft and settlement hold
  - submitting twice is idempotent
  - order states seed the matching actor tasks
  - ending a scheduled session completes the room-entry task
  - confirming a booking completes confirmation and creates intake and room tasks
  - mock session evidence is traceable and ready for a review draft

### Concerns

无。此前的 TypeScript 工作台遗留引用已清理。
