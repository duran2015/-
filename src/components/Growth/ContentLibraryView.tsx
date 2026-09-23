import React, { useMemo, useState } from 'react';
import {
  ArrowLeft, CalendarPlus, Copy, FileText, MoreHorizontal, Pencil,
  Search, Send, Trash2, X
} from 'lucide-react';

export type ContentStatus = 'draft' | 'ready' | 'scheduled' | 'published' | 'failed';

export interface ContentAsset {
  id: string;
  title: string;
  summary: string;
  platform: string;
  style: string;
  status: ContentStatus;
  sourceTopic?: string;
  updatedAt: string;
  words: number;
}

interface ContentLibraryViewProps {
  items: ContentAsset[];
  onBack: () => void;
  onContinue: (item: ContentAsset) => void;
  onEdit: (item: ContentAsset) => void;
  onSchedule: (item: ContentAsset) => void;
  onPublish: (item: ContentAsset) => void;
  onDelete: (id: string) => void;
}

const filters: Array<{ key: 'all' | ContentStatus; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'draft', label: '草稿' },
  { key: 'ready', label: '已完成' },
  { key: 'scheduled', label: '已排期' },
  { key: 'published', label: '已发布' },
];

const statusMeta: Record<ContentStatus, { label: string; className: string }> = {
  draft: { label: '草稿', className: 'bg-[#E6F3FF] text-[#2467A8]' },
  ready: { label: '已完成', className: 'bg-[#E8F7EC] text-[#167A39]' },
  scheduled: { label: '已排期', className: 'bg-[#FFF2D8] text-[#8A4B08]' },
  published: { label: '已发布', className: 'bg-[#F1E9FF] text-[#6750A4]' },
  failed: { label: '生成失败', className: 'bg-[#FCE8E6] text-[#B3261E]' },
};

export const defaultContentAssets: ContentAsset[] = [
  {
    id: 'content-1',
    title: '考研失利后，怎样重新找回生活节奏？',
    summary: '从允许情绪存在、重建日常秩序到重新确认目标，给正在经历失落的人一份可执行的陪伴清单。',
    platform: '小红书笔记', style: '温暖陪伴', status: 'draft',
    sourceTopic: '考研失败后的第一年，我终于学会了和自己和解', updatedAt: '今天 18:07', words: 1737,
  },
  {
    id: 'content-2',
    title: '别让领导的一句话，毁掉一整天的心情',
    summary: '识别自动化负面想法，用三个简单动作建立自己的情绪边界。',
    platform: '小红书笔记', style: '专业科普', status: 'ready',
    sourceTopic: '为什么越优秀的人越容易陷入焦虑？', updatedAt: '昨天 17:41', words: 1135,
  },
  {
    id: 'content-3',
    title: '总是害怕让别人失望，该如何练习拒绝？',
    summary: '从低压力场景开始建立边界，不再用满足所有人证明自己的价值。',
    platform: '视频脚本', style: '专业科普', status: 'scheduled',
    sourceTopic: '总是害怕让别人失望，该如何拒绝？', updatedAt: '09-25 20:00 发布', words: 860,
  },
  {
    id: 'content-4',
    title: '情绪耗竭的三个信号',
    summary: '帮助高压工作者识别持续疲惫、情绪迟钝与自我怀疑。',
    platform: '公众号文章', style: '专业科普', status: 'published',
    updatedAt: '09-20 已发布', words: 1529,
  },
];

export const ContentLibraryView: React.FC<ContentLibraryViewProps> = ({ items, onBack, onContinue, onEdit, onSchedule, onPublish, onDelete }) => {
  const [active, setActive] = useState<'all' | ContentStatus>('all');
  const [keyword, setKeyword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [menuId, setMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContentAsset | null>(null);
  const visibleItems = useMemo(() => items.filter(item => {
    const statusMatch = active === 'all' || item.status === active;
    const keywordMatch = !keyword.trim() || `${item.title}${item.summary}${item.platform}`.includes(keyword.trim());
    return statusMatch && keywordMatch;
  }), [active, items, keyword]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 min-h-full pb-8">
      <header className="flex items-center gap-3 pb-1">
        <button onClick={onBack} aria-label="返回增长首页" className="w-10 h-10 flex items-center justify-center bg-white border border-[#E6E0D6] rounded-full text-[#49463D] active:scale-95 transition shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-[#1D1B16]">内容库</h2>
          <p className="text-[13px] text-[#7A756C] font-medium mt-0.5">草稿、成稿与发布进度统一管理</p>
        </div>
      </header>

      <section className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 shadow-sm">
        <label className="flex items-center gap-2 rounded-[16px] bg-[#F7F4EF] px-4 py-3 text-[#7A756C]">
          <Search className="w-4 h-4" />
          <input value={keyword} onChange={event => setKeyword(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[13px] text-[#1D1B16] outline-none" placeholder="搜索标题、平台或内容" />
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="内容状态">
          {filters.map(filter => {
            const count = filter.key === 'all' ? items.length : items.filter(item => item.status === filter.key).length;
            return <button key={filter.key} role="tab" aria-selected={active === filter.key} onClick={() => setActive(filter.key)} className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-bold transition ${active === filter.key ? 'bg-[#6750A4] text-white' : 'bg-[#F5F2ED] text-[#6F6A61]'}`}>{filter.label} {count}</button>;
          })}
        </div>
      </section>

      {feedback && <p role="status" className="rounded-[16px] bg-[#F1E9FF] px-4 py-3 text-[12px] font-medium text-[#4F378B]">{feedback}</p>}

      <section className="space-y-3">
        {visibleItems.map(item => {
          const meta = statusMeta[item.status];
          return (
            <article key={item.id} className="bg-white border border-[#E6E0D6] rounded-[24px] p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-[#F4F0FF] px-2 py-1 text-[11px] font-bold text-[#6750A4]">{item.platform}</span>
                  <span className="rounded-md bg-[#F5F5F5] px-2 py-1 text-[11px] font-medium text-[#6F6A61]">{item.style}</span>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${meta.className}`}>{meta.label}</span>
              </div>
              <button onClick={() => onContinue(item)} className="block w-full text-left">
                <h3 className="mt-3 text-[16px] font-bold leading-snug text-[#1D1B16]">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-relaxed text-[#7A756C]">{item.summary}</p>
                {item.sourceTopic && <p className="mt-3 rounded-[12px] bg-[#FAF8F5] px-3 py-2 text-[11px] text-[#7A756C]">灵感来源：{item.sourceTopic}</p>}
              </button>
              <div className="mt-4 flex items-center justify-between border-t border-[#EEE9E1] pt-4 text-[11px] text-[#A09C94]">
                <span>{item.words} 字 · {item.updatedAt}</span>
                <div className="flex items-center gap-1">
                  <button aria-label="复制内容" onClick={() => setFeedback('内容已复制（交互演示）')} className="grid h-9 w-9 place-items-center rounded-full bg-[#F7F4EF] text-[#49463D]"><Copy className="h-4 w-4" /></button>
                  <button aria-label="内容操作" aria-expanded={menuId === item.id} onClick={() => setMenuId(current => current === item.id ? null : item.id)} className="grid h-9 w-9 place-items-center rounded-full bg-[#F7F4EF] text-[#49463D]"><MoreHorizontal className="h-4 w-4" /></button>
                </div>
              </div>
              {menuId === item.id && <div className="mt-3 grid grid-cols-2 gap-2 rounded-[18px] bg-[#FAF8F5] p-3">
                <button onClick={() => onEdit(item)} className="flex items-center gap-2 rounded-[14px] bg-white px-3 py-3 text-[12px] font-bold text-[#49463D]"><Pencil className="h-4 w-4 text-[#6750A4]" /> 二次编辑</button>
                <button onClick={() => onPublish(item)} disabled={item.status === 'published'} className="flex items-center gap-2 rounded-[14px] bg-white px-3 py-3 text-[12px] font-bold text-[#49463D] disabled:opacity-40"><Send className="h-4 w-4 text-[#167A39]" /> {item.status === 'published' ? '已经发布' : '立即发布'}</button>
                <button onClick={() => onSchedule(item)} disabled={item.status === 'scheduled' || item.status === 'published'} className="flex items-center gap-2 rounded-[14px] bg-white px-3 py-3 text-[12px] font-bold text-[#49463D] disabled:opacity-40"><CalendarPlus className="h-4 w-4 text-[#8A4B08]" /> {item.status === 'scheduled' ? '已经排期' : '加入计划'}</button>
                <button onClick={() => setDeleteTarget(item)} className="flex items-center gap-2 rounded-[14px] bg-white px-3 py-3 text-[12px] font-bold text-[#B3261E]"><Trash2 className="h-4 w-4" /> 删除内容</button>
              </div>}
            </article>
          );
        })}
        {visibleItems.length === 0 && <div className="rounded-[24px] border border-dashed border-[#D8D1C7] bg-white px-6 py-14 text-center"><FileText className="mx-auto h-8 w-8 text-[#B0AAA1]" /><h3 className="mt-3 font-bold text-[#49463D]">这个状态下还没有内容</h3><p className="mt-1 text-[12px] text-[#8D877E]">可以切换筛选，或返回首页开始创作。</p></div>}
      </section>
      {deleteTarget && <div className="fixed inset-0 z-[600] flex items-end bg-black/40" role="presentation" onClick={() => setDeleteTarget(null)}><section role="dialog" aria-modal="true" aria-labelledby="delete-content-title" className="w-full rounded-t-[28px] bg-white p-6 pb-[max(28px,env(safe-area-inset-bottom))]" onClick={event => event.stopPropagation()}><div className="flex items-start justify-between"><div><h3 id="delete-content-title" className="text-[18px] font-bold text-[#1D1B16]">删除这篇内容？</h3><p className="mt-2 text-[13px] leading-relaxed text-[#7A756C]">“{deleteTarget.title}”将从内容库移除，已有发布计划也应同步解除。</p></div><button aria-label="关闭删除确认" onClick={() => setDeleteTarget(null)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F5F2ED]"><X className="h-4 w-4" /></button></div><div className="mt-6 flex gap-3"><button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-full border border-[#D8D1C7] py-3.5 text-[13px] font-bold text-[#49463D]">保留内容</button><button onClick={() => { onDelete(deleteTarget.id); setDeleteTarget(null); setMenuId(null); setFeedback('内容已删除'); }} className="flex-1 rounded-full bg-[#B3261E] py-3.5 text-[13px] font-bold text-white">确认删除</button></div></section></div>}
    </div>
  );
};
