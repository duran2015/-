import test from 'node:test';
import assert from 'node:assert/strict';
import { addDays, adoptPlan, emptyState, entrySummary, generatePlan, migrateTasks, mockPlans, parsePublishState, planStatus, publishKey, taskError, validDate, withPrototypeMocks, type PlanPreferences, type Scenario } from './components/Growth/publishPlans';
const now = '2026-09-10';
const prefs: PlanPreferences = { start: now, end: '2026-09-16', topic: '晋升与沟通', channels: ['公众号', '小红书'], formats: ['文章', '图文'], count: 4, weekdays: [1, 4] };
test('generation respects chosen topic, channels, forms, count and weekdays without adopting', () => {
  const plan = generatePlan(prefs, 'p1', now);
  assert.equal(plan.status, 'suggested'); assert.equal(plan.tasks.length, 4);
  for (const t of plan.tasks) { assert.ok(t.title.includes(prefs.topic)); assert.ok(prefs.channels.includes(t.channel)); assert.ok(prefs.formats.includes(t.format)); assert.ok(prefs.weekdays.includes(new Date(t.date + 'T12:00:00').getDay())); }
});
test('invalid date, empty choices, oversized ranges and unavailable weekdays reject generation', () => {
  assert.equal(validDate('2026-02-30'), false);
  for (const patch of [{ start: '2026-09-09' }, { channels: [] }, { formats: [] }, { topic: ' ' }, { count: 0 }, { end: '2026-12-01' }, { end: now, weekdays: [1] }]) assert.throws(() => generatePlan({ ...prefs, ...patch }, 'x', now));
});
test('partial adoption creates only selected tasks, preserves earlier tasks, and cannot run twice', () => {
  const p = generatePlan(prefs, 'p', now); const base = mockPlans('manual', now); base.plans.push(p);
  const original = JSON.stringify(base); const adopted = adoptPlan(base, 'p', [p.tasks[0].id], now);
  assert.equal(adopted.tasks.length, base.tasks.length + 1); assert.equal(adopted.plans[0].status, 'accepted');
  assert.equal(JSON.stringify(base), original); assert.throws(() => adoptPlan(adopted, 'p', [p.tasks[0].id], now));
});
test('empty, expired and past-date selections do not create tasks', () => {
  const s = mockPlans('expiredSuggestion', now); const p = s.plans[0];
  assert.throws(() => adoptPlan(s, p.id, p.tasks.map(t => t.id), now)); assert.equal(s.tasks.length, 0);
  const fresh = mockPlans('suggestion', now); assert.throws(() => adoptPlan(fresh, fresh.plans[0].id, [], now));
  fresh.plans[0].tasks[0].date = addDays(now, -1);
  assert.throws(() => adoptPlan(fresh, fresh.plans[0].id, [fresh.plans[0].tasks[0].id], now));
});
test('calendar period and task completion are separate including end-date boundary', () => {
  const s = mockPlans('completed', now); const p = s.plans[0];
  assert.equal(planStatus(s, p, now), '已完成'); assert.equal(planStatus(s, p, p.end), '已完成'); assert.equal(planStatus(s, p, addDays(p.end, 1)), '已结束');
  const future = mockPlans('upcoming', now); assert.equal(planStatus(future, future.plans[0], now), '未开始');
});
test('migration preserves provenance and does not double count or remigrate an old task', () => {
  const s = mockPlans('expired', now); const t = s.tasks.find(t => t.status === 'todo')!;
  const moved = migrateTasks(s, [t.id], now, now, () => 'new-task');
  assert.equal(moved.tasks.find(x => x.id === t.id)?.status, 'moved');
  const copy = moved.tasks.find(x => x.id === 'new-task')!;
  assert.equal(copy.originId, t.id); assert.equal(copy.planId, undefined); assert.equal(copy.date, now);
  assert.equal(moved.tasks.filter(x => x.status === 'todo').length, s.tasks.filter(x => x.status === 'todo').length);
  assert.throws(() => migrateTasks(moved, [t.id], now, now)); assert.throws(() => migrateTasks(s, [t.id], addDays(now, -1), now));
});
test('manual task validates title, date, link and plan boundaries', () => {
  const s = mockPlans('active', now); const t = { ...s.tasks[1], title: '发布沟通清单', date: now, status: 'todo' as const };
  assert.equal(taskError(t, s, now), ''); assert.match(taskError({ ...t, title: ' ' }, s, now), /标题/);
  assert.match(taskError({ ...t, date: '2026-11-01' }, s, now), /不在/);
  assert.equal(taskError({ ...t, date: '2026-11-01', planId: undefined }, s, now), '');
  assert.match(taskError({ ...t, contentUrl: 'javascript:alert(1)' }, s, now), /链接/);
});
test('all eight mock states exist and default prototype includes suggestion and history, sandbox storage keys are separate', () => {
  const names: Scenario[] = ['empty', 'suggestion', 'active', 'upcoming', 'expired', 'expiredSuggestion', 'completed', 'manual'];
  for (const name of names) assert.deepEqual(parsePublishState(JSON.stringify(mockPlans(name, now))), JSON.parse(JSON.stringify(mockPlans(name, now))));
  const real = mockPlans('real', now);
  assert.equal(real.plans.filter(p => p.status === 'suggested').length, 1);
  assert.equal(real.plans.filter(p => p.status === 'accepted' && p.end < now).length, 2);
  assert.equal(real.tasks.filter(t => t.status === 'done').length, 4);
  assert.equal(real.tasks.filter(t => t.status === 'todo').length, 2);
  assert.notEqual(publishKey('c1', 'real'), publishKey('c1', 'active')); assert.notEqual(publishKey('c1', 'real'), publishKey('c2', 'real'));
});
test('entry labels come from actual state rather than fixed pending counts', () => {
  assert.match(entrySummary(emptyState(), now), /暂无/); assert.match(entrySummary(mockPlans('suggestion', now), now), /建议/);
  assert.match(entrySummary(mockPlans('active', now), now), /待完成/); assert.match(entrySummary(mockPlans('expired', now), now), /已结束/);
  assert.match(entrySummary(mockPlans('completed', now), now), /已完成/); assert.match(entrySummary(mockPlans('manual', now), now), /手动/);
});
test('prototype fixtures are added to existing arrangements without overwrite or duplication', () => {
  const existing = mockPlans('active', now);
  const merged = withPrototypeMocks(existing, now);
  assert.deepEqual(merged.plans.slice(0, existing.plans.length), existing.plans);
  assert.deepEqual(merged.tasks.slice(0, existing.tasks.length), existing.tasks);
  assert.equal(merged.plans.filter(p => p.status === 'suggested').length, 1);
  assert.equal(merged.plans.filter(p => p.status === 'accepted' && p.end < now).length, 2);
  assert.deepEqual(withPrototypeMocks(merged, now), merged);
});
test('corrupt persistent records fail explicitly instead of being silently overwritten', () => {
  assert.throws(() => parsePublishState('{')); assert.throws(() => parsePublishState('{"version":1,"plans":[],"tasks":[{}]}'));
  assert.throws(() => parsePublishState('{"version":8,"plans":[],"tasks":[]}'));
});
