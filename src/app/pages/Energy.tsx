import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BatteryCharging, AlertCircle, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useEnergy, EnergyLevel } from '../context/EnergyContext';
import { Link } from 'react-router';

export const Energy = () => {
  const { state, setLevel, addTrigger, deleteTrigger } = useEnergy();
  const [newTrigger, setNewTrigger] = useState('');
  const [triggerType, setTriggerType] = useState<'drain'|'boost'>('drain');
  const [triggerIntensity, setTriggerIntensity] = useState<number>(2);

  const levels: { level: EnergyLevel; emoji: string; label: string; desc: string; glow: string }[] = [
    { level: 1, emoji: '🤒', label: '极度耗竭', desc: '崩溃边缘，需要立即停止', glow: 'from-red-500/20 to-rose-600/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' },
    { level: 2, emoji: '🔋', label: '电量不足', desc: '容易暴躁，只能做简单事', glow: 'from-orange-500/20 to-amber-600/20 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]' },
    { level: 3, emoji: '⚖️', label: '平稳状态', desc: '情绪稳定，正常生活运转', glow: 'from-yellow-500/20 to-amber-400/20 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]' },
    { level: 4, emoji: '✨', label: '状态不错', desc: '专注力高，能处理复杂问题', glow: 'from-green-500/20 to-emerald-600/20 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]' },
    { level: 5, emoji: '🌟', label: '能量满格', desc: '创造力爆棚，能应对挑战', glow: 'from-blue-500/20 to-indigo-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' }
  ];

  const handleAddTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrigger.trim()) return;
    addTrigger({ source: newTrigger, type: triggerType, intensity: triggerIntensity });
    setNewTrigger('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-10 text-gray-100">
      <motion.div variants={itemVariants} className="flex flex-col space-y-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-yellow-400/20 to-orange-500/20 border border-yellow-500/30">
            <BatteryCharging className="text-yellow-400" size={28} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            能量管理与追踪
          </h1>
        </div>
        <p className="text-gray-400 text-sm md:text-base max-w-xl pl-16">
          Track your battery levels and identify what drains or boosts your energy.
        </p>
      </motion.div>

      {/* 5级能量签到 */}
      <motion.div variants={itemVariants} className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 border-b border-white/5 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">🔋</span> 5级能量签到 <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-white/10 rounded-md text-gray-400 uppercase tracking-widest">Energy Check-in</span>
          </h2>
          <p className="text-sm text-gray-400 mt-2">选择你当前的能量状态。系统将根据你的状态推荐适合的任务。如果是极度耗竭，请进入SOS模式。</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {levels.map(l => {
            const isActive = state.level === l.level;
            return (
              <button
                key={l.level}
                onClick={() => setLevel(l.level)}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-3 text-center group overflow-hidden
                  ${isActive 
                    ? `bg-gradient-to-br ${l.glow} scale-[1.02]` 
                    : 'border-white/5 hover:border-white/20 bg-black/40 hover:bg-black/60'}`}
              >
                {!isActive && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                <span className={`text-4xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{l.emoji}</span>
                <div className="space-y-1">
                  <span className={`block font-bold text-sm ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{l.label}</span>
                  <span className={`block text-xs line-clamp-2 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>{l.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {state.level <= 2 && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }} 
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }} 
              exit={{ opacity: 0, height: 0, marginTop: 0 }} 
              className="overflow-hidden relative z-10"
            >
              <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl flex items-start space-x-4 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                <div className="p-2 bg-red-500/20 rounded-xl">
                  <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
                </div>
                <div className="flex-1">
                  <div className="text-red-400 font-bold text-base">系统检测到你的能量极低</div>
                  <div className="text-sm text-red-400/80 mt-1 mb-4">建议立即停止消耗性工作，进入感官急救 (SOS) 模式，以防进一步过载。</div>
                  <Link to="/sos" className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-red-500/20">
                    <span>进入 SOS 模式</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 触发源追踪 */}
      <motion.div variants={itemVariants} className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 border-b border-white/5 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">🎯</span> 触发源追踪 <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-white/10 rounded-md text-gray-400 uppercase tracking-widest">Trigger Tracker</span>
          </h2>
          <p className="text-sm text-gray-400 mt-2">记录是什么消耗了你的能量，或者是什么给你充了电。这有助于识别模式并更好地保护你的边界。</p>
        </div>

        <form onSubmit={handleAddTrigger} className="relative z-10 flex flex-col md:flex-row gap-4 items-end bg-black/20 p-5 rounded-2xl border border-white/5">
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">触发源描述</label>
            <input 
              type="text" 
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 text-white transition-all placeholder:text-gray-600"
              placeholder="发生了什么？(e.g. 噪音、散步)"
            />
          </div>
          <div className="w-full md:w-40 space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">类型</label>
            <select 
              value={triggerType} 
              onChange={(e) => setTriggerType(e.target.value as 'drain'|'boost')}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 text-white transition-all appearance-none"
            >
              <option value="drain">📉 耗能 (Drain)</option>
              <option value="boost">📈 充电 (Boost)</option>
            </select>
          </div>
          <div className="w-full md:w-32 space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">强度 (1-3)</label>
            <select 
              value={triggerIntensity} 
              onChange={(e) => setTriggerIntensity(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 text-white transition-all appearance-none"
            >
              <option value={1}>1 - 轻微</option>
              <option value={2}>2 - 中度</option>
              <option value={3}>3 - 强烈</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={!newTrigger.trim()}
            className="w-full md:w-auto h-[46px] bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 rounded-xl font-bold text-sm hover:from-yellow-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-yellow-500/20"
          >
            <Plus size={18} />
            <span>记录</span>
          </button>
        </form>

        <div className="relative z-10 space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">最近记录</h3>
          <div className="grid gap-3">
            <AnimatePresence>
              {state.triggers.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-500 italic bg-black/20 p-6 rounded-2xl border border-white/5 text-center">
                  暂无记录，开始追踪你的能量源吧。
                </motion.div>
              ) : (
                state.triggers.map(t => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }} 
                    key={t.id} 
                    className="flex items-center justify-between bg-black/40 hover:bg-black/60 border border-white/5 p-4 rounded-2xl transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${t.type === 'drain' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                        <span className="text-xl leading-none block">
                          {t.type === 'drain' ? '📉' : '📈'}
                        </span>
                      </div>
                      <div>
                        <div className="text-base text-gray-200 font-medium flex items-center">
                          {t.source} 
                          <span className="ml-3 text-xs font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">
                            {new Date(t.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <div className="flex space-x-1.5 mt-2">
                          {Array.from({length: 3}).map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-2 h-2 rounded-full transition-colors ${
                                i < t.intensity 
                                  ? (t.type === 'drain' ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]')
                                  : 'bg-white/10'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteTrigger(t.id)} 
                      className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};