import { useEffect, useState } from 'react';
import { emptyState, mockPlans, parsePublishState, publishKey, withPrototypeMocks, type PublishState, type Scenario } from './publishPlans';

export function usePublishPlans(owner: string) {
  const [scenario, setScenario] = useState<Scenario>('real');
  const [state, setState] = useState<PublishState>(emptyState);
  const [error, setError] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [loadedKey, setLoadedKey] = useState('');
  const key = publishKey(owner, scenario);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); const saved = raw ? parsePublishState(raw) : mockPlans(scenario); setState(scenario === 'real' ? withPrototypeMocks(saved) : saved); setError(''); setBlocked(false); }
    catch (e) { setState(emptyState()); setError((e as Error).message); setBlocked(true); }
    setLoadedKey(key);
  }, [key]);
  function commit(next: PublishState) {
    if (blocked || loadedKey !== key) throw Error('数据尚未就绪，未保存本次修改。');
    try { localStorage.setItem(key, JSON.stringify(next)); }
    catch { throw Error('本机保存失败。当前输入仍保留，请重试；请勿关闭页面。'); }
    setState(next); setError('');
  }
  function resetDemo() { if (scenario !== 'real') commit(mockPlans(scenario)); }
  return { state, commit, scenario, setScenario, resetDemo, error, ready: loadedKey === key && !blocked };
}
export type PublishStore = ReturnType<typeof usePublishPlans>;
