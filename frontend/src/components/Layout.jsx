import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ReceiptIndianRupee, Users, Scissors, BarChart3, LogOut, Shield, Megaphone, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Layout = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = currentUser?.role === 'admin' ? [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Billing', path: '/billing', icon: <ReceiptIndianRupee size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'Services', path: '/services', icon: <Scissors size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
    { name: 'Marketing', path: '/marketing', icon: <Megaphone size={20} /> },
    { name: 'Staff Control', path: '/staff', icon: <Shield size={20} /> },
  ] : [
    { name: 'Billing', path: '/billing', icon: <ReceiptIndianRupee size={20} /> },
  ];

  return (
    <div className="h-screen bg-mesh w-full pb-20 md:pb-0 md:pl-72 flex flex-col overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 fixed left-0 top-0 h-screen glass border-r border-white/10 z-40 bg-dark/20">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center font-black text-2xl shadow-lg shadow-primary/20">V</div>
          <div>
            <h1 className="text-xl font-black text-white tracking-widest uppercase">Just <span className="text-primary italic">Hair</span></h1>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Enterprise v2.4</p>
          </div>
        </div>
        
        <nav className="flex-1 px-6 py-8 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative overflow-hidden ${
                  isActive 
                  ? 'bg-primary/20 text-white font-bold border border-primary/20 shadow-lg shadow-primary/10' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`}>
                    {item.icon}
                  </div>
                  <span className="tracking-wide">{item.name}</span>
                  {isActive && <motion.div layoutId="nav-active" className="absolute right-0 w-1 h-6 bg-primary rounded-l-full"></motion.div>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* User Card */}
        <div className="p-6 m-4 mt-auto glass-card border-none bg-white/[0.03]">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <UserCircle2 size={24} className="text-primary" />
             </div>
             <div className="min-w-0">
                <p className="text-sm font-black text-white truncate">{currentUser?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest">{currentUser?.role}</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all w-full border border-red-400/20"
          >
            <LogOut size={16} />
            <span>Terminate</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto overflow-hidden flex flex-col h-full p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 glass border border-white/10 z-50 rounded-[2.5rem] shadow-2xl p-2 bg-dark/80 backdrop-blur-3xl">
        <nav className="flex justify-around items-center h-16 relative">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center transition-all ${
                  isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
                }`
              }
            >
              {({ isActive }) => (
                <div className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-primary/20' : ''}`}>
                  {item.icon}
                </div>
              )}
            </NavLink>
          ))}
          <button 
            onClick={handleLogout}
            className="p-3 rounded-2xl text-red-400 hover:text-red-500"
          >
            <LogOut size={20} />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
