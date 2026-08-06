import React, { useState } from 'react';
import { 
  UserCheck, ShieldCheck, Clock, Award, Wallet, Calendar, Package, 
  ChevronRight, ArrowLeft, ArrowUpRight, Plus, Edit3, CheckCircle2, DollarSign, 
  ToggleLeft, ToggleRight, X, Sparkles, Building, FileCheck, ArrowRight,
  Sun, SunMedium, Moon, Copy, Check, Grid, Sliders, CalendarDays, FileText,
  CreditCard, Building2, AlertCircle, Info, Receipt, History, User, Phone,
  XCircle, ExternalLink, BookOpen, Globe, GraduationCap, Save, HeartHandshake, Compass,
  ShoppingBag, TrendingUp, Users, Share2
} from 'lucide-react';
import { ConsultantProfile, ServiceProduct, SettlementRecord } from '../../types';

interface ProfileTabProps {
  consultant: ConsultantProfile;
  products: ServiceProduct[];
  settlements: SettlementRecord[];
  onToggleProductPublish: (productId: string) => void;
  onUpdateConsultant?: (updated: ConsultantProfile) => void;
  onSubPageChange?: (isSubPage: boolean) => void;
  onOpenHistoryOrders: () => void;
  onOpenIncomeView: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  consultant,
  products,
  settlements,
  onToggleProductPublish,
  onUpdateConsultant,
  onSubPageChange,
  onOpenHistoryOrders,
  onOpenIncomeView
}) => {
  // Navigation section: 'menu' is default home view; selecting an item opens a dedicated page view
  const [activeSection, setActiveSection] = useState<'menu' | 'qualifications'>('menu');

  React.useEffect(() => {
    if (onSubPageChange) {
      onSubPageChange(activeSection !== 'menu');
    }
  }, [activeSection, onSubPageChange]);

  // Qualifications & Profile view mode: 'view' (card preview) or 'edit' (form editing)
  const [qualificationsViewMode, setQualificationsViewMode] = useState<'view' | 'edit'>('view');

  // Form states for Consultant Profile Editing
  const [formName, setFormName] = useState<string>(consultant.name);
  const [formTitle, setFormTitle] = useState<string>(consultant.title);
  const [formLicenseNo, setFormLicenseNo] = useState<string>(consultant.licenseNo);
  const [formExperienceYears, setFormExperienceYears] = useState<number>(consultant.experienceYears);
  const [formBio, setFormBio] = useState<string>(consultant.bio);

  // Qualifications & Training arrays
  const [formQualifications, setFormQualifications] = useState<string[]>(
    consultant.qualificationsList || [
      '中国心理学会注册心理师 (CPS-R-2018-0921)',
      '国家二级心理咨询师 (证书编号: 1603000008201201)',
      '上海市心理学会临床专业委员会会员'
    ]
  );
  const [formEducation, setFormEducation] = useState<string[]>(
    consultant.educationList || [
      '华东师范大学 临床与咨询心理学硕士',
      '浙江大学 心理与行为科学系学士'
    ]
  );
  const [formTraining, setFormTraining] = useState<string[]>(
    consultant.trainingExperiences || [
      '中美心理动力学连续培训项目（3年长程系统培训）',
      '认知行为疗法（CBT）临床实操与技术演练（120学时）',
      '正念减压（MBSR）与接纳承诺疗法（ACT）短程实操工作坊',
      '危机干预与心理首救专题研修'
    ]
  );
  const [formSupervisionHours, setFormSupervisionHours] = useState<number>(
    consultant.supervisionHours || 360
  );
  const [formPersonalTherapyHours, setFormPersonalTherapyHours] = useState<number>(
    consultant.personalTherapyHours || 220
  );

  // Specialties & Style arrays
  const [formSpecialties, setFormSpecialties] = useState<string[]>(
    consultant.specialties || ['职场焦虑与倦怠', '亲密关系与沟通', '情绪过载与自我关怀', '高敏感人群适应', '个人成长与自我认同']
  );
  const [formTargetAudience, setFormTargetAudience] = useState<string[]>(
    consultant.targetAudience || ['成人 (18-50岁)', '高压职场白领/管理者', '高敏感人群', '高校学生']
  );
  const [formProficientServices, setFormProficientServices] = useState<string[]>(
    consultant.proficientServices || ['50分钟个体心理咨询 (视频/语音)', '15分钟极简舒压倾听']
  );
  const [formLanguages, setFormLanguages] = useState<string[]>(
    consultant.workingLanguages || ['普通话 (标准)', '英语 (Fluent)', '粤语 (基础)']
  );
  const [formOrientations, setFormOrientations] = useState<string[]>(
    consultant.orientations || ['人本主义', '认知行为 (CBT)', '正念与接纳承诺 (ACT)', '心理剧与躯体觉察']
  );
  const [formStyle, setFormStyle] = useState<string>(
    consultant.counselingStyle || '温暖接纳、敏锐洞察、温和而坚定。注重陪伴来访者在安全氛围中自发探索，结合逻辑梳理与躯体感知。'
  );

  // Quick inputs for adding list items in Edit mode
  const [newQualInput, setNewQualInput] = useState('');
  const [newEduInput, setNewEduInput] = useState('');
  const [newTrainInput, setNewTrainInput] = useState('');
  const [newSpecialtyInput, setNewSpecialtyInput] = useState('');
  const [newAudienceInput, setNewAudienceInput] = useState('');
  const [newServiceInput, setNewServiceInput] = useState('');
  const [newLangInput, setNewLangInput] = useState('');
  const [newOrientInput, setNewOrientInput] = useState('');

  // Helper function to add items
  const handleAddItem = (
    value: string, 
    setValue: React.Dispatch<React.SetStateAction<string>>, 
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (list.includes(trimmed)) {
      alert('已存在相同的项目');
      return;
    }
    setList([...list, trimmed]);
    setValue('');
  };

  const handleRemoveItem = (
    index: number, 
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  // Save changes handler
  const handleSaveProfile = () => {
    const updated: ConsultantProfile = {
      ...consultant,
      name: formName,
      title: formTitle,
      licenseNo: formLicenseNo,
      experienceYears: formExperienceYears,
      bio: formBio,
      qualificationsList: formQualifications,
      educationList: formEducation,
      trainingExperiences: formTraining,
      supervisionHours: formSupervisionHours,
      personalTherapyHours: formPersonalTherapyHours,
      specialties: formSpecialties,
      targetAudience: formTargetAudience,
      proficientServices: formProficientServices,
      workingLanguages: formLanguages,
      orientations: formOrientations,
      counselingStyle: formStyle,
      targetGroups: formTargetAudience.length > 0 ? formTargetAudience : consultant.targetGroups,
    };

    if (onUpdateConsultant) {
      onUpdateConsultant(updated);
    }
    setQualificationsViewMode('view');
    alert('咨询师资质档案与个人介绍已成功保存更新！');
  };

  // ============================================================================
  // END OF STATE
  // ============================================================================

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* DEFAULT MAIN MENU PAGE VIEW */}
      {activeSection === 'menu' && (
        <div className="space-y-4">
          
          {/* M3 Elevated Profile Summary Card */}
          <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-5 shadow-2xs space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#E8E2D5]/30 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src={consultant.avatar}
                    alt={consultant.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#6750A4]/20 shadow-2xs"
                  />
                  <span className="absolute bottom-0 right-0 bg-[#6750A4] text-white p-0.5 rounded-full border-2 border-white" title="CPS 认证">
                    <ShieldCheck className="w-3 h-3" />
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-[#1D1B16]">{consultant.name}</h2>
                    <span className="bg-[#EADDFF] text-[#21005D] text-[10px] px-2.5 py-0.5 rounded-full font-semibold border border-[#D0BCFF] flex items-center gap-1">
                      <Award className="w-3 h-3 text-[#21005D]" />
                      CPS 认证在籍
                    </span>
                  </div>

                  <p className="text-xs text-[#49463D]">{consultant.title}</p>
                  <div className="text-[11px] text-[#7A756C] font-mono">执业证书: {consultant.licenseNo}</div>
                </div>
              </div>

              {/* M3 Metric Chips Grid */}
              <div className="grid grid-cols-3 gap-2 border-t sm:border-t-0 sm:border-l border-[#ECE6DC] pt-3 sm:pt-0 sm:pl-5 w-full sm:w-auto">
                <div className="bg-[#FAF8F5] border border-[#ECE6DC] p-2.5 rounded-[18px] text-center">
                  <div className="text-[10px] text-[#7A756C]">累计服务时长</div>
                  <div className="text-base font-bold text-[#6750A4] font-mono mt-0.5">{consultant.totalHours}h</div>
                </div>
                <div className="bg-[#FAF8F5] border border-[#ECE6DC] p-2.5 rounded-[18px] text-center">
                  <div className="text-[10px] text-[#7A756C]">已服务个案</div>
                  <div className="text-base font-bold text-[#1D1B16] font-mono mt-0.5">{consultant.totalClients}人</div>
                </div>
                <div className="bg-[#FAF8F5] border border-[#ECE6DC] p-2.5 rounded-[18px] text-center">
                  <div className="text-[10px] text-[#7A756C]">咨询师评分</div>
                  <div className="text-base font-bold text-[#A23F1E] font-mono mt-0.5">{consultant.rating} ★</div>
                </div>
              </div>

            </div>
          </div>

          {/* Independent Page Hub Entry List */}
          <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-2 shadow-2xs space-y-1">
            
            {/* New: Orders Management Item */}
            <button
              onClick={() => {
                alert('系统跳转：历史订单管理页（待开发）');
              }}
              className="w-full p-4 rounded-[20px] hover:bg-[#FAF8F5] transition flex items-center justify-between group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-[#1D1B16] flex items-center gap-2">
                    <span>历史订单管理</span>
                  </div>
                  <p className="text-xs text-[#7A756C] mt-0.5">查看所有历史订单记录、退款及售后工单</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#7A756C] group-hover:text-[#1D1B16] group-hover:translate-x-0.5 transition shrink-0" />
            </button>

            <div className="h-px bg-[#ECE6DC] mx-4" />

            {/* 1. 收入明细 Item */}
            <button
              onClick={onOpenIncomeView}
              className="w-full p-4 rounded-[20px] hover:bg-[#FAF8F5] transition flex items-center justify-between group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#EADDFF] text-[#21005D] flex items-center justify-center shrink-0 border border-[#D0BCFF]">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-[#1D1B16] flex items-center gap-2">
                    <span>收入明细与提现</span>
                    <span className="text-[10px] bg-[#EADDFF] text-[#21005D] font-mono px-2 py-0.2 rounded-full font-semibold">
                      可提现: ¥{consultant.earnings.withdrawable.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A756C] mt-0.5">订单账单明细、提现申请、财务打款记录与收款银行卡维护</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#7A756C] group-hover:text-[#1D1B16] group-hover:translate-x-0.5 transition shrink-0" />
            </button>

            <div className="h-px bg-[#ECE6DC] mx-4" />



            {/* 4. 资质档案 Item */}
            <button
              onClick={() => setActiveSection('qualifications')}
              className="w-full p-4 rounded-[20px] hover:bg-[#FAF8F5] transition flex items-center justify-between group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#EADDFF] text-[#21005D] flex items-center justify-center shrink-0 border border-[#D0BCFF]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-[#1D1B16] flex items-center gap-2">
                    <span>资质档案</span>
                    <span className="text-[10px] bg-[#EADDFF] text-[#21005D] px-2 py-0.2 rounded-full font-semibold border border-[#D0BCFF]">
                      CPS 认证在籍
                    </span>
                  </div>
                  <p className="text-xs text-[#7A756C] mt-0.5">行业权威注册资质、伦理规范声明与一对一督导受训记录</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#7A756C] group-hover:text-[#1D1B16] group-hover:translate-x-0.5 transition shrink-0" />
            </button>

          </div>

        </div>
      )}





      {/* DEDICATED PAGE 3: Service Products Catalog */}
      {activeSection === 'products' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('menu')}
              className="p-1.5 -ml-1.5 rounded-full text-[#6750A4] hover:bg-[#E8E2D5] transition active:scale-95 flex items-center gap-1 font-semibold text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回列表</span>
            </button>
            <span className="text-[#ECE6DC]">/</span>
            <span className="text-xs font-bold text-[#1D1B16]">服务商品架</span>
          </div>

          <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-5 shadow-2xs space-y-4">
            <div className="pb-2 border-b border-[#ECE6DC]">
              <h3 className="font-bold text-sm text-[#1D1B16]">咨询服务商品状态管理</h3>
              <p className="text-xs text-[#7A756C] mt-0.5">可自定义调整单次个体咨询及即时倾听的上架与休诊状态。服务商品为平台标准定价，不可修改。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {products.map((prod) => (
                <div key={prod.id} className="bg-[#FAF8F5] border border-[#ECE6DC] rounded-[20px] p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#1D1B16]">{prod.name}</h4>
                      </div>
                      <p className="text-xs text-[#49463D] mt-1 leading-relaxed">{prod.description}</p>
                    </div>

                    <button
                      onClick={() => onToggleProductPublish(prod.id)}
                      className="text-[#6750A4] hover:opacity-80 transition active:scale-95 shrink-0"
                      title="上架/下架开关"
                    >
                      {prod.isPublished ? (
                        <ToggleRight className="w-8 h-8 text-[#6750A4]" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-[#7A756C]" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#ECE6DC] text-xs">
                    <div className="text-[#7A756C]">
                      服务时长: <strong className="text-[#1D1B16] font-mono">{prod.durationMinutes || 50} 分钟</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold font-mono text-[#6750A4]">¥{prod.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED PAGE 4: Qualifications & Profile Settings */}
      {activeSection === 'qualifications' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Top Header & View/Edit Switcher */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSection('menu')}
                className="p-1.5 -ml-1.5 rounded-full text-[#6750A4] hover:bg-[#E8E2D5] transition active:scale-95 flex items-center gap-1 font-semibold text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回列表</span>
              </button>
              <span className="text-[#ECE6DC]">/</span>
              <span className="text-xs font-bold text-[#1D1B16]">资质档案与介绍</span>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center gap-1 bg-[#E8E2D5] p-1 rounded-full border border-[#DCD5C8]">
              <button
                type="button"
                onClick={() => setQualificationsViewMode('view')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 ${
                  qualificationsViewMode === 'view'
                    ? 'bg-white text-[#6750A4] shadow-2xs'
                    : 'text-[#7A756C] hover:text-[#1D1B16]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>预览名片</span>
              </button>

              <button
                type="button"
                onClick={() => setQualificationsViewMode('edit')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 ${
                  qualificationsViewMode === 'edit'
                    ? 'bg-[#6750A4] text-white shadow-2xs'
                    : 'text-[#7A756C] hover:text-[#1D1B16]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>编辑资料</span>
              </button>
            </div>
          </div>

          {/* VIEW MODE: 名片与资质介绍预览 */}
          {qualificationsViewMode === 'view' && (
            <div className="space-y-4 text-xs text-[#1D1B16]">
              
              {/* Consultant Card Header */}
              <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#6750A4]/5 to-transparent rounded-bl-full pointer-events-none" />
                
                <div className="flex items-start gap-3.5 sm:gap-4 relative z-10">
                  <img
                    src={consultant.avatar}
                    alt={consultant.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#6750A4]/20 shadow-xs shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold text-[#1D1B16]">{formName}</h2>
                      <span className="px-2 py-0.5 rounded-full bg-[#6750A4]/10 text-[#6750A4] text-[10px] font-bold flex items-center gap-1 border border-[#6750A4]/20">
                        <ShieldCheck className="w-3 h-3 text-[#6750A4]" />
                        <span>CPS 认证在籍</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#49463D] font-medium mt-1">{formTitle}</p>
                    
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#7A756C] font-mono flex-wrap">
                      <span>证书: {formLicenseNo}</span>
                      <span>•</span>
                      <span>从业 {formExperienceYears} 年</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#ECE6DC] text-center">
                      <div className="bg-[#FAF8F5] p-2 rounded-[14px] border border-[#ECE6DC]">
                        <div className="text-[10px] text-[#7A756C]">个案小时</div>
                        <div className="text-xs font-bold font-mono text-[#6750A4] mt-0.5">{consultant.totalHours}h</div>
                      </div>
                      <div className="bg-[#FAF8F5] p-2 rounded-[14px] border border-[#ECE6DC]">
                        <div className="text-[10px] text-[#7A756C]">督导时长</div>
                        <div className="text-xs font-bold font-mono text-[#6750A4] mt-0.5">{formSupervisionHours}h</div>
                      </div>
                      <div className="bg-[#FAF8F5] p-2 rounded-[14px] border border-[#ECE6DC]">
                        <div className="text-[10px] text-[#7A756C]">个人体验</div>
                        <div className="text-xs font-bold font-mono text-[#6750A4] mt-0.5">{formPersonalTherapyHours}h</div>
                      </div>
                      <div className="bg-[#FAF8F5] p-2 rounded-[14px] border border-[#ECE6DC]">
                        <div className="text-[10px] text-[#7A756C]">服务人次</div>
                        <div className="text-xs font-bold font-mono text-[#6750A4] mt-0.5">{consultant.totalClients}+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 1: 个人简介 (Personal Bio / Self Introduction) */}
              <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2 text-[#6750A4] font-bold text-xs pb-1 border-b border-[#ECE6DC]">
                  <Sparkles className="w-4 h-4 text-[#6750A4]" />
                  <span>个人简介与咨询寄语</span>
                </div>
                <div className="bg-[#FAF8F5] p-3.5 sm:p-4 rounded-[18px] border-l-4 border-l-[#6750A4] border border-[#ECE6DC] text-[#49463D] leading-relaxed text-xs italic">
                  “{formBio}”
                </div>
              </div>

              {/* CARD 2: 资质与受训 (Qualifications & Training) */}
              <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-[#6750A4] font-bold text-xs pb-1 border-b border-[#ECE6DC]">
                  <ShieldCheck className="w-4 h-4 text-[#6750A4]" />
                  <span>资质与受训背景</span>
                </div>

                <div className="space-y-3.5">
                  {/* 执业资质 */}
                  <div>
                    <h4 className="text-[11px] font-bold text-[#7A756C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#6750A4]" />
                      <span>执业资质与专业认证</span>
                    </h4>
                    <div className="space-y-1.5">
                      {formQualifications.map((item, idx) => (
                        <div key={idx} className="bg-[#FAF8F5] px-3 py-2 rounded-[14px] border border-[#ECE6DC] flex items-center gap-2 text-xs text-[#1D1B16]">
                          <CheckCircle2 className="w-4 h-4 text-[#6750A4] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 学历背景 */}
                  <div>
                    <h4 className="text-[11px] font-bold text-[#7A756C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#6750A4]" />
                      <span>学历背景</span>
                    </h4>
                    <div className="space-y-1.5">
                      {formEducation.map((item, idx) => (
                        <div key={idx} className="bg-[#FAF8F5] px-3 py-2 rounded-[14px] border border-[#ECE6DC] flex items-center gap-2 text-xs text-[#1D1B16]">
                          <Building className="w-4 h-4 text-[#6750A4] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 长短程受训 */}
                  <div>
                    <h4 className="text-[11px] font-bold text-[#7A756C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#6750A4]" />
                      <span>长短程培训经历</span>
                    </h4>
                    <div className="space-y-1.5">
                      {formTraining.map((item, idx) => (
                        <div key={idx} className="bg-[#FAF8F5] px-3 py-2 rounded-[14px] border border-[#ECE6DC] flex items-center gap-2 text-xs text-[#1D1B16]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#6750A4] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: 咨询师擅长 (Expertise, Languages, Orientations & Style) */}
              <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-[#6750A4] font-bold text-xs pb-1 border-b border-[#ECE6DC]">
                  <Compass className="w-4 h-4 text-[#6750A4]" />
                  <span>咨询师擅长与工作流派</span>
                </div>

                <div className="space-y-3.5">
                  {/* 擅长领域 */}
                  <div>
                    <h4 className="text-[11px] font-bold text-[#7A756C] uppercase tracking-wider mb-2">擅长领域</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {formSpecialties.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-[#6750A4]/10 text-[#6750A4] border border-[#6750A4]/20 text-xs font-semibold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 适合人群 */}
                  <div>
                    <h4 className="text-[11px] font-bold text-[#7A756C] uppercase tracking-wider mb-2">适合人群</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {formTargetAudience.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-[#FAF8F5] text-[#1D1B16] border border-[#ECE6DC] text-xs font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 擅长服务 */}
                  <div>
                    <h4 className="text-[11px] font-bold text-[#7A756C] uppercase tracking-wider mb-2">擅长服务</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {formProficientServices.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-[#FAF8F5] text-[#49463D] border border-[#ECE6DC] text-xs font-medium flex items-center gap-1">
                          <Package className="w-3 h-3 text-[#6750A4]" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 工作语言 & 工作流派 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-[#FAF8F5] p-3 rounded-[16px] border border-[#ECE6DC]">
                      <div className="text-[11px] font-bold text-[#7A756C] mb-1.5 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-[#6750A4]" />
                        <span>工作语言</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {formLanguages.map((lang, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white text-[#1D1B16] text-[11px] border border-[#ECE6DC]">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#FAF8F5] p-3 rounded-[16px] border border-[#ECE6DC]">
                      <div className="text-[11px] font-bold text-[#7A756C] mb-1.5 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-[#6750A4]" />
                        <span>工作流派</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {formOrientations.map((orient, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white text-[#1D1B16] text-[11px] border border-[#ECE6DC]">
                            {orient}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 咨询风格 */}
                  <div>
                    <h4 className="text-[11px] font-bold text-[#7A756C] uppercase tracking-wider mb-1.5">咨询风格</h4>
                    <div className="bg-[#FAF8F5] p-3 rounded-[16px] border border-[#ECE6DC] text-xs text-[#49463D] leading-relaxed">
                      {formStyle}
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 4: 预约须知与服务契约 (Booking Notice & Order Rules Disclaimer) */}
              <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-[#ECE6DC]">
                  <div className="flex items-center gap-2 text-[#1D1B16] font-bold text-xs">
                    <FileCheck className="w-4 h-4 text-[#6750A4]" />
                    <span>预约须知与订单服务契约</span>
                  </div>
                  <span className="text-[10px] text-[#7A756C] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#ECE6DC]">
                    订单通用条款
                  </span>
                </div>

                <div className="space-y-2 text-[11px] text-[#49463D]">
                  <div className="bg-[#FAF8F5] p-3 rounded-[16px] border border-[#ECE6DC] space-y-1.5">
                    <div className="font-bold text-[#1D1B16] flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5 text-[#6750A4]" />
                      <span>1. 咨询时长与候诊</span>
                    </div>
                    <p className="pl-5 text-[#7A756C]">个体心理咨询标准时长为 50 分钟/次；请于预约时间前 5 分钟在极简咨询室界面候诊以保证服务完整体验。</p>
                  </div>

                  <div className="bg-[#FAF8F5] p-3 rounded-[16px] border border-[#ECE6DC] space-y-1.5">
                    <div className="font-bold text-[#1D1B16] flex items-center gap-1.5 text-xs">
                      <AlertCircle className="w-3.5 h-3.5 text-[#A23F1E]" />
                      <span>2. 免费改期与退订规则</span>
                    </div>
                    <ul className="pl-5 space-y-0.5 list-disc text-[#7A756C]">
                      <li>开诊前 24 小时以上：支持无损取消退款或免费调整预约时段；</li>
                      <li>开诊前 24 小时以内：取消或改期扣除 50% 订单服务费；</li>
                      <li>开诊前 12 小时以内：取消或缺席全额扣除服务费。</li>
                    </ul>
                  </div>

                  <div className="bg-[#FAF8F5] p-3 rounded-[16px] border border-[#ECE6DC] space-y-1.5">
                    <div className="font-bold text-[#1D1B16] flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#6750A4]" />
                      <span>3. 伦理与危机干预提示</span>
                    </div>
                    <p className="pl-5 text-[#7A756C]">咨询过程严格遵循《中国心理学会临床与咨询心理学工作伦理守则》。若存在极高自伤、伤害他人或法定通报情形，将按规定启动紧急保密例外干预。</p>
                  </div>
                </div>

                <div className="text-[10px] text-[#7A756C] bg-[#FAF8F5] p-2.5 rounded-[12px] border border-[#ECE6DC] text-center">
                  * 提示：以上预约须知规则在来访者下单及订单确认时自动呈现并由系统履约挂载。
                </div>
              </div>

            </div>
          )}

          {/* EDIT MODE: 资质档案与个人介绍编辑表单 */}
          {qualificationsViewMode === 'edit' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-4 text-xs">
              
              {/* SECTION 1: 基本资料 & 个人简介 */}
              <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-2xs space-y-3.5">
                <div className="font-bold text-xs text-[#1D1B16] flex items-center gap-2 pb-2 border-b border-[#ECE6DC]">
                  <User className="w-4 h-4 text-[#6750A4]" />
                  <span>基本资料与个人简介编辑</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#7A756C] mb-1">咨询师姓名</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[14px] px-3 py-2 text-xs text-[#1D1B16] font-medium focus:outline-none focus:ring-2 focus:ring-[#6750A4]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#7A756C] mb-1">执业头衔/称谓</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[14px] px-3 py-2 text-xs text-[#1D1B16] font-medium focus:outline-none focus:ring-2 focus:ring-[#6750A4]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#7A756C] mb-1">证书/注册编号</label>
                    <input
                      type="text"
                      value={formLicenseNo}
                      onChange={(e) => setFormLicenseNo(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[14px] px-3 py-2 text-xs font-mono text-[#1D1B16] focus:outline-none focus:ring-2 focus:ring-[#6750A4]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#7A756C] mb-1">从极从业年限 (年)</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formExperienceYears}
                      onChange={(e) => setFormExperienceYears(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[14px] px-3 py-2 text-xs font-mono text-[#1D1B16] focus:outline-none focus:ring-2 focus:ring-[#6750A4]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#7A756C] mb-1">个人简介与寄语 (面向来访者)</label>
                  <textarea
                    rows={3}
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    placeholder="输入咨询师简介、接纳寄语或个人咨询理念..."
                    className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[16px] p-3 text-xs text-[#1D1B16] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#6750A4]/20"
                  />
                  <span className="text-[10px] text-[#7A756C] mt-0.5 block text-right">建议 50-200 字</span>
                </div>
              </div>

              {/* SECTION 2: 资质、学历与受训经历编辑 */}
              <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="font-bold text-xs text-[#1D1B16] flex items-center gap-2 pb-2 border-b border-[#ECE6DC]">
                  <ShieldCheck className="w-4 h-4 text-[#6750A4]" />
                  <span>资质、学历与受训经历</span>
                </div>

                {/* 1. 执业资质列表 */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7A756C] mb-1.5">执业资质与专业资格</label>
                  <div className="space-y-1.5 mb-2">
                    {formQualifications.map((item, idx) => (
                      <div key={idx} className="bg-[#FAF8F5] px-3 py-1.5 rounded-[12px] border border-[#ECE6DC] flex items-center justify-between text-xs">
                        <span className="text-[#1D1B16]">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx, formQualifications, setFormQualifications)}
                          className="p-1 rounded-full text-[#7A756C] hover:text-[#A23F1E] hover:bg-[#E8E2D5] transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newQualInput}
                      onChange={(e) => setNewQualInput(e.target.value)}
                      placeholder="如：中国心理学会注册心理师 (CPS-R-xxxx-xxxx)"
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#6750A4]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newQualInput, setNewQualInput, formQualifications, setFormQualifications)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#6750A4] text-white font-semibold text-xs hover:bg-[#594294] shrink-0"
                    >
                      添加
                    </button>
                  </div>
                </div>

                {/* 2. 学历背景列表 */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7A756C] mb-1.5">学历背景</label>
                  <div className="space-y-1.5 mb-2">
                    {formEducation.map((item, idx) => (
                      <div key={idx} className="bg-[#FAF8F5] px-3 py-1.5 rounded-[12px] border border-[#ECE6DC] flex items-center justify-between text-xs">
                        <span className="text-[#1D1B16]">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx, formEducation, setFormEducation)}
                          className="p-1 rounded-full text-[#7A756C] hover:text-[#A23F1E] hover:bg-[#E8E2D5] transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newEduInput}
                      onChange={(e) => setNewEduInput(e.target.value)}
                      placeholder="如：华东师范大学 临床与咨询心理学硕士"
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#6750A4]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newEduInput, setNewEduInput, formEducation, setFormEducation)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#6750A4] text-white font-semibold text-xs hover:bg-[#594294] shrink-0"
                    >
                      添加
                    </button>
                  </div>
                </div>

                {/* 3. 长短程受训经历列表 */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7A756C] mb-1.5">长短程培训受训经历</label>
                  <div className="space-y-1.5 mb-2">
                    {formTraining.map((item, idx) => (
                      <div key={idx} className="bg-[#FAF8F5] px-3 py-1.5 rounded-[12px] border border-[#ECE6DC] flex items-center justify-between text-xs">
                        <span className="text-[#1D1B16]">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx, formTraining, setFormTraining)}
                          className="p-1 rounded-full text-[#7A756C] hover:text-[#A23F1E] hover:bg-[#E8E2D5] transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTrainInput}
                      onChange={(e) => setNewTrainInput(e.target.value)}
                      placeholder="如：中美心理动力学3年连续培训项目"
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#6750A4]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newTrainInput, setNewTrainInput, formTraining, setFormTraining)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#6750A4] text-white font-semibold text-xs hover:bg-[#594294] shrink-0"
                    >
                      添加
                    </button>
                  </div>
                </div>

                {/* 4. 督导与体验时长 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#ECE6DC]">
                  <div>
                    <label className="block text-[11px] font-bold text-[#7A756C] mb-1">一对一督导时长 (小时)</label>
                    <input
                      type="number"
                      min="0"
                      value={formSupervisionHours}
                      onChange={(e) => setFormSupervisionHours(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 font-mono text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#6750A4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#7A756C] mb-1">个人体验时长 (小时)</label>
                    <input
                      type="number"
                      min="0"
                      value={formPersonalTherapyHours}
                      onChange={(e) => setFormPersonalTherapyHours(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 font-mono text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#6750A4]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: 咨询师擅长、领域、人群、服务、流派与风格 */}
              <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="font-bold text-xs text-[#1D1B16] flex items-center gap-2 pb-2 border-b border-[#ECE6DC]">
                  <Compass className="w-4 h-4 text-[#6750A4]" />
                  <span>咨询师擅长、人群、流派与风格</span>
                </div>

                {/* 1. 擅长领域 */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7A756C] mb-1.5">擅长领域 (议题/主题)</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formSpecialties.map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-[#6750A4]/10 text-[#6750A4] border border-[#6750A4]/20 text-xs font-medium flex items-center gap-1">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx, formSpecialties, setFormSpecialties)}
                          className="hover:text-[#A23F1E]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSpecialtyInput}
                      onChange={(e) => setNewSpecialtyInput(e.target.value)}
                      placeholder="如：职场焦虑与倦怠"
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#6750A4]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newSpecialtyInput, setNewSpecialtyInput, formSpecialties, setFormSpecialties)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#6750A4] text-white font-semibold text-xs hover:bg-[#594294] shrink-0"
                    >
                      添加
                    </button>
                  </div>
                </div>

                {/* 2. 适合人群 */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7A756C] mb-1.5">适合人群 (对象人群)</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formTargetAudience.map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-[#FAF8F5] text-[#1D1B16] border border-[#ECE6DC] text-xs font-medium flex items-center gap-1">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx, formTargetAudience, setFormTargetAudience)}
                          className="hover:text-[#A23F1E]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAudienceInput}
                      onChange={(e) => setNewAudienceInput(e.target.value)}
                      placeholder="如：成人 (18-50岁) / 高敏人群"
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#6750A4]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newAudienceInput, setNewAudienceInput, formTargetAudience, setFormTargetAudience)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#6750A4] text-white font-semibold text-xs hover:bg-[#594294] shrink-0"
                    >
                      添加
                    </button>
                  </div>
                </div>

                {/* 3. 擅长服务 */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7A756C] mb-1.5">擅长服务类型</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formProficientServices.map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-[#FAF8F5] text-[#49463D] border border-[#ECE6DC] text-xs font-medium flex items-center gap-1">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx, formProficientServices, setFormProficientServices)}
                          className="hover:text-[#A23F1E]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newServiceInput}
                      onChange={(e) => setNewServiceInput(e.target.value)}
                      placeholder="如：50分钟个体心理咨询 / 15分钟倾听"
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#6750A4]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newServiceInput, setNewServiceInput, formProficientServices, setFormProficientServices)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#6750A4] text-white font-semibold text-xs hover:bg-[#594294] shrink-0"
                    >
                      添加
                    </button>
                  </div>
                </div>

                {/* 4. 工作语言 */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7A756C] mb-1.5">工作语言</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formLanguages.map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-white text-[#1D1B16] border border-[#ECE6DC] text-xs font-medium flex items-center gap-1">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx, formLanguages, setFormLanguages)}
                          className="hover:text-[#A23F1E]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLangInput}
                      onChange={(e) => setNewLangInput(e.target.value)}
                      placeholder="如：普通话 (标准) / 英语"
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#6750A4]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newLangInput, setNewLangInput, formLanguages, setFormLanguages)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#6750A4] text-white font-semibold text-xs hover:bg-[#594294] shrink-0"
                    >
                      添加
                    </button>
                  </div>
                </div>

                {/* 5. 工作流派 */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7A756C] mb-1.5">工作流派 (理论取向)</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formOrientations.map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-white text-[#1D1B16] border border-[#ECE6DC] text-xs font-medium flex items-center gap-1">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx, formOrientations, setFormOrientations)}
                          className="hover:text-[#A23F1E]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newOrientInput}
                      onChange={(e) => setNewOrientInput(e.target.value)}
                      placeholder="如：人本主义 / CBT / 精神分析"
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#6750A4]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newOrientInput, setNewOrientInput, formOrientations, setFormOrientations)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#6750A4] text-white font-semibold text-xs hover:bg-[#594294] shrink-0"
                    >
                      添加
                    </button>
                  </div>
                </div>

                {/* 6. 咨询风格 */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7A756C] mb-1">咨询风格描述</label>
                  <textarea
                    rows={2}
                    value={formStyle}
                    onChange={(e) => setFormStyle(e.target.value)}
                    placeholder="描述您的沟通语气、陪伴习惯与核心咨询风格..."
                    className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[16px] p-3 text-xs text-[#1D1B16] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#6750A4]/20"
                  />
                </div>
              </div>

              {/* Form Bottom Save Action Bar */}
              <div className="sticky bottom-4 z-20 bg-[#FAF8F5]/90 backdrop-blur-md p-3.5 rounded-[20px] border border-[#ECE6DC] shadow-lg flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setQualificationsViewMode('view')}
                  className="px-4 py-2 rounded-full border border-[#E6E0D6] bg-white text-[#49463D] font-semibold hover:bg-[#E8E2D5] active:scale-95 transition"
                >
                  取消/放弃修改
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#6750A4] text-white font-semibold hover:bg-[#594294] shadow-2xs active:scale-95 transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>保存资质档案</span>
                </button>
              </div>

            </form>
          )}

        </div>
      )}


    </div>
  );
};

// Helper component for spinning icon
function RefreshCwSpinner({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
      <path d="M16 16h5v5"/>
    </svg>
  );
}
