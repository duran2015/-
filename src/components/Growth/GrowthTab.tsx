import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ChevronRight, 
  Lightbulb, FileText, Calendar, 
  Users, MessageSquare, Globe, Heart
} from 'lucide-react';
import { ConsultantProfile, ViralVoucher } from '../../types';
import { TopicInspirationView } from './TopicInspirationView';
import { ContentGeneratorView } from './ContentGeneratorView';
import { PublishPlanView } from './PublishPlanView';
import { PrivateTrafficLeadView } from './PrivateTrafficLeadView';
import { ConsultingEntryView } from './ConsultingEntryView';

interface GrowthTabProps {
  consultant: ConsultantProfile;
  vouchers: ViralVoucher[];
  onAddVoucher: (voucher: ViralVoucher) => void;
  onSubPageChange?: (isSubPage: boolean) => void;
}

export const GrowthTab: React.FC<GrowthTabProps> = ({
  consultant,
  vouchers,
  onAddVoucher,
  onSubPageChange,
}) => {
  const [viewMode, setViewMode] = useState<'main' | 'topic_inspiration' | 'content_generator' | 'publish_plan' | 'private_traffic' | 'consulting_entry'>('main');
  const [passedTopic, setPassedTopic] = useState<string | undefined>();

  React.useEffect(() => {
    if (onSubPageChange) {
      onSubPageChange(viewMode !== 'main');
    }
  }, [viewMode, onSubPageChange]);

  if (viewMode === 'consulting_entry') {
    return <ConsultingEntryView onBack={() => setViewMode('main')} />;
  }

  if (viewMode === 'private_traffic') {
    return <PrivateTrafficLeadView onBack={() => setViewMode('main')} />;
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
          setViewMode('main');
          setPassedTopic(undefined);
        }} 
        initialTopic={passedTopic}
      />
    );
  }

  if (viewMode === 'publish_plan') {
    return (
      <PublishPlanView 
        onBack={() => setViewMode('main')} 
        onGoToContentGenerator={() => setViewMode('content_generator')} 
      />
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200 min-h-full pb-4">
      {/* 顶部: 完成度卡片 */}
      <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-bold text-[16px] text-[#1D1B16] mb-1 tracking-tight">完善个人主页，提升被发现几率</h2>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#7A756C] font-medium">完成度 80%</span>
            <button className="text-[13px] font-bold text-[#6750A4] hover:underline">去完善 {'>'}</button>
          </div>
        </div>
        <div className="relative w-14 h-14 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#EADDFF]" strokeWidth="4" />
            <circle 
              cx="18" cy="18" r="16" fill="none" 
              className="stroke-[#6750A4]" strokeWidth="4" 
              strokeDasharray="100" strokeDashoffset="20" strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-[12px] text-[#6750A4]">
            80%
          </div>
        </div>
      </div>

      {/* Section 1: 我的主页 */}
      <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[16px] text-[#1D1B16] tracking-tight">我的主页</h3>
          <button className="text-[13px] text-[#49463D] font-medium flex items-center gap-0.5 bg-[#F5F5F5] px-3 py-1.5 rounded-full hover:bg-[#EAE5DB] transition">
            预览主页 <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-[16px] bg-[#FAF8F5] flex items-center justify-center text-[#49463D] mb-2 hover:bg-[#EAE5DB] transition cursor-pointer">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-[#7A756C] mb-1 font-medium">访客数</span>
            <span className="text-[11px] text-[#132C0B] bg-[#D0BCFF] px-2 py-0.5 rounded-md font-bold">本周 +28%</span>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-[16px] bg-[#FAF8F5] flex items-center justify-center text-[#49463D] mb-2 hover:bg-[#EAE5DB] transition cursor-pointer">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-[#7A756C] mb-1 font-medium">收藏数</span>
            <span className="text-[11px] text-[#132C0B] bg-[#D0BCFF] px-2 py-0.5 rounded-md font-bold">本周 +12%</span>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-[16px] bg-[#FAF8F5] flex items-center justify-center text-[#49463D] mb-2 hover:bg-[#EAE5DB] transition cursor-pointer">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-[#7A756C] mb-1 font-medium">被分享</span>
            <span className="text-[11px] text-[#132C0B] bg-[#D0BCFF] px-2 py-0.5 rounded-md font-bold">本周 +12%</span>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-[16px] bg-[#FAF8F5] flex items-center justify-center text-[#49463D] mb-2 hover:bg-[#EAE5DB] transition cursor-pointer">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-[#7A756C] mb-1 font-medium">咨询转化</span>
            <span className="text-[11px] text-[#132C0B] bg-[#D0BCFF] px-2 py-0.5 rounded-md font-bold">本周 +18%</span>
          </div>
        </div>
      </div>

      {/* Section 2: AI内容助手 */}
      <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[16px] text-[#1D1B16] tracking-tight">AI内容助手</h3>
            <Sparkles className="w-4 h-4 text-[#6750A4]" />
          </div>
          <button className="text-[13px] text-[#49463D] font-medium flex items-center gap-0.5 bg-[#F5F5F5] px-3 py-1.5 rounded-full hover:bg-[#EAE5DB] transition">
            更多工具 <ChevronRight className="w-3.5 h-3.5" />
          </button>
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
            onClick={() => setViewMode('publish_plan')}
            className="w-full flex items-center gap-4 p-4 bg-[#FAF8F5] rounded-[20px] border border-[#ECE6DC] hover:bg-[#EAE5DB] transition text-left group"
          >
            <div className="w-12 h-12 rounded-[16px] bg-[#C4EED0] text-[#003912] flex items-center justify-center shrink-0 group-active:scale-95 transition">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[15px] text-[#1D1B16]">发布计划</div>
              <div className="text-[12px] text-[#7A756C] mt-0.5 font-medium">本周待发布 3 篇内容</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#A09C94] group-hover:text-[#1D1B16] transition" />
          </button>
        </div>
      </div>

      {/* Section 3: 获客助手 */}
      <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[16px] text-[#1D1B16] tracking-tight">获客助手</h3>
          <button className="text-[13px] text-[#49463D] font-medium flex items-center gap-0.5 bg-[#F5F5F5] px-3 py-1.5 rounded-full hover:bg-[#EAE5DB] transition">
            更多工具 <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => setViewMode('private_traffic')}
            className="flex flex-col items-center justify-center text-center p-4 bg-[#FAF8F5] rounded-[20px] border border-[#ECE6DC] hover:bg-[#EAE5DB] transition group"
          >
            <div className="w-12 h-12 rounded-[16px] bg-[#EADDFF] text-[#4F378B] flex items-center justify-center mb-3 group-active:scale-95 transition">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[13px] font-bold text-[#1D1B16]">私域引流</span>
          </button>
          
          <button 
            onClick={() => setViewMode('consulting_entry')}
            className="flex flex-col items-center justify-center text-center p-4 bg-[#FAF8F5] rounded-[20px] border border-[#ECE6DC] hover:bg-[#EAE5DB] transition group"
          >
            <div className="w-12 h-12 rounded-[16px] bg-[#D3E3FD] text-[#0842A0] flex items-center justify-center mb-3 group-active:scale-95 transition">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-[13px] font-bold text-[#1D1B16]">咨询入口</span>
          </button>
          
          <button className="flex flex-col items-center justify-center text-center p-4 bg-[#FAF8F5] rounded-[20px] border border-[#ECE6DC] hover:bg-[#EAE5DB] transition group">
              <div className="w-12 h-12 rounded-[16px] bg-[#C4EED0] text-[#003912] flex items-center justify-center mb-3 group-active:scale-95 transition">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="font-bold text-[14px] text-[#1D1B16] mb-1">社群运营</div>
              <div className="text-[11px] text-[#7A756C] font-medium">长期关系维护</div>
            </button>
        </div>
      </div>
      
    </div>
  );
};
