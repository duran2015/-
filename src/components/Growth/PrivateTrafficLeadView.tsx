import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronRight, Copy, Edit3, ExternalLink, FileText, Share2, Sparkles } from 'lucide-react';
import type { ConsultantProfile } from '../../types';
import { ContentDetail, ProfilePageHeader, ProfilePublicView } from './ProfilePublicView';
import { PROFILE_CONTENT, DEFAULT_CONTENT_IDS, createSnapshot, displayIds, moveDisplayContent, profileCopy, profileDisplayKey, profileDraftKey, selectedContent, snapshotLink, type ProfileCopy } from './profileSharing';
import './profileSharing.css';

type View = 'manage' | 'edit' | 'content' | 'preview' | 'share' | 'article';
const allowedViews: View[] = ['manage', 'edit', 'content', 'preview', 'share', 'article'];
function readRoute(): { view: View; contentId: string } {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('profile') as View;
  return { view: allowedViews.includes(page) ? page : 'manage', contentId: params.get('content') || '' };
}
function readDisplay(id: string) {
  try { const raw = localStorage.getItem(profileDisplayKey(id)); return raw ? displayIds(JSON.parse(raw)) : [...DEFAULT_CONTENT_IDS]; } catch { return [...DEFAULT_CONTENT_IDS]; }
}
function readDraft(id: string): { copy?: ProfileCopy; ids?: string[] } {
  try { const value = JSON.parse(localStorage.getItem(profileDraftKey(id)) || '{}'); return { copy: value.copy ? profileCopy(value.copy) : undefined, ids: Array.isArray(value.ids) ? displayIds(value.ids) : undefined }; } catch { return {}; }
}
interface PrivateTrafficLeadViewProps { onBack: () => void; consultant: ConsultantProfile; onUpdateConsultant: (profile: ConsultantProfile) => void; initialView?: View }

export const PrivateTrafficLeadView: React.FC<PrivateTrafficLeadViewProps> = ({ onBack, consultant, onUpdateConsultant, initialView }) => {
  const [route, setRoute] = useState(() => initialView ? { view: initialView, contentId: '' } : readRoute());
  const [ids, setIds] = useState(() => readDisplay(consultant.id));
  const [copy, setCopy] = useState(() => readDraft(consultant.id).copy ?? profileCopy({ ...consultant, targetAudience: consultant.targetAudience ?? consultant.targetGroups }));
  const [draftIds, setDraftIds] = useState(() => readDraft(consultant.id).ids ?? ids);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [sharing, setSharing] = useState(false);
  const [search, setSearch] = useState('');
  const savedCopy = profileCopy({ ...consultant, targetAudience: consultant.targetAudience ?? consultant.targetGroups });
  const copyDirty = JSON.stringify(savedCopy) !== JSON.stringify(copy);
  const contentDirty = JSON.stringify(ids) !== JSON.stringify(draftIds);
  const snapshot = useMemo(() => createSnapshot(consultant, ids), [consultant, ids]);
  const url = useMemo(() => snapshotLink(window.location.origin, snapshot), [snapshot]);
  const localOnly = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

  const go = (view: View, contentId = '') => {
    const target = new URL(window.location.href); target.searchParams.set('tab', 'growth'); target.searchParams.set('profile', view); target.searchParams.delete('read');
    if (contentId) target.searchParams.set('content', contentId); else target.searchParams.delete('content');
    window.history.pushState(null, '', target); setRoute({ view, contentId }); setMessage(''); setError('');
  };
  useEffect(() => {
    const target = new URL(window.location.href); target.searchParams.set('tab', 'growth'); target.searchParams.set('profile', route.view);
    window.history.replaceState(null, '', target);
    const onPop = () => { if (!new URLSearchParams(window.location.search).has('profile')) onBack(); else setRoute(readRoute()); };
    window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [route.view, route.contentId]);
  useEffect(() => {
    try {
      if (!copyDirty && !contentDirty) localStorage.removeItem(profileDraftKey(consultant.id));
      else localStorage.setItem(profileDraftKey(consultant.id), JSON.stringify({ copy: copyDirty ? copy : undefined, ids: contentDirty ? draftIds : undefined }));
    }
    catch { setError('草稿无法保存在当前浏览器，请保留此页并重试。'); }
  }, [copy, draftIds, copyDirty, contentDirty, consultant.id]);
  const saveCopy = () => {
    if (!copy.bio.trim()) { setError('请填写个人简介后保存。'); return; }
    try { const next = profileCopy(copy); onUpdateConsultant({ ...consultant, ...next, targetGroups: next.targetAudience }); setCopy(next); go('manage'); setMessage('主页资料已保存，并同步到「我的」个人档案。'); }
    catch { setError('保存失败，内容仍在草稿中，请重试。'); }
  };
  const saveDisplay = () => {
    try { const next = displayIds(draftIds); localStorage.setItem(profileDisplayKey(consultant.id), JSON.stringify(next)); setIds(next); go('manage'); setMessage('展示内容与顺序已保存。'); }
    catch { setError('保存失败，当前选择仍保留，请重试。'); }
  };
  const copyLink = async () => {
    setError('');
    try { await navigator.clipboard.writeText(url); setMessage('主页链接已复制。'); }
    catch { setError('无法自动复制，请长按下方链接全选后复制。'); }
  };
  const nativeShare = async () => {
    if (!navigator.share) { await copyLink(); return; }
    setSharing(true); setError(''); setMessage('');
    try { await navigator.share({ title: `${consultant.name}的咨询主页`, text: '了解我的咨询方向与公开内容', url }); setMessage('已交给系统分享面板处理。'); }
    catch (e) { if ((e as Error).name !== 'AbortError') setError('分享未完成，可以改为复制链接。'); }
    finally { setSharing(false); }
  };
  const status = <>{error && <p role="alert" className="profile-error">{error}</p>}{message && <p role="status" className="profile-success">{message}</p>}</>;
  const back = () => { go('manage'); if (copyDirty || contentDirty) setMessage('未提交的修改已保留为本机草稿；公开预览仍使用已保存内容。'); };

  if (route.view === 'preview') return <ProfilePublicView snapshot={snapshot} preview onBack={back} onShare={() => go('share')} />;
  if (route.view === 'article') {
    const content = PROFILE_CONTENT.find(c => c.id === route.contentId && c.status === 'published');
    return content ? <ContentDetail content={content} onBack={back} /> : <div className="profile-flow"><ProfilePageHeader title="内容不可用" onBack={back} /><p>该内容未发布或不存在，无法展示。</p></div>;
  }
  if (route.view === 'share') return <div className="profile-flow">
    <ProfilePageHeader title="分享主页" onBack={back} />{status}
    <section className="profile-surface"><div className="profile-identity"><img src={consultant.avatar} alt={consultant.name} /><div><h1>{consultant.name}</h1><p>咨询师公开主页</p></div></div><p>分享个人简介、擅长方向和 {ids.length} 项已选内容。不会包含证件、收入、联系方式或来访者记录。</p><button type="button" className="profile-secondary full-width" onClick={() => go('preview')}>先看看用户会看到什么 <ChevronRight size={18} /></button></section>
    {(copyDirty || contentDirty) && <p className="profile-notice">你还有未保存的修改。本次只分享已保存内容，返回后可继续编辑。</p>}
    <section className="profile-surface"><h3>分享方式</h3><button type="button" className="profile-primary" onClick={copyLink}><Copy size={18} />复制主页链接</button><button type="button" disabled={sharing} className="profile-secondary full-width mt-3" onClick={nativeShare}><Share2 size={18} />{sharing ? '等待系统分享…' : navigator.share ? '更多分享方式' : '使用链接分享'}</button><label htmlFor="public-profile-link">主页链接（可手动复制）</label><textarea id="public-profile-link" name="publicProfileLink" readOnly value={url} className="profile-link-field" onFocus={e => e.currentTarget.select()} /><a className="profile-secondary full-width mt-3" href={url} target="_blank" rel="noopener noreferrer">打开接收方页面 <ExternalLink size={18} /></a></section>
    <p className="profile-notice">{localOnly ? '当前为本地预览，链接仅能在运行此原型的电脑上打开，尚未部署公网。' : '当前为演示快照链接，不是正式的咨询师认证主页。'} 修改主页后需重新分享；旧链接保留分享时的版本。</p>
  </div>;

  if (route.view === 'edit') return <div className="profile-flow">
    <ProfilePageHeader title="编辑公开资料" onBack={back} />{status}
    <p className="profile-notice">与「我的 → 个人主页与档案」共用资料。姓名和资质信息在档案中维护，这里不重复修改。</p>
    <form onSubmit={e => { e.preventDefault(); saveCopy(); }}><section className="profile-surface"><h3>{consultant.name}</h3><p>{consultant.title}</p>
      <label htmlFor="profile-bio">个人简介<textarea id="profile-bio" name="bio" maxLength={1200} required value={copy.bio} onChange={e => setCopy({ ...copy, bio: e.target.value })} /></label>
      <button type="button" className="profile-secondary" onClick={() => setSuggestion([copy.targetAudience.length ? `我主要陪伴${copy.targetAudience.join('、')}。` : '', copy.specialties.length ? `关注${copy.specialties.join('、')}等方向。` : '', copy.bio].filter(Boolean).join('\n'))}><Sparkles size={18} />整理简介示例</button>
      {suggestion && <div className="profile-notice mt-3"><strong>待你确认的整理示例</strong><p className="profile-preserve">{suggestion}</p><p className="profile-caption">仅拼接你已填写的信息，不是 AI 分析，不新增资历或效果承诺。</p><div className="profile-actions"><button type="button" className="profile-secondary" onClick={() => { setCopy({ ...copy, bio: suggestion.slice(0, 1200) }); setSuggestion(''); }}>放入编辑框</button><button type="button" className="profile-secondary" onClick={() => setSuggestion('')}>不用了</button></div></div>}
      <label htmlFor="profile-audience">主要服务人群<input id="profile-audience" name="targetAudience" type="text" maxLength={400} value={copy.targetAudience.join('、')} onChange={e => setCopy({ ...copy, targetAudience: e.target.value.split(/[、,，]/) })} /></label><p className="profile-caption">多项用顿号或逗号分隔。</p>
      <label htmlFor="profile-specialties">擅长方向<input id="profile-specialties" name="specialties" type="text" maxLength={400} value={copy.specialties.join('、')} onChange={e => setCopy({ ...copy, specialties: e.target.value.split(/[、,，]/) })} /></label>
      <label htmlFor="profile-style">咨询风格理念<textarea id="profile-style" name="counselingStyle" maxLength={400} value={copy.counselingStyle} onChange={e => setCopy({ ...copy, counselingStyle: e.target.value })} /></label>
    </section><p className="profile-caption">修改会自动保留为本机草稿；点击保存后才更新公开预览。</p><button type="submit" className="profile-primary">保存公开资料</button><button type="button" className="profile-secondary full-width mt-3" disabled={!copyDirty} onClick={() => { setCopy(savedCopy); setSuggestion(''); setMessage('已恢复为上次保存的资料。'); }}>放弃本次修改</button></form>
  </div>;

  if (route.view === 'content') return <div className="profile-flow">
    <ProfilePageHeader title="管理展示内容" onBack={back} />{status}
    <p className="profile-notice">勾选要放在主页上的内容，并调整顺序。保存后生效，未发布内容不能被选中。</p>
    <section className="profile-surface"><h3>展示顺序 · {draftIds.length} 项</h3>{draftIds.length ? selectedContent(draftIds).map((content, i) => <div className="profile-manage-row" key={content.id}><strong className="text-sm">{i + 1}. {content.title}</strong><div className="profile-order-buttons"><button type="button" disabled={i === 0} aria-label={`上移${content.title}`} onClick={() => setDraftIds(prev => moveDisplayContent(prev, content.id, -1))}><ArrowUp size={20} /></button><button type="button" disabled={i === draftIds.length - 1} aria-label={`下移${content.title}`} onClick={() => setDraftIds(prev => moveDisplayContent(prev, content.id, 1))}><ArrowDown size={20} /></button></div></div>) : <p>尚未选择内容。保存后，用户主页将展示空状态。</p>}</section>
    <section className="profile-surface"><h3>内容库</h3><label htmlFor="content-search">搜索内容<input type="text" id="content-search" name="contentSearch" value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索文章或问卷" /></label>
      {PROFILE_CONTENT.filter(c => c.title.includes(search.trim())).map(content => <div className="profile-manage-row" key={content.id}><label className="profile-choice"><input type="checkbox" name={`display-${content.id}`} disabled={content.status !== 'published'} checked={draftIds.includes(content.id)} onChange={e => setDraftIds(prev => e.target.checked ? [...prev, content.id] : prev.filter(id => id !== content.id))} /><span>{content.title}<small className="block profile-caption">{content.status === 'draft' ? '草稿 · 不可展示' : '已发布 · 演示内容'}</small></span></label></div>)}
      {!PROFILE_CONTENT.some(c => c.title.includes(search.trim())) && <p>没有找到相关内容，试试其他关键词。</p>}
    </section><button type="button" className="profile-primary" onClick={saveDisplay}>保存展示设置</button><button type="button" disabled={!contentDirty} className="profile-secondary" onClick={() => { setDraftIds(ids); setMessage('已恢复为上次保存的展示设置。'); }}>放弃本次调整</button>
  </div>;

  return <div className="profile-flow">
    <ProfilePageHeader title="分享主页" onBack={onBack} action={<button type="button" className="profile-icon-button" aria-label="打开主页分享" onClick={() => go('share')}><Share2 size={20} /></button>} />{status}
    <p className="profile-caption">编辑公开资料、选择展示内容，再预览与分享。</p>
    {(copyDirty || contentDirty) && <p className="profile-notice">有未保存的本机草稿。<button type="button" className="underline ml-2" onClick={() => go(copyDirty ? 'edit' : 'content')}>继续编辑</button></p>}
    <section className="profile-surface"><div className="profile-identity"><img src={consultant.avatar} alt={consultant.name} /><div className="min-w-0 flex-1"><h1>{consultant.name}</h1><p>{consultant.title}</p></div><button type="button" className="profile-icon-button" aria-label="编辑公开资料" onClick={() => go('edit')}><Edit3 size={20} /></button></div><div className="profile-tags">{savedCopy.specialties.map(tag => <span key={tag}>{tag}</span>)}</div><h3>个人简介</h3><p className="profile-preserve">{consultant.bio || '暂未填写个人简介'}</p><button type="button" className="profile-secondary full-width" onClick={() => go('edit')}>编辑公开资料</button></section>
    <div className="profile-info-grid"><section className="profile-surface"><h3>主要服务人群</h3><p>{savedCopy.targetAudience.join('、') || '暂未填写'}</p></section><section className="profile-surface"><h3>咨询风格理念</h3><p>{consultant.counselingStyle || '暂未填写'}</p></section></div>
    <section className="profile-surface"><h3>主页内容展示</h3><p className="profile-caption">对外可见的内容 · 当前使用演示内容库</p>{selectedContent(ids).length ? selectedContent(ids).map(content => <button type="button" key={content.id} className="profile-content-row" onClick={() => go('article', content.id)}><FileText size={24} /><span><strong>{content.title}</strong><small>{content.kind === 'article' ? '文章' : '问卷'} · 已展示</small></span><ChevronRight size={18} /></button>) : <p>暂未展示内容，可从内容库选择。</p>}<button type="button" className="profile-secondary full-width mt-3" onClick={() => go('content')}>管理展示内容 <ChevronRight size={18} /></button></section>
    <button type="button" className="profile-primary" onClick={() => go('preview')}>预览用户视角</button><button type="button" className="profile-secondary full-width" onClick={() => go('share')}><Share2 size={18} />分享主页</button>
  </div>;
};
