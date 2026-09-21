import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ChevronRight, 
  Lightbulb, FileText, Calendar, 
  Users, MessageSquare, Globe, Heart, Share2,
  X, Link as LinkIcon
} from 'lucide-react';
import { ConsultantProfile, ViralVoucher } from '../../types';
import { TopicInspirationView } from './TopicInspirationView';
import { ContentGeneratorView } from './ContentGeneratorView';
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
  const [viewMode, setViewMode] = useState<'main' | 'topic_inspiration' | 'content_generator' | 'publish_plan' | 'private_traffic' | 'consulting_entry'>(() => new URLSearchParams(window.location.search).has('profile') ? 'private_traffic' : new URLSearchParams(window.location.search).get('plan') === 'publish' ? 'publish_plan' : 'main');
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
          setViewMode('content_generator');
        }}
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
      />
    );
  }

  if (viewMode === 'publish_plan') {
    return (
      <PublishPlanView 
        onBack={closePublishPlan}
        store={publishStore}
        specialties={consultant.specialties}
        onGoToContentGenerator={(topic) => { setPassedTopic(topic); setFromPublishPlan(true); setViewMode('content_generator'); }}
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
        
        <div className="space-y-3">
          <button 
            onClick={() => setViewMode('topic_inspiration')}
            className="w-full flex items-center gap-4 p-4 bg-[#FAF8F5] rounded-[20px] border border-[#ECE6DC] hover:bg-[#EAE5DB] transition text-left group"
          >
            <div className="w-12 h-12 rounded-[16px] bg-[#FFDF99] text-[#7A2E0E] flex items-center justify-center shrink-0 group-active:scale-95 transition">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[15px] text-[#1D1B16]">选题灵感</div>
              <div className="text-[12px] text-[#7A756C] mt-0.5 font-medium">挖掘你的擅长生成热门选题</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#A09C94] group-hover:text-[#1D1B16] transition" />
          </button>
          
          <button 
            onClick={() => setViewMode('content_generator')}
            className="w-full flex items-center gap-4 p-4 bg-[#FAF8F5] rounded-[20px] border border-[#ECE6DC] hover:bg-[#EAE5DB] transition text-left group"
          >
            <div className="w-12 h-12 rounded-[16px] bg-[#D3E3FD] text-[#0842A0] flex items-center justify-center shrink-0 group-active:scale-95 transition">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[15px] text-[#1D1B16]">内容生成</div>
              <div className="text-[12px] text-[#7A756C] mt-0.5 font-medium">小红书/公众号/视频脚本</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#A09C94] group-hover:text-[#1D1B16] transition" />
          </button>
          
          <button 
            onClick={openPublishPlan}
            className="w-full flex items-center gap-4 p-4 bg-[#FAF8F5] rounded-[20px] border border-[#ECE6DC] hover:bg-[#EAE5DB] transition text-left group"
          >
            <div className="w-12 h-12 rounded-[16px] bg-[#C4EED0] text-[#003912] flex items-center justify-center shrink-0 group-active:scale-95 transition">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[15px] text-[#1D1B16]">发布计划</div>
              <div className="text-[12px] text-[#7A756C] mt-0.5 font-medium">{publishStore.error ? '计划暂无法读取 · 查看详情' : (publishStore.scenario !== 'real' ? '演示 · ' : '') + entrySummary(publishStore.state)}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#A09C94] group-hover:text-[#1D1B16] transition" />
          </button>
        </div>
      </div>

    </div>
  );
};
