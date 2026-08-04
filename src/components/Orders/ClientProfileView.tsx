import React, { useState } from 'react';
import { 
  ArrowLeft, User, Phone, ShieldAlert, Heart, Activity, FileText, Calendar, 
  CheckCircle2, Clock, Sparkles, MessageSquare, AlertCircle, Bookmark, Video 
} from 'lucide-react';
import { ClientProfile, Order } from '../../types';

interface ClientProfileViewProps {
  client: ClientProfile;
  relatedOrder?: Order;
  onBack: () => void;
  onEnterRoom?: (order: Order) => void;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({
  client,
  relatedOrder,
  onBack,
  onEnterRoom,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'intake' | 'history' | 'checkins'>('intake');

  const getRiskBadge = (level: ClientProfile['riskLevel']) => {
    switch (level) {
      case 'low':
        return (
          <span className="bg-[#E8E2D5] text-[#2E521C] border border-[#CBE6C3] text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E521C]" />
            <span>评估：低风险</span>
          </span>
        );
      case 'attention':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>评估：关注级</span>
          </span>
        );
      case 'high':
        return (
          <span className="bg-rose-100 text-rose-900 border border-rose-300 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
            <span>评估：重点关注</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Top Header with Back Navigation */}
      <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full border border-[#E6E0D6] bg-[#FAF8F5] text-[#1D1B16] hover:bg-[#E8E2D5] transition active:scale-95 flex items-center justify-center"
            title="返回"
          >
            <ArrowLeft className="w-4 h-4 text-[#2E521C]" />
          </button>
          <div className="h-4 w-[1px] bg-[#E6E0D6]" />
          <div>
            <h2 className="font-bold text-base text-[#1D1B16] flex items-center gap-2">
              来访者全景心理档案
              <span className="text-xs font-normal text-[#7A756C]">({client.name})</span>
            </h2>
          </div>
        </div>

        <div>{getRiskBadge(client.riskLevel)}</div>
      </div>

      {/* Client Overview Banner */}
      <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-5 shadow-2xs space-y-4">
        <div className="flex items-start gap-4">
          <img
            src={client.avatar}
            alt={client.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-[#386A20]/20 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-bold text-lg text-[#1D1B16]">{client.name}</h3>
              <span className="text-xs text-[#7A756C] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#ECE6DC] font-medium">
                {client.gender} • {client.age}岁
              </span>
              <span className="text-xs text-[#7A756C] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#ECE6DC] font-medium">
                建档日期：{client.intakeDate}
              </span>
            </div>

            <p className="text-xs text-[#7A756C] mt-1.5">
              <strong className="font-semibold text-[#1D1B16]">{client.occupation}</strong> | 现居地址: {client.city}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('intake')}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition active:scale-95 ${
              activeSubTab === 'intake'
                ? 'bg-[#2E521C] text-white shadow-2xs'
                : 'bg-[#FAF8F5] text-[#49463D] border border-[#ECE6DC] hover:bg-[#E8E2D5]'
            }`}
          >
            本次预约
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition active:scale-95 ${
              activeSubTab === 'history'
                ? 'bg-[#2E521C] text-white shadow-2xs'
                : 'bg-[#FAF8F5] text-[#49463D] border border-[#ECE6DC] hover:bg-[#E8E2D5]'
            }`}
          >
            过往记录 ({client.sessionLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('checkins')}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition active:scale-95 ${
              activeSubTab === 'checkins'
                ? 'bg-[#2E521C] text-white shadow-2xs'
                : 'bg-[#FAF8F5] text-[#49463D] border border-[#ECE6DC] hover:bg-[#E8E2D5]'
            }`}
          >
            日常打卡
          </button>
        </div>
      </div>

      {/* Tab Content Areas */}
      <div className="space-y-4 text-xs">
        
        {/* Tab 1: Intake & Psychometrics */}
        {activeSubTab === 'intake' && (
          <div className="space-y-4">
            
            {/* Psychological Test Scores */}
            <div className="bg-white p-5 rounded-[24px] border border-[#E6E0D6] shadow-2xs space-y-3">
              <div className="font-bold text-sm text-[#1D1B16] flex items-center justify-between pb-2 border-b border-[#ECE6DC]">
                <span className="flex items-center gap-2 text-[#2E521C]">
                  <Activity className="w-4 h-4 text-[#A23F1E]" />
                  心理量表自评
                </span>
                <span className="text-xs text-[#7A756C]">入组首次评测</span>
              </div>

              {(!client.phq9Score && !client.gad7Score) ? (
                <div className="text-center py-6 text-[#7A756C]">本次未进行量表评测</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {client.phq9Score && (
                    <div className="bg-[#FAF8F5] p-4 rounded-[16px] border border-[#ECE6DC]">
                      <div className="text-xs text-[#7A756C]">PHQ-9 抑郁症状群筛查</div>
                      <div className="text-xl font-bold text-[#1D1B16] font-mono mt-1">
                        {client.phq9Score.score} <span className="text-xs font-normal text-[#2E521C]">/ 27分</span>
                      </div>
                      <div className="text-xs text-[#2E521C] font-semibold mt-1 bg-white px-2.5 py-0.5 rounded-full inline-block border border-[#ECE6DC]">
                        {client.phq9Score.level}
                      </div>
                    </div>
                  )}

                  {client.gad7Score && (
                    <div className="bg-[#FAF8F5] p-4 rounded-[16px] border border-[#ECE6DC]">
                      <div className="text-xs text-[#7A756C]">GAD-7 广泛性焦虑障碍筛查</div>
                      <div className="text-xl font-bold text-[#1D1B16] font-mono mt-1">
                        {client.gad7Score.score} <span className="text-xs font-normal text-amber-800">/ 21分</span>
                      </div>
                      <div className="text-xs text-amber-900 font-semibold mt-1 bg-white px-2.5 py-0.5 rounded-full inline-block border border-[#ECE6DC]">
                        {client.gad7Score.level}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Related Order Intake Form Info */}
            <div className="bg-white p-5 rounded-[24px] border border-[#E6E0D6] shadow-2xs space-y-3">
              <div className="font-bold text-sm text-[#1D1B16] flex items-center justify-between pb-2 border-b border-[#ECE6DC]">
                <span className="flex items-center gap-2 text-[#2E521C]">
                  <FileText className="w-4 h-4 text-[#2E521C]" />
                  预约诉求描述
                </span>
                {relatedOrder && (
                  <span className="text-xs bg-[#E8E2D5] text-[#2E521C] px-2.5 py-0.5 rounded-full font-mono">
                    {relatedOrder.orderNo}
                  </span>
                )}
              </div>

              {(!relatedOrder || !relatedOrder.intakeForm) ? (
                 <div className="text-center py-6 text-[#7A756C]">本次预约暂未填写诉求描述</div>
              ) : (
                <div className="space-y-3 text-[#49463D] leading-relaxed">
                  <div>
                    <span className="text-[#7A756C] block mb-1 font-semibold text-xs">主要困扰：</span>
                    <p className="bg-[#FAF8F5] p-3.5 rounded-[16px] border border-[#ECE6DC] text-[#1D1B16] break-words whitespace-pre-wrap">
                      {relatedOrder.intakeForm.primaryIssueDetail}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#7A756C] block mb-1 font-semibold text-xs">咨询期望：</span>
                    <p className="bg-[#FAF8F5] p-3.5 rounded-[16px] border border-[#ECE6DC] text-[#1D1B16] break-words whitespace-pre-wrap">
                      {relatedOrder.intakeForm.expectations}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-[14px] border border-[#ECE6DC] text-xs">
                    <span className="text-[#7A756C]">咨询经历：</span>
                    <span className="font-semibold text-[#1D1B16]">
                      {relatedOrder.intakeForm.hasCounselingHistory
                        ? relatedOrder.intakeForm.previousCounselingType || '有相关经验'
                        : '首次接受心理咨询'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-[14px] border border-[#ECE6DC] text-xs">
                    <span className="text-[#7A756C]">知情同意书：</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> 已签署
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Counseling History & Working Notes */}
        {activeSubTab === 'history' && (
          <div className="relative max-w-full">
            {/* Vertical Line */}
            <div className="absolute left-[85px] top-[24px] bottom-4 w-[2px] bg-[#E6E0D6]"></div>
            
            <div className="space-y-6">
              {/* Session Timeline */}
              {client.sessionLogs.length === 0 ? (
                <div className="relative flex items-start gap-3 sm:gap-4">
                  <div className="w-[75px] text-right pt-5 shrink-0 text-xs font-semibold text-[#7A756C]">
                    无记录
                  </div>
                  <div className="relative mt-5 shrink-0 z-10 flex items-center justify-center w-5 h-5 bg-[#FAF8F5] rounded-full">
                    <div className="w-2.5 h-2.5 bg-[#D6D0C4] rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white p-8 rounded-[24px] border border-[#E6E0D6] text-center text-[#7A756C] mt-1">
                    <Clock className="w-8 h-8 text-[#2E521C] mx-auto mb-2 opacity-50" />
                    <span className="text-sm font-semibold block text-[#1D1B16]">暂无过往咨询记录</span>
                  </div>
                </div>
              ) : (
                [...client.sessionLogs]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((log) => (
                  <div key={log.sessionNo} className="relative flex items-start gap-3 sm:gap-4">
                    <div className="w-[75px] text-right pt-5 shrink-0 font-mono text-sm font-bold text-[#1D1B16]">
                      {log.date.substring(5)}
                      <div className="text-[10px] text-[#7A756C] font-sans font-normal mt-0.5">{log.date.substring(0, 4)}</div>
                    </div>
                    <div className="relative mt-5 shrink-0 z-10 flex items-center justify-center w-5 h-5 bg-[#FAF8F5] rounded-full">
                      <div className="w-2.5 h-2.5 bg-[#2E521C] rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-white p-4 sm:p-5 rounded-[24px] border border-[#E6E0D6] shadow-2xs space-y-4 mt-1">
                      <div className="text-sm text-[#1D1B16]">
                        <div className="mb-2">
                          <span className="text-[#7A756C]">咨询师：</span>
                          <span className="font-semibold">本机构咨询师</span>
                        </div>
                        <div className="mb-3">
                          <span className="text-[#7A756C]">咨询主题：</span>
                          <span className="font-semibold">{log.topic}</span>
                        </div>
                        <div className="bg-[#FAF8F5] p-3.5 rounded-[16px] border border-[#ECE6DC] text-[#49463D] text-xs leading-relaxed break-words whitespace-pre-wrap">
                          <span className="text-[#7A756C] font-semibold mb-1.5 block">咨询小结摘抄：</span>
                          {log.keyBreakthrough}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Mood Check-in Logs */}
        {activeSubTab === 'checkins' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-[24px] border border-[#E6E0D6] shadow-2xs space-y-3">
              <div className="font-bold text-sm text-[#1D1B16] flex items-center justify-between pb-2 border-b border-[#ECE6DC]">
                <span>情绪打卡记录</span>
                <span className="text-xs text-[#7A756C]">近期心情记录</span>
              </div>

              {client.preSessionCheckIns.length === 0 ? (
                <div className="text-center py-6 text-[#7A756C]">未录入近期情绪打卡数据</div>
              ) : (
                <div className="space-y-2.5 pt-1">
                  {client.preSessionCheckIns.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FAF8F5] p-3.5 rounded-[16px] border border-[#ECE6DC] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono text-xs text-[#7A756C]">{item.date}</div>
                        <div className="font-semibold text-[#1D1B16] text-xs mt-1 break-words whitespace-pre-wrap max-w-full">
                          诱发压力源：{item.distressTrigger}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <div className="text-xs font-bold text-[#A23F1E] font-mono">
                          焦虑指数 {item.moodScore}/10
                        </div>
                        <div className="text-[11px] text-[#7A756C] mt-0.5">睡眠时间: {item.sleepHours}小时</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Footer Bottom Actions Bar */}
      {relatedOrder && relatedOrder.status === 'scheduled' && onEnterRoom && (
        <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 shadow-2xs flex items-center justify-end">
          <button
            onClick={() => onEnterRoom(relatedOrder)}
            className="px-6 py-2.5 rounded-full bg-[#2E521C] text-white text-sm font-semibold hover:bg-[#234114] shadow-2xs active:scale-95 transition flex items-center gap-1.5"
          >
            <Video className="w-4 h-4 text-emerald-200" />
            <span>进入咨询室</span>
          </button>
        </div>
      )}

    </div>
  );
};
