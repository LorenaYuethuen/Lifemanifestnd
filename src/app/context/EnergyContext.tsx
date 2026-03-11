import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface Trigger {
  id: string;
  type: 'drain' | 'boost';
  source: string;
  intensity: number; // 1-3
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  energyRequired: number; // 1-5 (1=low, 5=high)
  category: string;
  completed: boolean;
  status: 'INBOX' | 'PLAN' | 'DO' | 'KNOWLEDGE' | 'CHECK';
  cognitiveLoad: '低' | '中' | '高';
  startupDifficulty: '轻松启动' | '需要仪式感';
  suitableEnergyState: '峰值' | '稳定' | '低能量可做';
}

interface EnergyState {
  level: EnergyLevel;
  triggers: Trigger[];
  tasks: Task[];
  lastCheckIn: number;
}

interface EnergyContextType {
  state: EnergyState;
  setLevel: (level: EnergyLevel) => void;
  addTrigger: (trigger: Omit<Trigger, 'id' | 'timestamp'>) => void;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  deleteTrigger: (id: string) => void;
  isSyncing: boolean;
}

const defaultState: EnergyState = {
  level: 3,
  triggers: [],
  tasks: [
    { id: '1', title: '深呼吸5分钟', energyRequired: 1, category: '恢复', completed: false, status: 'DO', cognitiveLoad: '低', startupDifficulty: '轻松启动', suitableEnergyState: '低能量可做' },
    { id: '2', title: '听白噪音闭目养神', energyRequired: 1, category: '恢复', completed: false, status: 'DO', cognitiveLoad: '低', startupDifficulty: '轻松启动', suitableEnergyState: '低能量可做' },
    { id: '3', title: '回复简单的消息', energyRequired: 2, category: '工作', completed: false, status: 'INBOX', cognitiveLoad: '低', startupDifficulty: '轻松启动', suitableEnergyState: '稳定' },
    { id: '4', title: '整理书桌', energyRequired: 3, category: '日常', completed: false, status: 'PLAN', cognitiveLoad: '中', startupDifficulty: '需要仪式感', suitableEnergyState: '稳定' },
    { id: '5', title: '完成项目计划', energyRequired: 5, category: '工作', completed: false, status: 'PLAN', cognitiveLoad: '高', startupDifficulty: '需要仪式感', suitableEnergyState: '峰值' },
  ],
  lastCheckIn: Date.now(),
};

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const EnergyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EnergyState>(defaultState);
  const [isSyncing, setIsSyncing] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const fetchState = async () => {
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2b74d895/sync`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setState({
            ...defaultState,
            ...json.data,
            // Merge default tasks if none exist
            tasks: json.data.tasks?.length ? json.data.tasks : defaultState.tasks
          });
        }
      }
    } catch (e) {
      console.error('Failed to load energy state:', e);
    } finally {
      setInitialLoaded(true);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const syncState = useCallback(async (newState: EnergyState) => {
    setIsSyncing(true);
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2b74d895/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: newState })
      });
    } catch (e) {
      console.error('Failed to sync energy state:', e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const updateState = (updater: (prev: EnergyState) => EnergyState) => {
    setState(prev => {
      const next = updater(prev);
      syncState(next);
      return next;
    });
  };

  const setLevel = (level: EnergyLevel) => {
    updateState(prev => ({ ...prev, level, lastCheckIn: Date.now() }));
  };

  const addTrigger = (trigger: Omit<Trigger, 'id' | 'timestamp'>) => {
    const newTrigger: Trigger = {
      ...trigger,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now()
    };
    updateState(prev => ({ ...prev, triggers: [newTrigger, ...prev.triggers] }));
  };

  const deleteTrigger = (id: string) => {
    updateState(prev => ({ ...prev, triggers: prev.triggers.filter(t => t.id !== id) }));
  };

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      completed: false
    };
    updateState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const toggleTask = (id: string) => {
    updateState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    updateState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const deleteTask = (id: string) => {
    updateState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  return (
    <EnergyContext.Provider value={{ state, setLevel, addTrigger, deleteTrigger, addTask, updateTask, toggleTask, deleteTask, isSyncing }}>
      {initialLoaded ? children : <div className="min-h-screen bg-[#191919] flex items-center justify-center text-white">正在同步您的云端能量状态...</div>}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (context === undefined) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
};
