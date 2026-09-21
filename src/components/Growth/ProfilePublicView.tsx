import React, { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, FileText, Share2, UserCircle } from 'lucide-react';
import { decodeSnapshot, selectedContent, type PublicSnapshot, type DisplayContent } from './profileSharing';
import './profileSharing.css';

export function ProfilePageHeader({ title, onBack, action }: { title: string; onBack: () => void; action?: React.ReactNode }) {
  return <header className="profile-flow-header"><button type="button" className="profile-icon-button" aria-label="返回上一页" onClick={onBack}><ArrowLeft size={20} /></button><h2>{title}</h2>{action}</header>;
}
export function ContentDetail({ content, onBack }: { content: DisplayContent; onBack: () => void }) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const options = [['经常有', '有时有', '很少有'], ['经常有', '有时有', '很少有'], ['可以应对', '有些吃力', '暂时说不清']];
  return <div className="profile-flow">
    <ProfilePageHeader title={submitted ? '我的回看' : content.kind === 'article' ? '内容详情' : '问卷探索'} onBack={onBack} />
    <article className="profile-surface"><span className="profile-caption">演示内容 · {content.kind === 'article' ? '日常自我探索' : '非诊断问卷'}</span><h1>{content.title}</h1>
      {content.paragraphs.map(p => <p key={p}>{p}</p>)}
      {content.questions && (submitted ? <><h3>你刚才的选择</h3><dl>{content.questions.map((q, i) => <div key={q}><dt>{q}</dt><dd>{answers[i]}</dd></div>)}</dl><p>可以留意哪些时刻让你恢复精力、哪些事情更消耗自己。以上只回看你的回答，不推断心理状态。</p><button type="button" className="profile-secondary" onClick={() => setSubmitted(false)}>修改回答</button></> : <form onSubmit={e => { e.preventDefault(); setSubmitted(true); window.scrollTo(0, 0); }}>
        {content.questions.map((q, i) => <fieldset key={q}><legend>{i + 1}. {q}</legend>{options[i].map(option => <label className="profile-choice" key={option}><input type="radio" name={`question-${i}`} value={option} checked={answers[i] === option} required onChange={() => setAnswers(prev => { const next = [...prev]; next[i] = option; return next; })} />{option}</label>)}</fieldset>)}
        <button type="submit" className="profile-primary">查看我的回答</button><p className="profile-caption">不要求联系方式；返回后清除本次作答。</p>
      </form>)}
    </article>
    <button type="button" className="profile-secondary full-width" onClick={onBack}>返回主页</button>
  </div>;
}

export function ProfilePublicView({ snapshot, onBack, onShare, preview = false }: { snapshot: PublicSnapshot; onBack?: () => void; onShare?: () => void; preview?: boolean }) {
  const readContent = () => selectedContent(snapshot.contentIds).find(content => content.id === new URLSearchParams(window.location.search).get('read')) ?? null;
  const [activeContent, setActiveContent] = useState<DisplayContent | null>(readContent);
  useEffect(() => { const onPop = () => setActiveContent(readContent()); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, [snapshot]);
  const openContent = (content: DisplayContent | null) => {
    const url = new URL(window.location.href);
    if (content) { url.searchParams.set('read', content.id); window.history.pushState(null, '', url); }
    else { url.searchParams.delete('read'); window.history.replaceState(null, '', url); }
    setActiveContent(content); window.scrollTo(0, 0);
  };
  const profile = snapshot.profile;
  if (activeContent) return <ContentDetail key={activeContent.id} content={activeContent} onBack={() => openContent(null)} />;
  return <div className="profile-flow">
    {onBack ? <ProfilePageHeader title="用户视角预览" onBack={onBack} action={onShare && <button type="button" className="profile-icon-button" aria-label="分享主页" onClick={onShare}><Share2 size={20} /></button>} /> : <header className="profile-flow-header"><strong>可鹿</strong><span className="profile-caption">咨询师公开主页</span></header>}
    <p className="profile-notice">{preview ? '用户视角：仅显示已保存的公开资料与已选内容。' : '交互原型 · 分享时的公开资料快照，非已核验的线上服务主页。'}</p>
    <section className="profile-surface"><div className="profile-identity">{profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : <UserCircle size={64} />}<div><h1>{profile.name}</h1><p>{profile.title}</p></div></div><div className="profile-tags">{profile.specialties.map(tag => <span key={tag}>{tag}</span>)}</div><h3>个人简介</h3><p className="profile-preserve">{profile.bio || '咨询师暂未填写个人简介。'}</p></section>
    <div className="profile-info-grid"><section className="profile-surface"><h3>主要服务人群</h3><p>{profile.targetAudience.join('、') || '暂未填写'}</p></section><section className="profile-surface"><h3>咨询风格理念</h3><p>{profile.counselingStyle || '暂未填写'}</p></section></div>
    <section className="profile-surface"><h3>主页内容</h3>{selectedContent(snapshot.contentIds).length ? selectedContent(snapshot.contentIds).map(content => <button type="button" key={content.id} className="profile-content-row" onClick={() => openContent(content)}><FileText size={24} /><span><strong>{content.title}</strong><small>{content.kind === 'article' ? '阅读文章' : '开始问卷'} · 演示内容</small></span><ChevronRight size={18} /></button>) : <p className="profile-caption">暂未展示内容。</p>}</section>
    <p className="profile-caption">用于心理支持与自我成长，不提供诊疗服务。此原型不承接真实预约与付款。</p>
    {preview && onBack && <button type="button" className="profile-primary" onClick={onBack}>返回编辑主页</button>}
    {!preview && <p className="profile-caption">快照生成于 {new Date(snapshot.createdAt).toLocaleString('zh-CN')}。新修改需重新分享；已有链接不会自动更新。</p>}
  </div>;
}

export function SharedProfileLanding() {
  const [snapshot] = useState(() => decodeSnapshot(window.location.hash.slice(1)));
  return <main className="shared-profile-shell">{snapshot ? <ProfilePublicView snapshot={snapshot} /> : <section className="profile-surface"><h1>主页链接无效</h1><p>链接可能不完整，请向分享者索取新的主页链接。</p><button type="button" className="profile-secondary" onClick={() => window.location.reload()}>重新加载</button></section>}</main>;
}
