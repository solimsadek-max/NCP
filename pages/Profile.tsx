
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { User } from '../types';
import { toBanglaNum, VIP_DATA } from '../constants';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onUpdate: (data: Partial<User>) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdate }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const activeVIP = VIP_DATA.find(v => v.level === user.active_vip);

  // Derive a unique referral code from the user's ID
  const referralCode = `NCP${user.id.toUpperCase().substring(0, 6)}`;
  const registerUrl = `${window.location.origin}${window.location.pathname}#/register?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(registerUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'NCP MEMBERS - Join & Earn',
      text: `NCP MEMBERS-এ যোগ দিন এবং প্রতিদিন ইনকাম করুন! আমার রেফারেল কোড: ${referralCode}\nরেজিস্ট্রেশন করতে নিচের লিংকে ক্লিক করুন:`,
      url: registerUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        handleCopyCode();
        alert('Share not supported. Referral code copied to clipboard instead!');
      }
    } catch (err) {
      console.error('Sharing failed', err);
    }
  };

  const stats = [
    { label: 'মোট টিম', value: toBanglaNum(0), icon: 'fa-users', color: 'blue' },
    { label: 'আজকের টিম রিওয়ার্ড', value: '৳০', icon: 'fa-gift', color: 'purple' },
    { label: 'রেফারাল কোড', value: referralCode, icon: 'fa-id-badge', color: 'orange' },
  ];

  return (
    <div className="pb-8">
      {/* Header Profile */}
      <div className="bg-blue-600 pt-10 pb-20 px-4 rounded-b-[40px] text-white">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden bg-white/20 flex items-center justify-center">
              <i className="fa-solid fa-user text-4xl"></i>
            </div>
            {activeVIP && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase border-2 border-white">
                {activeVIP.name}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-sm opacity-80">{user.phone}</p>
            <div className="flex items-center mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
              <span className="text-[10px] uppercase font-bold tracking-wider">সক্রিয় অ্যাকাউন্ট</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-10">
        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-5 flex justify-between gap-4 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className={`bg-${stat.color}-50 p-2 rounded-lg mb-2`}>
                <i className={`fa-solid ${stat.icon} text-${stat.color}-500 text-sm`}></i>
              </div>
              <span className="text-[10px] text-gray-500 font-bold mb-1 text-center">{stat.label}</span>
              <span className="text-xs font-bold text-gray-800 break-all text-center">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Refer & Earn Card */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-5 mb-6 text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-black">রেফার করুন এবং ইনকাম করুন!</h3>
              <i className="fa-solid fa-coins text-yellow-300 text-xl animate-bounce"></i>
            </div>
            <p className="text-xs opacity-90 mb-4">আপনার বন্ধুদের আমন্ত্রণ জানান এবং টিম কমিশন লাভ করুন।</p>
            
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex items-center justify-between border border-white/30 mb-2">
              <div>
                <p className="text-[10px] uppercase font-bold opacity-70">আপনার কোড</p>
                <p className="text-lg font-black tracking-widest">{referralCode}</p>
              </div>
              <div className="flex space-x-2">
                {/* Copy Code Button */}
                <button 
                  onClick={handleCopyCode}
                  title="কপি কোড"
                  className="bg-white text-orange-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-md active:scale-90 transition-transform relative group"
                >
                  <i className={`fa-solid ${copiedCode ? 'fa-check' : 'fa-copy'}`}></i>
                  {copiedCode && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-2 py-1 rounded whitespace-nowrap">কপি হয়েছে</span>
                  )}
                </button>
                
                {/* Copy Link Button */}
                <button 
                  onClick={handleCopyLink}
                  title="কপি লিংক"
                  className="bg-green-500 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md active:scale-90 transition-transform relative group"
                >
                  <i className={`fa-solid ${copiedLink ? 'fa-check' : 'fa-link'}`}></i>
                  {copiedLink && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-2 py-1 rounded whitespace-nowrap">লিংক কপি হয়েছে</span>
                  )}
                </button>

                {/* Share Button */}
                <button 
                  onClick={handleShare}
                  title="শেয়ার"
                  className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md active:scale-90 transition-transform"
                >
                  <i className="fa-solid fa-share-nodes"></i>
                </button>
              </div>
            </div>
            
            <p className="text-[9px] opacity-70 italic text-right">
              * রেজিস্ট্রেশন লিংক শেয়ার করতে লিংক আইকনে ক্লিক করুন
            </p>
          </div>
          <div className="absolute top-[-10px] right-[-10px] w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <h4 className="px-5 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase">অ্যাকাউন্ট সেটিংস</h4>
            
            <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition border-b border-gray-50">
              <div className="flex items-center">
                <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center mr-4">
                  <i className="fa-solid fa-key text-blue-500"></i>
                </div>
                <span className="font-bold text-gray-700">পাসওয়ার্ড পরিবর্তন</span>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
            </button>

            <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition border-b border-gray-50">
              <div className="flex items-center">
                <div className="bg-purple-50 w-10 h-10 rounded-xl flex items-center justify-center mr-4">
                  <i className="fa-solid fa-shield-halved text-purple-500"></i>
                </div>
                <span className="font-bold text-gray-700">উইথড্র পিন পরিবর্তন</span>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
            </button>

            <NavLink to="/support" className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
              <div className="flex items-center">
                <div className="bg-orange-50 w-10 h-10 rounded-xl flex items-center justify-center mr-4">
                  <i className="fa-solid fa-headset text-orange-500"></i>
                </div>
                <span className="font-bold text-gray-700">কাস্টমার সাপোর্ট</span>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
            </NavLink>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <h4 className="px-5 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase">আইনি তথ্য</h4>
            
            <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition border-b border-gray-50">
              <div className="flex items-center">
                <div className="bg-gray-50 w-10 h-10 rounded-xl flex items-center justify-center mr-4">
                  <i className="fa-solid fa-file-contract text-gray-500"></i>
                </div>
                <span className="font-bold text-gray-700">শর্তাবলী ও নীতি</span>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
            </button>

            <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
              <div className="flex items-center">
                <div className="bg-gray-50 w-10 h-10 rounded-xl flex items-center justify-center mr-4">
                  <i className="fa-solid fa-circle-info text-gray-500"></i>
                </div>
                <span className="font-bold text-gray-700">আমাদের সম্পর্কে</span>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
            </button>
          </div>

          <button 
            onClick={() => {
              if (window.confirm('আপনি কি লগআউট করতে চান?')) onLogout();
            }}
            className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center border border-red-100 hover:bg-red-100 transition active:scale-95"
          >
            <i className="fa-solid fa-right-from-bracket mr-2"></i>
            লগআউট করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
