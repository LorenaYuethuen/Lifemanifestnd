import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router';
import { Compass, Battery, AlertTriangle, Database as DatabaseIcon, Clock, Activity, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEnergy } from '../context/EnergyContext';

export const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { state, isSyncing } = useEnergy();

  const navItems = [
    { name: 'LIFE COMPASS', path: '/', icon: <Compass size={18} /> },
    { name: '能量与触发源', path: '/energy', icon: <Battery size={18} /> },
    { name: '感官急救 (SOS)', path: '/sos', icon: <AlertTriangle size={18} /> },
    { name: 'DATABASE', path: '/database', icon: <DatabaseIcon size={18} /> },
    { name: 'DAILY ROUTINE', path: '/routine', icon: <Clock size={18} /> },
    { name: 'SOP', path: '/sop', icon: <Activity size={18} /> },
  ];

  const NavContent = () => {
    if (state.level <= 2) return null; // Hide in low energy mode
    return (
      <div className="flex flex-col h-full bg-[#0d0d0d] border-r border-white/5 text-[#a1a1aa]">
        <div className="p-6 flex flex-col gap-2">
          <div className="flex items-center space-x-3 font-bold text-lg tracking-wide text-white">
            <div className="bg-gradient-to-tr from-yellow-400 to-orange-500 text-black px-2 py-0.5 rounded-md text-xs font-black shadow-[0_0_15px_rgba(234,179,8,0.3)]">ND</div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Life Compass</span>
          </div>
          <div className="text-[10px] text-gray-500 flex items-center mt-2 font-medium tracking-wider uppercase">
            {isSyncing ? (
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-2 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span> Syncing...</span>
            ) : (
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Cloud Synced</span>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <div className="px-3 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Layer 1 - 驾驶舱</div>
          {navItems.slice(0, 3).map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `relative flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm group ${
                    isActive 
                      ? 'bg-white/10 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 w-1 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-r-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className={`transition-transform duration-300 ${isActive ? 'scale-110 text-yellow-400' : 'group-hover:scale-110 group-hover:text-gray-300'}`}>
                      {item.icon}
                    </span>
                    <span className="group-hover:opacity-100 transition-opacity">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
          
          <div className="my-6 border-t border-white/5 mx-3"></div>
          <div className="px-3 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Layer 2+ - 执行与洞察</div>
          {navItems.slice(3).map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `relative flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm group ${
                    isActive 
                      ? 'bg-white/10 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 w-1 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-r-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className={`transition-transform duration-300 ${isActive ? 'scale-110 text-yellow-400' : 'group-hover:scale-110 group-hover:text-gray-300'}`}>
                      {item.icon}
                    </span>
                    <span className="group-hover:opacity-100 transition-opacity">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-yellow-500/30 overflow-hidden">
      {/* Desktop Sidebar */}
      {state.level > 2 && (
        <motion.div 
          initial={{ width: 0, opacity: 0 }} 
          animate={{ width: 256, opacity: 1 }} 
          className="hidden md:block h-full flex-shrink-0 z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.5)]"
        >
          <NavContent />
        </motion.div>
      )}

      {/* Mobile Header */}
      {state.level > 2 && (
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 z-40">
          <div className="font-bold text-sm flex items-center space-x-2">
            <span className="bg-gradient-to-tr from-yellow-400 to-orange-500 text-black px-1.5 py-0.5 rounded-md text-xs shadow-[0_0_10px_rgba(234,179,8,0.3)]">ND</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Life Compass</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            <Menu size={20} />
          </button>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && state.level > 2 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-[280px] z-50 bg-[#0d0d0d] shadow-2xl border-r border-white/5"
            >
              <div className="absolute top-4 right-4 z-10">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <NavContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 h-full overflow-y-auto ${state.level > 2 ? 'md:pt-0 pt-16' : 'pt-0'} relative`}>
        {state.level > 2 && (
          <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
        )}
        <div className={`mx-auto ${state.level > 2 ? 'max-w-6xl p-6 md:p-10' : 'max-w-full h-full p-0'} pb-24 relative z-10`}>
          <Outlet />
        </div>
      </div>

      {/* Global SOS Button - Layer 0 */}
      <NavLink 
        to="/sos"
        className="fixed bottom-8 right-8 z-50 group flex items-center justify-center w-14 h-14 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300 backdrop-blur-md"
      >
        <div className="absolute inset-0 rounded-full border border-amber-500/50 animate-[ping_3s_ease-in-out_infinite] opacity-20" />
        <AlertTriangle className="text-amber-500 group-hover:scale-110 transition-transform" size={24} />
      </NavLink>
    </div>
  );
};