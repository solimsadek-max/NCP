
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) return alert('সব তথ্য পূরণ করুন।');
    
    setIsLoading(true);
    // Simulating API
    setTimeout(() => {
      // Mock Admin check
      const isAdmin = phone === '01711111111'; 
      
      const mockUser: User = {
        id: 'u1',
        username: 'মোঃ রহিম',
        phone: phone,
        email: 'rahim@example.com',
        total_balance: 10000,
        withdrawable_balance: 2500,
        active_vip: 1,
        vip_expiry_date: null,
        referrer_id: null,
        withdraw_pin: '1234',
        is_blocked: false,
        isAdmin: isAdmin,
        last_task_completed_at: null,
        created_at: new Date().toISOString(),
      };
      
      onLogin(mockUser);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-20">
      <div className="mb-12 text-center">
        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-12">
          <i className="fa-solid fa-crown text-white text-4xl -rotate-12"></i>
        </div>
        <h1 className="text-3xl font-black text-gray-800">NCP MEMBERS</h1>
        <p className="text-gray-500 mt-2">আপনার অ্যাকাউন্টে লগইন করুন</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">ফোন নম্বর</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+88</span>
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-50 border-0 rounded-2xl pl-14 pr-4 py-4 font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 transition"
              placeholder="017XXXXXXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">পাসওয়ার্ড</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 border-0 rounded-2xl px-4 py-4 font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 transition"
            placeholder="আপনার পাসওয়ার্ড দিন"
          />
        </div>

        <div className="text-right">
          <button type="button" className="text-sm font-bold text-blue-600 hover:underline">পাসওয়ার্ড ভুলে গেছেন?</button>
        </div>

        <button 
          disabled={isLoading}
          type="submit" 
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'লগইন করুন'}
        </button>
      </form>

      <div className="mt-12 text-center">
        <p className="text-gray-500 font-medium">
          অ্যাকাউন্ট নেই? <button onClick={() => window.location.hash = '#/register'} className="text-blue-600 font-bold hover:underline">নতুন অ্যাকাউন্ট খুলুন</button>
        </p>
      </div>
      
      <div className="mt-auto py-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        Secure & encrypted platform
      </div>
    </div>
  );
};

export default Login;
