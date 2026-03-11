import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Dumbbell, Coffee, CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react';

interface RoutineTask {
  id: string;
  text: string;
  subtext?: string;
  completed: boolean;
}

export const Routine = () => {
  const [routines, setRoutines] = useState<{ [key: string]: RoutineTask[] }>({
    morning: [
      { id: 'm1', text: '冥想 / 听金刚经解读', completed: false },
      { id: 'm2', text: '早饭 (豆浆、粗粮、鸡蛋)', completed: false },
      { id: 'm3', text: '八段锦 / 拉伸 + 瑜伽', completed: false },
      { id: 'm4', text: '专注学习 1 小时', subtext: '营养学 / 神经科学 / 历史人文', completed: false },
      { id: 'm5', text: '骑车通勤', completed: false },
    ],
    evening: [
      { id: 'e1', text: '下班骑车与无氧运动', completed: false },
      { id: 'e2', text: '动作复盘 15 分钟', completed: false },
      { id: 'e3', text: '洗澡护肤 (播放音乐)', completed: false },
      { id: 'e4', text: '准备明日装备与食物', completed: false },
      { id: 'e5', text: '阅读心流与冥想入眠', completed: false },
    ],
    weekend: [
      { id: 'w1', text: '骑行 + 咖啡馆阅读', completed: false },
      { id: 'w2', text: '攀岩训练', completed: false },
      { id: 'w3', text: '观影输出与备菜', completed: false },
    ]
  });

  const toggleTask = (period: string, id: string) => {
    setRoutines(prev => ({
      ...prev,
      [period]: prev[period].map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const getProgress = (period: string) => {
    const tasks = routines[period];
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const RoutineBlock = ({ 
    title, icon, period, colorClass, shadowClass, gradientClass, textColor 
  }: { 
    title: string; icon: React.ReactNode; period: string; colorClass: string; shadowClass: string; gradientClass: string; textColor: string;
  }) => {
    const progress = getProgress(period);
    
    return (
      <motion.div variants={itemVariants} className={`bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-${colorClass.split('-')[1]}-500/30 transition-all duration-500`}>
        <div className={`absolute top-0 right-0 w-64 h-64 ${gradientClass} blur-3xl rounded-full pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-500`} />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl bg-black/40 border border-white/5 ${shadowClass} transition-all`}>
              {icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Daily Rituals</p>
            </div>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
              <circle 
                cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * progress) / 100}
                className={`${textColor} transition-all duration-1000 ease-out`} 
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-gray-300">{progress}%</span>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          {routines[period].map((task) => (
            <div 
              key={task.id} 
              onClick={() => toggleTask(period, task.id)}
              className="flex items-start space-x-4 p-4 bg-black/40 hover:bg-white/5 rounded-2xl border border-white/5 transition-all cursor-pointer"
            >
              <button className={`flex-shrink-0 mt-0.5 transition-colors ${task.completed ? textColor : 'text-gray-600'}`}>
                {task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
              </button>
              <div className="flex-1">
                <p className={`text-sm md:text-base font-medium transition-all ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                  {task.text}
                </p>
                {task.subtext && (
                  <p className="text-xs text-gray-500 mt-1">{task.subtext}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 text-gray-100 min-h-full pb-20">
      
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Clock className="text-emerald-400" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">日常节律</h1>
            <p className="text-gray-400 text-sm mt-1">你的每日锚点。在变动中保持能量的稳定底线。</p>
          </div>
        </div>
      </motion.div>

      {/* Stats/Overview Ribbon */}
      <motion.div variants={itemVariants} className="flex overflow-x-auto space-x-4 pb-2 [&::-webkit-scrollbar]:hidden">
        {['阅读习惯', '无氧运动', '冥想正念', '骑行通勤'].map((habit, i) => (
          <div key={i} className="flex-shrink-0 flex items-center space-x-2 bg-[#121212]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
            <Sparkles size={14} className="text-emerald-400" />
            <span className="text-sm font-medium text-gray-300">{habit}</span>
          </div>
        ))}
      </motion.div>

      {/* Routine Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Morning Routine */}
        <RoutineBlock 
          title="早晨自然醒" 
          icon={<Sun size={24} className="text-amber-400" />} 
          period="morning"
          colorClass="bg-amber"
          shadowClass="shadow-[0_0_20px_rgba(251,191,36,0.15)] group-hover:border-amber-500/50"
          gradientClass="bg-amber-500/10"
          textColor="text-amber-400"
        />

        {/* Evening Routine */}
        <RoutineBlock 
          title="晚间与下班" 
          icon={<Moon size={24} className="text-indigo-400" />} 
          period="evening"
          colorClass="bg-indigo"
          shadowClass="shadow-[0_0_20px_rgba(99,102,241,0.15)] group-hover:border-indigo-500/50"
          gradientClass="bg-indigo-500/10"
          textColor="text-indigo-400"
        />

        {/* Weekend & Long term */}
        <RoutineBlock 
          title="周末与长线" 
          icon={<Dumbbell size={24} className="text-pink-400" />} 
          period="weekend"
          colorClass="bg-pink"
          shadowClass="shadow-[0_0_20px_rgba(244,114,182,0.15)] group-hover:border-pink-500/50"
          gradientClass="bg-pink-500/10"
          textColor="text-pink-400"
        />

        {/* Frequency Targets (Static Info Card) */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-emerald-500/10 to-teal-900/10 border border-emerald-500/20 rounded-[2rem] p-8 shadow-xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-3 animate-pulse" />
              频率目标 (Frequency)
            </h3>
            
            <div className="space-y-4">
              <div className="bg-black/20 rounded-2xl p-4 border border-emerald-500/10 flex justify-between items-center backdrop-blur-sm">
                <span className="font-medium text-gray-200">每月一次</span>
                <span className="text-sm text-emerald-300 font-bold bg-emerald-500/20 px-3 py-1 rounded-lg">循环复盘</span>
              </div>
              <div className="bg-black/20 rounded-2xl p-4 border border-emerald-500/10 flex justify-between items-center backdrop-blur-sm">
                <span className="font-medium text-gray-200">每季度一次</span>
                <span className="text-sm text-emerald-300 font-bold bg-emerald-500/20 px-3 py-1 rounded-lg">短途旅行</span>
              </div>
              <div className="bg-black/20 rounded-2xl p-4 border border-emerald-500/10 flex justify-between items-center backdrop-blur-sm">
                <span className="font-medium text-gray-200">每年一次</span>
                <span className="text-sm text-emerald-300 font-bold bg-emerald-500/20 px-3 py-1 rounded-lg">大旅行充电</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed pt-2">
              规律的作息是维持神经多样性大脑稳定的基础。不要强求完美，允许弹性，只要大致在轨道上即可。
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};