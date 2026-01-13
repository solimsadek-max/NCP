
import React, { useState } from 'react';
import { User, VIPLevel, Transaction, TransactionType, TransactionStatus } from '../types';
import { formatCurrency, toBanglaNum } from '../constants';

interface VIPMarketProps {
  user: User;
  vipLevels: VIPLevel[];
  onUpdate: (data: Partial<User>) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'created_at'>) => void;
}

const VIPMarket: React.FC<VIPMarketProps> = ({ user, vipLevels, onUpdate, addTransaction }) => {
  const [purchasing, setPurchasing] = useState<number | null>(null);

  const handleUnlock = (vip: VIPLevel) => {
    if (user.active_vip && user.active_vip >= vip.level) {
      alert('আপনার কাছে ইতিমধ্যে একটি উচ্চতর বা সমমানের লেভেল আছে।');
      return;
    }
    if (user.withdrawable_balance < vip.price) {
      alert('দুঃখিত, আপনার ব্যালেন্স পর্যাপ্ত নয়। দয়া করে ডিপোজিট করুন।');
      return;
    }

    if (window.confirm(`${vip.name} আনলক করতে চান? এর জন্য ${formatCurrency(vip.price)} খরচ হবে।`)) {
      setPurchasing(vip.level);
      
      setTimeout(() => {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + vip.validity_days);
        
        onUpdate({
          active_vip: vip.level,
          withdrawable_balance: user.withdrawable_balance - vip.price,
          total_balance: user.total_balance,
          vip_expiry_date: expiryDate.toISOString(),
        });

        addTransaction({
          user_id: user.id,
          type: TransactionType.WITHDRAW,
          amount: vip.price,
          status: TransactionStatus.APPROVED,
          details: `VIP Level ${vip.level} Purchase`
        });
        
        setPurchasing(null);
        alert(`${vip.name} সফলভাবে আনলক করা হয়েছে!`);
      }, 1000);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i className="fa-solid fa-gem text-blue-600 mr-2"></i>
        ভিআইপি মেম্বারশিপ
      </h1>

      <div className="space-y-6">
        {vipLevels.map((vip) => (
          <div 
            key={vip.level} 
            className={`bg-white rounded-3xl overflow-hidden shadow-sm border-2 transition-all ${user.active_vip === vip.level ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-100 hover:shadow-md'}`}
          >
            {/* VIP Image Header */}
            <div className="h-32 w-full relative">
              <img 
                src={vip.image_url || `https://picsum.photos/400/200?random=${vip.level}`} 
                className="w-full h-full object-cover"
                alt={vip.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-black text-xl tracking-tight">{vip.name}</span>
              </div>
              {user.active_vip === vip.level && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse shadow-lg">
                  সক্রিয়
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <p className="text-blue-600 font-black text-2xl">{formatCurrency(vip.price)}</p>
                <span className="bg-gray-100 text-gray-500 text-[10px] px-3 py-1 rounded-full font-bold uppercase">
                  লেভেল {toBanglaNum(vip.level)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1">দৈনিক লাভ</p>
                  <p className="text-sm font-bold text-gray-800">{formatCurrency(vip.daily_profit)}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1">দৈনিক টাস্ক</p>
                  <p className="text-sm font-bold text-gray-800">{toBanglaNum(vip.tasks_per_day)}টি</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1">মোট লাভ</p>
                  <p className="text-sm font-bold text-gray-800">{formatCurrency(vip.daily_profit * vip.validity_days)}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1">মেয়াদ</p>
                  <p className="text-sm font-bold text-gray-800">{toBanglaNum(vip.validity_days)} দিন</p>
                </div>
              </div>

              <button
                disabled={user.active_vip === vip.level || purchasing !== null}
                onClick={() => handleUnlock(vip)}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-md active:scale-95 ${
                  user.active_vip === vip.level 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                {purchasing === vip.level ? (
                   <span className="flex items-center justify-center">
                     <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                     প্রসেসিং...
                   </span>
                ) : user.active_vip === vip.level ? 'ইতিমধ্যে সক্রিয়' : 'এখনই আনলক করুন'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VIPMarket;
