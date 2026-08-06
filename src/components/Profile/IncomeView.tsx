import React, { useState } from 'react';
import { 
  ArrowLeft, Wallet, Clock, CheckCircle2, XCircle, CreditCard, Building2, 
  Info, History, FileText, ChevronRight, X, Plus, Building, Phone, User, Check
} from 'lucide-react';
import { ConsultantProfile, BankAccount, WithdrawalRecord, BillRecord, BillRecordStatus } from '../../types';
import { INITIAL_BANK_ACCOUNTS, INITIAL_WITHDRAWAL_RECORDS, INITIAL_BILL_RECORDS } from '../../data/mockData';

interface IncomeViewProps {
  consultant: ConsultantProfile;
  onClose: () => void;
}

export const IncomeView: React.FC<IncomeViewProps> = ({ consultant, onClose }) => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [withdrawalRecords, setWithdrawalRecords] = useState<WithdrawalRecord[]>(INITIAL_WITHDRAWAL_RECORDS);
  const [billRecords, setBillRecords] = useState<BillRecord[]>(INITIAL_BILL_RECORDS);
  const [withdrawableBalance, setWithdrawableBalance] = useState<number>(consultant.earnings.withdrawable);

  const [settlementSubTab, setSettlementSubTab] = useState<'bills' | 'withdrawals' | 'accounts'>('bills');
  const [billStatusFilter, setBillStatusFilter] = useState<'all' | 'settled' | 'pending_settlement' | 'withdrawn' | 'refunded'>('all');

  const [showAddAccountModal, setShowAddAccountModal] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);

  const [withdrawAmountInput, setWithdrawAmountInput] = useState<string>('1000');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(INITIAL_BANK_ACCOUNTS[0]?.id || '');

  const [newAccType, setNewAccType] = useState<'bank_card' | 'wechat' | 'alipay'>('bank_card');
  const [newBankName, setNewBankName] = useState<string>('');
  const [newCardNumber, setNewCardNumber] = useState<string>('');
  const [newHolder, setNewHolder] = useState<string>(consultant.name);
  const [newPhone, setNewPhone] = useState<string>('13800000000');

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

  const filteredBillRecords = billRecords.filter(bill => {
    if (billStatusFilter === 'all') return true;
    return bill.status === billStatusFilter;
  });

  const pendingSettlementTotal = billRecords
    .filter(b => b.status === 'pending_settlement')
    .reduce((sum, b) => sum + b.netAmount, 0);

  const renderBillStatusBadge = (status: BillRecordStatus) => {
    switch (status) {
      case 'settled':
        return (
          <span className="bg-[#EADDFF] text-[#21005D] px-2 py-0.5 rounded-full text-[10px] font-semibold border border-[#D0BCFF] inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#6750A4]" />
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

  return (
    <div className="absolute inset-0 bg-[#FAF8F5] z-50 flex flex-col overflow-hidden sm:rounded-[28px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#ECE6DC] sticky top-0 z-10 shrink-0 shadow-xs">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full text-[#49463D] hover:bg-[#F5F2EC] transition flex items-center gap-1 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">返回</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-base font-bold text-[#1D1B16]">我的收入与提现</span>
        </div>
        <button
          onClick={() => setShowRulesModal(true)}
          className="p-2 -mr-2 rounded-full text-[#6750A4] hover:bg-[#F5F2EC] transition active:scale-95"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-4">
        {/* Balance Overview Hero Box */}
        <div className="bg-white border border-[#E6E0D6] rounded-[28px] p-5 shadow-2xs space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#6750A4]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-[#ECE6DC] relative z-10">
            <div>
              <div className="text-xs text-[#7A756C] flex items-center gap-1">
                <span>当前可提现余额</span>
                <span className="text-[10px] bg-[#EADDFF] text-[#21005D] px-1.5 py-0.2 rounded-full font-semibold">T+1 随时提</span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#6750A4] mt-1">
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
              <Building2 className="w-3.5 h-3.5 text-[#6750A4]" />
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
                className="px-5 py-1.5 rounded-full bg-[#6750A4] text-white text-xs font-semibold hover:bg-[#594294] transition shadow-2xs active:scale-95 flex items-center gap-1.5"
              >
                <Wallet className="w-4 h-4 text-emerald-200" />
                <span>发起提现申请</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="bg-[#FAF8F5] border border-[#ECE6DC] p-1.5 rounded-[20px] flex items-center gap-1 shadow-2xs text-xs">
          <button
            onClick={() => setSettlementSubTab('bills')}
            className={`flex-1 py-2 px-3 rounded-[14px] font-semibold transition active:scale-95 flex items-center justify-center gap-1.5 ${
              settlementSubTab === 'bills' ? 'bg-[#6750A4] text-white shadow-2xs' : 'text-[#49463D] hover:bg-[#E8E2D5]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>收入账单明细 ({billRecords.length})</span>
          </button>
          <button
            onClick={() => setSettlementSubTab('withdrawals')}
            className={`flex-1 py-2 px-3 rounded-[14px] font-semibold transition active:scale-95 flex items-center justify-center gap-1.5 ${
              settlementSubTab === 'withdrawals' ? 'bg-[#6750A4] text-white shadow-2xs' : 'text-[#49463D] hover:bg-[#E8E2D5]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>提现记录 ({withdrawalRecords.length})</span>
          </button>
          <button
            onClick={() => setSettlementSubTab('accounts')}
            className={`flex-1 py-2 px-3 rounded-[14px] font-semibold transition active:scale-95 flex items-center justify-center gap-1.5 ${
              settlementSubTab === 'accounts' ? 'bg-[#6750A4] text-white shadow-2xs' : 'text-[#49463D] hover:bg-[#E8E2D5]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>收款卡 ({bankAccounts.length})</span>
          </button>
        </div>

        {/* SUB TAB 1: BILLS LIST */}
        {settlementSubTab === 'bills' && (
          <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DC] flex-wrap gap-2">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
                {[
                  { id: 'all', label: '全部' },
                  { id: 'settled', label: '已入账' },
                  { id: 'pending_settlement', label: '待结算' },
                  { id: 'withdrawn', label: '已打款' },
                  { id: 'refunded', label: '已退款' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setBillStatusFilter(filter.id as any)}
                    className={`px-3 py-1 rounded-full font-semibold transition active:scale-95 ${
                      billStatusFilter === filter.id ? 'bg-[#6750A4] text-white shadow-2xs' : 'bg-[#FAF8F5] text-[#7A756C] border border-[#ECE6DC] hover:text-[#1D1B16]'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-[#7A756C]">按 12% 平台费率计算</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {filteredBillRecords.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#7A756C] bg-[#FAF8F5] rounded-[18px] border border-[#ECE6DC]">暂无记录</div>
              ) : (
                filteredBillRecords.map((bill) => (
                  <div key={bill.id} className="bg-[#FAF8F5] p-3.5 rounded-[18px] border border-[#ECE6DC] hover:border-[#D0BCFF] transition space-y-2.5">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-[#ECE6DC]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#1D1B16]">{bill.billNo}</span>
                      </div>
                      {renderBillStatusBadge(bill.status)}
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs text-[#1D1B16] flex items-center gap-2">
                          <span>{bill.clientName}</span>
                          <span className="text-[11px] text-[#49463D] font-normal">{bill.serviceTypeName}</span>
                        </div>
                        <div className="text-[11px] text-[#7A756C] mt-0.5 font-mono">
                          预约时间: {bill.bookingDate} {bill.bookingTimeSlot || ''}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-bold font-mono text-[#6750A4]">+¥{bill.netAmount.toFixed(2)}</div>
                        <div className="text-[10px] text-[#7A756C] font-mono mt-0.5">原价¥{bill.grossAmount} (扣12%)</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SUB TAB 2: WITHDRAWAL RECORDS */}
        {settlementSubTab === 'withdrawals' && (
          <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 shadow-2xs space-y-3">
            <div className="space-y-2.5">
              {withdrawalRecords.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#7A756C] bg-[#FAF8F5] rounded-[18px] border border-[#ECE6DC]">暂无提现记录</div>
              ) : (
                withdrawalRecords.map((record) => (
                  <div key={record.id} className="bg-[#FAF8F5] p-3.5 rounded-[18px] border border-[#ECE6DC] space-y-2.5">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-[#ECE6DC]">
                      <span className="font-mono text-[11px] font-bold text-[#1D1B16]">{record.withdrawNo}</span>
                      {record.status === 'completed' ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">打款成功</span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-200">待财务审核</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-[#1D1B16]">{record.bankAccount.bankName}</div>
                        <div className="text-[10px] text-[#7A756C] font-mono mt-0.5">尾号: {record.bankAccount.cardNumber.slice(-4)}</div>
                      </div>
                      <div className="text-base font-bold font-mono text-[#1D1B16]">-¥{record.amount.toFixed(2)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SUB TAB 3: ACCOUNTS */}
        {settlementSubTab === 'accounts' && (
          <div className="bg-white border border-[#E6E0D6] rounded-[24px] p-4 shadow-2xs space-y-3">
            <button
              onClick={() => setShowAddAccountModal(true)}
              className="w-full py-3 rounded-[16px] border-2 border-dashed border-[#ECE6DC] text-[#7A756C] hover:border-[#6750A4] hover:text-[#6750A4] hover:bg-[#F5F2EC] transition flex flex-col items-center justify-center gap-1 active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs font-bold">添加新的收款账号</span>
            </button>
            <div className="space-y-2.5">
              {bankAccounts.map((acc) => (
                <div key={acc.id} className="bg-[#FAF8F5] p-4 rounded-[18px] border border-[#ECE6DC] relative">
                  {acc.isDefault && <span className="absolute top-4 right-4 bg-[#6750A4] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">默认收款</span>}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#E6E0D6] flex items-center justify-center">
                      <Building className="w-5 h-5 text-[#6750A4]" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#1D1B16]">{acc.bankName}</div>
                      <div className="text-xs text-[#7A756C] font-mono tracking-widest mt-0.5">**** **** **** {acc.cardNumber.slice(-4)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#49463D] bg-white p-2 rounded-[12px] border border-[#ECE6DC]">
                    <div className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {acc.accountHolder}</div>
                    <div className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {acc.phone.slice(0,3)}****{acc.phone.slice(-4)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Bank Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-t-[28px] sm:rounded-[28px] max-w-md w-full p-5 shadow-2xl relative">
            <button onClick={() => setShowAddAccountModal(false)} className="absolute top-4 right-4 p-1.5 rounded-full text-[#7A756C] hover:bg-[#E8E2D5]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-[#1D1B16] mb-4">添加收款账号</h3>
            <form onSubmit={handleAddBankAccount} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1D1B16] font-semibold mb-1">账号类型</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setNewAccType('bank_card')} className={`flex-1 py-2 rounded-full border ${newAccType === 'bank_card' ? 'bg-[#6750A4] text-white border-[#6750A4]' : 'bg-white border-[#ECE6DC] text-[#7A756C]'}`}>银行储蓄卡</button>
                  <button type="button" onClick={() => setNewAccType('alipay')} className={`flex-1 py-2 rounded-full border ${newAccType === 'alipay' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white border-[#ECE6DC] text-[#7A756C]'}`}>支付宝</button>
                </div>
              </div>
              <div>
                <label className="block text-[#1D1B16] font-semibold mb-1">{newAccType === 'bank_card' ? '开户银行名称' : '平台名称'}</label>
                <input required value={newBankName} onChange={(e) => setNewBankName(e.target.value)} className="w-full bg-white border border-[#E6E0D6] rounded-full px-3.5 py-2 text-[#1D1B16]" placeholder="例如：招商银行 / 支付宝" />
              </div>
              <div>
                <label className="block text-[#1D1B16] font-semibold mb-1">收款账号 / 卡号</label>
                <input required value={newCardNumber} onChange={(e) => setNewCardNumber(e.target.value)} className="w-full bg-white border border-[#E6E0D6] rounded-full px-3.5 py-2 text-[#1D1B16] font-mono" placeholder="输入卡号或支付宝账号" />
              </div>
              <button type="submit" className="w-full py-3 rounded-full bg-[#6750A4] text-white text-sm font-bold shadow-xs active:scale-95">确认添加并绑定</button>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-t-[28px] sm:rounded-[28px] max-w-md w-full p-5 shadow-2xl relative">
            <button onClick={() => setShowWithdrawModal(false)} className="absolute top-4 right-4 p-1.5 rounded-full text-[#7A756C] hover:bg-[#E8E2D5]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-[#1D1B16] mb-4 flex items-center gap-2"><Wallet className="w-5 h-5 text-[#6750A4]" />发起余额提现</h3>
            <form onSubmit={handleApplyWithdraw} className="space-y-4">
              <div className="bg-white border border-[#E6E0D6] p-3 rounded-[16px]">
                <label className="block text-[11px] text-[#7A756C] mb-1">选择到账账户</label>
                <select value={selectedAccountId} onChange={(e) => setSelectedAccountId(e.target.value)} className="w-full bg-transparent text-xs font-bold text-[#1D1B16] focus:outline-hidden">
                  {bankAccounts.map(a => <option key={a.id} value={a.id}>{a.bankName} (尾号{a.cardNumber.slice(-4)})</option>)}
                </select>
              </div>
              <div className="bg-white border border-[#E6E0D6] p-4 rounded-[20px]">
                <label className="block text-[11px] text-[#7A756C] mb-2">提现金额 (¥)</label>
                <div className="flex items-center gap-2 border-b-2 border-[#E6E0D6] pb-2 focus-within:border-[#6750A4] transition-colors">
                  <span className="text-2xl font-bold text-[#1D1B16]">¥</span>
                  <input type="number" min="100" max={withdrawableBalance} step="0.01" required value={withdrawAmountInput} onChange={(e) => setWithdrawAmountInput(e.target.value)} className="w-full bg-transparent text-3xl font-bold font-mono text-[#6750A4] focus:outline-hidden placeholder-[#ECE6DC]" />
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px]">
                  <span className="text-[#7A756C]">可提现余额: ¥{withdrawableBalance.toFixed(2)}</span>
                  <button type="button" onClick={() => setWithdrawAmountInput(withdrawableBalance.toString())} className="text-[#6750A4] font-bold hover:underline">全部提现</button>
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 rounded-full bg-[#6750A4] text-white text-sm font-bold shadow-xs active:scale-95 flex justify-center items-center gap-2">
                <Check className="w-4 h-4" /> 确认提交审核
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#E6E0D6] rounded-[28px] max-w-md w-full p-6 shadow-2xl relative space-y-4 text-xs text-[#1D1B16]">
            <button onClick={() => setShowRulesModal(false)} className="absolute top-4 right-4 p-2 rounded-full text-[#7A756C] hover:text-[#1D1B16] hover:bg-[#E8E2D5]">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-base font-bold text-[#6750A4]">
              <Info className="w-5 h-5 text-[#6750A4]" /><span>咨询师提现规则与结算约定</span>
            </div>
            <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-[20px] border border-[#ECE6DC] leading-relaxed text-[#49463D]">
              <div><strong className="text-[#1D1B16] block mb-0.5">1. 结算时效约定 (T+1)</strong><p>当咨询订单服务完成（或急诊倾听会话结束）后，系统将于次日（T+1）自动将该笔订单的实际应得收益划入【可提现余额】。</p></div>
              <div><strong className="text-[#1D1B16] block mb-0.5">2. 提现额度与手续费</strong><p>单笔提现申请最低额度为 <span className="font-bold text-[#6750A4]">¥100.00</span>。提现不限次数，平台全额补贴提现渠道手续费。</p></div>
              <div><strong className="text-[#1D1B16] block mb-0.5">3. 财务审核与最终打款责任</strong><p>提交提现申请后，将由平台财务团队统一人工审核并执行网银划转（1个工作日内完成到账）。若开户信息有误，资金将安全退回可提现余额。</p></div>
              <div><strong className="text-[#1D1B16] block mb-0.5">4. 实名一致性合规</strong><p>提现收款卡开户人姓名必须与咨询师 CPS 执业认证实名姓名（{consultant.name}）完全相符，严禁代领。</p></div>
            </div>
            <div className="flex justify-end pt-1">
              <button onClick={() => setShowRulesModal(false)} className="px-6 py-2 bg-[#6750A4] text-white rounded-full font-semibold hover:bg-[#594294] shadow-2xs">我已了解</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
