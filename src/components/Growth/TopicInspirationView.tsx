import React, { useMemo, useState } from 'react';
import { ArrowLeft, Bookmark, BookmarkCheck, Compass, PenTool, RefreshCw, Settings, Sparkles, X } from 'lucide-react';
import { ContentPersonaView } from './ContentPersonaView';

interface Topic { id: string; category: 'pain_point' | 'knowledge' | 'case' | 'brand'; title: string; targetUser: string; reason: string; formats: string[]; tags: string[]; }
interface TopicInspirationViewProps { onBack: () => void; onGoToContentGenerator: (topic?: string) => void; savedTopics: string[]; onSavedTopicsChange: (ids: string[]) => void; }

const topics: Topic[] = [
  { id: 't1', category: 'pain_point', title: '为什么越努力的人越容易陷入内耗？', targetUser: '25-35岁职场人群', reason: '近期“工作压力”和“自我否定”的关注度持续上升，与你的职场心理方向高度匹配。', formats: ['小红书笔记', '短视频'], tags: ['职场压力', '内耗'] },
  { id: 't2', category: 'pain_point', title: '总是害怕让别人失望，该如何练习拒绝？', targetUser: '习惯讨好、难以拒绝的人', reason: '边界感是来访者常见困扰，适合用具体练习建立专业信任。', formats: ['小红书笔记', '朋友圈'], tags: ['边界感', '人际关系'] },
  { id: 't3', category: 'knowledge', title: '什么是情绪耗竭？三个信号帮你识别', targetUser: '长期处于高压状态的上班族', reason: '把概念转化成可观察的日常信号，更容易被收藏和分享。', formats: ['小红书笔记', '公众号文章'], tags: ['情绪管理', '心理科普'] },
  { id: 't4', category: 'case', title: '一个总说“没事”的人，可能正在经历什么？', targetUser: '习惯压抑情绪的人', reason: '从生活化场景切入，适合展示理解问题的方式，不涉及诊断结论。', formats: ['公众号文章', '短视频'], tags: ['情绪表达', '案例洞察'] },
  { id: 't5', category: 'brand', title: '做咨询这些年，我看到最多的情绪困扰是什么？', targetUser: '正在了解心理支持的泛人群', reason: '用从业观察说明你的服务方式，帮助用户建立初步信任。', formats: ['小红书笔记', '朋友圈'], tags: ['个人品牌', '经验分享'] },
];
export const TopicInspirationView: React.FC<TopicInspirationViewProps> = ({ onBack, onGoToContentGenerator, savedTopics, onSavedTopicsChange }) => {
  const [showPersonaConfig, setShowPersonaConfig] = useState(false);
  const [batch, setBatch] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [feedback, setFeedback] = useState('');
  const visibleTopics = useMemo(() => {
    const offset = (batch * 3) % topics.length;
    return [...topics.slice(offset), ...topics.slice(0, offset)].slice(0, 3);
  }, [batch]);

  if (showPersonaConfig) return <ContentPersonaView onBack={() => setShowPersonaConfig(false)} onComplete={() => setShowPersonaConfig(false)} />;

  const toggleSave = (id: string) => {
    const saved = savedTopics.includes(id);
    onSavedTopicsChange(saved ? savedTopics.filter(topicId => topicId !== id) : [...savedTopics, id]);
    setFeedback(saved ? '已移出灵感池' : '已加入灵感池');
  };

  return <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 min-h-full pb-8">
    <header className="flex items-center justify-between gap-3 pb-1">
      <div className="flex items-center gap-3 min-w-0"><button onClick={onBack} aria-label="返回增长首页" className="w-10 h-10 shrink-0 flex items-center justify-center bg-white border border-[#E6E0D6] rounded-full text-[#49463D] active:scale-95 transition shadow-sm"><ArrowLeft className="w-5 h-5" /></button><div className="min-w-0"><h2 className="text-xl font-bold text-[#1D1B16] flex items-center gap-2">灵感中心 <Sparkles className="w-5 h-5 text-[#6750A4]" /></h2><p className="text-[12px] text-[#7A756C] font-medium mt-0.5">收藏灵感，或直接带入内容创作</p></div></div>
      <button onClick={() => setShowPersonaConfig(true)} className="shrink-0 text-[12px] text-[#4F378B] font-bold flex items-center gap-1 bg-[#EADDFF] px-3 py-2 rounded-full"><Settings className="w-3.5 h-3.5" /> 内容定位</button>
    </header>

    <section className="rounded-[24px] border border-[#D8C8FF] bg-gradient-to-br from-[#F1E9FF] to-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-white text-[#6750A4]"><Compass className="h-5 w-5" /></span><div className="min-w-0 flex-1"><h3 className="text-[15px] font-bold text-[#1D1B16]">当前内容方向</h3><p className="mt-1 text-[12px] font-medium leading-relaxed text-[#6F6A61]">职场心理 · 25—35岁职场人群 · 温暖实用</p></div><button onClick={() => { setBatch(current => current + 1); setFeedback('已按当前内容方向更新一批灵感'); }} className="shrink-0 flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[12px] font-bold text-[#6750A4] shadow-sm active:scale-95 transition"><RefreshCw className="h-3.5 w-3.5" /> 换一批</button></div></section>
    {feedback && <p role="status" className="rounded-[14px] bg-[#E8F7EC] px-4 py-3 text-[12px] font-medium text-[#167A39]">{feedback}</p>}

    <section className="space-y-3">{visibleTopics.map(topic => {
      const saved = savedTopics.includes(topic.id);
      return <article key={topic.id} className="rounded-[24px] border border-[#E6E0D6] bg-white p-5 shadow-sm"><div className="flex flex-wrap gap-2">{topic.tags.map(tag => <span key={tag} className="rounded-md bg-[#F5F2ED] px-2 py-1 text-[11px] font-bold text-[#6F6A61]">{tag}</span>)}</div><button onClick={() => setSelectedTopic(topic)} className="mt-3 w-full text-left"><h3 className="text-[16px] font-bold leading-snug text-[#1D1B16]">{topic.title}</h3><p className="mt-2 text-[12px] font-medium text-[#7A756C]">适合：{topic.targetUser}</p></button><div className="mt-4 flex gap-2"><button onClick={() => toggleSave(topic.id)} className={`flex-1 flex items-center justify-center gap-1.5 rounded-full border py-3 text-[12px] font-bold ${saved ? 'border-[#D0BCFF] bg-[#F1E9FF] text-[#4F378B]' : 'border-[#D8D1C7] bg-white text-[#49463D]'}`}>{saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}{saved ? '已加入灵感池' : '加入灵感池'}</button><button onClick={() => onGoToContentGenerator(topic.title)} className="flex-[1.25] flex items-center justify-center gap-1.5 rounded-full bg-[#6750A4] py-3 text-[12px] font-bold text-white"><PenTool className="h-4 w-4" /> 用灵感创作</button></div></article>;
    })}</section>

    {selectedTopic && <div className="fixed inset-0 z-[500] flex items-end bg-black/40" role="presentation" onClick={() => setSelectedTopic(null)}><section role="dialog" aria-modal="true" className="w-full rounded-t-[30px] bg-white p-6 pb-[max(30px,env(safe-area-inset-bottom))]" onClick={event => event.stopPropagation()}><div className="flex items-start justify-between"><span className="rounded-md bg-[#F1E9FF] px-2 py-1 text-[11px] font-bold text-[#6750A4]">内容灵感</span><button aria-label="关闭" onClick={() => setSelectedTopic(null)} className="grid h-9 w-9 place-items-center rounded-full bg-[#F5F2ED]"><X className="h-4 w-4" /></button></div><h3 className="mt-4 text-[20px] font-bold leading-snug text-[#1D1B16]">{selectedTopic.title}</h3><div className="mt-5 rounded-[18px] bg-[#FAF8F5] p-4"><p className="text-[12px] font-bold text-[#6750A4]">为什么推荐</p><p className="mt-2 text-[13px] font-medium leading-relaxed text-[#49463D]">{selectedTopic.reason}</p></div><div className="mt-5 flex gap-3"><button onClick={() => toggleSave(selectedTopic.id)} className={`flex-1 flex items-center justify-center gap-2 rounded-[18px] border py-4 text-[13px] font-bold ${savedTopics.includes(selectedTopic.id) ? 'border-[#D0BCFF] bg-[#F1E9FF] text-[#4F378B]' : 'border-[#D8D1C7] text-[#49463D]'}`}>{savedTopics.includes(selectedTopic.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}{savedTopics.includes(selectedTopic.id) ? '已加入灵感池' : '加入灵感池'}</button><button onClick={() => onGoToContentGenerator(selectedTopic.title)} className="flex-[1.25] rounded-[18px] bg-[#6750A4] py-4 text-[13px] font-bold text-white">用灵感创作</button></div></section></div>}
  </div>;
};
