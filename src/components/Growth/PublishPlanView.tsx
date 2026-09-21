import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CalendarDays, Check, ChevronDown, Plus, Sparkles } from 'lucide-react';
import { addDays, adoptPlan, generatePlan, migrateTasks, planStatus, planTasks, scenarios, taskError, today, uid, validDate, type PlanPreferences, type PublishPlan, type PublishState, type PublishTask, type Scenario } from './publishPlans';
import type { PublishStore } from './usePublishPlans';
import './publishPlan.css';

type Tab = 'current' | 'suggestions' | 'history';
type Screen = { kind: 'list' } | { kind: 'generate' } | { kind: 'task'; task: PublishTask; original: string; suggested?: string } | { kind: 'suggestion'; planId: string } | { kind: 'migrate'; ids: string[] } | { kind: 'complete'; task: PublishTask };
interface Props { onBack: () => void; onGoToContentGenerator: (topic: string) => void; store: PublishStore; specialties?: string[] }
const blankTask = (): PublishTask => ({ id: uid(), title: '', date: today(), channel: '暂未确定', format: '暂未确定', note: '', contentUrl: '', status: 'todo' });
const initialPreferences = (topic: string): PlanPreferences => ({ start: today(), end: addDays(today(), 6), topic: topic || '职场压力', channels: ['小红书'], formats: ['图文'], count: 3, weekdays: [] });
export const PublishPlanView: React.FC<Props> = ({ onBack, onGoToContentGenerator, store, specialties = [] }) => {
  const { state, commit, scenario, ready } = store;
  const [screen, setScreen] = useState<Screen>({ kind: 'list' });
  const [tab, setTab] = useState<Tab>('current');
  const [prefs, setPrefs] = useState(() => initialPreferences(specialties[0]));
  const [prefsOriginal, setPrefsOriginal] = useState(JSON.stringify(prefs));
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [date, setDate] = useState(today());
  const [link, setLink] = useState('');
  const [range, setRange] = useState({ start: today(), end: addDays(today(), 6) });
  const titleRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const now = today();
  const activePlans = state.plans.filter(p => p.status === 'accepted' && p.end >= now);
  const suggestions = state.plans.filter(p => p.status === 'suggested');
  const history = state.plans.filter(p => p.status === 'accepted' && p.end < now);
  const independent = state.tasks.filter(t => !t.planId);
  const suggestion = screen.kind === 'suggestion' ? state.plans.find(p => p.id === screen.planId && p.status === 'suggested') : undefined;
  const dirty = screen.kind === 'task' ? JSON.stringify(screen.task) !== screen.original : screen.kind === 'generate' && JSON.stringify(prefs) !== prefsOriginal;
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { window.scrollTo(0, 0); titleRef.current?.focus(); }, [screen.kind, tab]);
  useEffect(() => { if (error || store.error) { errorRef.current?.focus(); errorRef.current?.scrollIntoView({ block: 'center' }); } }, [error, store.error]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  useEffect(() => { setScreen({ kind: 'list' }); setSelected([]); setError(''); setMessage(''); setTab(scenario === 'expired' ? 'history' : scenario === 'suggestion' || scenario === 'expiredSuggestion' ? 'suggestions' : 'current'); }, [scenario]);
  function save(next: PublishState, success = '') { try { commit(next); setError(''); setMessage(success); return true; } catch (e) { setError((e as Error).message); return false; } }
  function leave() {
    if (dirty && !window.confirm('有未保存的修改，确定放弃本次修改吗？')) return;
    if (timer.current) clearTimeout(timer.current); setBusy(false); setError('');
    if (screen.kind === 'list') onBack();
    else if (screen.kind === 'task' && screen.suggested) setScreen({ kind: 'suggestion', planId: screen.suggested });
    else setScreen({ kind: 'list' });
  }
  function generate() { const next = initialPreferences(specialties[0]); setPrefs(next); setPrefsOriginal(JSON.stringify(next)); setError(''); setScreen({ kind: 'generate' }); }
  function openTask(task?: PublishTask, suggested?: string) { const next = task ? { ...task } : blankTask(); setScreen({ kind: 'task', task: next, original: JSON.stringify(next), suggested }); setError(''); }
  function openSuggestion(p: PublishPlan) { setSelected(p.tasks.map(t => t.id)); setRange({ start: p.start, end: p.end }); setScreen({ kind: 'suggestion', planId: p.id }); setError(''); }
  function toggle(id: string) { setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); }
  function updateTask(task: PublishTask) { if (save({ ...state, tasks: state.tasks.map(t => t.id === task.id ? task : t) }, '任务已更新。')) setScreen({ kind: 'list' }); }
  function saveTask() {
    if (screen.kind !== 'task') return;
    const task = { ...screen.task, title: screen.task.title.trim(), note: screen.task.note.trim(), contentUrl: screen.task.contentUrl.trim() };
    const plan = screen.suggested ? state.plans.find(p => p.id === screen.suggested) : undefined;
    const problem = taskError({ ...task, planId: plan ? undefined : task.planId }, state);
    if (problem) { setError(problem); return; }
    if (plan) {
      if (task.date < plan.start || task.date > plan.end) { setError('日期超出建议周期，请先返回调整周期。'); return; }
      if (save({ ...state, plans: state.plans.map(p => p.id === plan.id ? { ...p, tasks: p.tasks.map(t => t.id === task.id ? task : t) } : p) }, '建议已调整，尚未采纳。')) setScreen({ kind: 'suggestion', planId: plan.id });
    } else {
      const duplicate = state.tasks.some(t => t.id !== task.id && t.status === 'todo' && t.title === task.title && t.date === task.date && t.channel === task.channel);
      if (duplicate && !window.confirm('已有相同主题、日期和渠道的任务，仍要保留这一项吗？')) return;
      const exists = state.tasks.some(t => t.id === task.id);
      if (save({ ...state, tasks: exists ? state.tasks.map(t => t.id === task.id ? task : t) : [...state.tasks, task] }, exists ? '修改已保存。' : '任务已添加。')) {
        setScreen({ kind: 'list' }); setTab('current');
        setTimeout(() => document.getElementById('task-' + task.id)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 0);
      }
    }
  }
  const taskStatus = (t: PublishTask) => t.status === 'todo' ? '待处理' : t.status === 'done' ? '已发布' : t.status === 'moved' ? '已迁移' : '已取消';
  const archivedTaskRow = (t: PublishTask) => {
    if (t.status === 'todo') return <article id={'task-' + t.id} className="pp-task pp-history-pending" key={t.id}>
      <label className="pp-history-select"><input name={'migrate-' + t.id} type="checkbox" checked={selected.includes(t.id)} onChange={() => toggle(t.id)} /><span><strong>{t.title}</strong><small>{t.date} · {t.channel} · {t.format}</small></span></label>
      <p className="pp-note">原计划未完成，可选择迁移到新日期，也可以取消或暂不处理。</p>
      <div className="pp-actions"><button type="button" onClick={() => { if (window.confirm('取消这项任务？记录仍会保留，不再计入待完成。')) updateTask({ ...t, status: 'cancelled' }); }}>取消任务</button></div>
    </article>;
    return <details id={'task-' + t.id} className="pp-history-task" key={t.id}>
      <summary>
        <span className="pp-history-status" aria-hidden="true"><Check size={15} /></span>
        <span className="pp-history-copy"><strong>{t.title}</strong><small>{t.date} · {t.channel} · {t.format}</small></span>
        <span className="pp-history-result">{taskStatus(t)}</span>
        <ChevronDown className="pp-history-chevron" size={18} aria-hidden="true" />
      </summary>
      <div className="pp-history-detail">
        {t.note && <p className="pp-note">{t.note}</p>}
        {t.status === 'moved' && <small>新日期：{state.tasks.find(x => x.id === t.movedTo)?.date || '已调整'}，原记录不再计入待完成。</small>}
        {t.contentUrl && <a href={t.contentUrl} target="_blank" rel="noopener noreferrer" className="underline">查看关联内容</a>}
        {t.status === 'done' && <small>完成状态由咨询师标记，平台未验证外部发布结果。</small>}
        {t.status === 'done' && <button type="button" className="pp-text-action" onClick={() => { if (window.confirm('撤销已发布标记，恢复为待完成？')) updateTask({ ...t, status: 'todo' }); }}>纠正完成状态</button>}
      </div>
    </details>;
  };
  const taskRow = (t: PublishTask, archived = false) => archived ? archivedTaskRow(t) : <article id={'task-' + t.id} className="pp-task" key={t.id}>
    <div className="pp-plan-heading"><div><small>{t.date} · {t.channel} · {t.format}</small><h3>{t.title}</h3></div><div className="pp-badge">{t.status === 'todo' ? '待完成' : t.status === 'done' ? '已发布' : t.status === 'moved' ? '已迁移' : '已取消'}</div></div>
    {t.status === 'todo' && t.date < now && <p className="pp-note">原定日期已过，可以改期，也可以暂不处理。</p>}
    {t.note && <p className="pp-note">{t.note}</p>}
    {t.originId && <small>从历史计划迁入 · 现为独立任务</small>}
    {t.status === 'moved' && <small>新日期：{state.tasks.find(x => x.id === t.movedTo)?.date || '已调整'}，原记录不再计入待完成。</small>}
    {t.contentUrl && <a href={t.contentUrl} target="_blank" rel="noopener noreferrer" className="underline">查看关联内容</a>}
    {t.status === 'done' && <small>由咨询师标记已发布，未验证外部平台结果。</small>}
    <div className="pp-actions">
      {t.status === 'todo' && !archived && <><button type="button" onClick={() => openTask(t)}>编辑 / 改期</button><button type="button" onClick={() => { setLink(t.contentUrl); setScreen({ kind: 'complete', task: t }); }}>标记已发布</button><button type="button" onClick={() => onGoToContentGenerator(t.title)}>去创作</button></>}
      {t.status === 'todo' && <button type="button" onClick={() => { if (window.confirm('取消这项任务？记录仍会保留，不再计入待完成。')) updateTask({ ...t, status: 'cancelled' }); }}>取消任务</button>}
      {t.status === 'todo' && !t.planId && !t.originId && <button type="button" onClick={() => { if (window.confirm('删除这项手动任务？此操作不可恢复。')) save({ ...state, tasks: state.tasks.filter(x => x.id !== t.id) }, '任务已删除。'); }}>删除</button>}
      {t.status === 'done' && <button type="button" onClick={() => { if (window.confirm('撤销已发布标记，恢复为待完成？')) updateTask({ ...t, status: 'todo' }); }}>纠正完成状态</button>}
    </div>
  </article>;
  const planSection = (p: PublishPlan, archived = false) => {
    const tasks = planTasks(state, p).sort((a, b) => a.date.localeCompare(b.date));
    const actual = tasks.filter(t => t.status !== 'cancelled' && t.status !== 'moved');
    const done = actual.filter(t => t.status === 'done').length;
    return <section className={`pp-panel${archived ? ' pp-history-plan' : ''}`} key={p.id}><div className="pp-plan-heading"><div><h3>{p.topic}</h3><small>{p.start} — {p.end}</small>{archived ? <p className="pp-history-summary">{tasks.length} 项内容 · 完成 {done} 项{tasks.some(t => t.status === 'todo') ? ` · ${tasks.filter(t => t.status === 'todo').length} 项待处理` : ''}</p> : <small>已完成 {done}/{actual.length} 项 · 已取消及已迁移不计入</small>}<button type="button" className="pp-topic-action" onClick={() => onGoToContentGenerator(p.topic)}><Sparkles size={15} aria-hidden="true" />用此主题创作</button></div><div className="pp-badge">{planStatus(state, p)}</div></div>
      <div className={archived ? 'pp-history-list' : 'mt-5'}>{tasks.map(t => taskRow(t, archived))}</div>
      {archived && tasks.some(t => t.status === 'todo') && <div className="pp-actions"><button type="button" disabled={!tasks.some(t => t.status === 'todo' && selected.includes(t.id))} onClick={() => { setDate(now); setScreen({ kind: 'migrate', ids: tasks.filter(t => t.status === 'todo' && selected.includes(t.id)).map(t => t.id) }); }}>迁移所选任务</button><button type="button" disabled={!tasks.some(t => t.status === 'todo' && selected.includes(t.id))} onClick={() => { if (window.confirm('取消选中的未完成任务？历史记录仍保留。')) { const ids = tasks.filter(t => t.status === 'todo' && selected.includes(t.id)).map(t => t.id); save({ ...state, tasks: state.tasks.map(t => ids.includes(t.id) ? { ...t, status: 'cancelled' } : t) }, '已取消所选任务。'); setSelected([]); } }}>取消所选</button><button type="button" onClick={() => { setSelected([]); setTab('current'); }}>暂不处理</button></div>}
    </section>;
  };
  return <div className="publish-plan antialiased">
    <header className="pp-header"><button type="button" className="pp-icon" aria-label="返回上一页" onClick={leave}><ArrowLeft size={20} /></button><div><h2 tabIndex={-1} ref={titleRef}>{screen.kind === 'generate' ? '生成发布计划' : screen.kind === 'task' ? (screen.suggested ? '调整建议' : '编辑发布任务') : screen.kind === 'suggestion' ? '计划建议' : screen.kind === 'migrate' ? '重新安排任务' : screen.kind === 'complete' ? '标记已发布' : '发布计划'}</h2><small>安排发布节奏，是否采纳与执行由你决定。</small></div></header>
    {(error || store.error) && <p role="alert" ref={errorRef} tabIndex={-1} className="pp-error">{error || store.error}</p>}
    {message && <p role="status" className="pp-success">{message}</p>}
    {scenario !== 'real' && <p className="pp-notice">演示场景：{scenarios[scenario]}。不会改动“我的安排”。</p>}
    {screen.kind === 'list' && <>
      <div className="pp-actions"><button type="button" className="pp-primary inline-flex items-center gap-2" disabled={!ready} onClick={generate}><Sparkles size={18} />生成计划</button><button type="button" className="inline-flex items-center gap-2" disabled={!ready} onClick={() => openTask()}><Plus size={18} />手动添加</button></div>
      <nav aria-label="计划分类" className="pp-tabs">{([['current', '当前安排'], ['suggestions', '待采纳建议'], ['history', '历史计划']] as [Tab, string][]).map(([key, text]) => <button type="button" key={key} aria-pressed={tab === key} onClick={() => { setTab(key); setSelected([]); setError(''); }}>{text}{key === 'suggestions' && suggestions.length ? ' (' + suggestions.length + ')' : ''}</button>)}</nav>
      {tab === 'current' && <>
        {!activePlans.length && !independent.length && <section className="pp-panel pp-empty"><CalendarDays size={32} className="mx-auto" /><h3 className="mt-4">还没有当前发布安排</h3><p className="pp-muted">可以生成一份建议后再决定，也可以直接添加一项任务。</p>{suggestions.length > 0 && <button type="button" onClick={() => setTab('suggestions')}>查看待采纳建议</button>}{history.length > 0 && <button type="button" onClick={() => setTab('history')}>查看上期记录</button>}</section>}
        {activePlans.map(p => planSection(p))}
        {independent.length > 0 && <section className="pp-panel"><h3>独立任务</h3><p className="pp-note">不依赖周期计划，按自己的日期安排。</p>{[...independent].sort((a, b) => a.date.localeCompare(b.date)).map(t => taskRow(t))}</section>}
      </>}
      {tab === 'suggestions' && <>{!suggestions.length && <section className="pp-panel pp-empty"><h3>没有待采纳的建议</h3><p>生成计划后先在这里预览，采纳才会进入当前安排。</p></section>}{suggestions.map(p => <section key={p.id} className="pp-panel"><div className="pp-plan-heading"><h3>{p.topic}</h3><div className="pp-badge">{planStatus(state, p)}</div></div><p>{p.start} — {p.end} · {p.tasks.length}项建议</p><div className="pp-actions"><button type="button" onClick={() => openSuggestion(p)}>查看与调整</button><button type="button" onClick={() => { if (window.confirm('放弃这份建议？不会影响已采纳的安排。')) save({ ...state, plans: state.plans.map(x => x.id === p.id ? { ...x, status: 'dismissed' } : x) }, '已放弃，不会创建任务。'); }}>放弃建议</button></div></section>)}</>}
      {tab === 'history' && <>{!history.length && <section className="pp-panel pp-empty"><h3>还没有历史计划</h3><p>周期结束后自动保留在这里，不会自动顺延。</p></section>}{history.map(p => planSection(p, true))}</>}
      <details className="pp-demo"><summary>原型演示 · 切换状态</summary><label className="pp-label">演示场景<select name="demoScenario" value={scenario} onChange={e => store.setScenario(e.target.value as Scenario)}>{Object.entries(scenarios).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><p>每个场景独立保存在本机；重置只影响当前演示。数据日期以重置当天为基准。</p>{scenario !== 'real' && <button type="button" onClick={() => { if (window.confirm('重置当前演示场景？“我的安排”不会受影响。')) { try { store.resetDemo(); setMessage('当前演示已重置。'); setSelected([]); } catch (e) { setError((e as Error).message); } } }}>重置当前演示</button>}</details>
      <p className="pp-note">当前为本机交互原型，未连接跨设备同步及自动发布。</p>
    </>}
    {screen.kind === 'generate' && <form className="pp-form" onSubmit={e => {
      e.preventDefault(); setError('');
      try {
        const plan = generatePlan(prefs); setBusy(true);
        timer.current = setTimeout(() => { setBusy(false); if (save({ ...state, plans: [...state.plans, plan] }, '建议已保存，尚未创建正式任务。')) openSuggestion(plan); }, 450);
      } catch (e) { setError((e as Error).message); }
    }}>
      <p className="pp-notice">按你的选择生成可调整的安排，不覆盖已有计划。当前为规则生成示例，尚未接入 AI 服务。</p>
      <fieldset disabled={busy} className="pp-form pp-panel">
        <div className="pp-dates"><label>开始日期<input name="start" type="date" required min={now} value={prefs.start} onChange={e => setPrefs({ ...prefs, start: e.target.value })} /></label><label>结束日期<input name="end" type="date" required min={prefs.start} value={prefs.end} onChange={e => setPrefs({ ...prefs, end: e.target.value })} /></label></div>
        <button type="button" onClick={() => setPrefs({ ...prefs, start: now, end: addDays(now, 6) })}>使用未来7天</button>
        <label>关注主题<input name="topic" maxLength={80} required value={prefs.topic} onChange={e => setPrefs({ ...prefs, topic: e.target.value })} /></label>
        {!!specialties.length && <small>可参考你的擅长方向：{specialties.join('、')}</small>}
        {([['channels', '发布渠道', ['小红书', '公众号', '朋友圈', '视频号']], ['formats', '内容形式', ['图文', '文章', '短视频']]] as const).map(([key, label, options]) => <fieldset key={key}><legend>{label}（多选）</legend><div className="pp-choices">{options.map(option => <label key={option}><input type="checkbox" name={key} checked={prefs[key].includes(option)} onChange={e => setPrefs({ ...prefs, [key]: e.target.checked ? [...prefs[key], option] : prefs[key].filter(x => x !== option) })} />{option}</label>)}</div></fieldset>)}
        <label>本周期内容数量<input name="count" required type="number" min={1} max={14} value={prefs.count} onChange={e => setPrefs({ ...prefs, count: Number(e.target.value) })} /></label>
        <fieldset><legend>偏好的发布日（可选）</legend><div className="pp-choices">{['日', '一', '二', '三', '四', '五', '六'].map((day, i) => <label key={day}><input type="checkbox" name="weekdays" checked={prefs.weekdays.includes(i)} onChange={e => setPrefs({ ...prefs, weekdays: e.target.checked ? [...prefs.weekdays, i] : prefs.weekdays.filter(x => x !== i) })} />周{day}</label>)}</div><small>不选则在周期内均匀安排；同一天可能有多项内容。</small></fieldset>
      </fieldset>
      <button type="submit" className="pp-primary" disabled={busy || !ready}>{busy ? '正在整理建议…' : '生成建议，先看一看'}</button>
      <button type="button" onClick={leave}>{busy ? '取消生成' : '取消'}</button>
    </form>}
    {suggestion && <>
      <p className="pp-notice">仅采纳勾选项目；未勾选项目不会创建任务。调整会保存到建议中，不代表采纳。</p>
      <form className="pp-form pp-panel" onSubmit={e => {
        e.preventDefault();
        if (!validDate(range.start) || !validDate(range.end) || range.start < now || range.end < range.start || range.end > addDays(range.start, 30)) { setError('请选择今天起、最长31天的有效周期。'); return; }
        const delta = Math.round((new Date(range.start + 'T12:00:00').getTime() - new Date(suggestion.start + 'T12:00:00').getTime()) / 86400000);
        const tasks = suggestion.tasks.map(t => ({ ...t, date: addDays(t.date, delta) }));
        if (tasks.some(t => t.date > range.end)) { setError('新周期容纳不下全部任务，请延长结束日期或先调整任务日期。'); return; }
        save({ ...state, plans: state.plans.map(p => p.id === suggestion.id ? { ...p, ...range, tasks } : p) }, '周期已更新，任务日期同步平移；仍待你采纳。');
      }}>
        <h3>{suggestion.topic} · {planStatus(state, suggestion)}</h3>
        <div className="pp-dates"><label>建议开始日期<input name="suggestionStart" type="date" required value={range.start} onChange={e => setRange({ ...range, start: e.target.value })} /></label><label>建议结束日期<input name="suggestionEnd" type="date" required value={range.end} onChange={e => setRange({ ...range, end: e.target.value })} /></label></div><button type="submit">更新周期并平移日期</button>
      </form>
      <section className="pp-panel"><label className="pp-check"><input type="checkbox" name="selectAll" checked={suggestion.tasks.length > 0 && suggestion.tasks.every(t => selected.includes(t.id))} onChange={e => setSelected(e.target.checked ? suggestion.tasks.map(t => t.id) : [])} />全选</label>{suggestion.tasks.map(t => <article className="pp-task" key={t.id}><label className="pp-check"><input type="checkbox" name={'adopt-' + t.id} checked={selected.includes(t.id)} onChange={() => toggle(t.id)} />{t.title}</label><small>{t.date} · {t.channel} · {t.format}</small><p className="pp-note">{t.note}</p>{t.date < now && <p className="pp-note">日期已过，调整后才能采纳。</p>}<button type="button" onClick={() => openTask(t, suggestion.id)}>调整这一项</button></article>)}</section>
      <button type="button" className="pp-primary" disabled={!selected.length || !ready} onClick={() => {
        try {
          if (range.start !== suggestion.start || range.end !== suggestion.end) { setError('请先保存周期调整，再采纳。'); return; }
          const tasks = suggestion.tasks.filter(t => selected.includes(t.id));
          if (tasks.some(t => state.tasks.some(old => old.status === 'todo' && old.date === t.date && old.channel === t.channel && old.title === t.title)) && !window.confirm('部分任务与已有安排重复，仍要添加吗？')) return;
          if (save(adoptPlan(state, suggestion.id, selected), '已采纳所选项目；未选项目不创建任务，原有安排保持不变。')) { setScreen({ kind: 'list' }); setTab('current'); setSelected([]); }
        } catch (e) { setError((e as Error).message); }
      }}>采纳所选 {selected.length} 项</button>
      <div className="pp-actions"><button type="button" onClick={() => { setScreen({ kind: 'list' }); setTab('suggestions'); }}>稍后再看</button><button type="button" onClick={() => { if (window.confirm('放弃这份建议？不会影响已采纳计划。') && save({ ...state, plans: state.plans.map(p => p.id === suggestion.id ? { ...p, status: 'dismissed' } : p) }, '已放弃建议，没有创建任务。')) setScreen({ kind: 'list' }); }}>放弃建议</button></div>
    </>}
    {screen.kind === 'task' && <form className="pp-form" onSubmit={e => { e.preventDefault(); saveTask(); }}>
      <section className="pp-panel pp-form">
        <label>任务标题<input name="taskTitle" required maxLength={160} value={screen.task.title} onChange={e => setScreen({ ...screen, task: { ...screen.task, title: e.target.value } })} /></label>
        <label>计划日期<input name="taskDate" required type="date" min={now} value={screen.task.date} onChange={e => setScreen({ ...screen, task: { ...screen.task, date: e.target.value } })} /></label>
        {(['channel', 'format'] as const).map(key => <label key={key}>{key === 'channel' ? '发布渠道' : '内容形式'}<select name={key} value={screen.task[key]} onChange={e => setScreen({ ...screen, task: { ...screen.task, [key]: e.target.value } })}>{(key === 'channel' ? ['暂未确定', '小红书', '公众号', '朋友圈', '视频号'] : ['暂未确定', '图文', '文章', '短视频']).map(value => <option key={value}>{value}</option>)}</select></label>)}
        {!screen.suggested && <label>所属计划<select name="planId" value={screen.task.planId || ''} onChange={e => setScreen({ ...screen, task: { ...screen.task, planId: e.target.value || undefined } })}><option value="">独立任务</option>{activePlans.map(p => <option key={p.id} value={p.id}>{p.topic}（{p.start}—{p.end}）</option>)}</select></label>}
        <label>关联内容链接（可选）<input name="contentUrl" type="url" maxLength={1500} placeholder="https://" value={screen.task.contentUrl} onChange={e => setScreen({ ...screen, task: { ...screen.task, contentUrl: e.target.value } })} /></label>
        <label>备注（可选）<textarea name="taskNote" maxLength={1200} value={screen.task.note} onChange={e => setScreen({ ...screen, task: { ...screen.task, note: e.target.value } })} /></label>
      </section><button type="submit" className="pp-primary" disabled={!ready}>{screen.suggested ? '保存建议调整' : '保存任务'}</button><button type="button" onClick={leave}>取消</button>
    </form>}
    {screen.kind === 'migrate' && <form className="pp-form pp-panel" onSubmit={e => {
      e.preventDefault(); try { if (save(migrateTasks(state, screen.ids, date), '所选任务已迁移到独立任务，原记录保留，不重复计数。')) { setSelected([]); setScreen({ kind: 'list' }); setTab('current'); } } catch (e) { setError((e as Error).message); }
    }}><h3>迁移 {screen.ids.length} 项任务</h3><p>所选任务统一安排到新日期，作为独立任务；之后可逐项调整。</p><label>新的计划日期<input name="migrationDate" type="date" min={now} value={date} required onChange={e => setDate(e.target.value)} /></label><button type="submit" className="pp-primary">确认迁移</button><button type="button" onClick={leave}>暂不处理</button></form>}
    {screen.kind === 'complete' && <form className="pp-form pp-panel" onSubmit={e => {
      e.preventDefault(); if (link && !/^https?:\/\/\S+$/.test(link)) { setError('请填写有效的 http(s) 链接或留空。'); return; } updateTask({ ...screen.task, status: 'done', contentUrl: link.trim() });
    }}><h3>{screen.task.title}</h3><p>请在实际发布后标记。这里只记录你的确认，不会代你发布，也不会自动核验外部平台。</p><label>已发布内容链接（可选）<input name="publishedUrl" type="url" maxLength={1500} value={link} placeholder="https://" onChange={e => setLink(e.target.value)} /></label><button type="submit" className="pp-primary">确认已发布</button><button type="button" onClick={leave}>取消</button></form>}
  </div>;
};
