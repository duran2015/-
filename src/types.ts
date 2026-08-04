export type OrderStatus = 
  | 'pending_confirm' // 待确认
  | 'scheduled'       // 待咨询
  | 'in_progress'     // 服务中
  | 'completed'       // 已完成
  | 'refunded'        // 退款/售后
  | 'cancelled';      // 已取消

export type OrderServiceType = 
  | '50min_video'     // 50分钟视频咨询
  | '50min_audio'     // 50分钟语音咨询
  | '15min_listening' // 15分钟极简倾听
  | 'package_4sessions' // 4次深度疗程
  | 'instant_chat';   // 21天即时文字陪伴

export interface ClientProfile {
  id: string;
  name: string;
  avatar: string;
  gender: string;
  age: number;
  occupation: string;
  city: string;
  phone: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  intakeDate: string;
  riskLevel: 'low' | 'moderate' | 'attention' | 'high';
  tags: string[];
  phq9Score?: { score: number; level: string }; // 抑郁测评
  gad7Score?: { score: number; level: string }; // 焦虑测评
  historySummary: {
    totalSessions: number;
    attendanceRate: string;
    primaryGoals: string[];
    counselorWorkingNotes: string;
  };
  sessionLogs: Array<{
    sessionNo: number;
    date: string;
    topic: string;
    preMoodScore: number;
    keyBreakthrough: string;
    homeworkStatus: 'completed' | 'partial' | 'pending';
  }>;
  preSessionCheckIns: Array<{
    date: string;
    moodScore: number;
    sleepHours: number;
    distressTrigger: string;
  }>;
}

export interface Order {
  id: string;
  orderNo: string;
  clientId?: string;
  clientName: string;
  clientAvatar: string;
  serviceType: OrderServiceType;
  serviceTypeName: string;
  bookingDate: string; // YYYY-MM-DD
  bookingTimeSlot: string; // e.g. "14:00 - 14:50"
  price: number;
  originalPrice?: number;
  status: OrderStatus;
  paymentMethod?: string;
  consultationFormat?: 'video' | 'audio' | 'chat';
  preMoodScore?: number; // 1-10
  complaintTopic: string;
  note?: string;
  hasSummary?: boolean;
  createdAt: string;
  intakeForm?: {
    primaryIssueDetail: string;
    expectations: string;
    riskAssessmentPassed: boolean;
    hasCounselingHistory: boolean;
    previousCounselingType?: string;
  };
}

export interface ConsultantProfile {
  id: string;
  name: string;
  avatar: string;
  title: string; // e.g. 国家二级心理咨询师 / 注册系统心理师
  licenseNo: string;
  experienceYears: number;
  totalHours: number;
  totalClients: number;
  rating: number;
  verifiedStatus: 'verified' | 'under_review';
  isListeningActive: boolean; // 是否开启即时倾听通道
  orientations: string[]; // 疗法流派: 人本主义, CBT, 精神分析等
  targetGroups: string[]; // 擅长人群
  bio: string;

  // 资质与受训
  qualificationsList?: string[]; // 执业资质 (CPS注册心理师、国家二级等)
  educationList?: string[]; // 学历背景 (华东师范大学硕士等)
  trainingExperiences?: string[]; // 长短程受训经历
  supervisionHours?: number; // 督导时长 (小时)
  personalTherapyHours?: number; // 个人体验时长 (小时)

  // 咨询师擅长
  specialties?: string[]; // 擅长领域
  targetAudience?: string[]; // 适合人群
  proficientServices?: string[]; // 擅长服务
  workingLanguages?: string[]; // 工作语言
  counselingStyle?: string; // 咨询风格描述

  earnings: {
    withdrawable: number;
    monthlySettled: number;
    totalEarned: number;
    commissionRate: number; // e.g. 15%
  };
  referralStats: {
    totalReferrals: number;
    convertedClients: number;
    viralRevenue: number;
    activeVouchersCount: number;
  };
}

export interface TimeSlot {
  id: string;
  dayOfWeek: number; // 1-7
  time: string; // e.g. "10:00"
  status: 'available' | 'booked' | 'blocked';
  clientName?: string;
}

export interface ServiceProduct {
  id: string;
  name: string;
  type: OrderServiceType;
  durationMinutes: number;
  price: number;
  salesCount: number;
  isPublished: boolean;
  description: string;
  badge?: string;
}

export interface SettlementRecord {
  id: string;
  period: string; // e.g., "2026年07月（下半月）"
  totalAmount: number;
  platformFee: number;
  taxAmount: number;
  netAmount: number;
  payoutStatus: 'paid' | 'processing';
  payoutDate: string;
}

export interface BankAccount {
  id: string;
  accountType: 'bank_card' | 'wechat' | 'alipay';
  bankName: string;
  cardNumber: string;
  accountHolder: string;
  phone: string;
  isDefault: boolean;
}

export type WithdrawalStatus = 'pending_audit' | 'processing' | 'completed' | 'rejected';

export interface WithdrawalRecord {
  id: string;
  withdrawNo: string;
  amount: number;
  bankAccount: {
    bankName: string;
    cardNumber: string;
    accountHolder: string;
  };
  status: WithdrawalStatus;
  applyTime: string;
  completedTime?: string;
  rejectReason?: string;
  financeNote?: string;
}

export type BillRecordStatus = 'pending_settlement' | 'settled' | 'withdrawn' | 'refunded';

export interface BillRecord {
  id: string;
  billNo: string;
  orderId?: string;
  orderNo?: string;
  clientName: string;
  clientAvatar?: string;
  serviceTypeName: string;
  bookingDate: string;
  bookingTimeSlot?: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: BillRecordStatus;
  createdAt: string;
  settledAt?: string;
}

export interface SessionSummary {
  id: string;
  orderId: string;
  clientName: string;
  date: string;
  sessionNumber: number;
  clientMood: string;
  mainComplaint: string;
  interventions: string[];
  insights: string;
  homework: string;
  nextPlan: string;
  createdAt: string;
}

export interface ViralVoucher {
  id: string;
  title: string;
  code: string;
  discountType: 'free_15min' | 'amount_off' | 'percentage';
  discountValue: number; // e.g. 50 RMB off or 100% off
  originalPrice: number;
  voucherPrice: number; // e.g. 0 for gift, or 19 RMB
  claimedCount: number;
  conversionCount: number;
  isEnabled: boolean;
}

export interface TherapyQuote {
  id: string;
  title: string;
  quote: string;
  tag: string;
  authorNote?: string;
}
