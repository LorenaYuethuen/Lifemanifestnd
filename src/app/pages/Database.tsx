import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database as DatabaseIcon, Plus, MoreVertical, Search, Zap, Sun, CheckCircle2, Circle, AlertCircle, LayoutGrid, List } from 'lucide-react';
import { useEnergy, Task } from '../context/EnergyContext';

export const Database = () => {
  const { state, addTask, updateTask, toggleTask, deleteTask } = useEnergy();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const statuses = ['ALL', 'INBOX', 'PLAN', 'DO', 'KNOWLEDGE', 'CHECK'];

  const filteredTasks = state.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getCognitiveLoadColor = (load: string) => {
    switch(load) {
      case '高': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case '中': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case '低': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    energyRequired: 3,
    category: '工作',
    status: 'INBOX',
    cognitiveLoad: '中',
    startupDifficulty: '需要仪式感',
    suitableEnergyState: '稳定'
  });

  const handleAddTask = () => {
    if (newTask.title?.trim()) {
      addTask(newTask as Omit<Task, 'id' | 'completed'>);
      setIsAddingTask(false);
      setNewTask({
        title: '',
        energyRequired: 3,
        category: '工作',
        status: 'INBOX',
        cognitiveLoad: '中',
        startupDifficulty: '需要仪式感',
        suitableEnergyState: '稳定'
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-gray-100 min-h-full pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <DatabaseIcon className="text-purple-400" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center">
              GTD 任务中枢
            </h1>
            <p className="text-gray-400 text-sm mt-1">设置任务的静态成本与耗能标签，供驾驶舱智能调度。</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索任务..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors w-full md:w-64"
            />
          </div>
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            <button onClick={() => setViewMode('board')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'board' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
              <LayoutGrid size={18} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
              <List size={18} />
            </button>
          </div>
          <button 
            onClick={() => setIsAddingTask(true)}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <Plus size={18} />
            <span className="hidden md:inline">新建记录</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all whitespace-nowrap
              ${filterStatus === status 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                : 'bg-[#121212] text-gray-500 border border-white/5 hover:bg-white/5 hover:text-gray-300'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Add Task Form (Inline) */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#1a1a1a]/90 backdrop-blur-xl border border-purple-500/30 rounded-[2rem] p-6 shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">任务名称</label>
                  <input 
                    type="text" 
                    value={newTask.title} 
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                    placeholder="输入需要执行的具体动作..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">状态 (Status)</label>
                    <select 
                      value={newTask.status} 
                      onChange={e => setNewTask({...newTask, status: e.target.value as Task['status']})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 appearance-none"
                    >
                      <option value="INBOX">INBOX (收集箱)</option>
                      <option value="PLAN">PLAN (计划中)</option>
                      <option value="DO">DO (执行中)</option>
                      <option value="CHECK">CHECK (待检查)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">分类 (Category)</label>
                    <input 
                      type="text" 
                      value={newTask.category} 
                      onChange={e => setNewTask({...newTask, category: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                <h3 className="text-sm font-bold text-purple-400 flex items-center mb-4">
                  <Zap size={16} className="mr-2" />
                  耗能标签 (Energy Cost)
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-medium text-gray-400">最低要求能量 (1-5)</label>
                      <span className="text-xs font-bold text-purple-400">{newTask.energyRequired}</span>
                    </div>
                    <input 
                      type="range" min="1" max="5" 
                      value={newTask.energyRequired} 
                      onChange={e => setNewTask({...newTask, energyRequired: parseInt(e.target.value)})}
                      className="w-full accent-purple-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">认知负荷</label>
                      <div className="flex bg-black/50 rounded-lg p-1 border border-white/5">
                        {['低', '中', '高'].map(level => (
                          <button
                            key={level}
                            onClick={() => setNewTask({...newTask, cognitiveLoad: level as any})}
                            className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${newTask.cognitiveLoad === level ? 'bg-white/20 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">启动难度</label>
                      <div className="flex bg-black/50 rounded-lg p-1 border border-white/5">
                        {['轻松启动', '需要仪式感'].map(diff => (
                          <button
                            key={diff}
                            onClick={() => setNewTask({...newTask, startupDifficulty: diff as any})}
                            className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${newTask.startupDifficulty === diff ? 'bg-white/20 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            {diff === '轻松启动' ? '顺滑' : '高阻力'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3 border-t border-white/5 pt-4">
              <button onClick={() => setIsAddingTask(false)} className="px-5 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                取消
              </button>
              <button onClick={handleAddTask} className="px-6 py-2 rounded-xl text-sm font-bold bg-purple-500 hover:bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-colors">
                保存任务
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List / Board */}
      <div className={viewMode === 'board' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500"
            >
              <DatabaseIcon size={48} className="mb-4 opacity-20" />
              <p>没有找到符合条件的任务记录</p>
            </motion.div>
          ) : (
            filteredTasks.map(task => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={task.id}
                className={`group bg-[#121212]/80 backdrop-blur-xl border border-white/5 hover:border-white/10 rounded-3xl p-5 shadow-lg transition-all duration-300 
                  ${viewMode === 'list' ? 'flex items-center justify-between gap-4' : 'flex flex-col'}`}
              >
                <div className={`flex ${viewMode === 'list' ? 'items-center space-x-4 flex-1' : 'items-start justify-between mb-4'}`}>
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 mt-0.5 ${task.completed ? 'text-emerald-500' : 'text-gray-500 hover:text-purple-400'} transition-colors`}
                  >
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <div className={viewMode === 'list' ? 'flex-1 flex items-center space-x-4' : 'flex-1 pr-4'}>
                    <h3 className={`font-semibold text-lg ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200 group-hover:text-white'} transition-colors truncate`}>
                      {task.title}
                    </h3>
                    {viewMode === 'list' && (
                      <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5 uppercase tracking-wider">{task.status}</span>
                    )}
                  </div>
                  {viewMode === 'board' && (
                    <div className="flex-shrink-0">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5">
                        {task.status}
                      </span>
                    </div>
                  )}
                </div>

                <div className={`flex flex-wrap items-center gap-2 ${viewMode === 'list' ? 'justify-end w-auto' : 'mt-auto pt-4 border-t border-white/5'}`}>
                  {/* Energy Req Badge */}
                  <div title="最低要求能量" className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-xs text-gray-300">
                    <Zap size={12} className="text-yellow-500" />
                    <span>Lv.{task.energyRequired}</span>
                  </div>
                  
                  {/* Cognitive Load */}
                  <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${getCognitiveLoadColor(task.cognitiveLoad)}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${task.cognitiveLoad === '高' ? 'bg-red-400' : task.cognitiveLoad === '中' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                    <span>认知{task.cognitiveLoad}</span>
                  </div>

                  {/* Startup Diff */}
                  <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-xs text-gray-300">
                    {task.startupDifficulty === '轻松启动' ? <Sun size={12} className="text-emerald-400"/> : <AlertCircle size={12} className="text-orange-400"/>}
                    <span>{task.startupDifficulty === '轻松启动' ? '顺滑' : '高阻力'}</span>
                  </div>

                  <button 
                    onClick={() => deleteTask(task.id)}
                    className={`ml-auto p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors ${viewMode === 'list' ? 'ml-4' : ''}`}
                    title="删除"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};