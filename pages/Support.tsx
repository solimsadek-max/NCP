
import React, { useState } from 'react';
import { User, SupportToken, SupportStatus } from '../types';
import { toBanglaNum } from '../constants';

interface SupportProps {
  user: User;
  tokens: SupportToken[];
  onAddToken: (token: Omit<SupportToken, 'id' | 'created_at' | 'status'>) => void;
}

const Support: React.FC<SupportProps> = ({ user, tokens, onAddToken }) => {
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userTokens = tokens.filter(t => t.user_id === user.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return alert('দয়া করে বিষয় এবং মেসেজ পূরণ করুন।');

    setIsSubmitting(true);
    setTimeout(() => {
      onAddToken({
        user_id: user.id,
        username: user.username,
        subject,
        message
      });
      setIsSubmitting(false);
      setShowForm(false);
      setSubject('');
      setMessage('');
      alert('আপনার সাপোর্ট টোকেন সফলভাবে জমা দেওয়া হয়েছে। আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবে।');
    }, 1000);
  };

  const getStatusBadge = (status: SupportStatus) => {
    switch (status) {
      case SupportStatus.OPEN:
        return <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">পেন্ডিং</span>;
      case SupportStatus.IN_PROGRESS:
        return <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">প্রসেসিং</span>;
      case SupportStatus.RESOLVED:
        return <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">সমাধানিত</span>;
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <i className="fa-solid fa-headset text-blue-600 mr-2"></i>
          সাপোর্ট টোকেন
        </h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95 transition"
        >
          {showForm ? 'বন্ধ করুন' : 'নতুন টোকেন'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 mb-6 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-bold text-gray-800 mb-4">নতুন সাহায্য অনুরোধ</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">বিষয়</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="যেমন: ডিপোজিট সমস্যা, উইথড্র দেরি হচ্ছে"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">আপনার মেসেজ</label>
              <textarea 
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="আপনার সমস্যাটি বিস্তারিত লিখুন..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              ></textarea>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition flex items-center justify-center"
            >
              {isSubmitting ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : null}
              টোকেন সাবমিট করুন
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">আপনার টোকেন ইতিহাস</h3>
        
        {userTokens.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <i className="fa-solid fa-ticket text-gray-200 text-5xl mb-4 block"></i>
            <p className="text-gray-400 text-sm">আপনার কোনো সাপোর্ট টোকেন নেই</p>
          </div>
        ) : (
          userTokens.map(token => (
            <div key={token.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-800">{token.subject}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{token.id}</p>
                </div>
                {getStatusBadge(token.status)}
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{token.message}</p>
              <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                <span className="text-[10px] text-gray-400">
                  <i className="fa-regular fa-calendar mr-1"></i>
                  {new Date(token.created_at).toLocaleDateString('bn-BD')}
                </span>
                <button className="text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:underline">বিস্তারিত দেখুন</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-2xl border border-blue-100">
        <div className="flex items-center mb-2">
          <i className="fa-solid fa-circle-info text-blue-500 mr-2"></i>
          <h4 className="text-sm font-bold text-blue-800">অপেক্ষা করুন</h4>
        </div>
        <p className="text-xs text-blue-600 leading-relaxed">
          একটি টোকেন জমা দেওয়ার পর আমাদের প্রতিনিধি ২৪ ঘণ্টার মধ্যে সমাধান প্রদান করবে। দয়া করে একই বিষয়ে একাধিক টোকেন খুলবেন না।
        </p>
      </div>
    </div>
  );
};

export default Support;
