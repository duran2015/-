import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ChevronRight, 
  Lightbulb, FileText, Calendar, 
  Users, MessageSquare, Globe, Heart, Share2,
  X, Link as LinkIcon, BookMarked, Library
} from 'lucide-react';
import { ConsultantProfile, ViralVoucher } from '../../types';
import { TopicInspirationView } from './TopicInspirationView';
import { ContentGeneratorView } from './ContentGeneratorView';
import { ContentAsset, ContentLibraryView, defaultContentAssets } from './ContentLibraryView';
import { PublishPlanView } from './PublishPlanView';
import { usePublishPlans } from './usePublishPlans';
import { entrySummary } from './publishPlans';
import { PrivateTrafficLeadView } from './PrivateTrafficLeadView';
import { ConsultingEntryView } from './ConsultingEntryView';
import { createSnapshot, DEFAULT_CONTENT_IDS, snapshotLink } from './profileSharing';

interface GrowthTabProps {
  consultant: ConsultantProfile;
  vouchers: ViralVoucher[];
  onAddVoucher: (voucher: ViralVoucher) => void;
  onSubPageChange?: (isSubPage: boolean) => void;
  onNavigateToProfile?: () => void;
  onUpdateConsultant: (profile: ConsultantProfile) => void;
}

export const GrowthTab: React.FC<GrowthTabProps> = ({
  consultant,
  vouchers,
  onAddVoucher,
  onSubPageChange,
  onNavigateToProfile, onUpdateConsultant
}) => {
  const [viewMode, setViewMode] = useState<'main' | 'topic_inspiration' | 'content_generator' | 'content_library' | 'publish_plan' | 'private_traffic' | 'consulting_entry'>(() => new URLSearchParams(window.location.search).has('profile') ? 'private_traffic' : new URLSearchParams(window.location.search).get('plan') === 'publish' ? 'publish_plan' : 'main');
  const publishStore = usePublishPlans(consultant.id);
  const [fromPublishPlan, setFromPublishPlan] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');
  const profileShareUrl = snapshotLink(window.location.origin, createSnapshot(consultant, DEFAULT_CONTENT_IDS));
  const shareProfile = async (channel: 'wechat' | 'moments' | 'link') => {
    if (channel === 'link') {
      try {
        await navigator.clipboard.writeText(profileShareUrl);
        setShareFeedback('主页链接已复制');
      } catch {
        setShareFeedback('复制失败，请稍后重试');
      }
      return;
    }
    setShareFeedback(channel === 'wechat' ? '已选择微信好友（交互演示）' : '已选择朋友圈（交互演示）');
  };
  const openPublishPlan = () => {
    const url = new URL(window.location.href); url.searchParams.set('tab', 'growth'); url.searchParams.set('plan', 'publish');
    window.history.pushState(null, '', url); setViewMode('publish_plan');
  };
  const closePublishPlan = () => {
    const url = new URL(window.location.href); url.searchParams.delete('plan'); window.history.replaceState(null, '', url); setViewMode('main');
  };
  const [passedTopic, setPassedTopic] = useState<string | undefined>();
  const [savedTopics, setSavedTopics] = useState<string[]>(['t2']);
  const [contentAssets, setContentAssets] = useState<ContentAsset[]>(defaultContentAssets);
  const [editingContent, setEditingContent] = useState<ContentAsset | undefined>();
  const [startEditing, setStartEditing] = useState(false);
  const openProfile = (page: 'manage' | 'preview' | 'share') => {
    const url = new URL(window.location.href); url.searchParams.set('tab', 'growth'); url.searchParams.set('profile', page); url.searchParams.delete('content'); url.searchParams.delete('read');
    window.history.pushState(null, '', url); setViewMode('private_traffic'); window.scrollTo(0, 0);
  };
  const closeProfile = () => {
    const url = new URL(window.location.href); url.searchParams.delete('profile'); url.searchParams.delete('content'); url.searchParams.delete('read');
    window.history.replaceState(null, '', url); setViewMode('main'); window.scrollTo(0, 0);
  };
  React.useEffect(() => {
    const onPop = () => setViewMode(new URLSearchParams(window.location.search).has('profile') ? 'private_traffic' : new URLSearchParams(window.location.search).get('plan') === 'publish' ? 'publish_plan' : 'main');
    window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop);
  }, []);
  const [completionRate, setCompletionRate] = useState((consultant as any).completionRate || 80);

  React.useEffect(() => {
    setCompletionRate((consultant as any).completionRate || 80);
  }, [(consultant as any).completionRate]);

  React.useEffect(() => {
    if (onSubPageChange) {
      onSubPageChange(viewMode !== 'main');
    }
  }, [viewMode, onSubPageChange]);

  if (viewMode === 'consulting_entry') {
    return <ConsultingEntryView onBack={() => setViewMode('main')} />;
  }

  if (viewMode === 'private_traffic') {
    return <PrivateTrafficLeadView consultant={consultant} onUpdateConsultant={onUpdateConsultant} onBack={closeProfile} />;
  }

  if (viewMode === 'topic_inspiration') {
    return (
      <TopicInspirationView 
        onBack={() => setViewMode('main')} 
        onGoToContentGenerator={(topic) => {
          setPassedTopic(topic);
          setEditingContent(undefined);
          setStartEditing(false);
          setViewMode('content_generator');
        }}
        savedTopics={savedTopics}
        onSavedTopicsChange={setSavedTopics}
      />
    );
  }
  
  if (viewMode === 'content_generator') {
    return (
      <ContentGeneratorView 
        onBack={() => {
          setViewMode(fromPublishPlan ? 'publish_plan' : 'main');
          setFromPublishPlan(false);
          setPassedTopic(undefined);
        }} 
        initialTopic={passedTopic}
        editingContent={editingContent}
        startEditing={startEditing}
        onSaveContent={(asset) => {
          setContentAssets(previous => [asset, ...previous.filter(item => item.id !== asset.id)]);
        }}
        onAddToPublishPlan={(asset) => {
          setContentAssets(previous => [{ ...asset, status: 'scheduled', updatedAt: '刚刚加入发布计划' }, ...previous.filter(item => item.id !== asset.id)]);
          openPublishPlan();
        }}
        onPublishContent={(asset) => {
          setContentAssets(previous => [{ ...asset, status: 'published', updatedAt: '刚刚发布' }, ...previous.filter(item => item.id !== asset.id)]);
        }}
      />
    );
  }

  if (viewMode === 'content_library') {
    return <ContentLibraryView
      items={contentAssets}
      onBack={() => setViewMode('main')}
      onContinue={(item) => { setEditingContent(item); setStartEditing(false); setPassedTopic(item.sourceTopic || item.title); setViewMode('content_generator'); }}
      onEdit={(item) => { setEditingContent(item); setStartEditing(true); setPassedTopic(item.sourceTopic || item.title); setViewMode('content_generator'); }}
      onSchedule={(item) => { setContentAssets(previous => previous.map(asset => asset.id === item.id ? { ...asset, status: 'scheduled', updatedAt: '刚刚加入发布计划' } : asset)); openPublishPlan(); }}
      onPublish={(item) => { setContentAssets(previous => previous.map(asset => asset.id === item.id ? { ...asset, status: 'published', updatedAt: '刚刚发布' } : asset)); }}
      onDelete={(id) => setContentAssets(previous => previous.filter(asset => asset.id !== id))}
    />;
  }

  if (viewMode === 'publish_plan') {
    return (
      <PublishPlanView 
        onBack={closePublishPlan}
        store={publishStore}
        specialties={consultant.specialties}
        onGoToContentGenerator={(topic) => { setPassedTopic(topic); setEditingContent(undefined); setStartEditing(false); setFromPublishPlan(true); setViewMode('content_generator'); }}
      />
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200 min-h-full pb-4">
      {/* 顶部: 完成度卡片 */}
      {completionRate < 100 && (
        <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-6 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[16px] text-[#1D1B16] mb-1 tracking-tight">完善个人主页，提升被发现几率</h2>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#7A756C] font-medium">完成度 {completionRate}%</span>
              <button 
                onClick={() => {
                  setCompletionRate(100);
                  if (onNavigateToProfile) onNavigateToProfile();
                }}
                className="text-[13px] font-bold text-[#6750A4] hover:underline"
              >
                去完善 {'>'}
              </button>
            </div>
          </div>
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#EADDFF]" strokeWidth="4" />
              <circle 
                cx="18" cy="18" r="16" fill="none" 
                className="stroke-[#6750A4]" strokeWidth="4" 
                strokeDasharray="100" strokeDashoffset={100 - completionRate} strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-[12px] text-[#6750A4]">
              {completionRate}%
            </div>
          </div>
        </div>
      )}

      {/* Section 1: 我的主页 */}
      <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[16px] text-[#1D1B16] tracking-tight">我的主页</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setShareFeedback(''); setShowShareSheet(true); }}
              className="text-[13px] text-[#49463D] font-medium flex items-center gap-1 bg-[#F5F5F5] px-3 py-1.5 rounded-full hover:bg-[#EAE5DB] transition"
            >
              <Share2 className="w-3.5 h-3.5" /> 分享
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-[16px] bg-[#FAF8F5] flex items-center justify-center text-[#49463D] mb-2 hover:bg-[#EAE5DB] transition cursor-pointer">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-[#7A756C] mb-1 font-medium">访客数</span>
            <span className="text-[11px] text-[#132C0B] bg-[#D0BCFF] px-2 py-0.5 rounded-md font-bold">{(consultant as any).totalClients === 0 ? '暂无数据' : '本周 +28%'}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-[16px] bg-[#FAF8F5] flex items-center justify-center text-[#49463D] mb-2 hover:bg-[#EAE5DB] transition cursor-pointer">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-[#7A756C] mb-1 font-medium">被分享</span>
            <span className="text-[11px] text-[#132C0B] bg-[#D0BCFF] px-2 py-0.5 rounded-md font-bold">{(consultant as any).totalClients === 0 ? '暂无数据' : '本周 +12%'}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-[16px] bg-[#FAF8F5] flex items-center justify-center text-[#49463D] mb-2 hover:bg-[#EAE5DB] transition cursor-pointer">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-[#7A756C] mb-1 font-medium">收藏数</span>
            <span className="text-[11px] text-[#6750A4] bg-[#F1E9FF] px-2 py-0.5 rounded-md font-bold">待支持</span>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-[16px] bg-[#FAF8F5] flex items-center justify-center text-[#49463D] mb-2 hover:bg-[#EAE5DB] transition cursor-pointer">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-[#7A756C] mb-1 font-medium">咨询转化</span>
            <span className="text-[11px] text-[#6750A4] bg-[#F1E9FF] px-2 py-0.5 rounded-md font-bold">待支持</span>
          </div>
        </div>
      </div>

      {showShareSheet && (
        <div className="fixed inset-0 z-[500] flex items-end bg-black/35" role="presentation" onClick={() => setShowShareSheet(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-share-title"
            className="w-full rounded-t-[28px] bg-white px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-200"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#CAC4D0]" />
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 id="profile-share-title" className="text-[18px] font-bold text-[#1D1B16]">分享我的主页</h3>
                <p className="mt-1 text-[12px] text-[#7A756C]">分享公开资料与主页内容</p>
              </div>
              <button type="button" aria-label="关闭分享" onClick={() => setShowShareSheet(false)} className="grid h-10 w-10 place-items-center rounded-full bg-[#F5F2ED] text-[#49463D]">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button type="button" onClick={() => void shareProfile('wechat')} className="flex flex-col items-center gap-2 text-[13px] font-medium text-[#1D1B16]">
                <span className="grid h-14 w-14 place-items-center rounded-[18px] bg-[#DDF5DF] text-[#167A39]"><MessageSquare size={26} /></span>
                微信
              </button>
              <button type="button" onClick={() => void shareProfile('moments')} className="flex flex-col items-center gap-2 text-[13px] font-medium text-[#1D1B16]">
                <span className="grid h-14 w-14 place-items-center rounded-[18px] bg-[#E6F3FF] text-[#2467A8]"><Users size={26} /></span>
                朋友圈
              </button>
              <button type="button" onClick={() => void shareProfile('link')} className="flex flex-col items-center gap-2 text-[13px] font-medium text-[#1D1B16]">
                <span className="grid h-14 w-14 place-items-center rounded-[18px] bg-[#F1E9FF] text-[#6750A4]"><LinkIcon size={26} /></span>
                复制链接
              </button>
            </div>
            {shareFeedback && <p role="status" className="mt-5 rounded-[14px] bg-[#F5F2ED] px-4 py-3 text-center text-[12px] font-medium text-[#49463D]">{shareFeedback}</p>}
          </section>
        </div>
      )}

      {/* Section 2: AI内容助手 */}
      <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[16px] text-[#1D1B16] tracking-tight">AI内容助手</h3>
            <Sparkles className="w-4 h-4 text-[#6750A4]" />
          </div>
        </div>
        
        <p className="-mt-2 mb-4 text-[12px] font-medium text-[#7A756C]">从灵感出发，或带着明确主题直接开始</p>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setViewMode('topic_inspiration')}
            className="min-h-[152px] flex flex-col items-start p-4 bg-[#FFF7E7] rounded-[20px] border border-[#F2DCAA] hover:border-[#D7B96E] transition text-left group"
          >
            <div className="w-12 h-12 rounded-[16px] bg-[#FFDF99] text-[#7A2E0E] flex items-center justify-center shrink-0 group-active:scale-95 transition">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[15px] text-[#1D1B16] mt-3">从灵感开始</div>
              <div className="text-[12px] text-[#7A756C] mt-1 font-medium leading-relaxed">浏览推荐，选一个灵感开始创作</div>
            </div>
            <span className="mt-auto flex items-center text-[12px] font-bold text-[#7A2E0E]">去找灵感 <ChevronRight className="w-4 h-4" /></span>
          </button>
          
          <button 
            onClick={() => { setPassedTopic(undefined); setEditingContent(undefined); setStartEditing(false); setViewMode('content_generator'); }}
            className="min-h-[152px] flex flex-col items-start p-4 bg-[#EEF4FF] rounded-[20px] border border-[#D3E3FD] hover:border-[#9EBBEF] transition text-left group"
          >
            <div className="w-12 h-12 rounded-[16px] bg-[#D3E3FD] text-[#0842A0] flex items-center justify-center shrink-0 group-active:scale-95 transition">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[15px] text-[#1D1B16] mt-3">直接创作</div>
              <div className="text-[12px] text-[#7A756C] mt-1 font-medium leading-relaxed">已有主题，直接生成笔记、长文或脚本</div>
            </div>
            <span className="mt-auto flex items-center text-[12px] font-bold text-[#0842A0]">开始创作 <ChevronRight className="w-4 h-4" /></span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-6 shadow-sm">
        <h3 className="font-bold text-[16px] text-[#1D1B16] tracking-tight">我的内容资产</h3>
        <p className="mt-1 mb-3 text-[12px] font-medium text-[#7A756C]">灵感、内容与发布进度各归其位</p>
        <div className="divide-y divide-[#EEE9E1]">
          <button onClick={() => setViewMode('topic_inspiration')} className="w-full flex items-center gap-3 py-4 text-left group">
            <span className="grid h-11 w-11 place-items-center rounded-[15px] bg-[#FFF2D8] text-[#8A4B08]"><BookMarked className="w-5 h-5" /></span>
            <span className="flex-1"><b className="block text-[14px] text-[#1D1B16]">灵感池</b><small className="text-[11px] text-[#7A756C]">收藏后随时继续创作</small></span>
            <strong className="text-[13px] text-[#6750A4]">{savedTopics.length}</strong><ChevronRight className="w-4 h-4 text-[#A09C94]" />
          </button>
          <button onClick={() => setViewMode('content_library')} className="w-full flex items-center gap-3 py-4 text-left group">
            <span className="grid h-11 w-11 place-items-center rounded-[15px] bg-[#EEF4FF] text-[#0842A0]"><Library className="w-5 h-5" /></span>
            <span className="flex-1"><b className="block text-[14px] text-[#1D1B16]">内容库</b><small className="text-[11px] text-[#7A756C]">草稿、成稿和发布记录</small></span>
            <strong className="text-[13px] text-[#6750A4]">{contentAssets.length}</strong><ChevronRight className="w-4 h-4 text-[#A09C94]" />
          </button>
          <button onClick={openPublishPlan} className="w-full flex items-center gap-3 py-4 text-left group">
            <span className="grid h-11 w-11 place-items-center rounded-[15px] bg-[#E8F7EC] text-[#167A39]"><Calendar className="w-5 h-5" /></span>
            <span className="flex-1"><b className="block text-[14px] text-[#1D1B16]">发布计划</b><small className="text-[11px] text-[#7A756C]">{publishStore.error ? '计划暂无法读取' : entrySummary(publishStore.state)}</small></span>
            <ChevronRight className="w-4 h-4 text-[#A09C94]" />
          </button>
        </div>
      </div>

    </div>
  );
};
