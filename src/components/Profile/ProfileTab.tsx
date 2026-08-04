import React, { useState } from 'react';
import { 
  UserCheck, ShieldCheck, Clock, Award, Wallet, Calendar, Package, 
  ChevronRight, ArrowLeft, ArrowUpRight, Plus, Edit3, CheckCircle2, DollarSign, 
  ToggleLeft, ToggleRight, X, Sparkles, Building, FileCheck, ArrowRight,
  Sun, SunMedium, Moon, Copy, Check, Grid, Sliders, CalendarDays, FileText,
  CreditCard, Building2, AlertCircle, Info, Receipt, History, User, Phone,
  XCircle, ExternalLink, BookOpen, Globe, GraduationCap, Save, HeartHandshake, Compass
} from 'lucide-react';
import { ConsultantProfile, ServiceProduct, SettlementRecord, BankAccount, WithdrawalRecord, BillRecord, BillRecordStatus, WithdrawalStatus } from '../../types';
import { INITIAL_BANK_ACCOUNTS, INITIAL_WITHDRAWAL_RECORDS, INITIAL_BILL_RECORDS } from '../../data/mockData';

interface ProfileTabProps {
  consultant: ConsultantProfile;
  products: ServiceProduct[];
  settlements: SettlementRecord[];
  onToggleProductPublish: (productId: string) => void;
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  onUpdateConsultant?: (updated: ConsultantProfile) => void;
  onSubPageChange?: (isSubPage: boolean) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  consultant,
  products,
  settlements,
  onToggleProductPublish,
  onUpdateProductPrice,
  onUpdateConsultant,
  onSubPageChange,
}) => {
  // Navigation section: 'menu' is default home view; selecting an item opens a dedicated page view
  const [activeSection, setActiveSection] = useState<'menu' | 'settlements' | 'schedule' | 'products' | 'qualifications'>('menu');

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
    consultant.proficientServices || ['50分钟个体心理咨询 (视频/语音)', '15分钟极简舒压倾听', '4次深度连续疗程套餐', '21天文字即时陪伴']
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

  // State for Earnings, Withdrawals, and Bank Accounts
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [withdrawalRecords, setWithdrawalRecords] = useState<WithdrawalRecord[]>(INITIAL_WITHDRAWAL_RECORDS);
  const [billRecords, setBillRecords] = useState<BillRecord[]>(INITIAL_BILL_RECORDS);
  const [withdrawableBalance, setWithdrawableBalance] = useState<number>(consultant.earnings.withdrawable);

  // Earnings section sub-tabs: 'bills' | 'withdrawals' | 'accounts'
  const [settlementSubTab, setSettlementSubTab] = useState<'bills' | 'withdrawals' | 'accounts'>('bills');
  const [billStatusFilter, setBillStatusFilter] = useState<'all' | 'settled' | 'pending_settlement' | 'withdrawn' | 'refunded'>('all');

  // Earnings Modals & Drawers
  const [selectedBillForDetail, setSelectedBillForDetail] = useState<BillRecord | null>(null);
  const [selectedWithdrawalForDetail, setSelectedWithdrawalForDetail] = useState<WithdrawalRecord | null>(null);
  const [showAddAccountModal, setShowAddAccountModal] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);

  // Form states
  const [withdrawAmountInput, setWithdrawAmountInput] = useState<string>('1000');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(INITIAL_BANK_ACCOUNTS[0]?.id || '');

  // Add Bank Account form
  const [newAccType, setNewAccType] = useState<'bank_card' | 'wechat' | 'alipay'>('bank_card');
  const [newBankName, setNewBankName] = useState<string>('');
  const [newCardNumber, setNewCardNumber] = useState<string>('');
  const [newHolder, setNewHolder] = useState<string>(consultant.name);
  const [newPhone, setNewPhone] = useState<string>('13800000000');

  // Products editing state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPriceInput, setEditingPriceInput] = useState<number>(0);

  // Mock weekly schedule grid state (Mon to Sun)
  const daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const timeSlotRows = ['上午 (09:00 - 12:00)', '下午 (14:00 - 18:00)', '晚间 (19:00 - 22:00)'];

  // Mobile schedule state
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0); // 0 = 周一
  const [scheduleViewMode, setScheduleViewMode] = useState<'day' | 'week'>('day');

  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, boolean>>({
    '0-0': true, '0-1': true, '0-2': false,
    '1-0': true, '1-1': true, '1-2': true,
    '2-0': false, '2-1': true, '2-2': true,
    '3-0': true, '3-1': true, '3-2': false,
    '4-0': true, '4-1': true, '4-2': true,
    '5-0': true, '5-1': false, '5-2': true,
    '6-0': false, '6-1': false, '6-2': true,
  });

  const toggleDaySlot = (key: string) => {
    setWeeklySchedule((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getOpenSlotsCount = (dayIndex: number) => {
    let count = 0;
    for (let slot = 0; slot < 3; slot++) {
      if (weeklySchedule[`${dayIndex}-${slot}`]) count++;
    }
    return count;
  };

  const handleBatchDaySlots = (dayIndex: number, enable: boolean) => {
    setWeeklySchedule((prev) => {
      const next = { ...prev };
      for (let slot = 0; slot < 3; slot++) {
        next[`${dayIndex}-${slot}`] = enable;
      }
      return next;
    });
  };

  const handleCopyScheduleToWeekdays = (sourceDayIndex: number) => {
    setWeeklySchedule((prev) => {
      const next = { ...prev };
      const sourceSlots = [
        prev[`${sourceDayIndex}-0`] ?? false,
        prev[`${sourceDayIndex}-1`] ?? false,
        prev[`${sourceDayIndex}-2`] ?? false,
      ];
      for (let day = 0; day < 5; day++) {
        for (let slot = 0; slot < 3; slot++) {
          next[`${day}-${slot}`] = sourceSlots[slot];
        }
      }
      return next;
    });
    alert(`已将【${daysOfWeek[sourceDayIndex]}】的排班规则成功一键应用至周一至周五工作日！`);
  };

  // Submit withdrawal request
  const handleApplyWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmountInput);
    if (isNaN(amountNum) || amountNum < 100) {
      alert('提现单笔金额不能低于 ¥100.00');
      return;
    }
    if (amountNum > withdrawableBalance) {
      alert('提现金额超出当前可提现余额！');
      return;
    }

    const targetAccount = bankAccounts.find(a => a.id === selectedAccountId) || bankAccounts[0];
    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRecord: WithdrawalRecord = {
      id: `wd_${Date.now()}`,
      withdrawNo: `WD${now.getFullYear()}${String(now.getMonth()+1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Math.floor(Math.random()*900)+100)}`,
      amount: amountNum,
      bankAccount: {
        bankName: targetAccount.bankName,
        cardNumber: targetAccount.cardNumber,
        accountHolder: targetAccount.accountHolder
      },
      status: 'pending_audit',
      applyTime: formattedTime,
      financeNote: '已提交财务团队审核，预计 1 个工作日内完成划转打款'
    };

    setWithdrawalRecords([newRecord, ...withdrawalRecords]);
    setWithdrawableBalance(prev => prev - amountNum);
    setShowWithdrawModal(false);
    setSettlementSubTab('withdrawals');
    alert(`提现申请提交成功！金额 ¥${amountNum.toFixed(2)} 已转入【待财务审核】队列。`);
  };

  // Add new bank card
  const handleAddBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName || !newCardNumber) {
      alert('请填写完整的银行/收款机构名称及账号');
      return;
    }

    const newAcc: BankAccount = {
      id: `bank_${Date.now()}`,
      accountType: newAccType,
      bankName: newBankName,
      cardNumber: newCardNumber,
      accountHolder: newHolder || consultant.name,
      phone: newPhone,
      isDefault: bankAccounts.length === 0
    };

    setBankAccounts([...bankAccounts, newAcc]);
    setSelectedAccountId(newAcc.id);
    setShowAddAccountModal(false);
    setNewBankName('');
    setNewCardNumber('');
    alert('收款账号添加成功！');
  };

  // Filter bill records
  const filteredBillRecords = billRecords.filter(bill => {
    if (billStatusFilter === 'all') return true;
    return bill.status === billStatusFilter;
  });

  // Calculate total pending settlement
  const pendingSettlementTotal = billRecords
    .filter(b => b.status === 'pending_settlement')
    .reduce((sum, b) => sum + b.netAmount, 0);

  // Status rendering helpers
  const renderBillStatusBadge = (status: BillRecordStatus) => {
    switch (status) {
      case 'settled':
        return (
          <span className="bg-[#E8E2D5] text-[#2E521C] px-2 py-0.5 rounded-full text-[10px] font-semibold border border-[#CBE6C3] inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#2E521C]" />
            <span>已入账</span>
          </span>
        );
      case 'pending_settlement':
        return (
          <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-amber-200 inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>待结算</span>
          </span>
        );
      case 'withdrawn':
        return (
          <span className="bg-sky-50 text-sky-800 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-sky-200 inline-flex items-center gap-1">
            <Wallet className="w-3 h-3 text-sky-600" />
            <span>已打款</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-stone-200 inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-stone-500" />
            <span>已退款</span>
          </span>
        );
      default:
        return null;
    }
  };

  const renderWithdrawalStatusBadge = (status: WithdrawalStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="bg-[#E8E2D5] text-[#2E521C] px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-[#CBE6C3] inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#2E521C]" />
            <span>已打款到账</span>
          </span>
        );
      case 'pending_audit':
        return (
          <span className="bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-amber-200 inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>待财务审核</span>
          </span>
        );
      case 'processing':
        return (
          <span className="bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-sky-200 inline-flex items-center gap-1">
            <RefreshCwSpinner className="w-3 h-3 text-sky-600 animate-spin" />
            <span>财务打款中</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-rose-50 text-rose-800 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-rose-200 inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>已驳回</span>
          </span>
        );
      default:
        return null;
    }
  };

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
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#2E521C]/20 shadow-2xs"
                  />
                  <span className="absolute bottom-0 right-0 bg-[#2E521C] text-white p-0.5 rounded-full border-2 border-white" title="CPS 认证">
                    <ShieldCheck className="w-3 h-3" />
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-[#1D1B16]">{consultant.name}</h2>
                    <span className="bg-[#E8E2D5] text-[#2E521C] text-[10px] px-2.5 py-0.5 rounded-full font-semibold border border-[#CBE6C3] flex items-center gap-1">
                      <Award className="w-3 h-3 text-[#2E521C]" />
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
                  <div className="text-base font-bold text-[#2E521C] font-mono mt-0.5">{consultant.totalHours}h</div>
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
            
            {/* 1. 收入明细 Item */}
            <button
              onClick={() => setActiveSection('settlements')}
              className="w-full p-4 rounded-[20px] hover:bg-[#FAF8F5] transition flex items-center justify-between group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#E8E2D5] text-[#2E521C] flex items-center justify-center shrink-0 border border-[#CBE6C3]">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-[#1D1B16] flex items-center gap-2">
                    <span>收入明细与提现</span>
                    <span className="text-[10px] bg-[#E8E2D5] text-[#2E521C] font-mono px-2 py-0.2 rounded-full font-semibold">
                      可提现: ¥{withdrawableBalance.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A756C] mt-0.5">订单账单明细、提现申请、财务打款记录与收款银行卡维护</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#7A756C] group-hover:text-[#1D1B16] group-hover:translate-x-0.5 transition shrink-0" />
            </button>

            <div className="h-px bg-[#ECE6DC] mx-4" />

            {/* 2. 常规周排班 Item */}
            <button
              onClick={() => setActiveSection('schedule')}
              className="w-full p-4 rounded-[20px] hover:bg-[#FAF8F5] transition flex items-center justify-between group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#E8E2D5] text-[#2E521C] flex items-center justify-center shrink-0 border border-[#CBE6C3]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-[#1D1B16] flex items-center gap-2">
                    <span>常规周排班</span>
                    <span className="text-[10px] bg-[#FAF8F5] border border-[#ECE6DC] text-[#49463D] px-2 py-0.2 rounded-full font-semibold">
                      按天/按周快速排班
                    </span>
                  </div>
                  <p className="text-xs text-[#7A756C] mt-0.5">管理周一至周日开放的个案与听众预约时间段</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#7A756C] group-hover:text-[#1D1B16] group-hover:translate-x-0.5 transition shrink-0" />
            </button>

            <div className="h-px bg-[#ECE6DC] mx-4" />

            {/* 3. 服务商品架 Item */}
            <button
              onClick={() => setActiveSection('products')}
              className="w-full p-4 rounded-[20px] hover:bg-[#FAF8F5] transition flex items-center justify-between group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#E8E2D5] text-[#2E521C] flex items-center justify-center shrink-0 border border-[#CBE6C3]">
                  <Package className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-[#1D1B16] flex items-center gap-2">
                    <span>服务商品架</span>
                    <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.2 rounded-full font-semibold">
                      {products.filter(p => p.isPublished).length} 项服务上架中
                    </span>
                  </div>
                  <p className="text-xs text-[#7A756C] mt-0.5">自定义单次个体咨询、倾听与疗程套餐的上架及服务定价</p>
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
                <div className="w-11 h-11 rounded-full bg-[#E8E2D5] text-[#2E521C] flex items-center justify-center shrink-0 border border-[#CBE6C3]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-[#1D1B16] flex items-center gap-2">
                    <span>资质档案</span>
                    <span className="text-[10px] bg-[#E8E2D5] text-[#2E521C] px-2 py-0.2 rounded-full font-semibold border border-[#CBE6C3]">
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

      {/* DEDICATED PAGE 1: Earnings & Withdrawal Center */}
      {activeSection === 'settlements' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Sub-view Top Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSection('menu')}
                className="p-1.5 -ml-1.5 rounded-full text-[#2E521C] hover:bg-[#E8E2D5] transition active:scale-95 flex items-center gap-1 font-semibold text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回列表</span>
              </button>
              <span className="text-[#ECE6DC]">/</span>
              <span className="text-xs font-bold text-[#1D1B16]">收入明细与提现管理</span>
            </div>

            <button
              onClick={() => setShowRulesModal(true)}
              className="text-xs text-[#2E521C] hover:underline flex items-center gap-1 font-semibold"
            >
              <Info className="w-3.5 h-3.5" />
              <span>提现规则与约定</span>
            </button>
          </div>
          
          {/* Balance Overview Hero Box */}
          <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-5 shadow-2xs space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#2E521C]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-[#ECE6DC] relative z-10">
              <div>
                <div className="text-xs text-[#7A756C] flex items-center gap-1">
                  <span>当前可提现余额</span>
                  <span className="text-[10px] bg-[#E8E2D5] text-[#2E521C] px-1.5 py-0.2 rounded-full font-semibold">T+1 随时提</span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#2E521C] mt-1">
                  ¥{withdrawableBalance.toFixed(2)}
                </div>
              </div>

              <div>
                <div className="text-xs text-[#7A756C]">待结算冻结金额</div>
                <div className="text-lg font-bold font-mono text-[#1D1B16] mt-1">
                  ¥{pendingSettlementTotal.toFixed(2)}
                </div>
                <div className="text-[10px] text-[#7A756C] mt-0.5">服务完成后自动打入余额</div>
              </div>

              <div>
                <div className="text-xs text-[#7A756C]">累计已提现收益</div>
                <div className="text-lg font-bold font-mono text-[#49463D] mt-1">
                  ¥{consultant.earnings.totalEarned.toFixed(2)}
                </div>
                <div className="text-[10px] text-[#7A756C] mt-0.5">财务代扣代缴个人所得税</div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center justify-between gap-2 flex-wrap relative z-10 pt-1">
              <div className="text-xs text-[#7A756C] flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-[#2E521C]" />
                <span>提现至: <strong className="text-[#1D1B16] font-semibold">{bankAccounts[0]?.bankName || '尚未绑定银行卡'}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSettlementSubTab('accounts')}
                  className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E6E0D6] text-[#1D1B16] text-xs font-semibold hover:bg-[#E8E2D5] transition active:scale-95 flex items-center gap-1"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#7A756C]" />
                  <span>提现账号管理</span>
                </button>

                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-5 py-1.5 rounded-full bg-[#2E521C] text-white text-xs font-semibold hover:bg-[#234114] transition shadow-2xs active:scale-95 flex items-center gap-1.5"
                >
                  <Wallet className="w-4 h-4 text-emerald-200" />
                  <span>发起提现申请</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sub Navigation Bar: Bills vs Withdrawal Records vs Account Setup */}
          <div className="bg-[#FAF8F5] border border-[#ECE6DC] p-1.5 rounded-[20px] flex items-center gap-1 shadow-2xs text-xs">
            <button
              onClick={() => setSettlementSubTab('bills')}
              className={`flex-1 py-2 px-3 rounded-[14px] font-semibold transition active:scale-95 flex items-center justify-center gap-1.5 ${
                settlementSubTab === 'bills'
                  ? 'bg-[#2E521C] text-white shadow-2xs'
                  : 'text-[#49463D] hover:bg-[#E8E2D5]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>收入账单明细 ({billRecords.length})</span>
            </button>

            <button
              onClick={() => setSettlementSubTab('withdrawals')}
              className={`flex-1 py-2 px-3 rounded-[14px] font-semibold transition active:scale-95 flex items-center justify-center gap-1.5 ${
                settlementSubTab === 'withdrawals'
                  ? 'bg-[#2E521C] text-white shadow-2xs'
                  : 'text-[#49463D] hover:bg-[#E8E2D5]'
              }`}
            >
              <History className="w-4 h-4" />
              <span>提现申请记录 ({withdrawalRecords.length})</span>
            </button>

            <button
              onClick={() => setSettlementSubTab('accounts')}
              className={`flex-1 py-2 px-3 rounded-[14px] font-semibold transition active:scale-95 flex items-center justify-center gap-1.5 ${
                settlementSubTab === 'accounts'
                  ? 'bg-[#2E521C] text-white shadow-2xs'
                  : 'text-[#49463D] hover:bg-[#E8E2D5]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>收款卡维护 ({bankAccounts.length})</span>
            </button>
          </div>

          {/* SUB TAB 1: BILLS LIST WITH ASSOCIATED ORDERS & DETAILS */}
          {settlementSubTab === 'bills' && (
            <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 shadow-2xs space-y-3">
              
              {/* Filter Chips Bar */}
              <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DC] flex-wrap gap-2">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
                  {[
                    { id: 'all', label: '全部账单' },
                    { id: 'settled', label: '已入账' },
                    { id: 'pending_settlement', label: '待结算' },
                    { id: 'withdrawn', label: '已打款' },
                    { id: 'refunded', label: '已退款' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setBillStatusFilter(filter.id as any)}
                      className={`px-3 py-1 rounded-full font-semibold transition active:scale-95 ${
                        billStatusFilter === filter.id
                          ? 'bg-[#2E521C] text-white shadow-2xs'
                          : 'bg-[#FAF8F5] text-[#7A756C] border border-[#ECE6DC] hover:text-[#1D1B16]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <span className="text-[11px] text-[#7A756C]">按 12% 平台费率计算收益</span>
              </div>

              {/* Bill Items Stack */}
              <div className="space-y-2.5 pt-1">
                {filteredBillRecords.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#7A756C] bg-[#FAF8F5] rounded-[18px] border border-[#ECE6DC]">
                    暂无符合过滤条件的账单明细记录
                  </div>
                ) : (
                  filteredBillRecords.map((bill) => (
                    <div
                      key={bill.id}
                      className="bg-[#FAF8F5] p-3.5 rounded-[18px] border border-[#ECE6DC] hover:border-[#CBE6C3] transition space-y-2.5"
                    >
                      {/* Top Row: Order Header & Status Badge */}
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-[#ECE6DC]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#1D1B16]">{bill.billNo}</span>
                          {bill.orderNo && (
                            <span className="text-[10px] text-[#7A756C] font-mono bg-white px-2 py-0.2 rounded-full border border-[#ECE6DC]">
                              单号: {bill.orderNo}
                            </span>
                          )}
                        </div>
                        {renderBillStatusBadge(bill.status)}
                      </div>

                      {/* Middle Row: Client & Service Detail */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-xs text-[#1D1B16] flex items-center gap-2">
                            <span>{bill.clientName}</span>
                            <span className="text-[11px] text-[#49463D] font-normal">{bill.serviceTypeName}</span>
                          </div>
                          <div className="text-[11px] text-[#7A756C] mt-0.5 font-mono">
                            咨询预约时间: {bill.bookingDate} {bill.bookingTimeSlot || ''}
                          </div>
                        </div>

                        {/* Amount Calculation */}
                        <div className="text-right shrink-0">
                          <div className="text-base font-bold font-mono text-[#2E521C]">
                            +¥{bill.netAmount.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-[#7A756C] font-mono mt-0.5">
                            原价¥{bill.grossAmount} (扣12%平台费)
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action: View Order Detail Breakdown */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#ECE6DC] text-xs">
                        <span className="text-[11px] text-[#7A756C] font-mono">
                          账单创建: {bill.createdAt}
                        </span>

                        <button
                          onClick={() => setSelectedBillForDetail(bill)}
                          className="text-xs text-[#2E521C] font-semibold hover:underline flex items-center gap-1 active:scale-95"
                        >
                          <span>查看订单与分账明细</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* SUB TAB 2: WITHDRAWAL APPLICATION HISTORY */}
          {settlementSubTab === 'withdrawals' && (
            <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 shadow-2xs space-y-3">
              <div className="pb-2 border-b border-[#ECE6DC] flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#1D1B16]">提现申请记录</h3>
                <span className="text-xs text-[#7A756C]">最终打款由平台财务统一审核划转</span>
              </div>

              <div className="space-y-2.5">
                {withdrawalRecords.map((wd) => (
                  <div
                    key={wd.id}
                    className="bg-[#FAF8F5] p-4 rounded-[18px] border border-[#ECE6DC] hover:border-[#CBE6C3] transition space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-[#ECE6DC]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1D1B16]">{wd.withdrawNo}</span>
                        <span className="text-[10px] text-[#7A756C] font-mono">{wd.applyTime}</span>
                      </div>
                      {renderWithdrawalStatusBadge(wd.status)}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold font-mono text-[#2E521C]">
                          ¥{wd.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-[#49463D] mt-1 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#2E521C]" />
                          <span>打款目标: <strong className="text-[#1D1B16]">{wd.bankAccount.bankName}</strong> ({wd.bankAccount.cardNumber})</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedWithdrawalForDetail(wd)}
                        className="px-3 py-1.5 rounded-full bg-white border border-[#ECE6DC] text-xs font-semibold text-[#2E521C] hover:bg-[#E8E2D5] transition active:scale-95 shrink-0"
                      >
                        详情 / 打款轨迹
                      </button>
                    </div>

                    {wd.rejectReason && (
                      <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-[12px] text-xs text-rose-800 space-y-0.5">
                        <strong className="font-bold block">驳回说明:</strong>
                        <p>{wd.rejectReason}</p>
                      </div>
                    )}

                    {wd.financeNote && !wd.rejectReason && (
                      <div className="bg-[#FAF8F5] p-2.5 rounded-[12px] border border-[#ECE6DC] text-[11px] text-[#7A756C]">
                        财务备注: {wd.financeNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB TAB 3: BANK / RECEIVING ACCOUNTS MANAGEMENT */}
          {settlementSubTab === 'accounts' && (
            <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DC]">
                <div>
                  <h3 className="font-bold text-sm text-[#1D1B16]">提现卡号与收款账号维护</h3>
                  <p className="text-xs text-[#7A756C] mt-0.5">提现收款人必须与执业认证真实姓名（{consultant.name}）保持一致</p>
                </div>

                <button
                  onClick={() => setShowAddAccountModal(true)}
                  className="px-3.5 py-1.5 bg-[#2E521C] text-white rounded-full text-xs font-semibold hover:bg-[#234114] shadow-2xs transition active:scale-95 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加收款账号</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {bankAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className={`p-4 rounded-[20px] border relative space-y-2 transition ${
                      acc.isDefault
                        ? 'bg-white border-[#CBE6C3] shadow-2xs ring-2 ring-[#2E521C]/20'
                        : 'bg-[#FAF8F5] border-[#ECE6DC]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#2E521C]" />
                        <span className="font-bold text-xs text-[#1D1B16]">{acc.bankName}</span>
                      </div>

                      {acc.isDefault ? (
                        <span className="text-[10px] bg-[#E8E2D5] text-[#2E521C] px-2 py-0.2 rounded-full font-semibold border border-[#CBE6C3]">
                          默认收款账号
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setBankAccounts(bankAccounts.map(a => ({ ...a, isDefault: a.id === acc.id })));
                          }}
                          className="text-[10px] text-[#7A756C] hover:text-[#2E521C] underline font-semibold"
                        >
                          设为默认
                        </button>
                      )}
                    </div>

                    <div className="font-mono text-base font-bold text-[#1D1B16] tracking-wider py-1">
                      {acc.cardNumber}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#7A756C] pt-2 border-t border-[#ECE6DC]">
                      <span>开户人: <strong className="text-[#1D1B16] font-semibold">{acc.accountHolder}</strong></span>
                      <span>手机: {acc.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* DEDICATED PAGE 2: Weekly Shift Schedule Grid */}
      {activeSection === 'schedule' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('menu')}
              className="p-1.5 -ml-1.5 rounded-full text-[#2E521C] hover:bg-[#E8E2D5] transition active:scale-95 flex items-center gap-1 font-semibold text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回列表</span>
            </button>
            <span className="text-[#ECE6DC]">/</span>
            <span className="text-xs font-bold text-[#1D1B16]">常规周排班</span>
          </div>

          <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-5 shadow-2xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ECE6DC]">
            <div>
              <h3 className="font-bold text-sm text-[#1D1B16] flex items-center gap-2">
                <span>常规每周可预约排班设置</span>
                <span className="text-[10px] bg-[#E8E2D5] text-[#2E521C] px-2 py-0.5 rounded-full font-mono font-semibold">
                  M3 移动端适配
                </span>
              </h3>
              <p className="text-xs text-[#7A756C] mt-0.5">
                按星期切换管理开放时段，实时同步至来访者预约界面
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="bg-[#FAF8F5] border border-[#ECE6DC] p-1 rounded-full flex items-center text-xs">
                <button
                  onClick={() => setScheduleViewMode('day')}
                  className={`px-3 py-1 rounded-full font-semibold transition active:scale-95 flex items-center gap-1 ${
                    scheduleViewMode === 'day'
                      ? 'bg-[#2E521C] text-white shadow-2xs'
                      : 'text-[#49463D] hover:text-[#1D1B16]'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>按天排班</span>
                </button>
                <button
                  onClick={() => setScheduleViewMode('week')}
                  className={`px-3 py-1 rounded-full font-semibold transition active:scale-95 flex items-center gap-1 ${
                    scheduleViewMode === 'week'
                      ? 'bg-[#2E521C] text-white shadow-2xs'
                      : 'text-[#49463D] hover:text-[#1D1B16]'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>全周总览</span>
                </button>
              </div>

              <button
                onClick={() => alert('排班设置已成功保存！客户端已同步更新您的开放时间。')}
                className="px-4 py-1.5 bg-[#2E521C] text-white rounded-full text-xs font-semibold hover:bg-[#234114] shadow-2xs transition active:scale-95"
              >
                保存排班
              </button>
            </div>
          </div>

          {scheduleViewMode === 'day' && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-[#7A756C] mb-2 flex items-center justify-between">
                  <span>选择要排班的星期：</span>
                  <span className="text-[11px] text-[#2E521C]">
                    当前选中：<strong className="text-[#1D1B16] font-bold">{daysOfWeek[selectedDayIndex]}</strong> ({getOpenSlotsCount(selectedDayIndex)}/3个时段开放)
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {daysOfWeek.map((dayName, idx) => {
                    const openCount = getOpenSlotsCount(idx);
                    const isSelected = selectedDayIndex === idx;

                    return (
                      <button
                        key={dayName}
                        onClick={() => setSelectedDayIndex(idx)}
                        className={`flex-1 min-w-[76px] py-2.5 px-2 rounded-[18px] border text-center transition active:scale-95 shrink-0 ${
                          isSelected
                            ? 'bg-[#2E521C] text-white border-[#2E521C] shadow-2xs ring-2 ring-[#2E521C]/20'
                            : 'bg-[#FAF8F5] text-[#49463D] border border-[#ECE6DC] hover:bg-[#E8E2D5]'
                        }`}
                      >
                        <div className="text-xs font-bold">{dayName}</div>
                        <div className={`text-[10px] font-mono mt-0.5 rounded-full px-1.5 py-0.2 inline-block ${
                          isSelected
                            ? 'bg-white/20 text-white font-semibold'
                            : openCount > 0
                              ? 'bg-[#E8E2D5] text-[#2E521C] font-semibold'
                              : 'bg-stone-200 text-stone-500'
                        }`}>
                          {openCount > 0 ? `${openCount}时段` : '休息'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#FAF8F5] border border-[#ECE6DC] rounded-[20px] p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DC] flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1D1B16]">
                      {daysOfWeek[selectedDayIndex]} 排班设定
                    </span>
                    <span className="text-xs text-[#7A756C]">
                      ({getOpenSlotsCount(selectedDayIndex) === 3 ? '全天开放' : getOpenSlotsCount(selectedDayIndex) === 0 ? '全天不接单' : '部分时段开放'})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <button
                      onClick={() => handleBatchDaySlots(selectedDayIndex, true)}
                      className="px-2.5 py-1 bg-white border border-[#ECE6DC] rounded-full text-[#2E521C] hover:bg-[#E8E2D5] font-semibold transition active:scale-95"
                    >
                      全选开放
                    </button>
                    <button
                      onClick={() => handleBatchDaySlots(selectedDayIndex, false)}
                      className="px-2.5 py-1 bg-white border border-[#ECE6DC] rounded-full text-[#7A756C] hover:bg-[#E8E2D5] font-semibold transition active:scale-95"
                    >
                      全不开放
                    </button>
                    <button
                      onClick={() => handleCopyScheduleToWeekdays(selectedDayIndex)}
                      className="px-2.5 py-1 bg-[#2E521C]/10 text-[#2E521C] rounded-full font-semibold hover:bg-[#2E521C]/20 transition active:scale-95 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>应用至工作日</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    { slotIndex: 0, title: '上午场', hours: '09:00 - 12:00', icon: Sun, desc: '适合早间清醒状态下的个体心理咨询与情绪疏导' },
                    { slotIndex: 1, title: '下午场', hours: '14:00 - 18:00', icon: SunMedium, desc: '黄金高峰咨询时段，来访者预约意愿最强' },
                    { slotIndex: 2, title: '晚间场', hours: '19:00 - 22:00', icon: Moon, desc: '适合职场人群下班后舒压倾听与夜间接诊' },
                  ].map((slotConfig) => {
                    const key = `${selectedDayIndex}-${slotConfig.slotIndex}`;
                    const isOpen = weeklySchedule[key] ?? false;
                    const SlotIcon = slotConfig.icon;

                    return (
                      <div
                        key={slotConfig.slotIndex}
                        onClick={() => toggleDaySlot(key)}
                        className={`p-3.5 rounded-[16px] border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isOpen
                            ? 'bg-white border-[#CBE6C3] shadow-2xs ring-1 ring-[#2E521C]/20'
                            : 'bg-[#FAF8F5] border-[#ECE6DC] opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-full shrink-0 ${
                            isOpen ? 'bg-[#2E521C] text-white' : 'bg-stone-200 text-stone-500'
                          }`}>
                            <SlotIcon className="w-4 h-4" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#1D1B16]">{slotConfig.title}</span>
                              <span className="font-mono text-xs font-semibold text-[#2E521C] bg-[#FAF8F5] px-2 py-0.2 rounded-full border border-[#ECE6DC]">
                                {slotConfig.hours}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#7A756C] mt-0.5 line-clamp-1">{slotConfig.desc}</p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <span className={`text-xs font-bold hidden sm:inline-block ${isOpen ? 'text-[#2E521C]' : 'text-[#7A756C]'}`}>
                            {isOpen ? '开放预约' : '暂停预约'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDaySlot(key);
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                              isOpen ? 'bg-[#2E521C]' : 'bg-stone-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isOpen ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          )}

          {scheduleViewMode === 'week' && (
            <div className="space-y-3">
              <div className="text-xs text-[#7A756C] flex items-center justify-between">
                <span>全周 7×3 时段排班概览图表：</span>
                <span className="text-[11px] text-[#2E521C]">点击单元格可直接切换开放状态</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F5] text-[#7A756C]">
                      <th className="p-3 text-left w-32 rounded-l-[12px] font-semibold">时段 / 星期</th>
                      {daysOfWeek.map((day) => (
                        <th key={day} className="p-2.5 font-bold text-[#1D1B16]">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECE6DC]">
                    {timeSlotRows.map((rowLabel, rowIndex) => (
                      <tr key={rowLabel}>
                        <td className="p-3 text-left font-semibold text-[#1D1B16] bg-[#FAF8F5]">{rowLabel}</td>
                        {daysOfWeek.map((_, dayIndex) => {
                          const key = `${dayIndex}-${rowIndex}`;
                          const isOpen = weeklySchedule[key];
                          return (
                            <td key={key} className="p-1">
                              <button
                                onClick={() => toggleDaySlot(key)}
                                className={`w-full py-2 rounded-[10px] font-semibold text-[11px] transition active:scale-95 ${
                                  isOpen
                                    ? 'bg-[#2E521C] text-white shadow-2xs'
                                    : 'bg-[#FAF8F5] text-[#7A756C] border border-[#ECE6DC] hover:bg-[#E8E2D5]'
                                }`}
                              >
                                {isOpen ? '开放' : '休'}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
        </div>
      )}

      {/* DEDICATED PAGE 3: Service Products Catalog */}
      {activeSection === 'products' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('menu')}
              className="p-1.5 -ml-1.5 rounded-full text-[#2E521C] hover:bg-[#E8E2D5] transition active:scale-95 flex items-center gap-1 font-semibold text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回列表</span>
            </button>
            <span className="text-[#ECE6DC]">/</span>
            <span className="text-xs font-bold text-[#1D1B16]">服务商品架</span>
          </div>

          <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-5 shadow-2xs space-y-4">
            <div className="pb-2 border-b border-[#ECE6DC]">
              <h3 className="font-bold text-sm text-[#1D1B16]">咨询服务商品与价格管理</h3>
              <p className="text-xs text-[#7A756C] mt-0.5">可自定义调整单次个体咨询、即时倾听及疗程套餐的上架状态与服务定价</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {products.map((prod) => (
                <div key={prod.id} className="bg-[#FAF8F5] border border-[#ECE6DC] rounded-[20px] p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#1D1B16]">{prod.name}</h4>
                        {prod.badge && (
                          <span className="text-[10px] bg-rose-50 text-rose-800 px-2 py-0.2 rounded-full font-semibold border border-rose-200">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#49463D] mt-1 leading-relaxed">{prod.description}</p>
                    </div>

                    <button
                      onClick={() => onToggleProductPublish(prod.id)}
                      className="text-[#2E521C] hover:opacity-80 transition active:scale-95 shrink-0"
                      title="上架/下架开关"
                    >
                      {prod.isPublished ? (
                        <ToggleRight className="w-8 h-8 text-[#2E521C]" />
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
                      {editingProductId === prod.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editingPriceInput}
                            onChange={(e) => setEditingPriceInput(Number(e.target.value))}
                            className="w-20 bg-white border border-[#E6E0D6] rounded-full px-2.5 py-1 text-xs font-mono"
                          />
                          <button
                            onClick={() => {
                              onUpdateProductPrice(prod.id, editingPriceInput);
                              setEditingProductId(null);
                            }}
                            className="text-xs bg-[#2E521C] text-[#FAF8F5] px-3 py-1 rounded-full font-semibold"
                          >
                            保存
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold font-mono text-[#2E521C]">¥{prod.price}</span>
                          <button
                            onClick={() => {
                              setEditingProductId(prod.id);
                              setEditingPriceInput(prod.price);
                            }}
                            className="p-1 text-[#7A756C] hover:text-[#1D1B16]"
                            title="修改服务定价"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
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
                className="p-1.5 -ml-1.5 rounded-full text-[#2E521C] hover:bg-[#E8E2D5] transition active:scale-95 flex items-center gap-1 font-semibold text-xs"
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
                    ? 'bg-white text-[#2E521C] shadow-2xs'
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
                    ? 'bg-[#2E521C] text-white shadow-2xs'
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
                <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#2E521C]/5 to-transparent rounded-bl-full pointer-events-none" />
                
                <div className="flex items-start gap-3.5 sm:gap-4 relative z-10">
                  <img
                    src={consultant.avatar}
                    alt={consultant.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#2E521C]/20 shadow-xs shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold text-[#1D1B16]">{formName}</h2>
                      <span className="px-2 py-0.5 rounded-full bg-[#2E521C]/10 text-[#2E521C] text-[10px] font-bold flex items-center gap-1 border border-[#2E521C]/20">
                        <ShieldCheck className="w-3 h-3 text-[#2E521C]" />
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
                        <div className="text-xs font-bold font-mono text-[#2E521C] mt-0.5">{consultant.totalHours}h</div>
                      </div>
                      <div className="bg-[#FAF8F5] p-2 rounded-[14px] border border-[#ECE6DC]">
                        <div className="text-[10px] text-[#7A756C]">督导时长</div>
                        <div className="text-xs font-bold font-mono text-[#2E521C] mt-0.5">{formSupervisionHours}h</div>
                      </div>
                      <div className="bg-[#FAF8F5] p-2 rounded-[14px] border border-[#ECE6DC]">
                        <div className="text-[10px] text-[#7A756C]">个人体验</div>
                        <div className="text-xs font-bold font-mono text-[#2E521C] mt-0.5">{formPersonalTherapyHours}h</div>
                      </div>
                      <div className="bg-[#FAF8F5] p-2 rounded-[14px] border border-[#ECE6DC]">
                        <div className="text-[10px] text-[#7A756C]">服务人次</div>
                        <div className="text-xs font-bold font-mono text-[#2E521C] mt-0.5">{consultant.totalClients}+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 1: 个人简介 (Personal Bio / Self Introduction) */}
              <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2 text-[#2E521C] font-bold text-xs pb-1 border-b border-[#ECE6DC]">
                  <Sparkles className="w-4 h-4 text-[#2E521C]" />
                  <span>个人简介与咨询寄语</span>
                </div>
                <div className="bg-[#FAF8F5] p-3.5 sm:p-4 rounded-[18px] border-l-4 border-l-[#2E521C] border border-[#ECE6DC] text-[#49463D] leading-relaxed text-xs italic">
                  “{formBio}”
                </div>
              </div>

              {/* CARD 2: 资质与受训 (Qualifications & Training) */}
              <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-[#2E521C] font-bold text-xs pb-1 border-b border-[#ECE6DC]">
                  <ShieldCheck className="w-4 h-4 text-[#2E521C]" />
                  <span>资质与受训背景</span>
                </div>

                <div className="space-y-3.5">
                  {/* 执业资质 */}
                  <div>
                    <h4 className="text-[11px] font-bold text-[#7A756C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#2E521C]" />
                      <span>执业资质与专业认证</span>
                    </h4>
                    <div className="space-y-1.5">
                      {formQualifications.map((item, idx) => (
                        <div key={idx} className="bg-[#FAF8F5] px-3 py-2 rounded-[14px] border border-[#ECE6DC] flex items-center gap-2 text-xs text-[#1D1B16]">
                          <CheckCircle2 className="w-4 h-4 text-[#2E521C] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 学历背景 */}
                  <div>
                    <h4 className="text-[11px] font-bold text-[#7A756C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#2E521C]" />
                      <span>学历背景</span>
                    </h4>
                    <div className="space-y-1.5">
                      {formEducation.map((item, idx) => (
                        <div key={idx} className="bg-[#FAF8F5] px-3 py-2 rounded-[14px] border border-[#ECE6DC] flex items-center gap-2 text-xs text-[#1D1B16]">
                          <Building className="w-4 h-4 text-[#2E521C] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 长短程受训 */}
                  <div>
                    <h4 className="text-[11px] font-bold text-[#7A756C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#2E521C]" />
                      <span>长短程培训经历</span>
                    </h4>
                    <div className="space-y-1.5">
                      {formTraining.map((item, idx) => (
                        <div key={idx} className="bg-[#FAF8F5] px-3 py-2 rounded-[14px] border border-[#ECE6DC] flex items-center gap-2 text-xs text-[#1D1B16]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2E521C] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: 咨询师擅长 (Expertise, Languages, Orientations & Style) */}
              <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-[#2E521C] font-bold text-xs pb-1 border-b border-[#ECE6DC]">
                  <Compass className="w-4 h-4 text-[#2E521C]" />
                  <span>咨询师擅长与工作流派</span>
                </div>

                <div className="space-y-3.5">
                  {/* 擅长领域 */}
                  <div>
                    <h4 className="text-[11px] font-bold text-[#7A756C] uppercase tracking-wider mb-2">擅长领域</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {formSpecialties.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-[#2E521C]/10 text-[#2E521C] border border-[#2E521C]/20 text-xs font-semibold">
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
                          <Package className="w-3 h-3 text-[#2E521C]" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 工作语言 & 工作流派 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-[#FAF8F5] p-3 rounded-[16px] border border-[#ECE6DC]">
                      <div className="text-[11px] font-bold text-[#7A756C] mb-1.5 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-[#2E521C]" />
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
                        <BookOpen className="w-3.5 h-3.5 text-[#2E521C]" />
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
                    <FileCheck className="w-4 h-4 text-[#2E521C]" />
                    <span>预约须知与订单服务契约</span>
                  </div>
                  <span className="text-[10px] text-[#7A756C] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#ECE6DC]">
                    订单通用条款
                  </span>
                </div>

                <div className="space-y-2 text-[11px] text-[#49463D]">
                  <div className="bg-[#FAF8F5] p-3 rounded-[16px] border border-[#ECE6DC] space-y-1.5">
                    <div className="font-bold text-[#1D1B16] flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5 text-[#2E521C]" />
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
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2E521C]" />
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
                  <User className="w-4 h-4 text-[#2E521C]" />
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
                      className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[14px] px-3 py-2 text-xs text-[#1D1B16] font-medium focus:outline-none focus:ring-2 focus:ring-[#2E521C]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#7A756C] mb-1">执业头衔/称谓</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[14px] px-3 py-2 text-xs text-[#1D1B16] font-medium focus:outline-none focus:ring-2 focus:ring-[#2E521C]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#7A756C] mb-1">证书/注册编号</label>
                    <input
                      type="text"
                      value={formLicenseNo}
                      onChange={(e) => setFormLicenseNo(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[14px] px-3 py-2 text-xs font-mono text-[#1D1B16] focus:outline-none focus:ring-2 focus:ring-[#2E521C]/20"
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
                      className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[14px] px-3 py-2 text-xs font-mono text-[#1D1B16] focus:outline-none focus:ring-2 focus:ring-[#2E521C]/20"
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
                    className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[16px] p-3 text-xs text-[#1D1B16] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2E521C]/20"
                  />
                  <span className="text-[10px] text-[#7A756C] mt-0.5 block text-right">建议 50-200 字</span>
                </div>
              </div>

              {/* SECTION 2: 资质、学历与受训经历编辑 */}
              <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="font-bold text-xs text-[#1D1B16] flex items-center gap-2 pb-2 border-b border-[#ECE6DC]">
                  <ShieldCheck className="w-4 h-4 text-[#2E521C]" />
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
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#2E521C]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newQualInput, setNewQualInput, formQualifications, setFormQualifications)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#2E521C] text-white font-semibold text-xs hover:bg-[#234114] shrink-0"
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
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#2E521C]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newEduInput, setNewEduInput, formEducation, setFormEducation)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#2E521C] text-white font-semibold text-xs hover:bg-[#234114] shrink-0"
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
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#2E521C]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newTrainInput, setNewTrainInput, formTraining, setFormTraining)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#2E521C] text-white font-semibold text-xs hover:bg-[#234114] shrink-0"
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
                      className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 font-mono text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#2E521C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#7A756C] mb-1">个人体验时长 (小时)</label>
                    <input
                      type="number"
                      min="0"
                      value={formPersonalTherapyHours}
                      onChange={(e) => setFormPersonalTherapyHours(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 font-mono text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#2E521C]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: 咨询师擅长、领域、人群、服务、流派与风格 */}
              <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="font-bold text-xs text-[#1D1B16] flex items-center gap-2 pb-2 border-b border-[#ECE6DC]">
                  <Compass className="w-4 h-4 text-[#2E521C]" />
                  <span>咨询师擅长、人群、流派与风格</span>
                </div>

                {/* 1. 擅长领域 */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7A756C] mb-1.5">擅长领域 (议题/主题)</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formSpecialties.map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-[#2E521C]/10 text-[#2E521C] border border-[#2E521C]/20 text-xs font-medium flex items-center gap-1">
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
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#2E521C]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newSpecialtyInput, setNewSpecialtyInput, formSpecialties, setFormSpecialties)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#2E521C] text-white font-semibold text-xs hover:bg-[#234114] shrink-0"
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
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#2E521C]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newAudienceInput, setNewAudienceInput, formTargetAudience, setFormTargetAudience)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#2E521C] text-white font-semibold text-xs hover:bg-[#234114] shrink-0"
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
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#2E521C]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newServiceInput, setNewServiceInput, formProficientServices, setFormProficientServices)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#2E521C] text-white font-semibold text-xs hover:bg-[#234114] shrink-0"
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
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#2E521C]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newLangInput, setNewLangInput, formLanguages, setFormLanguages)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#2E521C] text-white font-semibold text-xs hover:bg-[#234114] shrink-0"
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
                      className="flex-1 bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] px-3 py-1.5 text-xs text-[#1D1B16] focus:outline-none focus:ring-1 focus:ring-[#2E521C]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(newOrientInput, setNewOrientInput, formOrientations, setFormOrientations)}
                      className="px-3 py-1.5 rounded-[12px] bg-[#2E521C] text-white font-semibold text-xs hover:bg-[#234114] shrink-0"
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
                    className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[16px] p-3 text-xs text-[#1D1B16] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2E521C]/20"
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
                  className="px-6 py-2 rounded-full bg-[#2E521C] text-white font-semibold hover:bg-[#234114] shadow-2xs active:scale-95 transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>保存资质档案</span>
                </button>
              </div>

            </form>
          )}

        </div>
      )}

      {/* MODAL 1: WITHDRAWAL APPLICATION FORM MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-t-[28px] sm:rounded-[28px] max-w-sm w-full p-5 shadow-2xl relative">
            <div className="w-10 h-1 bg-[#E6E0D6] rounded-full mx-auto mb-3" />

            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#7A756C] hover:text-[#1D1B16] hover:bg-[#E8E2D5] transition active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-[#1D1B16] mb-1">申请资金提现</h3>
            <p className="text-xs text-[#7A756C] mb-4">提现申请经财务审核后打款至您绑定的收款账号</p>
            
            <form onSubmit={handleApplyWithdraw} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1 font-medium text-[#7A756C]">
                  <label>提现金额 (元)</label>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmountInput(withdrawableBalance.toString())}
                    className="text-[#2E521C] font-semibold hover:underline"
                  >
                    全部提现
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-sm font-bold text-[#2E521C]">¥</span>
                  <input
                    type="number"
                    required
                    min="100"
                    step="0.01"
                    max={withdrawableBalance}
                    value={withdrawAmountInput}
                    onChange={(e) => setWithdrawAmountInput(e.target.value)}
                    className="w-full bg-white border border-[#E6E0D6] rounded-[14px] pl-8 pr-3 py-2.5 font-mono text-base font-bold text-[#2E521C] focus:outline-none focus:ring-2 focus:ring-[#2E521C]/20"
                  />
                </div>
                <span className="text-[11px] text-[#7A756C] mt-1 block">
                  当前可提现余额：<strong className="font-mono text-[#1D1B16]">¥{withdrawableBalance.toFixed(2)}</strong> (最低提现 ¥100.00)
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 font-medium text-[#7A756C]">
                  <label>选择打款目标账号</label>
                  <button
                    type="button"
                    onClick={() => setShowAddAccountModal(true)}
                    className="text-[#2E521C] font-semibold hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>新增账号</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {bankAccounts.map((acc) => (
                    <div
                      key={acc.id}
                      onClick={() => setSelectedAccountId(acc.id)}
                      className={`p-3 rounded-[14px] border cursor-pointer transition flex items-center justify-between ${
                        selectedAccountId === acc.id
                          ? 'bg-white border-[#2E521C] shadow-2xs ring-1 ring-[#2E521C]/20'
                          : 'bg-[#FAF8F5] border-[#ECE6DC] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-[#2E521C]" />
                        <div>
                          <div className="font-bold text-xs text-[#1D1B16]">{acc.bankName}</div>
                          <div className="text-[11px] text-[#7A756C] font-mono">{acc.cardNumber} ({acc.accountHolder})</div>
                        </div>
                      </div>

                      {selectedAccountId === acc.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#2E521C]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FAF8F5] border border-[#ECE6DC] p-3 rounded-[14px] text-[11px] text-[#7A756C] space-y-1">
                <div>• 提现到账时效：工作日 24 小时内由财务代扣并完成划转</div>
                <div>• 提现约定：单笔免手续费，失败资金将原路退回余额</div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 rounded-full border border-[#E6E0D6] bg-white text-[#49463D] font-semibold hover:bg-[#E8E2D5] active:scale-95"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#2E521C] text-white font-semibold hover:bg-[#234114] shadow-2xs active:scale-95"
                >
                  提交申请
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD BANK ACCOUNT MODAL */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-t-[28px] sm:rounded-[28px] max-w-sm w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setShowAddAccountModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#7A756C] hover:text-[#1D1B16] hover:bg-[#E8E2D5] transition active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-[#1D1B16] mb-1">新增提现收款账号</h3>
            <p className="text-xs text-[#7A756C] mb-4">开户人姓名必须与您的执业实名认证相一致</p>

            <form onSubmit={handleAddBankAccount} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#7A756C] mb-1 font-medium">账户类型</label>
                <select
                  value={newAccType}
                  onChange={(e) => setNewAccType(e.target.value as any)}
                  className="w-full bg-white border border-[#E6E0D6] rounded-[12px] p-2.5 font-semibold text-[#1D1B16]"
                >
                  <option value="bank_card">银行借记卡 / 储蓄卡</option>
                  <option value="wechat">微信支付零钱</option>
                  <option value="alipay">支付宝账户</option>
                </select>
              </div>

              <div>
                <label className="block text-[#7A756C] mb-1 font-medium">开户银行 / 机构全称</label>
                <input
                  type="text"
                  required
                  placeholder="例如：招商银行 (上海静安支行)"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  className="w-full bg-white border border-[#E6E0D6] rounded-[12px] p-2.5 text-[#1D1B16]"
                />
              </div>

              <div>
                <label className="block text-[#7A756C] mb-1 font-medium">卡号 / 账号</label>
                <input
                  type="text"
                  required
                  placeholder="例如：6222 0210 **** 8821"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  className="w-full bg-white border border-[#E6E0D6] rounded-[12px] p-2.5 font-mono text-[#1D1B16]"
                />
              </div>

              <div>
                <label className="block text-[#7A756C] mb-1 font-medium">开户人姓名 (默认实名认证)</label>
                <input
                  type="text"
                  required
                  value={newHolder}
                  onChange={(e) => setNewHolder(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E6E0D6] rounded-[12px] p-2.5 font-semibold text-[#1D1B16]"
                />
              </div>

              <div>
                <label className="block text-[#7A756C] mb-1 font-medium">银行预留手机号</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-white border border-[#E6E0D6] rounded-[12px] p-2.5 font-mono text-[#1D1B16]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="px-4 py-2 rounded-full border border-[#E6E0D6] bg-white text-[#49463D] font-semibold hover:bg-[#E8E2D5]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#2E521C] text-white font-semibold hover:bg-[#234114] shadow-2xs"
                >
                  保存账号
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: WITHDRAWAL RULES & AGREEMENT MODAL */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#E6E0D6] rounded-[28px] max-w-md w-full p-6 shadow-2xl relative space-y-4 text-xs text-[#1D1B16]">
            <button
              onClick={() => setShowRulesModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#7A756C] hover:text-[#1D1B16] hover:bg-[#E8E2D5]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-base font-bold text-[#2E521C]">
              <Info className="w-5 h-5 text-[#2E521C]" />
              <span>咨询师提现规则与结算约定</span>
            </div>

            <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-[20px] border border-[#ECE6DC] leading-relaxed text-[#49463D]">
              <div>
                <strong className="text-[#1D1B16] block mb-0.5">1. 结算时效约定 (T+1)</strong>
                <p>当咨询订单服务完成（或急诊倾听会话结束）后，系统将于次日（T+1）自动将该笔订单的实际应得收益划入【可提现余额】。</p>
              </div>

              <div>
                <strong className="text-[#1D1B16] block mb-0.5">2. 提现额度与手续费</strong>
                <p>单笔提现申请最低额度为 <span className="font-bold text-[#2E521C]">¥100.00</span>。提现不限次数，平台全额补贴提现渠道手续费。</p>
              </div>

              <div>
                <strong className="text-[#1D1B16] block mb-0.5">3. 财务审核与最终打款责任</strong>
                <p>提交提现申请后，将由平台财务团队统一人工审核并执行网银划转（1个工作日内完成到账）。若开户信息有误，资金将安全退回可提现余额。</p>
              </div>

              <div>
                <strong className="text-[#1D1B16] block mb-0.5">4. 实名一致性合规</strong>
                <p>提现收款卡开户人姓名必须与咨询师 CPS 执业认证实名姓名（{consultant.name}）完全相符，严禁代领。</p>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowRulesModal(false)}
                className="px-6 py-2 bg-[#2E521C] text-white rounded-full font-semibold hover:bg-[#234114] shadow-2xs"
              >
                我已了解
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ORDER & BILL DETAIL BREAKDOWN MODAL */}
      {selectedBillForDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#E6E0D6] rounded-[28px] max-w-md w-full p-6 shadow-2xl relative space-y-4 text-xs text-[#1D1B16]">
            <button
              onClick={() => setSelectedBillForDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#7A756C] hover:text-[#1D1B16] hover:bg-[#E8E2D5]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-[#ECE6DC]">
              <Receipt className="w-5 h-5 text-[#2E521C]" />
              <div>
                <h3 className="font-bold text-sm text-[#1D1B16]">订单分账与资金流水明细</h3>
                <span className="text-[11px] text-[#7A756C] font-mono">账单号: {selectedBillForDetail.billNo}</span>
              </div>
            </div>

            {/* Client & Service Card */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-[18px] border border-[#ECE6DC] flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-[#1D1B16]">{selectedBillForDetail.clientName}</div>
                <div className="text-[11px] text-[#7A756C]">{selectedBillForDetail.serviceTypeName}</div>
                <div className="text-[10px] text-[#7A756C] font-mono mt-0.5">{selectedBillForDetail.bookingDate} {selectedBillForDetail.bookingTimeSlot || ''}</div>
              </div>

              {renderBillStatusBadge(selectedBillForDetail.status)}
            </div>

            {/* Fee Breakdown Sheet */}
            <div className="bg-[#FAF8F5] p-4 rounded-[20px] border border-[#ECE6DC] space-y-2.5">
              <div className="font-bold text-xs text-[#1D1B16] mb-1">资金划转与平台分成计算公式</div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#7A756C]">订单原价 (来访者实付):</span>
                <span className="font-mono font-bold text-[#1D1B16]">¥{selectedBillForDetail.grossAmount.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-rose-800">
                <span className="flex items-center gap-1">
                  <span>- 平台技术与督导服务费 (12%):</span>
                </span>
                <span className="font-mono font-bold">-¥{selectedBillForDetail.platformFee.toFixed(2)}</span>
              </div>

              <div className="h-px bg-[#ECE6DC]" />

              <div className="flex items-center justify-between text-sm pt-1">
                <span className="font-bold text-[#1D1B16]">咨询师实际应得净收益 (88%):</span>
                <span className="font-mono font-bold text-base text-[#2E521C]">+¥{selectedBillForDetail.netAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Audit Trace Timeline */}
            <div className="space-y-2 text-[11px] text-[#7A756C]">
              <strong className="text-[#1D1B16] block text-xs font-bold">账单流水轨迹:</strong>
              <div className="space-y-1.5 pl-2 border-l-2 border-[#CBE6C3]">
                <div>• 下单创建时间: {selectedBillForDetail.createdAt}</div>
                <div>• 咨询服务完成: {selectedBillForDetail.bookingDate}</div>
                <div>• 平台清算入账: {selectedBillForDetail.settledAt || '服务完成后 T+1 自动归集'}</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBillForDetail(null)}
                className="px-5 py-2 rounded-full bg-[#2E521C] text-white text-xs font-semibold hover:bg-[#234114]"
              >
                关闭详情
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: WITHDRAWAL APPLICATION DETAIL MODAL */}
      {selectedWithdrawalForDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#E6E0D6] rounded-[28px] max-w-md w-full p-6 shadow-2xl relative space-y-4 text-xs text-[#1D1B16]">
            <button
              onClick={() => setSelectedWithdrawalForDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#7A756C] hover:text-[#1D1B16] hover:bg-[#E8E2D5]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DC]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#2E521C]" />
                <div>
                  <h3 className="font-bold text-sm text-[#1D1B16]">提现申请与财务打款单据</h3>
                  <span className="text-[11px] text-[#7A756C] font-mono">{selectedWithdrawalForDetail.withdrawNo}</span>
                </div>
              </div>
              {renderWithdrawalStatusBadge(selectedWithdrawalForDetail.status)}
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-[20px] border border-[#ECE6DC] space-y-3">
              <div>
                <span className="text-xs text-[#7A756C] block">提现申请金额</span>
                <span className="text-2xl font-bold font-mono text-[#2E521C]">¥{selectedWithdrawalForDetail.amount.toFixed(2)}</span>
              </div>

              <div className="h-px bg-[#ECE6DC]" />

              <div className="space-y-1.5 text-xs">
                <div><strong className="text-[#1D1B16]">打款目标机构：</strong>{selectedWithdrawalForDetail.bankAccount.bankName}</div>
                <div><strong className="text-[#1D1B16]">收款卡号/账号：</strong><span className="font-mono">{selectedWithdrawalForDetail.bankAccount.cardNumber}</span></div>
                <div><strong className="text-[#1D1B16]">收款人真实姓名：</strong>{selectedWithdrawalForDetail.bankAccount.accountHolder}</div>
                <div><strong className="text-[#1D1B16]">申请提交时间：</strong><span className="font-mono">{selectedWithdrawalForDetail.applyTime}</span></div>
                {selectedWithdrawalForDetail.completedTime && (
                  <div><strong className="text-[#1D1B16]">财务处理完成时间：</strong><span className="font-mono">{selectedWithdrawalForDetail.completedTime}</span></div>
                )}
              </div>
            </div>

            {/* Financial Note or Reject Reason */}
            {selectedWithdrawalForDetail.rejectReason && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-[16px] text-xs text-rose-800 space-y-1">
                <strong className="font-bold flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>提现被驳回原因说明:</span>
                </strong>
                <p>{selectedWithdrawalForDetail.rejectReason}</p>
              </div>
            )}

            {selectedWithdrawalForDetail.financeNote && !selectedWithdrawalForDetail.rejectReason && (
              <div className="bg-[#FAF8F5] p-3 rounded-[16px] border border-[#ECE6DC] text-xs text-[#49463D] space-y-1">
                <strong className="font-bold text-[#2E521C] block">财务打款流程备注:</strong>
                <p>{selectedWithdrawalForDetail.financeNote}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedWithdrawalForDetail(null)}
                className="px-5 py-2 rounded-full bg-[#2E521C] text-white text-xs font-semibold hover:bg-[#234114]"
              >
                关闭单据
              </button>
            </div>
          </div>
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
