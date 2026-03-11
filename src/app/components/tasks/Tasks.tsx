import React, { useState, useMemo } from "react";
import { useEnergy } from "../../context/EnergyContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { CheckSquare, Plus, Brain, Zap, Clock, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";

export function Tasks() {
  const { tasks, toggleTask, addTask, currentEnergy } = useEnergy();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [cognitiveLoad, setCognitiveLoad] = useState<"low"|"medium"|"high">("medium");
  const [startupDifficulty, setStartupDifficulty] = useState<"easy"|"ritual">("easy");
  const [suitableEnergy, setSuitableEnergy] = useState<"low"|"stable"|"peak">("stable");
  const [smartSort, setSmartSort] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title, cognitiveLoad, startupDifficulty, suitableEnergy });
    setTitle("");
    setIsAdding(false);
  };

  const COG_LOAD_MAP = { low: "低耗能", medium: "中耗能", high: "高耗能" };
  const DIFF_MAP = { easy: "极简启动", ritual: "需仪式感" };
  const ENERGY_MAP = { low: "低能量", stable: "平稳态", peak: "高能态" };

  const displayTasks = useMemo(() => {
    if (!smartSort || currentEnergy === null) return tasks;

    // Map current energy to suitable categories
    let currentCategory: "low" | "stable" | "peak" = "stable";
    if (currentEnergy <= 2) currentCategory = "low";
    else if (currentEnergy === 5) currentCategory = "peak";

    // Score tasks based on fit with current energy
    const scoredTasks = tasks.map(task => {
      let score = 0;
      if (task.status === "done") score -= 100;
      
      // Match energy
      if (task.suitableEnergy === currentCategory) score += 10;
      else if (currentCategory === "low" && task.suitableEnergy !== "low") score -= 10; // Penalize hard tasks when low energy
      else if (currentCategory === "peak" && task.suitableEnergy === "low") score -= 2; // Slight penalty for easy tasks when peak (do hard things first)

      // Map cognitive load
      if (currentCategory === "low" && task.cognitiveLoad === "low") score += 5;
      if (currentCategory === "peak" && task.cognitiveLoad === "high") score += 5;

      return { task, score };
    });

    return scoredTasks.sort((a, b) => b.score - a.score).map(t => t.task);
  }, [tasks, smartSort, currentEnergy]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">任务管理</h1>
        <p className="text-slate-500">基于 ND/HSP 能量感知的任务排序系统。</p>
      </div>

      <div className="flex justify-between items-center">
        <Button 
          variant={smartSort ? "default" : "outline"} 
          className={cn("gap-2", smartSort ? "bg-amber-500 hover:bg-amber-600 text-white border-none" : "")}
          onClick={() => setSmartSort(!smartSort)}
        >
          <Sparkles className="w-4 h-4"/> 
          {smartSort ? "智能推荐中" : "按能量推荐"}
        </Button>
        <Button onClick={() => setIsAdding(!isAdding)} className="gap-2">
          {isAdding ? "取消" : <><Plus className="w-4 h-4"/> 添加任务</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-indigo-200 bg-indigo-50/30">
          <CardContent className="p-6">
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">任务名称</label>
                <input 
                  type="text" 
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                  placeholder="例如：整理上周的会议纪要..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
                    <Brain className="w-4 h-4 text-slate-500" /> 认知负荷
                  </label>
                  <div className="flex gap-2">
                    {(["low", "medium", "high"] as const).map(v => (
                      <button type="button" key={v} onClick={() => setCognitiveLoad(v)} className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg border", cognitiveLoad === v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}>
                        {COG_LOAD_MAP[v]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
                    <Clock className="w-4 h-4 text-slate-500" /> 启动难度
                  </label>
                  <div className="flex gap-2">
                    {(["easy", "ritual"] as const).map(v => (
                      <button type="button" key={v} onClick={() => setStartupDifficulty(v)} className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg border", startupDifficulty === v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}>
                        {DIFF_MAP[v]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
                    <Zap className="w-4 h-4 text-slate-500" /> 所需能量区间
                  </label>
                  <div className="flex gap-2">
                    {(["low", "stable", "peak"] as const).map(v => (
                      <button type="button" key={v} onClick={() => setSuitableEnergy(v)} className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg border", suitableEnergy === v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}>
                        {ENERGY_MAP[v]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit">保存任务</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {smartSort && currentEnergy !== null && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-900">智能推荐已开启</h3>
            <p className="text-sm text-amber-700">当前您的能量水平为 {currentEnergy}/5。已为您重新排序，优先展示最适合当前能量的任务。</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <CheckSquare className="w-5 h-5" />
             所有任务
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
             {displayTasks.map((task) => (
                <div key={task.id} onClick={() => toggleTask(task.id)} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                      task.status === "done" ? "bg-indigo-500 border-indigo-500" : "border-slate-300 group-hover:border-indigo-400"
                    )}>
                      {task.status === "done" && <CheckSquare className="w-3 h-3 text-white" />}
                    </div>
                    <span className={cn("font-medium", task.status === "done" && "line-through text-slate-400")}>{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-80 hidden sm:flex">
                     <span className={cn("px-2 py-1 text-[10px] font-bold rounded", task.cognitiveLoad === "high" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600")}>
                       {COG_LOAD_MAP[task.cognitiveLoad]}
                     </span>
                     <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">{DIFF_MAP[task.startupDifficulty]}</span>
                     <span className={cn("px-2 py-1 text-[10px] font-bold rounded", task.suitableEnergy === "peak" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600")}>
                       {ENERGY_MAP[task.suitableEnergy]}要求
                     </span>
                  </div>
                </div>
             ))}
             {displayTasks.length === 0 && (
               <p className="text-center py-8 text-slate-400">目前没有任务，去休息一下吧！</p>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}