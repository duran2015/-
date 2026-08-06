import React, { useState } from 'react';
import { 
  ShieldCheck, Wallet, ChevronRight, Edit3, CheckCircle2, User,
  Sparkles, Building, Globe, BookOpen, Compass, Save, X, Award, GraduationCap, Package, ShoppingBag
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
  onToggleProductPublish,
  onUpdateConsultant,
  onOpenHistoryOrders,
  onOpenIncomeView
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Form states for Consultant Profile Editing
  const [formName, setFormName] = useState<string>(consultant.name);
  const [formTitle, setFormTitle] = useState<string>(consultant.title);
  const [formLicenseNo, setFormLicenseNo] = useState<string>(consultant.licenseNo);
  const [formExperienceYears, setFormExperienceYears] = useState<number>(consultant.experienceYears);
  const [formBio, setFormBio] = useState<string>(consultant.bio);

  const [formQualifications, setFormQualifications] = useState<string[]>(
    consultant.qualificationsList || ['中国心理学会注册心理师 (CPS-R-2018-0921)', '国家二级心理咨询师']
  );
  const [formEducation, setFormEducation] = useState<string[]>(
    consultant.educationList || ['华东师范大学 临床与咨询心理学硕士']
  );
  const [formTraining, setFormTraining] = useState<string[]>(
    consultant.trainingExperiences || ['中美心理动力学连续培训项目（3年长程系统培训）']
  );
  
  const [formSpecialties, setFormSpecialties] = useState<string[]>(
    consultant.specialties || ['职场焦虑与倦怠', '亲密关系与沟通', '情绪过载与自我关怀']
  );
  const [formLanguages, setFormLanguages] = useState<string[]>(
    consultant.workingLanguages || ['普通话 (标准)', '英语 (Fluent)']
  );
  const [formOrientations, setFormOrientations] = useState<string[]>(
    consultant.orientations || ['人本主义', '认知行为 (CBT)']
  );
  const [formStyle, setFormStyle] = useState<string>(
    consultant.counselingStyle || '温暖接纳、敏锐洞察、温和而坚定。注重陪伴来访者在安全氛围中自发探索。'
  );

  // Quick inputs
  const [newQualInput, setNewQualInput] = useState('');
  const [newEduInput, setNewEduInput] = useState('');
  const [newTrainInput, setNewTrainInput] = useState('');
  const [newSpecialtyInput, setNewSpecialtyInput] = useState('');
  const [newLangInput, setNewLangInput] = useState('');
  const [newOrientInput, setNewOrientInput] = useState('');

  const handleAddItem = (
    value: string, 
    setValue: React.Dispatch<React.SetStateAction<string>>, 
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!list.includes(trimmed)) setList([...list, trimmed]);
    setValue('');
  };

  const handleRemoveItem = (index: number, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.filter((_, i) => i !== index));
  };

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
      specialties: formSpecialties,
      workingLanguages: formLanguages,
      orientations: formOrientations,
      counselingStyle: formStyle,
    };
    if (onUpdateConsultant) onUpdateConsultant(updated);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* 快捷操作区 (Quick Actions) - 直达高频功能 */}
      {!isEditing && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onOpenIncomeView}
            className="bg-[#EADDFF] border border-[#D0BCFF] rounded-[24px] p-4 flex flex-col items-start gap-2 shadow-sm active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-[#21005D] text-white flex items-center justify-center shadow-md">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-left mt-1">
              <h3 className="text-[#21005D] font-bold text-sm">收入与提现</h3>
              <p className="text-[#4F378B] text-xs font-mono mt-0.5">¥{consultant.earnings.withdrawable.toFixed(2)} 可提现</p>
            </div>
          </button>

          <button
            onClick={onOpenHistoryOrders}
            className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 flex flex-col items-start gap-2 shadow-sm active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#1D1B16] border border-[#ECE6DC] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="text-left mt-1">
              <h3 className="text-[#1D1B16] font-bold text-sm">历史订单</h3>
              <p className="text-[#7A756C] text-xs mt-0.5">查阅历史及售后</p>
            </div>
          </button>
        </div>
      )}

      {/* 服务项目管理 (Service Products) */}
      {!isEditing && (
        <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#1D1B16] mb-3 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#6750A4]" /> 我的服务项目
          </h3>
          <div className="space-y-2">
            {products.map(prod => (
              <div key={prod.id} className="flex items-center justify-between bg-[#FAF8F5] p-3 rounded-[16px] border border-[#ECE6DC]">
                <div>
                  <div className="font-bold text-xs text-[#1D1B16]">{prod.name}</div>
                  <div className="text-[11px] text-[#7A756C] mt-0.5">{prod.durationMinutes}分钟 · ¥{prod.price}</div>
                </div>
                <button 
                  onClick={() => onToggleProductPublish(prod.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                    prod.isPublished 
                      ? 'bg-[#EADDFF] text-[#21005D] border border-[#D0BCFF]' 
                      : 'bg-[#E6E0D6] text-[#7A756C]'
                  }`}
                >
                  {prod.isPublished ? '已上架' : '已休诊'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 个人主页区 (Personal Profile / Self Intro) */}
      <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-5 shadow-sm space-y-5 relative overflow-hidden">
        {/* 背景光晕 */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#EADDFF]/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

        {/* 头部信息与编辑按钮 */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={consultant.avatar}
                alt={consultant.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-[#FAF8F5] shadow-sm"
              />
              <span className="absolute bottom-0 right-0 bg-[#6750A4] text-white p-1 rounded-full border-2 border-white">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1D1B16]">{isEditing ? formName : consultant.name}</h2>
              <p className="text-xs text-[#49463D] mt-0.5 font-medium">{isEditing ? formTitle : consultant.title}</p>
              <div className="text-[11px] text-[#7A756C] mt-1 bg-[#FAF8F5] px-2 py-0.5 rounded-md inline-block">
                从业 {isEditing ? formExperienceYears : consultant.experienceYears} 年 · {consultant.totalHours}小时个案
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-colors shadow-sm active:scale-95 ${
              isEditing ? 'bg-white text-[#49463D] border border-[#E6E0D6]' : 'bg-[#6750A4] text-white'
            }`}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditing ? '取消编辑' : '编辑主页'}</span>
          </button>
        </div>

        {/* 分割线 */}
        <div className="h-px w-full bg-[#ECE6DC] relative z-10" />

        {/* VIEW MODE: 咨询师自我介绍展示 */}
        {!isEditing && (
          <div className="space-y-5 relative z-10">
            {/* 1. 自我介绍与寄语 */}
            <div className="space-y-2">
              <h3 className="text-[13px] font-bold text-[#6750A4] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> 咨询师寄语 & 简介
              </h3>
              <div className="bg-[#FAF8F5] p-4 rounded-[20px] text-[#49463D] text-[13px] leading-relaxed italic border border-[#ECE6DC]">
                “{consultant.bio}”
              </div>
            </div>

            {/* 2. 擅长领域与风格 */}
            <div className="space-y-2">
              <h3 className="text-[13px] font-bold text-[#6750A4] flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> 擅长领域与流派
              </h3>
              <div className="flex flex-wrap gap-2">
                {consultant.specialties?.map((spec, i) => (
                  <span key={i} className="px-3 py-1 bg-[#F6EDFF] text-[#4F378B] rounded-full text-xs font-bold border border-[#EADDFF]">
                    {spec}
                  </span>
                ))}
                {consultant.orientations?.map((ori, i) => (
                  <span key={i} className="px-3 py-1 bg-white text-[#49463D] rounded-full text-xs border border-[#ECE6DC]">
                    {ori}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#7A756C] mt-2 leading-relaxed bg-[#FAF8F5] p-3 rounded-[16px]">
                <strong className="text-[#1D1B16]">咨询风格：</strong>{consultant.counselingStyle}
              </p>
            </div>

            {/* 3. 资质与受训 */}
            <div className="space-y-2">
              <h3 className="text-[13px] font-bold text-[#6750A4] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 专业资质与背景
              </h3>
              <div className="space-y-1.5">
                {consultant.qualificationsList?.map((qual, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#1D1B16] bg-white p-2.5 rounded-[14px] border border-[#ECE6DC]">
                    <CheckCircle2 className="w-4 h-4 text-[#6750A4] shrink-0" />
                    <span>{qual}</span>
                  </div>
                ))}
                {consultant.educationList?.map((edu, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#1D1B16] bg-white p-2.5 rounded-[14px] border border-[#ECE6DC]">
                    <GraduationCap className="w-4 h-4 text-[#6750A4] shrink-0" />
                    <span>{edu}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODE: 咨询师自我介绍表单 */}
        {isEditing && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-5 relative z-10 animate-in fade-in">
            
            {/* 基础字段 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#7A756C] mb-1">姓名</label>
                <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#ECE6DC] rounded-[14px] px-3 py-2 text-xs focus:ring-2 focus:ring-[#6750A4]/20 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#7A756C] mb-1">头衔/称谓</label>
                <input type="text" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#ECE6DC] rounded-[14px] px-3 py-2 text-xs focus:ring-2 focus:ring-[#6750A4]/20 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#7A756C] mb-1">从业年限</label>
                <input type="number" required value={formExperienceYears} onChange={(e) => setFormExperienceYears(Number(e.target.value))} className="w-full bg-[#FAF8F5] border border-[#ECE6DC] rounded-[14px] px-3 py-2 text-xs focus:ring-2 focus:ring-[#6750A4]/20 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#7A756C] mb-1">证书编号</label>
                <input type="text" required value={formLicenseNo} onChange={(e) => setFormLicenseNo(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#ECE6DC] rounded-[14px] px-3 py-2 text-xs focus:ring-2 focus:ring-[#6750A4]/20 outline-none" />
              </div>
            </div>

            {/* 个人简介 */}
            <div>
              <label className="block text-[11px] font-bold text-[#6750A4] mb-1 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5"/> 个人简介与寄语</label>
              <textarea rows={3} required value={formBio} onChange={(e) => setFormBio(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#ECE6DC] rounded-[16px] p-3 text-xs leading-relaxed focus:ring-2 focus:ring-[#6750A4]/20 outline-none" placeholder="写下你的咨询理念..." />
            </div>

            {/* 擅长领域 */}
            <div>
              <label className="block text-[11px] font-bold text-[#6750A4] mb-1.5 flex items-center gap-1"><Compass className="w-3.5 h-3.5"/> 擅长领域</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formSpecialties.map((item, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#F6EDFF] text-[#4F378B] rounded-full text-xs font-bold border border-[#EADDFF] flex items-center gap-1">
                    {item} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => handleRemoveItem(idx, formSpecialties, setFormSpecialties)} />
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newSpecialtyInput} onChange={(e) => setNewSpecialtyInput(e.target.value)} placeholder="如: 职场焦虑" className="flex-1 bg-[#FAF8F5] border border-[#ECE6DC] rounded-[12px] px-3 py-1.5 text-xs outline-none" />
                <button type="button" onClick={() => handleAddItem(newSpecialtyInput, setNewSpecialtyInput, formSpecialties, setFormSpecialties)} className="px-4 bg-[#6750A4] text-white rounded-[12px] text-xs font-bold">添加</button>
              </div>
            </div>

            {/* 执业资质 */}
            <div>
              <label className="block text-[11px] font-bold text-[#6750A4] mb-1.5 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5"/> 专业资质</label>
              <div className="space-y-1.5 mb-2">
                {formQualifications.map((item, idx) => (
                  <div key={idx} className="bg-[#FAF8F5] px-3 py-2 rounded-[12px] border border-[#ECE6DC] flex justify-between items-center text-xs">
                    <span>{item}</span>
                    <X className="w-3.5 h-3.5 text-[#7A756C] cursor-pointer hover:text-red-500" onClick={() => handleRemoveItem(idx, formQualifications, setFormQualifications)} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newQualInput} onChange={(e) => setNewQualInput(e.target.value)} placeholder="如: 国家二级心理咨询师" className="flex-1 bg-[#FAF8F5] border border-[#ECE6DC] rounded-[12px] px-3 py-1.5 text-xs outline-none" />
                <button type="button" onClick={() => handleAddItem(newQualInput, setNewQualInput, formQualifications, setFormQualifications)} className="px-4 bg-[#6750A4] text-white rounded-[12px] text-xs font-bold">添加</button>
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 mt-4 bg-[#6750A4] text-white rounded-full font-bold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> 保存主页信息
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
