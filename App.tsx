
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Transaction, TransactionType, TransactionStatus, AppConfig, SupportToken, SupportStatus, VIPLevel } from './types';
import { VIP_DATA } from './constants';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import VIPMarket from './pages/VIPMarket';
import Tasks from './pages/Tasks';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Support from './pages/Support';

// Components
import BottomNav from './components/BottomNav';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appConfig, setAppConfig] = useState<AppConfig>({ minWithdrawal: 500 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [supportTokens, setSupportTokens] = useState<SupportToken[]>([]);
  const [vipLevels, setVipLevels] = useState<VIPLevel[]>(VIP_DATA);
  const [loading, setLoading] = useState(true);

  // Simulation of Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('ncp_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedConfig = localStorage.getItem('ncp_config');
    if (savedConfig) setAppConfig(JSON.parse(savedConfig));

    const savedTx = localStorage.getItem('ncp_transactions');
    if (savedTx) setTransactions(JSON.parse(savedTx));

    const savedTokens = localStorage.getItem('ncp_support_tokens');
    if (savedTokens) setSupportTokens(JSON.parse(savedTokens));

    const savedVip = localStorage.getItem('ncp_vip_levels');
    if (savedVip) setVipLevels(JSON.parse(savedVip));
    
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('ncp_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ncp_user');
  };

  const updateUser = useCallback((updatedData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('ncp_user', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  const updateAppConfig = useCallback((updatedConfig: Partial<AppConfig>) => {
    setAppConfig(prev => {
      const newConfig = { ...prev, ...updatedConfig };
      localStorage.setItem('ncp_config', JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  const updateVIPLevels = useCallback((updatedVips: VIPLevel[]) => {
    setVipLevels(updatedVips);
    localStorage.setItem('ncp_vip_levels', JSON.stringify(updatedVips));
  }, []);

  const addTransaction = useCallback((txData: Omit<Transaction, 'id' | 'created_at'>) => {
    const newTx: Transaction = {
      ...txData,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    setTransactions(prev => {
      const updated = [newTx, ...prev];
      localStorage.setItem('ncp_transactions', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addSupportToken = useCallback((tokenData: Omit<SupportToken, 'id' | 'created_at' | 'status'>) => {
    const newToken: SupportToken = {
      ...tokenData,
      id: `TKN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: SupportStatus.OPEN,
      created_at: new Date().toISOString(),
    };
    setSupportTokens(prev => {
      const updated = [newToken, ...prev];
      localStorage.setItem('ncp_support_tokens', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateSupportToken = useCallback((tokenId: string, status: SupportStatus) => {
    setSupportTokens(prev => {
      const updated = prev.map(t => t.id === tokenId ? { ...t, status } : t);
      localStorage.setItem('ncp_support_tokens', JSON.stringify(updated));
      return updated;
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-600">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">NCP MEMBERS</h1>
          <p className="text-sm opacity-80">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen pb-20 max-w-md mx-auto bg-gray-50 shadow-xl relative">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={login} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register onRegister={login} />} />
          
          <Route path="/" element={<PrivateRoute user={user}><Home user={user!} vipLevels={vipLevels} /></PrivateRoute>} />
          <Route path="/vip" element={<PrivateRoute user={user}><VIPMarket user={user!} vipLevels={vipLevels} onUpdate={updateUser} addTransaction={addTransaction} /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute user={user}><Tasks user={user!} vipLevels={vipLevels} onUpdate={updateUser} addTransaction={addTransaction} /></PrivateRoute>} />
          <Route path="/wallet" element={<PrivateRoute user={user}><Wallet user={user!} onUpdate={updateUser} appConfig={appConfig} transactions={transactions} addTransaction={addTransaction} /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute user={user}><Profile user={user!} onLogout={logout} onUpdate={updateUser} /></PrivateRoute>} />
          <Route path="/support" element={<PrivateRoute user={user}><Support user={user!} tokens={supportTokens} onAddToken={addSupportToken} /></PrivateRoute>} />
          
          <Route path="/admin" element={<PrivateRoute user={user}>{user?.isAdmin ? <AdminPanel user={user} appConfig={appConfig} onUpdateConfig={updateAppConfig} transactions={transactions} supportTokens={supportTokens} onUpdateToken={updateSupportToken} vipLevels={vipLevels} onUpdateVIPLevels={updateVIPLevels} /> : <Navigate to="/" />}</PrivateRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {user && <BottomNav isAdmin={user.isAdmin} />}
      </div>
    </HashRouter>
  );
};

export default App;
