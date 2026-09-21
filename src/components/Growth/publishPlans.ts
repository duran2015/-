export type PublishTask = { id: string; title: string; date: string; channel: string; format: string; note: string; contentUrl: string; status: 'todo' | 'done' | 'cancelled' | 'moved'; planId?: string; originId?: string; movedTo?: string };
export type PublishPlan = { id: string; start: string; end: string; topic: string; status: 'suggested' | 'accepted' | 'dismissed'; tasks: PublishTask[] };
export type PublishState = { version: 1; plans: PublishPlan[]; tasks: PublishTask[] };
export type PlanPreferences = { start: string; end: string; topic: string; channels: string[]; formats: string[]; count: number; weekdays: number[] };
export const scenarios = { real: '我的安排', empty: '全新咨询师', suggestion: '待采纳建议', active: '当前有效计划', upcoming: '尚未开始', expired: '已过期计划', expiredSuggestion: '已过期建议', completed: '全部完成', manual: '仅手动任务' };
export type Scenario = keyof typeof scenarios;
export const today = () => localDate(new Date());
function localDate(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function addDays(date: string, count: number) { const d = new Date(`${date}T12:00:00`); d.setDate(d.getDate() + count); return localDate(d); }
export function validDate(date: string) { return /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(new Date(`${date}T12:00:00`).getTime()) && localDate(new Date(`${date}T12:00:00`)) === date; }
export const uid = (): string => crypto.randomUUID();
export const emptyState = (): PublishState => ({ version: 1, plans: [], tasks: [] });
export function planTasks(state: PublishState, plan: PublishPlan) { return state.tasks.filter(t => t.planId === plan.id); }
export function planStatus(state: PublishState, plan: PublishPlan, now = today()) {
  if (plan.status === 'dismissed') return '已放弃';
  if (plan.status === 'suggested') return plan.end < now ? '建议已过期' : '待采纳';
  if (plan.end < now) return '已结束';
  if (plan.start > now) return '未开始';
  const tasks = planTasks(state, plan).filter(t => t.status !== 'cancelled');
  if (!tasks.length) return '无待办';
  return tasks.every(t => t.status === 'done' || t.status === 'moved') ? '已完成' : '进行中';
}
export function generatePlan(p: PlanPreferences, id = uid(), now = today()): PublishPlan {
  if (!validDate(p.start) || !validDate(p.end) || p.start < now || p.end < p.start || p.end > addDays(p.start, 30)) throw Error('请选择今天起、最长31天的有效周期。');
  if (!p.topic.trim() || !p.channels.length || !p.formats.length || !Number.isInteger(p.count) || p.count < 1 || p.count > 14) throw Error('请填写主题，至少选择一个渠道和内容形式，数量为1—14项。');
  const dates: string[] = [];
  for (let d = p.start; d <= p.end; d = addDays(d, 1)) if (!p.weekdays.length || p.weekdays.includes(new Date(`${d}T12:00:00`).getDay())) dates.push(d);
  if (!dates.length) throw Error('所选周期内没有偏好的发布日，请调整日期或星期。');
  const angles = ['一个常见困扰与自我观察问题', '可以尝试的日常练习', '一份沟通准备清单', '常见误解与支持边界'];
  return { id, start: p.start, end: p.end, topic: p.topic.trim(), status: 'suggested', tasks: Array.from({ length: p.count }, (_, i) => ({ id: `${id}-${i}`, planId: id, title: `${p.topic.trim()}：${angles[i % angles.length]}`, date: dates[Math.floor(i * dates.length / p.count)], channel: p.channels[i % p.channels.length], format: p.formats[i % p.formats.length], note: `依据你选择的「${p.topic.trim()}」、${p.count}项内容及发布日偏好安排。`, contentUrl: '', status: 'todo' })) };
}
export function adoptPlan(state: PublishState, id: string, selected: string[], now = today()): PublishState {
  const plan = state.plans.find(p => p.id === id);
  if (!plan || plan.status !== 'suggested') throw Error('这份建议已处理，请返回查看当前安排。');
  const tasks = plan.tasks.filter(t => selected.includes(t.id));
  if (!tasks.length) throw Error('请至少选择一项，也可以稍后再看或放弃建议。');
  if (plan.end < now || tasks.some(t => t.date < now || t.date < plan.start || t.date > plan.end)) throw Error('部分日期已过或超出周期，请调整后再采纳。');
  return { ...state, plans: state.plans.map(p => p.id === id ? { ...p, status: 'accepted', tasks: [] } : p), tasks: [...state.tasks, ...tasks] };
}
export function taskError(task: PublishTask, state: PublishState, now = today()) {
  if (!task.title.trim()) return '请填写任务标题。';
  if (!validDate(task.date) || task.date < now) return '请选择今天或之后的日期。';
  if (task.contentUrl && !/^https?:\/\/\S+$/.test(task.contentUrl)) return '内容链接须以 http:// 或 https:// 开头。';
  if (task.planId) { const p = state.plans.find(p => p.id === task.planId && p.status === 'accepted'); if (!p || task.date < p.start || task.date > p.end) return '任务日期不在所选计划内，请修改日期或选择“独立任务”。'; }
  return '';
}
export function migrateTasks(state: PublishState, ids: string[], date: string, now = today(), idFactory = uid): PublishState {
  if (!validDate(date) || date < now) throw Error('请选择今天或之后的日期。');
  const source = state.tasks.filter(t => ids.includes(t.id) && t.status === 'todo' && state.plans.some(p => p.id === t.planId && p.end < now));
  if (!source.length) throw Error('请先选择已结束计划中的未完成任务。');
  const copies = source.map(t => ({ ...t, id: idFactory(), date, planId: undefined, originId: t.id }));
  return { ...state, tasks: [...state.tasks.map(t => { const copy = copies.find(c => c.originId === t.id); return copy ? { ...t, status: 'moved' as const, movedTo: copy.id } : t; }), ...copies] };
}
export function entrySummary(state: PublishState, now = today()) {
  const current = state.plans.filter(p => p.status === 'accepted' && p.end >= now);
  const pending = state.tasks.filter(t => t.status === 'todo' && (!t.planId || current.some(p => p.id === t.planId)));
  if (current.length) return pending.length ? `${current[0].start.slice(5)}—${current[0].end.slice(5)} · ${pending.length}项待完成` : current.every(p => planStatus(state, p, now) === '已完成') ? '本期安排已完成 · 按自己的节奏继续' : '当前没有待完成任务 · 可查看已有安排';
  if (state.tasks.some(t => !t.planId)) return `${state.tasks.filter(t => !t.planId && t.status === 'todo').length}项待完成 · 手动安排`;
  if (state.plans.some(p => p.status === 'suggested')) return '有一份计划建议 · 查看后自主采纳';
  if (state.plans.some(p => p.status === 'accepted')) return '上期已结束 · 查看记录或重新安排';
  return '暂无发布安排 · 可生成计划或手动添加';
}
export function mockPlans(scenario: Scenario, now = today()): PublishState {
  const state = emptyState();
  if (scenario === 'real') return defaultPrototypeState(now);
  if (scenario === 'empty') return state;
  const p = generatePlan({ start: now, end: addDays(now, 6), topic: '职场压力与边界', channels: ['小红书', '公众号'], formats: ['图文', '文章'], count: 4, weekdays: [] }, `mock-${scenario}`, now);
  if (scenario === 'suggestion') return { ...state, plans: [p] };
  const start = scenario === 'expired' || scenario === 'expiredSuggestion' ? addDays(now, -9) : scenario === 'upcoming' ? addDays(now, 7) : addDays(now, -2);
  const tasks = p.tasks.map((t, i) => ({ ...t, date: addDays(start, scenario === 'active' && i === 1 ? 1 : i * 2), status: (scenario === 'completed' || (scenario === 'expired' && i < 2) || (scenario !== 'upcoming' && scenario !== 'expiredSuggestion' && i === 0) ? 'done' : 'todo') as PublishTask['status'] }));
  const plan: PublishPlan = { ...p, start, end: addDays(start, 6), status: scenario === 'expiredSuggestion' ? 'suggested' : 'accepted', tasks: scenario === 'expiredSuggestion' ? tasks : [] };
  if (scenario === 'expiredSuggestion') return { ...state, plans: [plan] };
  if (scenario === 'manual') return { ...state, tasks: tasks.slice(1, 3).map(t => ({ ...t, planId: undefined })) };
  return { ...state, plans: [plan], tasks };
}
export function defaultPrototypeState(now = today()): PublishState {
  const suggested = mockPlans('suggestion', now);
  const recent = mockPlans('expired', now);
  const olderStart = addDays(now, -23);
  const olderId = 'mock-history-completed';
  const olderTasks: PublishTask[] = [
    { id: `${olderId}-0`, planId: olderId, title: '职场关系：一次沟通前的准备清单', date: olderStart, channel: '小红书', format: '图文', note: '咨询师按计划完成的历史任务示例。', contentUrl: 'https://example.com/mock-published-content', status: 'done' },
    { id: `${olderId}-1`, planId: olderId, title: '职场关系：如何表达不同意见', date: addDays(olderStart, 3), channel: '公众号', format: '文章', note: '咨询师按计划完成的历史任务示例。', contentUrl: '', status: 'done' }
  ];
  const older: PublishPlan = { id: olderId, start: olderStart, end: addDays(olderStart, 6), topic: '职场关系与沟通', status: 'accepted', tasks: [] };
  return { version: 1, plans: [...suggested.plans, ...recent.plans, older], tasks: [...recent.tasks, ...olderTasks] };
}
export function withPrototypeMocks(state: PublishState, now = today()): PublishState {
  const fixtures = defaultPrototypeState(now);
  const knownPlans = new Set(state.plans.map(p => p.id));
  const knownTasks = new Set(state.tasks.map(t => t.id));
  return {
    version: 1,
    plans: [...state.plans, ...fixtures.plans.filter(p => !knownPlans.has(p.id))],
    tasks: [...state.tasks, ...fixtures.tasks.filter(t => !knownTasks.has(t.id))]
  };
}
export const publishKey = (owner: string, scenario: Scenario) => `kelu:publish-plan:v1:${owner}:${scenario}`;
export function parsePublishState(raw: string): PublishState {
  const s = JSON.parse(raw);
  const isTask = (t: PublishTask) => t && typeof t.id === 'string' && typeof t.title === 'string' && validDate(t.date) && ['todo', 'done', 'cancelled', 'moved'].includes(t.status) && ['channel', 'format', 'note', 'contentUrl'].every(k => typeof (t as any)[k] === 'string');
  if (s.version !== 1 || !Array.isArray(s.plans) || !Array.isArray(s.tasks) || !s.tasks.every(isTask) || !s.plans.every((p: PublishPlan) => p && typeof p.id === 'string' && typeof p.topic === 'string' && validDate(p.start) && validDate(p.end) && p.start <= p.end && ['suggested', 'accepted', 'dismissed'].includes(p.status) && Array.isArray(p.tasks) && p.tasks.every(isTask))) throw Error('保存的计划无法读取。未覆盖原数据，请联系支持或切换到演示场景。');
  return s;
}
