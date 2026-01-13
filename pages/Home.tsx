
import React from 'react';
import { User, VIPLevel } from '../types';
import { formatCurrency, toBanglaNum } from '../constants';

interface HomeProps {
  user: User;
  vipLevels: VIPLevel[];
}

const Home: React.FC<HomeProps> = ({ user, vipLevels }) => {
  const activeVIP = vipLevels.find(v => v.level === user.active_vip);

  const getRemainingDays = (expiry: string | null) => {
    if (!expiry) return null;
    const expiryDate = new Date(expiry);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const remainingDays = getRemainingDays(user.vip_expiry_date);

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-gray-500 text-sm">স্বাগতম,</h2>
          <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
        </div>
        <div className="bg-blue-100 p-2 rounded-full">
          <i className="fa-solid fa-bell text-blue-600 text-xl"></i>
        </div>
      </header>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="opacity-80 text-sm mb-1">মোট ব্যালেন্স</p>
          <h2 className="text-4xl font-bold mb-4">{formatCurrency(user.total_balance)}</h2>
          
          <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
            <div>
              <p className="opacity-70 text-xs">উত্তোলনযোগ্য</p>
              <p className="text-lg font-semibold">{formatCurrency(user.withdrawable_balance)}</p>
            </div>
            <div>
              <p className="opacity-70 text-xs">সক্রিয় লেভেল</p>
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{activeVIP ? activeVIP.name : 'কোনটি নয়'}</p>
                {activeVIP && remainingDays !== null && (
                  <p className="text-[10px] opacity-80 mt-0.5">
                    মেয়াদ: <span className="font-bold">{toBanglaNum(remainingDays)} দিন</span> বাকি
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10px] left-[20%] w-16 h-16 bg-blue-400/20 rounded-full blur-xl"></div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3">
        <div className="bg-yellow-100 p-2 rounded-lg">
          <i className="fa-solid fa-bullhorn text-yellow-600"></i>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-600 truncate animate-pulse">
            নতুন সদস্যের জন্য বিশেষ বোনাস! আপনার বন্ধুদের আমন্ত্রণ জানান এবং উপার্জন করুন।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="bg-green-100 p-3 rounded-full mb-2">
            <i className="fa-solid fa-money-bill-trend-up text-green-600 text-xl"></i>
          </div>
          <p className="text-xs text-gray-500">আজকের লাভ</p>
          <p className="text-lg font-bold text-gray-800">
            {activeVIP ? formatCurrency(activeVIP.daily_profit) : formatCurrency(0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="bg-purple-100 p-3 rounded-full mb-2">
            <i className="fa-solid fa-users text-purple-600 text-xl"></i>
          </div>
          <p className="text-xs text-gray-500">টিম মেম্বার</p>
          <p className="text-lg font-bold text-gray-800">{toBanglaNum(0)} জন</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">দ্রুত কাজ</h3>
        <div className="grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition">
            <i className="fa-solid fa-plus-circle text-blue-600 text-2xl mb-2"></i>
            <span className="text-[10px] font-medium">ডিপোজিট</span>
          </button>
          <button className="flex flex-col items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition">
            <i className="fa-solid fa-minus-circle text-red-500 text-2xl mb-2"></i>
            <span className="text-[10px] font-medium">উত্তোলন</span>
          </button>
          <button className="flex flex-col items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition">
            <i className="fa-solid fa-share-nodes text-orange-500 text-2xl mb-2"></i>
            <span className="text-[10px] font-medium">আমন্ত্রণ</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-lg mt-4 h-40 relative group cursor-pointer">
        <img src="https://picsum.photos/800/400?random=1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Banner" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h4 className="text-xl font-bold mb-1">NCP MEMBERS</h4>
            <p className="text-sm opacity-90">আপনার আয়ের ডিজিটাল পথ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
