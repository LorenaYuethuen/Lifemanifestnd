import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Sun, CheckCircle2, AlertTriangle, Plus, PenSquare, CheckSquare, Banknote, BatteryCharging, ArrowRight, ShieldCheck, Moon, Heart } from 'lucide-react';
import { useEnergy, EnergyLevel } from '../context/EnergyContext';
import { Link } from 'react-router';

export const Dashboard = () => {
  const { state, setLevel } = useEnergy();
  const [isFabOpen, setIsFabOpen] = useState(false);

  const getEnergyStatus = () => {
    switch(state.level) {
      case 1: return { text: "极度耗竭", emoji: "🤒", color: "text-red-500", glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]", border: "border-red-500/30", bg: "bg-gradient-to-br from-red-500/10 to-red-900/10", rec: "完全休息，执行SOS急救" };
      case 2: return { text: "电量不足", emoji: "🔋", color: "text-orange-400", glow: "shadow-[0_0_15px_rgba(249,115,22,0.3)]", border: "border-orange-500/30", bg: "bg-gradient-to-br from-orange-500/10 to-orange-900/10", rec: "低认知负担的恢复性任务" };
      case 3: return { text: "平稳状态", emoji: "⚖️", color: "text-yellow-400", glow: "shadow-[0_0_15px_rgba(234,179,8,0.3)]", border: "border-yellow-500/30", bg: "bg-gradient-to-br from-yellow-500/10 to-yellow-900/10", rec: "常规生活维护，避免过度消耗" };
      case 4: return { text: "状态不错", emoji: "✨", color: "text-green-400", glow: "shadow-[0_0_15px_rgba(34,197,94,0.3)]", border: "border-green-500/30", bg: "bg-gradient-to-br from-green-500/10 to-green-900/10", rec: "核心工作，深度思考" };
      case 5: return { text: "能量满格", emoji: "🌟", color: "text-blue-400", glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]", border: "border-blue-500/30", bg: "bg-gradient-to-br from-blue-500/10 to-blue-900/10", rec: "高挑战性任务，创造性输出" };
      default: return { text: "未知", emoji: "❓", color: "text-gray-400", glow: "shadow-none", border: "border-gray-500/30", bg: "bg-gradient-to-br from-gray-500/10 to-transparent", rec: "请先进行能量签到" };
    }
  };

  const status = getEnergyStatus();

  // Tasks mapped by current energy level
  const getRecommendedTasks = () => {
    const pendingTasks = state.tasks.filter(t => !t.completed && t.status !== 'CHECK');
    
    if (state.level <= 2) {
      return pendingTasks.filter(t => t.suitableEnergyState === '低能量可做' && t.startupDifficulty === '轻松启动');
    } else if (state.level === 3) {
      return pendingTasks.filter(t => t.energyRequired <= 3);
    } else {
      return [...pendingTasks].sort((a, b) => b.energyRequired - a.energyRequired);
    }
  };

  const recommendedTasks = getRecommendedTasks();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Determine time of day for Daily Tracker
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  // Quick Add FAB options
  const fabOptions = [
    { icon: <PenSquare size={18} />, color: 'bg-blue-500', delay: 0.1 },
    { icon: <CheckSquare size={18} />, color: 'bg-green-500', delay: 0.15 },
    { icon: <Banknote size={18} />, color: 'bg-yellow-500', delay: 0.2 },
    { icon: <BatteryCharging size={18} />, color: 'bg-red-500', delay: 0.25 },
  ];

  // 极简庇护模式 (Minimal Asylum Mode)
  if (state.level <= 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black/50 relative overflow-hidden -mt-10">
        <motion.div 
          className="absolute inset-0 z-0 bg-gradient-to-b from-red-900/10 via-black to-black pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
        />
        
        <div className="w-full max-w-2xl relative z-10 space-y-8">
          {/* Header */}
          <div className="flex justify-center mb-8">
            <div className="bg-black/60 backdrop-blur-md border border-white/5 rounded-full p-2 flex space-x-2">
              {[1,2,3,4,5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl as EnergyLevel)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${state.level === lvl ? 'bg-white/20 scale-110 shadow-lg' : 'opacity-40 hover:opacity-100 hover:bg-white/10'}`}
                >
                  {lvl === 1 ? '🤒' : lvl === 2 ? '🔋' : lvl === 3 ? '⚖️' : lvl === 4 ? '✨' : '🌟'}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="mx-auto w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide">
              你现在安全了。
            </h1>
            <p className="text-gray-400 text-lg">系统已进入低耗能庇护模式，已为你屏蔽一切复杂干扰。</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid gap-6 mt-12"
          >
            <Link to="/sos" className="block w-full">
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 hover:border-red-500/40 p-8 rounded-3xl transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-red-500/20 text-red-400 rounded-2xl group-hover:scale-110 transition-transform">
                    <Heart size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">🌿 感官急救包</h2>
                    <p className="text-gray-400">进入轻度/中度恢复菜单</p>
                  </div>
                </div>
                <ArrowRight size={24} className="text-red-400/50 group-hover:text-red-400 group-hover:translate-x-2 transition-all" />
              </div>
            </Link>

            <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 p-8 rounded-3xl">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center">
                <span className="mr-2">🪫</span> 仅限低耗能任务
              </h2>
              {recommendedTasks.length > 0 ? (
                <div className="space-y-3">
                  {recommendedTasks.slice(0, 2).map(task => (
                    <div key={task.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-500 flex-shrink-0" />
                      <span className="text-gray-300 font-medium text-lg">{task.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 italic text-lg">
                  当前无适配任务，请安心休息。
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 标准模式 (Standard Mode)
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 text-gray-100 relative min-h-full"
    >
      {/* 顶部 Header: 能量状态板 (Energy Center) */}
      <motion.div variants={itemVariants} className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <div className="flex items-center space-x-6 relative z-10 w-full md:w-auto">
          <div className={`p-4 rounded-3xl bg-black/40 border border-white/10 shadow-inner ${status.glow}`}>
            <span className="text-4xl">{status.emoji}</span>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Energy Center</div>
            <div className="text-2xl font-black text-white flex items-center">
              {status.text}
            </div>
          </div>
        </div>

        {/* 1-5 能量刻度选择器 */}
        <div className="flex space-x-2 bg-black/40 p-2 rounded-full border border-white/5 relative z-10 w-full md:w-auto justify-center">
          {[
            { level: 1, emoji: '🤒', color: 'bg-red-500' },
            { level: 2, emoji: '🔋', color: 'bg-orange-500' },
            { level: 3, emoji: '⚖️', color: 'bg-yellow-500' },
            { level: 4, emoji: '✨', color: 'bg-green-500' },
            { level: 5, emoji: '🌟', color: 'bg-blue-500' }
          ].map((item) => (
            <button
              key={item.level}
              onClick={() => setLevel(item.level as EnergyLevel)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 relative group
                ${state.level === item.level ? `${item.color}/20 scale-110 shadow-inner border border-${item.color.split('-')[1]}-500/50` : 'hover:bg-white/10 opacity-50 hover:opacity-100'}`}
            >
              {state.level === item.level && (
                <motion.div layoutId="energyIndicator" className={`absolute inset-0 rounded-full ${item.color}/20 border border-${item.color.split('-')[1]}-500`} />
              )}
              <span className="relative z-10">{item.emoji}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* 4列/3行 Bento Box 网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 中左侧: ⚡ 能量匹配任务推荐 (Task Matcher) - 占2列 */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Zap className="mr-3 text-yellow-400" size={24} />
              能量匹配任务
            </h2>
            <div className="text-xs px-3 py-1 bg-white/10 rounded-full text-gray-400 font-medium">
              适配当前能量 {state.level}
            </div>
          </div>

          <div className="flex-1 space-y-3 relative z-10 overflow-y-auto">
            {recommendedTasks.slice(0, 5).map((task, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }}
                key={task.id} 
                className="group flex flex-col p-4 bg-black/40 hover:bg-black/60 rounded-2xl border border-white/5 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded border-2 border-gray-600 group-hover:border-blue-500 transition-colors flex-shrink-0" />
                    <span className="text-gray-200 font-medium group-hover:text-white transition-colors">{task.title}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pl-8">
                  {/* Cognitive Load Badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1
                    ${task.cognitiveLoad === '高' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                      task.cognitiveLoad === '中' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                      'bg-green-500/10 text-green-400 border border-green-500/20'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${task.cognitiveLoad === '高' ? 'bg-red-400' : task.cognitiveLoad === '中' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                    <span>认知{task.cognitiveLoad}</span>
                  </span>
                  {/* Startup Difficulty Badge */}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5 flex items-center">
                    {task.startupDifficulty === '需要仪式感' ? <><Zap size={10} className="mr-1 text-orange-400"/>高阻力</> : <><Sun size={10} className="mr-1 text-emerald-400"/>顺滑</>}
                  </span>
                </div>
              </motion.div>
            ))}
            {recommendedTasks.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 italic bg-black/20 rounded-2xl border border-white/5 p-6">
                <span className="text-3xl mb-3">🧘</span>
                <p>当前无适配任务，你可以休息了。</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* 中右侧: 习惯与节律 (Daily Tracker) - 占2列 */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col h-full">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Sun className="mr-3 text-emerald-400" size={24} />
              习惯与节律
            </h2>
            <div className="flex space-x-1 bg-black/40 p-1 rounded-xl border border-white/5">
              <div className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${timeOfDay === 'morning' ? 'bg-white/20 text-white' : 'text-gray-500'}`}>早晨</div>
              <div className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${timeOfDay === 'afternoon' ? 'bg-white/20 text-white' : 'text-gray-500'}`}>下午</div>
              <div className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${timeOfDay === 'evening' ? 'bg-white/20 text-white' : 'text-gray-500'}`}>晚上</div>
            </div>
          </div>

          <div className="flex-1 space-y-4 relative z-10">
            {timeOfDay === 'morning' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">早晨节律蓝图</h3>
                {['冥想 10 分钟', '喝一大杯温水', '八段锦 / 拉伸', '确定今日 3 件要事'].map((habit, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-colors cursor-pointer">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-600 group-hover:border-emerald-400 flex items-center justify-center transition-colors" />
                    <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{habit}</span>
                  </div>
                ))}
              </div>
            )}
            {timeOfDay === 'afternoon' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">下午节律蓝图</h3>
                {['午休 20 分钟', '处理低认知事务', '补充水分', '出门散步 15 分钟'].map((habit, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-colors cursor-pointer">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-600 group-hover:border-emerald-400 flex items-center justify-center transition-colors" />
                    <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{habit}</span>
                  </div>
                ))}
              </div>
            )}
            {timeOfDay === 'evening' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">晚间节律蓝图</h3>
                {['准备明日衣物', '阅读 30 分钟', '洗澡 & 护肤', '感恩日记'].map((habit, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-colors cursor-pointer">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-600 group-hover:border-indigo-400 flex items-center justify-center transition-colors" />
                    <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{habit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* 底部: 预警与洞察 (Alerts & Insights) - 占全宽 */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-xl flex items-center space-x-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex-shrink-0 flex items-center space-x-2 text-gray-400 pr-6 border-r border-white/10">
            <Sparkles size={20} className="text-purple-400" />
            <span className="font-bold uppercase tracking-widest text-xs">洞察</span>
          </div>
          
          <div className="flex space-x-4 flex-nowrap min-w-max">
            <div className="flex items-center space-x-3 bg-black/40 px-4 py-3 rounded-2xl border border-white/5">
              <span className="text-lg">📊</span>
              <span className="text-sm text-gray-300">本周能量波动平稳，平均 3.2</span>
            </div>
            <div className="flex items-center space-x-3 bg-red-500/10 px-4 py-3 rounded-2xl border border-red-500/20">
              <AlertTriangle size={18} className="text-red-400" />
              <span className="text-sm text-red-300 font-medium">注意：咖啡豆即将耗尽</span>
            </div>
            <div className="flex items-center space-x-3 bg-black/40 px-4 py-3 rounded-2xl border border-white/5">
              <span className="text-lg">🗓️</span>
              <span className="text-sm text-gray-300">明天下午 2 点有牙医预约</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 右上角 / 悬浮: 快捷录入 (Quick Add FAB) */}
      <div className="fixed bottom-24 right-8 z-40 flex flex-col-reverse items-end space-y-reverse space-y-4">
        <button 
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <motion.div animate={{ rotate: isFabOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Plus size={28} className="text-black" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isFabOpen && (
            <>
              {fabOptions.map((opt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ delay: opt.delay, type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl ${opt.color} hover:brightness-110 active:scale-95 transition-transform`}
                >
                  {opt.icon}
                </motion.button>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};