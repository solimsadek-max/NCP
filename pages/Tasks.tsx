
import React, { useState, useEffect } from 'react';
import { User, Transaction, TransactionType, TransactionStatus, VIPLevel } from '../types';
import { formatCurrency, toBanglaNum } from '../constants';

interface TasksProps {
  user: User;
  vipLevels: VIPLevel[];
  onUpdate: (data: Partial<User>) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'created_at'>) => void;
}

const Tasks: React.FC<TasksProps> = ({ user, vipLevels, onUpdate, addTransaction }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [cooldown, setCooldown] = useState<number | null>(null);

  const activeVIP = vipLevels.find(v => v.level === user.active_vip);

  useEffect(() => {
    const checkCooldown = () => {
      if (!user.last_task_completed_at) return;
      
      const last = new Date(user.last_task_completed_at).getTime();
      const now = new Date().getTime();
      const diff = now - last;
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (diff < twentyFourHours) {
        setCooldown(twentyFourHours - diff);
      } else {
        setCooldown(null);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [user.last_task_completed_at]);

  const handleCompleteTask = () => {
    if (!activeVIP) {
      alert('কাজ শুরু করতে অনুগ্রহ করে একটি ভিআইপি লেভেল আনলক করুন।');
      return;
    }

    if (cooldown !== null) {
      alert('দুঃখিত, আপনি ইতিমধ্যে আজকের কাজ শেষ করেছেন।');
      return;
    }

    setIsCompleting(true);
    
    setTimeout(() => {
      const now = new Date().toISOString();
      const profit = activeVIP.daily_profit;
      
      onUpdate({
        withdrawable_balance: user.withdrawable_balance + profit,
        total_balance: user.total_balance + profit,
        last_task_completed_at: now
      });

      addTransaction({
        user_id: user.id,
        type: TransactionType.PROFIT,
        amount: profit,
        status: TransactionStatus.APPROVED,
        details: `Daily task profit from ${activeVIP.name}`
      });

      setIsCompleting(false);
      alert('অভিনন্দন! আপনি সফলভাবে কাজটি সম্পন্ন করেছেন এবং লাভ পেয়েছেন।');
    }, 2000);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    const h = hours < 10 ? '0' + hours : hours;
    const m = minutes < 10 ? '0' + minutes : minutes;
    const s = seconds < 10 ? '0' + seconds : seconds;

    return `${toBanglaNum(h)}:${toBanglaNum(m)}:${toBanglaNum(s)}`;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i className="fa-solid fa-list-check text-blue-600 mr-2"></i>
        দৈনিক কাজ
      </h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center space-y-4">
        {!activeVIP ? (
          <div className="py-10">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-lock text-gray-400 text-3xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-800">কোন সক্রিয় লেভেল নেই</h3>
            <p className="text-gray-500 text-sm mb-6">কাজ শুরু করার জন্য ভিআইপি লেভেল ১ বা তার বেশি প্রয়োজন।</p>
            <button 
              onClick={() => window.location.hash = '#/vip'}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              ভিআইপি কিনুন
            </button>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 py-4 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">আপনার বর্তমান লেভেল</p>
              <h2 className="text-2xl font-black text-blue-800">{activeVIP.name}</h2>
            </div>

            <div className="py-6 flex flex-col items-center">
              {cooldown !== null ? (
                <>
                  <div className="relative w-48 h-48 mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" fill="transparent" stroke="#e5e7eb" strokeWidth="12" />
                      <circle 
                        cx="96" cy="96" r="88" fill="transparent" stroke="#3b82f6" strokeWidth="12" 
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={(2 * Math.PI * 88) * (1 - (24 * 60 * 60 * 1000 - cooldown) / (24 * 60 * 60 * 1000))}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs text-gray-500 font-bold uppercase">পুনরায় শুরু হবে</span>
                      <span className="text-2xl font-black text-gray-800">{formatTime(cooldown)}</span>
                    </div>
                  </div>
                  <button disabled className="w-full py-4 bg-gray-100 text-gray-400 rounded-xl font-bold cursor-not-allowed">
                    আজকের কাজ শেষ
                  </button>
                </>
              ) : (
                <>
                  <div className="w-48 h-48 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
                    <i className="fa-solid fa-play text-white text-5xl ml-2"></i>
                  </div>
                  <p className="text-gray-600 mb-6">কাজটি শুরু করতে নিচের বাটনে ক্লিক করুন।</p>
                  <button 
                    onClick={handleCompleteTask}
                    disabled={isCompleting}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    {isCompleting ? (
                      <span className="flex items-center justify-center">
                        <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                        কাজ চলছে...
                      </span>
                    ) : 'কাজ সম্পন্ন করুন'}
                  </button>
                </>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs text-gray-500">কাজ শেষে পাবেন</p>
                <p className="text-xl font-black text-green-600">{formatCurrency(activeVIP.daily_profit)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">অবশিষ্ট কাজ</p>
                <p className="text-xl font-black text-gray-800">{cooldown ? toBanglaNum(0) : toBanglaNum(1)}/১</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">নির্দেশনা</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start">
            <i className="fa-solid fa-circle-check text-green-500 mt-1 mr-2"></i>
            প্রতি ২৪ ঘণ্টায় একবার কাজ করা যাবে।
          </li>
          <li className="flex items-start">
            <i className="fa-solid fa-circle-check text-green-500 mt-1 mr-2"></i>
            কাজ শেষে লাভ সরাসরি উত্তোলনযোগ্য ব্যালেন্সে যোগ হবে।
          </li>
          <li className="flex items-start">
            <i className="fa-solid fa-circle-check text-green-500 mt-1 mr-2"></i>
            ভিআইপি লেভেলের মেয়াদের মধ্যে কাজ সম্পন্ন করতে হবে।
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Tasks;
