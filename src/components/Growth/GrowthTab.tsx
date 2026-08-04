import React, { useState } from 'react';
import { 
  TrendingUp, Users, Share2, Sparkles, QrCode, Ticket, Copy, Download, 
  Check, DollarSign, Award, ArrowUpRight, Plus, RefreshCw, Eye 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ConsultantProfile, ViralVoucher } from '../../types';
import { REVENUE_MONTHLY_DATA } from '../../data/mockData';

interface GrowthTabProps {
  consultant: ConsultantProfile;
  vouchers: ViralVoucher[];
  onAddVoucher: (voucher: ViralVoucher) => void;
  onOpenAiQuoteModal: () => void;
}

export const GrowthTab: React.FC<GrowthTabProps> = ({
  consultant,
  vouchers,
  onAddVoucher,
  onOpenAiQuoteModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'viral_tools'>('analytics');
  
  // Card customization states
  const [cardTheme, setCardTheme] = useState<'morandi_green' | 'warm_sand' | 'deep_ocean' | 'soft_rose'>('morandi_green');
  const [customQuote, setCustomQuote] = useState<string>(
    '在安全温暖的空间里，陪你一起看清情绪背后的需求，找回内心的平静。'
  );
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // New voucher modal
  const [showAddVoucherModal, setShowAddVoucherModal] = useState<boolean>(false);
  const [newVoucherTitle, setNewVoucherTitle] = useState<string>('【好友同享】15分钟倾听体验券');
  const [newVoucherPrice, setNewVoucherPrice] = useState<number>(19);

  const themeStyles = {
    morandi_green: { bg: 'bg-[#5A6A50]', text: 'text-white', badge: 'bg-[#4D5B44]', accent: 'text-emerald-200' },
    warm_sand: { bg: 'bg-[#D48C70]', text: 'text-white', badge: 'bg-[#C27A5E]', accent: 'text-amber-100' },
    deep_ocean: { bg: 'bg-[#334155]', text: 'text-white', badge: 'bg-[#1E293B]', accent: 'text-sky-200' },
    soft_rose: { bg: 'bg-[#7E6266]', text: 'text-white', badge: 'bg-[#664C50]', accent: 'text-rose-200' },
  };

  const copyBusinessLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const newV: ViralVoucher = {
      id: `vouch_${Date.now()}`,
      title: newVoucherTitle,
      code: `GIFT${Math.floor(1000 + Math.random() * 9000)}`,
      discountType: 'amount_off',
      discountValue: 20,
      originalPrice: 39,
      voucherPrice: newVoucherPrice,
      claimedCount: 0,
      conversionCount: 0,
      isEnabled: true,
    };
    onAddVoucher(newV);
    setShowAddVoucherModal(false);
  };

  return (
    <div className="space-y-3">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between px-1 pt-1">
        <h1 className="text-base font-bold text-[#1D1B16]">执业增长</h1>
        <span className="text-xs text-[#7A756C]">数据分析与品牌推广</span>
      </div>

      {/* Sub tab navigation bar - M3 Segmented Control */}
      <div className="bg-[#FAF8F5] border border-[#ECE6DC] rounded-[18px] p-1.5 flex items-center gap-1.5 shadow-2xs">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex-1 py-2 px-3 rounded-[12px] text-xs font-semibold transition flex items-center justify-center gap-1.5 active:scale-95 ${
            activeSubTab === 'analytics'
              ? 'bg-[#2E521C] text-white shadow-2xs'
              : 'text-[#7A756C] hover:bg-[#E8E2D5]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>收入与转化效率</span>
        </button>

        <button
          onClick={() => setActiveSubTab('viral_tools')}
          className={`flex-1 py-2 px-3 rounded-[12px] text-xs font-semibold transition flex items-center justify-center gap-1.5 active:scale-95 ${
            activeSubTab === 'viral_tools'
              ? 'bg-[#2E521C] text-white shadow-2xs'
              : 'text-[#7A756C] hover:bg-[#E8E2D5]'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>裂变与引流工具</span>
        </button>
      </div>

      {/* SUB-TAB 1: Revenue & Efficiency Analytics */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-4">
          
          {/* Key Metrics Cards - M3 Elevated Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white border border-[#E6E0D6] rounded-[20px] p-4 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-[#7A756C]">
                <span>月度估算总收入</span>
                <span className="text-[#2E521C] bg-[#E8E2D5] px-2 py-0.2 rounded-full font-bold">+17.3%</span>
              </div>
              <div className="text-xl font-bold text-[#1D1B16] mt-1.5 font-mono">
                ¥27,000
              </div>
              <div className="text-[10px] text-[#7A756C] mt-0.5">扣除平台服务费后净收益</div>
            </div>

            <div className="bg-white border border-[#E6E0D6] rounded-[20px] p-4 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-[#7A756C]">
                <span>复购留存率</span>
                <span className="text-[#2E521C] font-semibold">优秀</span>
              </div>
              <div className="text-xl font-bold text-[#1D1B16] mt-1.5 font-mono">
                68.4%
              </div>
              <div className="text-[10px] text-[#7A756C] mt-0.5">来访者进行2次以上复购</div>
            </div>

            <div className="bg-white border border-[#E6E0D6] rounded-[20px] p-4 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-[#7A756C]">
                <span>裂变营销收入</span>
                <span className="text-[#A23F1E] font-bold">+¥1.58万</span>
              </div>
              <div className="text-xl font-bold text-[#1D1B16] mt-1.5 font-mono">
                34 人次
              </div>
              <div className="text-[10px] text-[#7A756C] mt-0.5">暖心券与金句海报转化</div>
            </div>

            <div className="bg-white border border-[#E6E0D6] rounded-[20px] p-4 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-[#7A756C]">
                <span>黄金时段率</span>
                <span className="text-[#A23F1E] bg-[#FAF2ED] px-2 py-0.2 rounded-full font-bold">86%</span>
              </div>
              <div className="text-xl font-bold text-[#1D1B16] mt-1.5 font-mono">
                178 小时
              </div>
              <div className="text-[10px] text-[#7A756C] mt-0.5">本月已完成有效倾听时长</div>
            </div>
          </div>

          {/* Revenue Chart & Breakdown */}
          <div className="space-y-4">
            
            {/* Chart Area */}
            <div className="bg-white border border-[#E6E0D6] rounded-[20px] p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-sm text-[#1D1B16]">近6个月收入趋势</h3>
                  <p className="text-[11px] text-[#7A756C]">稳健增长的倾听服务与裂变引流收益</p>
                </div>
                <span className="text-[10px] text-[#2E521C] font-medium bg-[#E8E2D5] px-2.5 py-0.5 rounded-full">
                  单位：元
                </span>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_MONTHLY_DATA}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E521C" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2E521C" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECE6DC" />
                    <XAxis dataKey="month" stroke="#7A756C" fontSize={11} tickLine={false} />
                    <YAxis stroke="#7A756C" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FAF8F5', borderRadius: '12px', border: '1px solid #ECE6DC', fontSize: '11px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="收入"
                      stroke="#2E521C"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Smart Growth Advice */}
            <div className="bg-white border border-[#E6E0D6] rounded-[20px] p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A23F1E]" />
                <h3 className="font-bold text-sm text-[#1D1B16]">AI 咨询师增长效率诊断</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-[#FAF8F5] p-3 rounded-[14px] border border-[#ECE6DC]">
                  <div className="font-semibold text-[#2E521C] mb-0.5">💡 黄金排班加开建议</div>
                  <p className="text-[#49463D] leading-relaxed text-[11px]">
                    周三与周天晚间 (19:00 - 21:30) 预约率达 100%。建议加开 1 个弹性时段，预计月收益增加 <strong>¥1,600</strong>。
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-[14px] border border-[#ECE6DC]">
                  <div className="font-semibold text-[#A23F1E] mb-0.5">🎁 裂变体验券高复购</div>
                  <p className="text-[#49463D] leading-relaxed text-[11px]">
                    “15分钟体验券”转化为 50分钟疗程的成功率达 <strong>38.6%</strong>，可增加金句海报派发频次。
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenAiQuoteModal}
                className="w-full py-2.5 rounded-full bg-[#2E521C] text-white text-xs font-semibold hover:bg-[#234114] transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                生成今日专属朋友圈社交引流海报
              </button>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 2: Social Growth & Viral Marketing Tools */}
      {activeSubTab === 'viral_tools' && (
        <div className="space-y-4">
          
          {/* Tool 1: Digital Business Card Studio */}
          <div className="bg-white border border-[#E6E0D6] rounded-[20px] p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#1D1B16] flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-[#2E521C]" />
                  暖心名片 Studio
                </h3>
                <p className="text-[11px] text-[#7A756C]">打造轻量极简数字名片，方便客户保存转介绍</p>
              </div>

              {/* Theme selectors */}
              <div className="flex items-center gap-1">
                {(['morandi_green', 'warm_sand', 'deep_ocean', 'soft_rose'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setCardTheme(theme)}
                    className={`w-5 h-5 rounded-full border-2 transition ${
                      cardTheme === theme ? 'border-[#1D1B16] scale-110' : 'border-transparent'
                    } ${
                      theme === 'morandi_green'
                        ? 'bg-[#2E521C]'
                        : theme === 'warm_sand'
                        ? 'bg-[#A23F1E]'
                        : theme === 'deep_ocean'
                        ? 'bg-[#334155]'
                        : 'bg-[#7E6266]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Card Live Preview */}
            <div
              className={`rounded-[20px] p-5 transition-all duration-300 shadow-xs ${themeStyles[cardTheme].bg} ${themeStyles[cardTheme].text} relative overflow-hidden`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={consultant.avatar}
                    alt={consultant.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/30"
                  />
                  <div>
                    <h4 className="text-base font-bold">{consultant.name}</h4>
                    <p className={`text-[11px] ${themeStyles[cardTheme].accent} font-medium`}>{consultant.title}</p>
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] opacity-90 font-mono">
                      <span>咨询 {consultant.totalHours}h</span>
                      <span>•</span>
                      <span>评分 {consultant.rating} ⭐</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 p-1.5 rounded-[12px] text-center shadow-2xs shrink-0">
                  <QrCode className="w-9 h-9 text-[#1D1B16]" />
                  <span className="text-[8px] text-[#1D1B16] font-bold block">扫码预约</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/20">
                <p className="text-[11px] italic leading-relaxed opacity-95">“{customQuote}”</p>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {consultant.targetGroups.map((tag) => (
                  <span key={tag} className={`text-[9px] px-2.5 py-0.5 rounded-full ${themeStyles[cardTheme].badge}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Customization Controls */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#1D1B16] mb-1">自定义治愈寄语</label>
                <textarea
                  rows={2}
                  value={customQuote}
                  onChange={(e) => setCustomQuote(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#ECE6DC] rounded-[14px] p-2.5 text-xs text-[#1D1B16] focus:outline-hidden focus:ring-2 focus:ring-[#386A20]/30"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyBusinessLink}
                  className="flex-1 py-2 px-3 rounded-full border border-[#E6E0D6] bg-[#F5F2EC] text-[#1D1B16] text-xs font-semibold hover:bg-[#E8E2D5] transition flex items-center justify-center gap-1 active:scale-95"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#2E521C]" />}
                  <span>{copiedLink ? '已复制' : '复制链接'}</span>
                </button>

                <button
                  onClick={() => alert('已为您生成名片海报图，可保存分享！')}
                  className="flex-1 py-2 px-3 rounded-full bg-[#2E521C] text-white text-xs font-semibold hover:bg-[#234114] transition flex items-center justify-center gap-1 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>保存海报</span>
                </button>
              </div>
            </div>

          </div>

          {/* Tool 2: Viral Voucher Hub */}
          <div className="bg-white border border-[#E6E0D6] rounded-[20px] p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#1D1B16] flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-[#A23F1E]" />
                  “倾听体验券”裂变分发
                </h3>
                <p className="text-[11px] text-[#7A756C]">支持客户转赠亲友，带来新个案</p>
              </div>

              <button
                onClick={() => setShowAddVoucherModal(true)}
                className="px-3 py-1.5 rounded-full bg-[#A23F1E] text-white text-xs font-semibold hover:bg-[#883216] transition shadow-2xs flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新建体验券</span>
              </button>
            </div>

            <div className="space-y-2">
              {vouchers.map((v) => (
                <div key={v.id} className="bg-[#FAF8F5] border border-[#ECE6DC] rounded-[16px] p-3 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1D1B16]">{v.title}</span>
                    <span className="text-[10px] bg-[#E8E2D5] text-[#2E521C] px-2 py-0.2 rounded-full font-mono font-bold">
                      {v.code}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold font-mono text-[#A23F1E]">¥{v.voucherPrice}</span>
                    <span className="text-xs text-stone-400 line-through font-mono">¥{v.originalPrice}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#7A756C] pt-1.5 border-t border-[#ECE6DC]">
                    <span>已领 {v.claimedCount} 张</span>
                    <span>转化 {v.conversionCount} 人次</span>
                  </div>

                  <button
                    onClick={() => alert(`体验券【${v.title}】口令：${v.code}`)}
                    className="w-full py-1.5 rounded-full bg-white text-[#2E521C] border border-[#E6E0D6] text-xs font-medium hover:bg-[#F5F2EC] transition active:scale-95"
                  >
                    一键发送至客户
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* New Voucher M3 Bottom Sheet */}
      {showAddVoucherModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-t-[28px] sm:rounded-[28px] max-w-md w-full p-5 shadow-2xl relative">
            <div className="w-10 h-1 bg-[#E6E0D6] rounded-full mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#1D1B16] mb-3">新建社交裂变体验券</h3>
            
            <form onSubmit={handleCreateVoucher} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#1D1B16] font-semibold mb-1">体验券名称</label>
                <input
                  type="text"
                  required
                  value={newVoucherTitle}
                  onChange={(e) => setNewVoucherTitle(e.target.value)}
                  className="w-full bg-white border border-[#E6E0D6] rounded-full px-3.5 py-2 text-xs text-[#1D1B16]"
                />
              </div>

              <div>
                <label className="block text-[#1D1B16] font-semibold mb-1">体验价 (元)</label>
                <input
                  type="number"
                  required
                  value={newVoucherPrice}
                  onChange={(e) => setNewVoucherPrice(Number(e.target.value))}
                  className="w-full bg-white border border-[#E6E0D6] rounded-full px-3.5 py-2 text-xs text-[#1D1B16]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVoucherModal(false)}
                  className="px-4 py-2 rounded-full border border-[#E6E0D6] bg-white text-[#49463D] font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#2E521C] text-white font-semibold shadow-2xs active:scale-95"
                >
                  创建并上线
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
