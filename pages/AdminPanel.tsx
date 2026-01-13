
import React, { useState } from 'react';
import { User, TransactionStatus, TransactionType, AppConfig, Transaction, SupportToken, SupportStatus, VIPLevel } from '../types';
import { toBanglaNum, formatCurrency } from '../constants';

interface AdminPanelProps {
  user: User;
  appConfig: AppConfig;
  onUpdateConfig: (config: Partial<AppConfig>) => void;
  transactions: Transaction[];
  supportTokens: SupportToken[];
  onUpdateToken: (tokenId: string, status: SupportStatus) => void;
  vipLevels: VIPLevel[];
  onUpdateVIPLevels: (vips: VIPLevel[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  user, appConfig, onUpdateConfig, transactions, supportTokens, onUpdateToken, vipLevels, onUpdateVIPLevels 
pendingDepositspendingDeposits
  const [activeView, setActiveView] = useState<'users' | 'withdrawals' | 'deposits' | 'support' | 'vip' | 'settings'>('users');
  const [editingVip, setEditingVip] = useState<VIPLevel | null>(null);
  const [minWithdrawInput, setMinWithdrawInput] = useState(appConfig.minWithdrawal.toString());

  const pendingWithdrawals = transactions.filter(t => t.type === TransactionType.WITHDRAW && t.status === TransactionStatus.PENDING);
  const pendingDeppendingDepositsosits = transactions.filter(t => t.type === TransactionType.DEPOSIT && t.status === TransactionStatus.PENDING);
  const openSupport = supportTokens.filter(t => t.status !== SupportStatus.RESOLVED);

  const mockUsers = [
    { id: '1', name: 'কামাল হোসেন', phone: '01712345678', balance: 45000, vip: 3 },
    { id: '2', name: 'সালাউদ্দিন', phone: '01888888888', balance: 1200, vip: 1 },
    { id: '3', name: 'জহির রায়হান', phone: '01999999999', balance: 500, vip: 0 },
  ];

  const handleSaveSettings = () => {
    const min = parseFloat(minWithdrawInput);
    if (isNaN(min) || min < 0) return alert('সঠিক সংখ্যা দিন।');
    onUpdateConfig({ minWithdrawal: min });
    alert('সেটিংস সেভ করা হয়েছে।');
  };

  const handleUpdateToken = (id: string, status: SupportStatus) => {
    onUpdateToken(id, status);
    alert('টোকেন স্ট্যাটাস আপডেট করা হয়েছে।');
  };

  const handleSaveVIP = () => {
    if (!editingVip) return;
    const newVips = vipLevels.map(v => v.level === editingVip.level ? editingVip : v);
    onUpdateVIPLevels(newVips);
    setEditingVip(null);
    alert('ভিআইপি আপডেট করা হয়েছে।');
  };

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
        <i className="fa-solid fa-gauge-high mr-2"></i>
        এডমিন প্যানেল
      </h1>

      <div className="grid grid-cols-6 gap-1 mb-6">
        {['users', 'withdrawals', 'deposits', 'support', 'vip', 'settings'].map(view => (
          <button 
            key={view}
            onClick={() => setActiveView(view as any)}
            className={`py-2 px-1 rounded-lg text-[7px] font-bold transition uppercase ${activeView === view ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            {view === 'users' ? 'ইউজার' : 
             view === 'withdrawals' ? `উত্তোলন (${toBanglaNum(pendingWithdrawals.length)})` : 
             view === 'deposits' ? `ডিপোজিট (${toBanglaNum(pendingDeposits.length)})` : 
             view === 'support' ? `সাপোর্ট (${toBanglaNum(openSupport.length)})` : 
             view === 'vip' ? 'ভিআইপি' : 'সেটিংস'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {activeView === 'users' && (
          <div className="divide-y divide-gray-50">
            <div className="p-4 bg-gray-50">
              <input type="text" placeholder="ইউজার খুঁজুন..." className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            {mockUsers.map(u => (
              <div key={u.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{u.name}</p>
                  <p className="text-[10px] text-gray-500">{u.phone}</p>
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">VIP {toBanglaNum(u.vip)}</span>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm text-gray-800">{formatCurrency(u.balance)}</p>
                  <button className="text-[10px] text-red-600 font-bold underline">এডিট করুন</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'vip' && (
          <div className="p-4">
            {editingVip ? (
              <div className="space-y-4 animate-in slide-in-from-right duration-300">
                <button onClick={() => setEditingVip(null)} className="text-xs text-gray-500 font-bold mb-2 flex items-center">
                   <i className="fa-solid fa-arrow-left mr-1"></i> ফিরে যান
                </button>
                <h3 className="font-bold text-gray-800 mb-4">এডিট {editingVip.name}</h3>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">প্যাকেজ নাম</label>
                  <input type="text" value={editingVip.name} onChange={e => setEditingVip({...editingVip, name: e.target.value})} className="w-full bg-gray-50 p-3 rounded-xl text-sm border-0 focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">মূল্য (BDT)</label>
                  <input type="number" value={editingVip.price} onChange={e => setEditingVip({...editingVip, price: Number(e.target.value)})} className="w-full bg-gray-50 p-3 rounded-xl text-sm border-0 focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">দৈনিক লাভ</label>
                  <input type="number" value={editingVip.daily_profit} onChange={e => setEditingVip({...editingVip, daily_profit: Number(e.target.value)})} className="w-full bg-gray-50 p-3 rounded-xl text-sm border-0 focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">ফটো URL</label>
                  <input type="text" value={editingVip.image_url} onChange={e => setEditingVip({...editingVip, image_url: e.target.value})} className="w-full bg-gray-50 p-3 rounded-xl text-sm border-0 focus:ring-2 focus:ring-red-500" placeholder="https://..." />
                </div>
                <button onClick={handleSaveVIP} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold shadow-lg mt-4">আপডেট সেভ করুন</button>
              </div>
            ) : (
              <div className="space-y-3">
                {vipLevels.map(v => (
                  <div key={v.level} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img src={v.image_url} className="w-12 h-12 rounded-lg object-cover bg-gray-200" alt={v.name} />
                      <div>
                        <p className="font-bold text-sm text-gray-800">{v.name}</p>
                        <p className="text-[10px] text-gray-500">{formatCurrency(v.price)}</p>
                      </div>
                    </div>
                    <button onClick={() => setEditingVip(v)} className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-bold text-blue-600 hover:bg-blue-50">এডিট</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ... Other admin views (withdrawals, deposits, etc.) ... */}
        {activeView === 'withdrawals' && (
          <div className="divide-y divide-gray-50">
            {pendingWithdrawals.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">কোনো পেন্ডিং নেই</div> : pendingWithdrawals.map(w => (
                <div key={w.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div><p className="font-bold text-gray-800 text-sm">User: {w.user_id}</p><p className="text-[10px] text-gray-500">{new Date(w.created_at).toLocaleString('bn-BD')}</p></div>
                    <div className="text-right"><p className="font-black text-sm text-red-500">{formatCurrency(w.amount)}</p></div>
                  </div>
                </div>
            ))}
          </div>
        )}

        {activeView === 'support' && (
          <div className="divide-y divide-gray-50">
            {supportTokens.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">কোনো সাপোর্ট টোকেন নেই</div> : supportTokens.map(t => (
                <div key={t.id} className="p-4">
                  <h4 className="font-bold text-gray-800 text-sm">{t.subject}</h4>
                  <p className="text-[10px] text-gray-500 mb-2">User: {t.username}</p>
                  <p className="text-xs text-gray-600 italic">"{t.message}"</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleUpdateToken(t.id, SupportStatus.RESOLVED)} className="flex-1 bg-green-600 text-white text-[10px] font-bold py-1.5 rounded">সমাধান</button>
                  </div>
                </div>
            ))}
          </div>
        )}

        {activeView === 'settings' && (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">সর্বনিম্ন উত্তোলন (Minimum Withdrawal)</label>
              <div className="flex space-x-2">
                <input type="number" value={minWithdrawInput} onChange={e => setMinWithdrawInput(e.target.value)} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold text-gray-800 focus:ring-2 focus:ring-red-500 outline-none transition" />
                <button onClick={handleSaveSettings} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm">সেভ</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
