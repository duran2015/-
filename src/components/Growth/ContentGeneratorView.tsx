import React, { useState } from 'react';
import { 
  ArrowLeft, Sparkles, FileText, 
  MessageSquare, Video, PenTool,
  Copy, CalendarPlus, Share2
} from 'lucide-react';
import { ContentAsset } from './ContentLibraryView';

interface ContentGeneratorViewProps {
  onBack: () => void;
  initialTopic?: string;
  editingContent?: ContentAsset;
  startEditing?: boolean;
  onSaveContent: (asset: ContentAsset) => void;
  onAddToPublishPlan: (asset: ContentAsset) => void;
  onPublishContent?: (asset: ContentAsset) => void;
}

export const ContentGeneratorView: React.FC<ContentGeneratorViewProps> = ({ onBack, initialTopic, editingContent, startEditing = false, onSaveContent, onAddToPublishPlan, onPublishContent }) => {
  const [step, setStep] = useState<'input' | 'generating' | 'result'>(editingContent && !startEditing ? 'result' : 'input');
  
  // Form State
  const [topic, setTopic] = useState(initialTopic || editingContent?.sourceTopic || editingContent?.title || '');
  const [contentType, setContentType] = useState(editingContent?.platform || '小红书笔记');
  const [style, setStyle] = useState(editingContent?.style || '专业科普');
  const [selectedTitle, setSelectedTitle] = useState(editingContent?.title || '别让领导的一句话，毁了你一整天的心情');
  const [currentAsset, setCurrentAsset] = useState<ContentAsset | undefined>(editingContent);
  const [feedback, setFeedback] = useState(editingContent ? '已载入内容草稿' : '');
  
  const contentTypes = [
    { id: '小红书笔记', icon: <PenTool className="w-4 h-4" /> },
    { id: '朋友圈', icon: <MessageSquare className="w-4 h-4" /> },
    { id: '视频脚本', icon: <Video className="w-4 h-4" /> },
    { id: '公众号文章', icon: <FileText className="w-4 h-4" /> },
  ];

  const styles = ['专业科普', '温暖陪伴', '案例故事', '个人观点'];

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setStep('generating');
    setTimeout(() => {
      const generated: ContentAsset = {
        id: editingContent?.id || `content-${Date.now()}`,
        title: selectedTitle,
        summary: '识别自动化负面想法，用三个简单动作建立自己的情绪边界。',
        platform: contentType,
        style,
        status: 'ready',
        sourceTopic: initialTopic || undefined,
        updatedAt: '刚刚生成',
        words: 1135,
      };
      setCurrentAsset(generated);
      onSaveContent(generated);
      setStep('result');
    }, 2000);
  };

  const saveAsset = (status: ContentAsset['status'] = 'ready') => {
    const asset: ContentAsset = currentAsset || {
      id: editingContent?.id || `content-${Date.now()}`,
      title: selectedTitle, summary: '识别自动化负面想法，用三个简单动作建立自己的情绪边界。',
      platform: contentType, style, status, sourceTopic: initialTopic || undefined, updatedAt: '刚刚保存', words: 1135,
    };
    const next = { ...asset, title: selectedTitle, platform: contentType, style, status, updatedAt: '刚刚保存' };
    setCurrentAsset(next); onSaveContent(next); return next;
  };

  const InputView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      {initialTopic && <div className="rounded-[20px] border border-[#D8C8FF] bg-[#F1E9FF] p-4"><div className="flex items-center gap-2 text-[12px] font-bold text-[#6750A4]"><Sparkles className="h-4 w-4" /> 已选择灵感</div><p className="mt-2 text-[14px] font-bold leading-snug text-[#1D1B16]">{initialTopic}</p><p className="mt-1 text-[11px] text-[#7A756C]">灵感信息已带入，你可以继续补充或直接生成。</p></div>}
      {/* 核心输入区 */}
      <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-5 shadow-sm">
        <h3 className="font-bold text-[16px] text-[#1D1B16] mb-4 tracking-tight">你想写什么？</h3>
        <textarea 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例如：最近遇到很多职场新人，总是因为领导的一句话内耗一整天..."
          className="w-full bg-[#FAF8F5] border border-[#ECE6DC] rounded-[20px] p-4 text-[14px] text-[#1D1B16] placeholder-[#A09C94] focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] transition resize-none h-32"
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            <button 
              onClick={() => setTopic('职场焦虑')}
              className="text-[12px] bg-[#F5F5F5] text-[#7A756C] px-3 py-1.5 rounded-full hover:bg-[#EAE5DB] transition font-medium"
            >
              # 职场焦虑
            </button>
            <button 
              onClick={() => setTopic('讨好型人格')}
              className="text-[12px] bg-[#F5F5F5] text-[#7A756C] px-3 py-1.5 rounded-full hover:bg-[#EAE5DB] transition font-medium"
            >
              # 讨好型人格
            </button>
          </div>
          <span className="text-[12px] text-[#A09C94]">{topic.length}/200</span>
        </div>
      </div>

      {/* 选项区 */}
      <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-5 shadow-sm space-y-6">
        
        <div>
          <h3 className="font-bold text-[15px] text-[#1D1B16] mb-3 tracking-tight">内容类型</h3>
          <div className="grid grid-cols-2 gap-3">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setContentType(type.id)}
                className={`flex items-center gap-2 p-3 rounded-[16px] border transition active:scale-95 ${
                  contentType === type.id
                    ? 'bg-[#EADDFF] border-[#D0BCFF] text-[#4F378B] font-bold'
                    : 'bg-[#FAF8F5] border-[#ECE6DC] text-[#7A756C] hover:bg-[#EAE5DB] font-medium'
                }`}
              >
                {type.icon}
                <span className="text-[13px]">{type.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-[15px] text-[#1D1B16] mb-3 tracking-tight">内容风格</h3>
          <div className="flex flex-wrap gap-2">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-4 py-2 rounded-full border transition text-[13px] active:scale-95 ${
                  style === s
                    ? 'bg-[#EADDFF] border-[#D0BCFF] text-[#4F378B] font-bold'
                    : 'bg-[#FAF8F5] border-[#ECE6DC] text-[#7A756C] hover:bg-[#EAE5DB] font-medium'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action */}
      <button 
        onClick={handleGenerate}
        disabled={!topic.trim()}
        className={`w-full py-3.5 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 transition ${
          topic.trim() 
            ? 'bg-[#6750A4] text-white hover:bg-[#594294] active:scale-95 shadow-sm' 
            : 'bg-[#E7E0EC] text-[#A09C94] cursor-not-allowed'
        }`}
      >
        <Sparkles className="w-5 h-5" /> 开始生成
      </button>
    </div>
  );

  const GeneratingView = () => (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
      <div className="w-20 h-20 bg-[#EADDFF] rounded-full flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 border-4 border-[#D0BCFF] rounded-full animate-ping opacity-75"></div>
        <Sparkles className="w-8 h-8 text-[#6750A4] animate-pulse" />
      </div>
      <h3 className="font-bold text-[18px] text-[#1D1B16] mb-2">AI 正在创作中...</h3>
      <p className="text-[14px] text-[#7A756C] font-medium animate-pulse">正在结合「{style}」风格与您的专业定位</p>
      
      <div className="w-64 bg-[#E7E0EC] h-2 rounded-full mt-8 overflow-hidden">
        <div className="bg-[#6750A4] h-full rounded-full w-1/2 animate-[progress_2s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );

  const ResultView = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-2">
      <div className="flex items-center gap-2 rounded-[20px] border border-[#E6E0D6] bg-white px-4 py-3 shadow-sm">
        <span className="rounded-md bg-[#F1E9FF] px-2 py-1 text-[11px] font-bold text-[#6750A4]">{contentType}</span>
        <span className="rounded-md bg-[#F5F2ED] px-2 py-1 text-[11px] font-medium text-[#6F6A61]">{style}</span>
        <span className="ml-auto rounded-md bg-[#E8F7EC] px-2 py-1 text-[11px] font-bold text-[#167A39]">已生成</span>
        <span className="text-[11px] text-[#8D877E]">1135 字</span>
      </div>

      {/* 正文内容 */}
      <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#6750A4]" />
            <h3 className="font-bold text-[16px] text-[#1D1B16] tracking-tight">正文内容</h3>
          </div>
          <button onClick={() => setFeedback('全文已复制')} className="text-[12px] text-[#6750A4] font-bold flex items-center gap-1 bg-[#EADDFF] px-3 py-1.5 rounded-full hover:bg-[#D0BCFF] transition">
            <Copy className="w-3.5 h-3.5" /> 复制全文
          </button>
        </div>

        <h1 className="mb-5 text-[20px] font-bold leading-snug text-[#1D1B16]">{selectedTitle}</h1>
        
        <div className="text-[14px] text-[#49463D] leading-relaxed space-y-4 font-medium">
          <p><span className="font-bold text-[#6750A4]">【痛点引入】</span><br/>最近在咨询室里，我遇到好几位职场新人。他们都有一个共同的困扰：“今天领导叹了口气，我是不是做错了什么？”、“开会时老板没看我，是不是对我有意见？”</p>
          <p><span className="font-bold text-[#6750A4]">【心理解释】</span><br/>在心理学中，我们把这种现象称为「自动化负面思维」结合「过度理智化」。高敏感人群往往拥有极强的雷达，能捕捉到空气中一丝一毫的微表情。但问题在于，我们常常把别人的情绪，错误地归因于自己。</p>
          <p><span className="font-bold text-[#6750A4]">【行动建议】</span><br/>下次当你再次陷入这种内耗时，试试这 3 个心理急救法：<br/>1. 课题分离：他的情绪是他的课题，你的工作是你的课题。<br/>2. 寻找反证：除了“他对我不满”，还有其他可能吗？也许他只是太累了。<br/>3. 物理抽离：去接杯水，让紧绷的神经休息 3 分钟。</p>
          <p>你的专业价值，永远不需要通过讨好所有人来证明。💡</p>
        </div>
        
        <div className="flex gap-2 mt-5 pt-4 border-t border-[#F5F5F5]">
          <span className="text-[12px] text-[#4F378B] bg-[#EADDFF] px-2 py-1 rounded-md font-bold">#职场心理学</span>
          <span className="text-[12px] text-[#4F378B] bg-[#EADDFF] px-2 py-1 rounded-md font-bold">#拒绝内耗</span>
          <span className="text-[12px] text-[#4F378B] bg-[#EADDFF] px-2 py-1 rounded-md font-bold">#情绪管理</span>
        </div>
      </div>

      {feedback && <p role="status" className="rounded-[14px] bg-[#E8F7EC] px-4 py-3 text-[12px] font-medium text-[#167A39]">{feedback}</p>}

      {/* 底部操作 */}
      <div className="sticky bottom-0 z-30 -mx-1 flex gap-3 border-t border-[#E6E0D6] bg-[#F7F4EF]/95 px-1 py-3 backdrop-blur">
        <button onClick={() => onAddToPublishPlan(saveAsset('scheduled'))} className="flex-[1.35] py-3.5 rounded-full font-bold text-[14px] bg-[#6750A4] text-white active:scale-95 transition shadow-sm flex items-center justify-center gap-2"><CalendarPlus className="w-4 h-4" /> 加入发布计划</button>
        <button onClick={() => { const published = saveAsset('published'); onPublishContent?.(published); setFeedback('内容已发布'); }} className="flex-1 py-3.5 rounded-full font-bold text-[14px] bg-white border border-[#6750A4] text-[#6750A4] active:scale-95 transition shadow-sm flex items-center justify-center gap-2"><Share2 className="w-4 h-4" /> 立即发布</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 min-h-full pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E6E0D6] rounded-full text-[#49463D] hover:bg-[#FAF8F5] active:scale-95 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-[#1D1B16] flex items-center gap-2">
            {step === 'result' ? '文章详情' : editingContent ? '继续创作' : initialTopic ? '从灵感创作' : '直接创作'} {step !== 'result' && <Sparkles className="w-5 h-5 text-[#6750A4]" />}
          </h2>
          <p className="text-[13px] text-[#7A756C] font-medium mt-0.5">{step === 'result' ? '内容已自动保存到内容库' : '生成、编辑、保存与发布在这里连续完成'}</p>
        </div>
        {step === 'result' && <button onClick={() => setStep('input')} className="shrink-0 rounded-full bg-[#F1E9FF] px-4 py-2 text-[12px] font-bold text-[#6750A4]">编辑</button>}
      </div>

      {step === 'input' && <InputView />}
      {step === 'generating' && <GeneratingView />}
      {step === 'result' && <ResultView />}
      
    </div>
  );
};
