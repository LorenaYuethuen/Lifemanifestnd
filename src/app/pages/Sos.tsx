import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Play, Square, RefreshCcw, Heart, Volume2, Wind } from 'lucide-react';
import { Link } from 'react-router';
import { useEnergy } from '../context/EnergyContext';

export const Sos = () => {
  const { setLevel } = useEnergy();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // Default 5 mins
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [mode, setMode] = useState<'breathe' | 'rest' | 'sound'>('breathe');

  useEffect(() => {
    let interval: number;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setLevel(3);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, setLevel]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
  };

  const setDuration = (secs: number) => {
    setSelectedDuration(secs);
    setTimeLeft(secs);
    setIsActive(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const breatheVariants = {
    inhale: { scale: 1.5, opacity: 0.8, transition: { duration: 4, ease: "easeInOut" } },
    exhale: { scale: 1, opacity: 0.4, transition: { duration: 6, ease: "easeInOut" } }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-gray-100 min-h-[80vh] relative">
      {/* Background ambient light for SOS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isActive ? (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md bg-[#121212]/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl space-y-10 relative z-10"
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-400 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <AlertTriangle size={40} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">感官急救 (SOS)</h1>
              <p className="text-gray-400 text-sm leading-relaxed">当你感到被淹没、过度刺激或极度耗竭时，请在这里暂停。我们将带你进入低刺激环境进行恢复。</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] text-center">选择恢复时长</h2>
              <div className="flex justify-center space-x-3">
                {[180, 300, 600, 900].map(secs => (
                  <button
                    key={secs}
                    onClick={() => setDuration(secs)}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 border
                      ${selectedDuration === secs 
                        ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)] scale-105' 
                        : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/20 hover:bg-black/60 hover:text-white'}`}
                  >
                    {secs / 60}m
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] text-center">选择恢复模式</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'breathe', icon: Wind, label: '4-7-8 呼吸', color: 'blue' },
                  { id: 'rest', icon: Heart, label: '闭目静心', color: 'purple' },
                  { id: 'sound', icon: Volume2, label: '白噪音', color: 'green' }
                ].map(m => {
                  const isSelected = mode === m.id;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id as any)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300
                        ${isSelected 
                          ? `bg-${m.color}-500/20 border-${m.color}-500/50 text-${m.color}-300 shadow-[0_0_15px_rgba(var(--${m.color}-500-rgb),0.2)] scale-105` 
                          : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/20 hover:bg-black/60 hover:text-gray-200'}`}
                    >
                      <Icon size={24} className="mb-3" />
                      <span className="text-xs font-bold">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={toggleTimer}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-lg font-bold py-5 rounded-2xl shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2 border border-red-400/30"
            >
              <Play fill="currentColor" size={20} />
              <span>开始急救</span>
            </button>
            
            <div className="text-center pt-2">
              <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-wider font-medium">
                返回主页 (Skip SOS)
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center text-white p-6"
          >
            {/* Ambient Background animation based on mode */}
            {mode === 'breathe' && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none"
              >
                <motion.div 
                  className="w-96 h-96 rounded-full bg-blue-500/20 blur-[100px]"
                  animate={isActive ? ["inhale", "exhale"] : "exhale"}
                  variants={breatheVariants}
                  initial="exhale"
                  onAnimationComplete={(definition) => {
                    if (definition === "inhale") setTimeout(() => {}, 4000);
                  }}
                />
              </motion.div>
            )}

            <div className="relative z-10 flex flex-col items-center space-y-16 w-full max-w-md">
              <div className="text-center space-y-6">
                <div className="text-gray-400 text-sm md:text-base uppercase tracking-[0.4em] font-medium bg-white/5 px-6 py-2 rounded-full backdrop-blur-md border border-white/5 inline-block">
                  {mode === 'breathe' ? '跟随光晕呼吸' : mode === 'rest' ? '闭上眼睛，放松' : '聆听白噪音'}
                </div>
                <div className="text-[7rem] md:text-[9rem] font-light tabular-nums tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] leading-none">
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div 
                  className="h-full bg-gradient-to-r from-gray-400 to-white"
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / selectedDuration) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>

              <div className="flex items-center justify-center space-x-8">
                <button
                  onClick={toggleTimer}
                  className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-md transition-all duration-300 active:scale-90 text-white shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  <Square fill="currentColor" size={28} />
                </button>
                <button
                  onClick={resetTimer}
                  className="w-14 h-14 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 backdrop-blur-md"
                >
                  <RefreshCcw size={20} />
                </button>
              </div>
            </div>

            <div className="absolute bottom-12 text-[10px] text-gray-600 uppercase tracking-[0.3em] font-medium">
              Life Compass SOS Mode
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};