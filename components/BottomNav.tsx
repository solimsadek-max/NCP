
import React from 'react';
import { NavLink } from 'react-router-dom';

interface BottomNavProps {
  isAdmin: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ isAdmin }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-w-md mx-auto z-50">
      <div className="flex justify-around items-center h-16">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
          <i className="fa-solid fa-house text-xl"></i>
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </NavLink>
        
        <NavLink to="/vip" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
          <i className="fa-solid fa-gem text-xl"></i>
          <span className="text-[10px] mt-1 font-medium">VIP</span>
        </NavLink>
        
        <NavLink to="/tasks" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
          <div className="bg-blue-600 text-white p-3 rounded-full -mt-8 shadow-lg ring-4 ring-gray-50">
            <i className="fa-solid fa-list-check text-xl"></i>
          </div>
          <span className="text-[10px] mt-1 font-medium">Tasks</span>
        </NavLink>
        
        <NavLink to="/wallet" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
          <i className="fa-solid fa-wallet text-xl"></i>
          <span className="text-[10px] mt-1 font-medium">Wallet</span>
        </NavLink>
        
        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
          <i className="fa-solid fa-user text-xl"></i>
          <span className="text-[10px] mt-1 font-medium">Profile</span>
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-red-600' : 'text-gray-500'}`}>
            <i className="fa-solid fa-gear text-xl"></i>
            <span className="text-[10px] mt-1 font-medium">Admin</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default BottomNav;
