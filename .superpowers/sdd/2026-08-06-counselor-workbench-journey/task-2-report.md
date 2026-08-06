# Task 2 report — Project serialized counselor journeys

## 修改摘要

- 新增 `buildCounselorJourneys(orders, tasks)` 纯函数，将每笔订单的咨询师业务任务投影为固定四步旅程。
- 固定阶段顺序为确认预约、查阅资料、开始咨询、确认总结；按阶段而非输入任务数组顺序确定唯一当前节点。
- 未填写资料时将查阅资料标记为 `skipped`；不同订单（即使共享 `clientId`）保持独立旅程。

## RED

命令：`node --import tsx --test src/workbenchJourney.test.ts`

结果：失败（退出码 1），因为 `src/workbenchJourney.ts` 不存在，导入报 `ERR_MODULE_NOT_FOUND`。该失败证明目标接口尚未实现。

## GREEN

命令：`node --import tsx --test src/workbenchJourney.test.ts`

结果：5/5 通过，0 失败。

附加验证：

- `npx tsc --noEmit`：通过，0 诊断。
- `npm test`：36/36 通过，0 失败。
- `npm run build`：通过。Vite 输出既有的大 chunk 警告，但不影响构建完成。
- `git diff --check`：通过。

## 覆盖状态

- 已覆盖：待确认预约、已填资料的查阅资料优先级、未填资料跳过、开始咨询、会谈完成后的总结确认、同一来访者的多订单独立成链。
- 测试直接使用文字面状态数组断言，且将后续房间任务置于前面以验证阶段排序不依赖输入顺序。

## 文件清单

- `src/workbenchJourney.ts`
- `src/workbenchJourney.test.ts`
- `.superpowers/sdd/2026-08-06-counselor-workbench-journey/task-2-report.md`

## Commit

`feat: serialize counselor workbench journeys`

## Self-review

- 仅接受四种咨询师业务任务，故客户端任务和已移除的成长任务不会生成旅程。
- 仅 `pending` 或 `in_progress` 的咨询师任务可使订单显示为待办；已完成业务链不会重复展示。
- 旅程按 `order.id` 过滤任务，避免同一来访者的多次会谈串场。
- 每个返回旅程恰有一个 `currentTask` 和四个固定步骤。

## Concerns

无。
