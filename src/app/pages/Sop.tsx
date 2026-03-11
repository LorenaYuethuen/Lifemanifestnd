import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GripVertical, Plus, X, BrainCircuit, Zap, Sparkles, Settings2 } from 'lucide-react';
import { useEnergy, Task } from '../context/EnergyContext';

const COLUMNS = [
  { id: 'INBOX', title: '收集箱', icon: '📦', color: 'bg-[#2b4c6e]' },
  { id: 'PLAN', title: 'OKR及项目管理', icon: '🎯', color: 'bg-[#4d3a5a]' },
  { id: 'DO', title: '执行', icon: '📝', color: 'bg-[#613241]' },
  { id: 'KNOWLEDGE', title: '知识管理', icon: '📚', color: 'bg-[#544627]' },
  { id: 'CHECK', title: '回顾纠偏', icon: '📍', color: 'bg-[#5c3127]' },
] as const;

export const Sop = () => {
  const { state, addTask, updateTask, deleteTask } = useEnergy();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tasks = state.tasks || [];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('taskId');
    if (id) {
      updateTask(id, { status: status as any });
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = (id: string) => {
    if (editTitle.trim()) {
      updateTask(id, { title: editTitle.trim() });
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') saveEdit(id);
    if (e.key === 'Escape') setEditingId(null);
  };

  const handleAddTask = (status: string) => {
    addTask({
      title: '新任务',
      energyRequired: 3,
      category: '日常',
      status: status as any,
      cognitiveLoad: '中',
      startupDifficulty: '需要仪式感',
      suitableEnergyState: '稳定'
    } as any);
  };

  const getCognitiveColor = (level: string) => {
    switch (level) {
      case '低': return 'text-green-400 bg-green-400/10';
      case '中': return 'text-yellow-400 bg-yellow-400/10';
      case '高': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col space-y-6 text-gray-100 font-sans">
      <div className="flex items-center justify-between">
        <div className="bg-[#4d3a5a] px-4 py-2 text-xl font-bold tracking-wider text-[#eadbf2] rounded-sm flex items-center space-x-2">
          <span>SOP 执行引擎</span>
          <span className="text-xs font-normal opacity-70 ml-2 border border-[#eadbf2]/30 px-2 py-0.5 rounded">PDCA</span>
        </div>
        <div className="text-sm text-gray-400 hidden md:block">
          通过拖拽流转任务卡片，降低决策负荷
        </div>
      </div>

      <div className="flex-1 flex overflow-x-auto pb-4 gap-4 snap-x">
        {COLUMNS.map(col => {
          const columnTasks = tasks.filter(t => (t.status || 'INBOX') === col.id);
          
          return (
            <div 
              key={col.id}
              className="flex-shrink-0 w-80 bg-[#1e1e1e] border border-[#333] rounded-lg flex flex-col snap-center"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className={`px-4 py-3 border-b border-[#333] rounded-t-lg flex items-center justify-between ${col.color} bg-opacity-20`}>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{col.icon}</span>
                  <h3 className="font-bold tracking-wide">{col.title}</h3>
                </div>
                <span className="text-xs bg-black/40 px-2 py-1 rounded-full text-gray-300 font-medium">
                  {columnTasks.length}
                </span>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-3 min-h-[300px]">
                {columnTasks.map(task => (
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="bg-[#2a2a2a] p-3 rounded-md border border-[#444] cursor-grab active:cursor-grabbing hover:border-gray-500 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 mr-2">
                        {editingId === task.id ? (
                          <input 
                            autoFocus
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            onBlur={() => saveEdit(task.id)}
                            onKeyDown={(e) => handleKeyDown(e, task.id)}
                            className="w-full bg-[#1a1a1a] border border-blue-500/50 rounded px-2 py-1 text-sm text-white focus:outline-none"
                          />
                        ) : (
                          <div 
                            className="text-sm font-medium text-gray-200 cursor-text"
                            onClick={() => startEdit(task)}
                          >
                            {task.title}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedTask(task)}
                          className="text-gray-500 hover:text-blue-400 p-1 rounded hover:bg-[#333]"
                        >
                          <Settings2 size={14} />
                        </button>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-500 hover:text-red-400 p-1 rounded hover:bg-[#333]"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="flex items-center space-x-1 text-[10px] px-1.5 py-0.5 bg-[#333] text-gray-300 rounded">
                        <Zap size={10} className="text-yellow-500" />
                        <span>耗能 {task.energyRequired}</span>
                      </span>
                      {task.cognitiveLoad && (
                        <span className={`flex items-center space-x-1 text-[10px] px-1.5 py-0.5 rounded ${getCognitiveColor(task.cognitiveLoad)}`}>
                          <BrainCircuit size={10} />
                          <span>认知:{task.cognitiveLoad}</span>
                        </span>
                      )}
                      {task.startupDifficulty === '轻松启动' && (
                        <span className="flex items-center space-x-1 text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded">
                          <Sparkles size={10} />
                          <span>轻松启动</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => handleAddTask(col.id)}
                  className="w-full py-2 flex items-center justify-center space-x-1 text-sm text-gray-500 hover:text-gray-300 hover:bg-[#333] rounded transition-colors border border-dashed border-[#444] hover:border-gray-500"
                >
                  <Plus size={16} />
                  <span>添加任务</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTask(null)}>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1e1e1e] border border-[#333] p-6 rounded-xl w-full max-w-md shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-100 flex items-center"><Settings2 className="mr-2 text-blue-400" /> 能量维度标注</h3>
              <button onClick={() => setSelectedTask(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">认知负荷 (Cognitive Load)</label>
                <div className="flex space-x-2">
                  {['低', '中', '高'].map(level => (
                    <button
                      key={level}
                      onClick={() => {
                        updateTask(selectedTask.id, { cognitiveLoad: level as any });
                        setSelectedTask({ ...selectedTask, cognitiveLoad: level as any });
                      }}
                      className={`flex-1 py-1.5 rounded text-sm border ${selectedTask.cognitiveLoad === level ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'border-[#444] text-gray-400 hover:bg-[#333]'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">启动难度 (Startup Difficulty)</label>
                <div className="flex space-x-2">
                  {['轻松启动', '需要仪式感'].map(level => (
                    <button
                      key={level}
                      onClick={() => {
                        updateTask(selectedTask.id, { startupDifficulty: level as any });
                        setSelectedTask({ ...selectedTask, startupDifficulty: level as any });
                      }}
                      className={`flex-1 py-1.5 rounded text-sm border ${selectedTask.startupDifficulty === level ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'border-[#444] text-gray-400 hover:bg-[#333]'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">适配能量状态 (Suitable Energy)</label>
                <div className="flex space-x-2">
                  {['低能量可做', '稳定', '峰值'].map(level => (
                    <button
                      key={level}
                      onClick={() => {
                        updateTask(selectedTask.id, { suitableEnergyState: level as any });
                        setSelectedTask({ ...selectedTask, suitableEnergyState: level as any });
                      }}
                      className={`flex-1 py-1.5 rounded text-sm border ${selectedTask.suitableEnergyState === level ? 'bg-green-500/20 border-green-500 text-green-300' : 'border-[#444] text-gray-400 hover:bg-[#333]'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">绝对耗能值 (1-5)</label>
                <input 
                  type="range" min="1" max="5" 
                  value={selectedTask.energyRequired || 3}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateTask(selectedTask.id, { energyRequired: val });
                    setSelectedTask({ ...selectedTask, energyRequired: val });
                  }}
                  className="w-full accent-yellow-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 (极低)</span><span>2</span><span>3</span><span>4</span><span>5 (极高)</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedTask(null)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-colors font-medium"
            >
              完成
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};