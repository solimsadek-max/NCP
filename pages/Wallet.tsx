
import React, { useState } from 'react';
import { User, Transaction, TransactionType, TransactionStatus, AppConfig } from '../types';
import { formatCurrency, toBanglaNum } from '../constants';

interface WalletProps {
  user: User;
  onUpdate: (data: Partial<User>) => void;
  appConfig: AppConfig;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'created_at'>) => void;
}

type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'bank';

const Wallet: React.FC<WalletProps> = ({ user, onUpdate, appConfig, transactions, addTransaction }) => {
  const [tab, setTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bkash');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter transactions for the current user
  const userTransactions = transactions.filter(tx => tx.user_id === user.id);

  const handleDeposit = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 500) {
      alert('ন্যূনতম ডিপোজিট ৫০০ টাকা।');
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      addTransaction({
        user_id: user.id,
        type: TransactionType.DEPOSIT,
        amount: amt,
        status: TransactionStatus.PENDING,
        details: `Deposit request via ${selectedMethod}`
      });
      alert(`আপনার ${formatCurrency(amt)} ডিপোজিট রিকোয়েস্ট ${selectedMethod.toUpperCase()} এর মাধ্যমে জমা দেওয়া হয়েছে। এডমিন ভেরিফাই করার পর ব্যালেন্স যোগ হবে।`);
      setAmount('');
      setIsProcessing(false);
    }, 1500);
  };

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    const minWithdrawal = appConfig.minWithdrawal;

    if (isNaN(amt) || amt < minWithdrawal) {
      alert(`ন্যূনতম উত্তোলন ${formatCurrency(minWithdrawal)}।`);
      return;
    }
    if (amt > user.withdrawable_balance) {
      alert('অপর্যাপ্ত ব্যালেন্স।');
      return;
    }
    if (pin !== (user.withdraw_pin || '1234')) {
      alert('ভুল উইথড্র পিন।');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      onUpdate({
        withdrawable_balance: user.withdrawable_balance - amt,
        total_balance: user.total_balance - amt
      });
      addTransaction({
        user_id: user.id,
        type: TransactionType.WITHDRAW,
        amount: amt,
        status: TransactionStatus.PENDING,
        details: 'Withdrawal request'
      });
      alert('উত্তোলন রিকোয়েস্ট সফল হয়েছে। ২৪ ঘণ্টার মধ্যে পেমেন্ট পাবেন।');
      setAmount('');
      setPin('');
      setIsProcessing(false);
    }, 1500);
  };

  const methods: { id: PaymentMethod; name: string; icon: string; color: string }[] = [
    { id: 'bkash', name: 'bKash', icon: 'fa-mobile-screen', color: 'bg-[#e2136e]' },
    { id: 'nagad', name: 'Nagad', icon: 'fa-money-bill-transfer', color: 'bg-[#f7941d]' },
    { id: 'rocket', name: 'Rocket', icon: 'fa-paper-plane', color: 'bg-[#8c3494]' },
    { id: 'bank', name: 'Bank', icon: 'fa-building-columns', color: 'bg-blue-600' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i className="fa-solid fa-wallet text-blue-600 mr-2"></i>
        ওয়ালেট
      </h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">মোট উত্তোলনযোগ্য ব্যালেন্স</p>
        <h2 className="text-4xl font-black text-gray-800 mb-6">{formatCurrency(user.withdrawable_balance)}</h2>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setTab('deposit')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${tab === 'deposit' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
          >
            ডিপোজিট
          </button>
          <button 
            onClick={() => setTab('withdraw')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${tab === 'withdraw' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
          >
            উত্তোলন
          </button>
          <button 
            onClick={() => setTab('history')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${tab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
          >
            ইতিহাস
          </button>
        </div>
      </div>

      {tab === 'deposit' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">টাকার পরিমাণ (BDT)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="৫০০ - ২৫,০০,০০০"
              className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">পেমেন্ট মেথড নির্বাচন করুন</label>
            <div className="grid grid-cols-2 gap-3">
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex items-center p-3 rounded-xl border-2 transition-all ${
                    selectedMethod === method.id 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className={`${method.color} text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0`}>
                    <i className={`fa-solid ${method.icon} text-sm`}></i>
                  </div>
                  <span className={`font-bold text-sm ${selectedMethod === method.id ? 'text-blue-700' : 'text-gray-600'}`}>
                    {method.name}
                  </span>
                  {selectedMethod === method.id && (
                    <div className="ml-auto">
                      <i className="fa-solid fa-circle-check text-blue-600 text-xs"></i>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h4 className="text-blue-800 font-bold text-xs mb-1 flex items-center">
              <i className="fa-solid fa-circle-info mr-1"></i>
              নির্দেশনা
            </h4>
            <p className="text-[10px] text-blue-600 leading-tight">
              আপনার নির্বাচিত মেথড ({selectedMethod.toUpperCase()}) ব্যবহার করে টাকা পাঠান এবং ট্রানজেকশন আইডি সহ রিকোয়েস্ট সম্পন্ন করুন।
            </p>
          </div>

          <button 
            onClick={handleDeposit}
            disabled={isProcessing}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition"
          >
            {isProcessing ? <i className="fa-solid fa-spinner animate-spin"></i> : 'ডিপোজিট রিকোয়েস্ট পাঠান'}
          </button>
        </div>
      )}

      {tab === 'withdraw' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">টাকার পরিমাণ (BDT)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`${toBanglaNum(appConfig.minWithdrawal)} থেকে ব্যালেন্স পর্যন্ত`}
              className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">উইথড্র পিন</label>
            <input 
              type="password" 
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="৪-৬ ডিজিটের পিন"
              className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none"
            />
          </div>
          <div className="bg-orange-50 p-3 rounded-xl">
            <p className="text-[10px] text-orange-700 leading-tight">
              * ন্যূনতম উত্তোলন {formatCurrency(appConfig.minWithdrawal)}। উইথড্র করতে ১% চার্জ প্রযোজ্য। টাকা পেতে ১২-২৪ ঘণ্টা সময় লাগতে পারে।
            </p>
          </div>
          <button 
            onClick={handleWithdraw}
            disabled={isProcessing}
            className="w-full py-4 bg-red-500 text-white rounded-xl font-bold shadow-lg hover:bg-red-600 active:scale-95 transition"
          >
            {isProcessing ? <i className="fa-solid fa-spinner animate-spin"></i> : 'টাকা উত্তোলন করুন'}
          </button>
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {userTransactions.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <i className="fa-solid fa-receipt text-4xl mb-3 block opacity-20"></i>
              <p className="text-sm">কোনো লেনদেনের ইতিহাস পাওয়া যায়নি</p>
            </div>
          ) : (
            userTransactions.map(tx => (
              <div key={tx.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-gray-800">
                    {tx.type === TransactionType.DEPOSIT ? 'ডিপোজিট' : 
                     tx.type === TransactionType.WITHDRAW ? 'উত্তোলন' : 
                     tx.type === TransactionType.PROFIT ? 'টাস্ক প্রফিট' : 'কমিশন'}
                  </p>
                  <p className="text-[10px] text-gray-500">{new Date(tx.created_at).toLocaleDateString('bn-BD')}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${tx.type === TransactionType.WITHDRAW ? 'text-red-500' : 'text-green-600'}`}>
                    {tx.type === TransactionType.WITHDRAW ? '-' : '+'}{formatCurrency(tx.amount)}
                  </p>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    tx.status === TransactionStatus.APPROVED ? 'bg-green-100 text-green-600' : 
                    tx.status === TransactionStatus.PENDING ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {tx.status === TransactionStatus.APPROVED ? 'সফল' : 
                     tx.status === TransactionStatus.PENDING ? 'পেন্ডিং' : 'বাতিল'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Wallet;
