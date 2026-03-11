import React, { useState, useMemo } from "react";
import { useEnergy, EnergyLevel } from "../../context/EnergyContext";
import { ENERGY_CONFIG, TIME_SLOTS } from "../../config/energyConfig";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { cn } from "../../lib/utils";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { DrainEventDialog } from "../energy/DrainEventDialog";
import { Link } from "react-router";

export function DashboardV2() {
  const { currentEnergy, addLog, tasks, toggleTask, logs } = useEnergy();
  const [drainDialogOpen, setDrainDialogOpen] = useState(false);

  // Get today's check-ins
  const todayCheckIns = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const todayLogs = logs.filter(log => log.date === today);
    const checkIns: Record<string, EnergyLevel> = {};
    todayLogs.forEach(log => {
      checkIns[log.timeOfDay] = log.level;
    });
    return checkIns;
  }, [logs]);

  const latestEnergy = currentEnergy;
  const energyCfg = latestEnergy ? ENERGY_CONFIG[latestEnergy] : null;

  // Determine which tasks to show based on energy
  const getMatchedTasks = () => {
    if (!latestEnergy) return tasks.slice(0, 3);

    if (latestEnergy <= 2) {
      return tasks.filter(t => t.suitableEnergy === "low" && t.startupDifficulty === "easy");
    }
    if (latestEnergy === 3) {
      return tasks.filter(t => t.suitableEnergy === "low" || t.suitableEnergy === "stable");
    }
    // 4 or 5
    const highLoad = tasks.filter(t => t.cognitiveLoad === "high");
    const others = tasks.filter(t => t.cognitiveLoad !== "high");
    return [...highLoad, ...others];
  };

  const matchedTasks = getMatchedTasks().filter(t => t.status === "todo");

  const handleCheckIn = (level: EnergyLevel, timeOfDay: typeof TIME_SLOTS[number]["key"]) => {
    addLog(level, timeOfDay);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 md:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="text-xs tracking-[0.15em] text-slate-400 uppercase font-medium">LIFE COMPASS</div>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-slate-900">能量感知系统</h1>
        <p className="text-sm text-slate-500">
          {format(new Date(), "yyyy年M月d日 EEEE", { locale: zhCN })}
        </p>
      </div>

      {/* Energy Status Banner */}
      {energyCfg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: energyCfg.bgColor }}
          className="rounded-2xl p-5 border-2 flex items-center justify-between"
          style={{ borderColor: energyCfg.color + "40" }}
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">{energyCfg.emoji}</div>
            <div>
              <div className="text-xs text-slate-600">当前能量</div>
              <div className="font-bold text-lg" style={{ color: energyCfg.color }}>
                {latestEnergy} · {energyCfg.label}
              </div>
            </div>
          </div>
          <Link to="/sos">
            <Button 
              size="sm" 
              className="bg-[#C85C45] hover:bg-[#B54C35] text-white animate-pulse"
            >
              🆘 急救
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Energy Check-in */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-serif text-xl font-semibold text-slate-900">今日能量签到</h2>
          
          {TIME_SLOTS.map(slot => {
            const checked = todayCheckIns[slot.key];
            const cfg = checked ? ENERGY_CONFIG[checked] : null;
            
            return (
              <Card key={slot.key} className="overflow-hidden">
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{slot.icon}</span>
                      <div>
                        <div className="font-semibold text-slate-900">{slot.label}</div>
                        <div className="text-xs text-slate-500">{slot.hours}</div>
                      </div>
                    </div>
                    {cfg && (
                      <div 
                        className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
                        style={{ background: cfg.bgColor, color: cfg.color }}
                      >
                        <span>{cfg.emoji}</span>
                        <span>{cfg.label}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {([1, 2, 3, 4, 5] as EnergyLevel[]).map(lv => {
                      const c = ENERGY_CONFIG[lv];
                      const sel = checked === lv;
                      
                      return (
                        <button
                          key={lv}
                          onClick={() => handleCheckIn(lv, slot.key)}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all hover:scale-105",
                            sel 
                              ? "border-current shadow-sm" 
                              : "border-slate-100 hover:border-slate-200"
                          )}
                          style={{
                            background: sel ? c.bgColor : "#F6F2EC",
                            color: sel ? c.color : "#C0B4AC",
                            borderColor: sel ? c.color : "transparent"
                          }}
                        >
                          <span className="text-xl">{c.emoji}</span>
                          <span className="text-xs font-semibold">{lv}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Today's Trend Chart */}
          {Object.keys(todayCheckIns).length > 0 && (
            <Card className="p-5">
              <div className="text-xs font-semibold text-slate-600 tracking-wider uppercase mb-4">
                今日走势
              </div>
              <div className="flex items-end h-24 gap-3">
                {TIME_SLOTS.map(slot => {
                  const lv = todayCheckIns[slot.key];
                  const cfg = lv ? ENERGY_CONFIG[lv] : null;
                  
                  return (
                    <div key={slot.key} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div
                        className="w-full rounded-lg transition-all duration-500 border-2"
                        style={{
                          height: lv ? `${(lv / 5) * 80}px` : "6px",
                          background: cfg ? cfg.bgColor : "#EDE8E0",
                          borderColor: cfg ? cfg.color : "#DDD8D0"
                        }}
                      />
                      <div className="text-xs text-slate-500 text-center">{slot.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Energy Warning */}
              {latestEnergy && latestEnergy <= 2 && (
                <div className="mt-4 bg-[#FDF0ED] rounded-xl p-4 border-l-4 border-[#C85C45]">
                  <div className="text-sm font-semibold text-[#C85C45] mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    能量预警
                  </div>
                  <div className="text-xs text-[#9A6258] mb-3">
                    能量处于危险水平，建议立即进入恢复模式。
                  </div>
                  <Link to="/sos">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-[#C85C45] border-[#C85C45] hover:bg-[#FDF0ED]"
                    >
                      前往急救包 →
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          )}

          {/* Quick drain event log */}
          <Card>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">记录耗能事件</h3>
                  <p className="text-xs text-slate-500">刚经历了感官过载或重度耗能？</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setDrainDialogOpen(true)}>
                记录事件
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: Task Matcher */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-slate-900">任务匹配</h2>
            {matchedTasks.length > 0 && (
              <div className="text-xs text-slate-500">{matchedTasks.length} 个适配</div>
            )}
          </div>

          {!latestEnergy ? (
            <Card className="p-12 text-center">
              <div className="text-5xl mb-4">🔋</div>
              <div className="font-semibold text-slate-900 mb-2">先完成一次能量签到</div>
              <div className="text-sm text-slate-600 leading-relaxed mb-6">
                系统需要了解你的当前状态，<br />才能推荐适合的任务。
              </div>
              <div className="text-xs text-slate-400">
                ↑ 在左侧选择时间段并签到
              </div>
            </Card>
          ) : (
            <>
              {latestEnergy >= 4 && (
                <div className="text-xs bg-[#E8F5EE] text-[#3D7A5A] px-4 py-2 rounded-lg">
                  ⚡ 能量峰值——高认知任务优先推荐
                </div>
              )}
              {latestEnergy <= 2 && (
                <div className="text-xs bg-[#FDF5EC] text-[#C4865A] px-4 py-2 rounded-lg">
                  🌧️ 低能量模式——只显示低启动阻力任务
                </div>
              )}

              {matchedTasks.length === 0 ? (
                <Card className="p-10 text-center">
                  <div className="text-4xl mb-3">🌱</div>
                  <div className="font-semibold text-slate-900 mb-2">当前无适配任务</div>
                  <div className="text-sm text-slate-600 mb-5">建议进入恢复模式。</div>
                  <Link to="/sos">
                    <Button className="bg-[#C85C45] hover:bg-[#B54C35]">
                      进入恢复模式
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-3">
                  {matchedTasks.map((task, i) => {
                    const done = task.status === "done";
                    const cogColors = {
                      low: ["#EFF7F1", "#5D8C6A"],
                      medium: ["#FDF5EC", "#C4865A"],
                      high: ["#FDF0ED", "#C85C45"]
                    };
                    const [cbg, ctxt] = cogColors[task.cognitiveLoad];

                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card className={cn("p-4 transition-opacity", done && "opacity-50")}>
                          <div className="flex items-start gap-3 mb-2">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                                done 
                                  ? "bg-[#5D8C6A] border-[#5D8C6A]" 
                                  : "border-slate-300 hover:border-slate-400"
                              )}
                            >
                              {done && <span className="text-white text-xs">✓</span>}
                            </button>
                            <div className="flex-1">
                              <div className={cn(
                                "font-medium text-sm",
                                done ? "line-through text-slate-500" : "text-slate-900"
                              )}>
                                {task.title}
                              </div>
                            </div>
                            <div
                              className="px-2 py-1 rounded-md text-xs font-semibold flex-shrink-0"
                              style={{ background: cbg, color: ctxt }}
                            >
                              {task.cognitiveLoad === "high" ? "高" : task.cognitiveLoad === "medium" ? "中" : "低"}负荷
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pl-8 text-xs text-slate-500">
                            <span className={task.startupDifficulty === "easy" ? "text-[#5D8C6A]" : "text-[#C4865A]"}>
                              {task.startupDifficulty === "easy" ? "▶ 可立即启动" : "🕯 需要仪式感"}
                            </span>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Energy Level Legend */}
      <Card className="p-5 bg-slate-50/50">
        <div className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-4">
          能量等级说明
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {([5, 4, 3, 2, 1] as EnergyLevel[]).map(lv => {
            const c = ENERGY_CONFIG[lv];
            return (
              <div key={lv} className="flex items-center gap-2">
                <span className="text-xl">{c.emoji}</span>
                <div>
                  <div className="font-semibold text-xs" style={{ color: c.color }}>
                    {lv} · {c.label}
                  </div>
                  <div className="text-xs text-slate-500">{c.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Drain Event Dialog */}
      <DrainEventDialog open={drainDialogOpen} onOpenChange={setDrainDialogOpen} />
    </div>
  );
}

// Helper component for Activity icon
function Activity({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  );
}
