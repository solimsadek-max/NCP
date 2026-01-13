
import React, { useState } from 'react';
import { User } from '../types';

interface RegisterProps {
  onRegister: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.phone || !formData.password) return alert('সব তথ্য পূরণ করুন।');
    if (formData.password !== formData.confirmPassword) return alert('পাসওয়ার্ড মেলেনি।');

    setIsLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: formData.username,
        phone: formData.phone,
        email: '',
        total_balance: 0,
        withdrawable_balance: 0,
        active_vip: null,
        vip_expiry_date: null,
        referrer_id: formData.referCode || null,
        withdraw_pin: null,
        is_blocked: false,
        isAdmin: false,
        last_task_completed_at: null,
        created_at: new Date().toISOString(),
      };
      onRegister(newUser);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-10 pb-10 overflow-y-auto no-scrollbar">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-gray-800">নতুন সদস্য হোন</h1>
        <p className="text-gray-500 mt-2">NCP MEMBERS এ আপনার যাত্রা শুরু করুন</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">পুরো নাম</label>
          <input 
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 transition"
            placeholder="আপনার নাম লিখুন"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">ফোন নম্বর</label>
          <input 
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 transition"
            placeholder="01XXXXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">পাসওয়ার্ড</label>
          <input 
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 transition"
            placeholder="পাসওয়ার্ড দিন"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
          <input 
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 transition"
            placeholder="আবার পাসওয়ার্ড দিন"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">রেফারেল কোড (ঐচ্ছিক)</label>
          <input 
            type="text"
            value={formData.referCode}
            onChange={(e) => setFormData({...formData, referCode: e.target.value})}
            className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 transition"
            placeholder="রেফার কোড থাকলে দিন"
          />
        </div>

        <div className="flex items-start space-x-2 py-2">
          <input type="checkbox" required className="mt-1 rounded text-blue-600" />
          <p className="text-[10px] text-gray-500 leading-tight">
            আমি সকল <span className="text-blue-600 font-bold">শর্তাবলী ও গোপনীয়তা নীতি</span> মেনে নিচ্ছি এবং নিশ্চিত করছি যে আমার বয়স ১৮ বছরের বেশি।
          </p>
        </div>

        <button 
          disabled={isLoading}
          type="submit" 
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all mt-4"
        >
          {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'অ্যাকাউন্ট খুলুন'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-500 font-medium text-sm">
          ইতিমধ্যে অ্যাকাউন্ট আছে? <button onClick={() => window.location.hash = '#/login'} className="text-blue-600 font-bold hover:underline">লগইন করুন</button>
        </p>
      </div>
    </div>
  );
};

export default Register;
