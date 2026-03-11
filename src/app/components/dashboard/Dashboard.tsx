import React, { useState } from "react";
import { useEnergy, EnergyLevel } from "../../context/EnergyContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryWarning, CheckCircle2, Zap, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import { DrainEventDialog } from "../energy/DrainEventDialog";

const ENERGY_ICONS = {
  1: { icon: BatteryWarning, color: "text-rose-500", bg: "bg-rose-100", label: "Critically Low" },
  2: { icon: BatteryLow, color: "text-orange-500", bg: "bg-orange-100", label: "Low" },
  3: { icon: BatteryMedium, color: "text-amber-500", bg: "bg-amber-100", label: "Stable" },
  4: { icon: BatteryFull, color: "text-emerald-500", bg: "bg-emerald-100", label: "Good" },
  5: { icon: Zap, color: "text-indigo-500", bg: "bg-indigo-100", label: "Peak" },
};

export function Dashboard() {
  const { currentEnergy, addLog, tasks, toggleTask } = useEnergy();
  const [selectedTime, setSelectedTime] = useState<"morning" | "noon" | "afternoon" | "evening">("morning");
  const [drainDialogOpen, setDrainDialogOpen] = useState(false);

  // Determine which tasks to show based on energy
  const getMatchedTasks = () => {
    if (!currentEnergy) return tasks.slice(0, 3); // default

    if (currentEnergy <= 2) {
      return tasks.filter(t => t.suitableEnergy === "low" && t.startupDifficulty === "easy");
    }
    if (currentEnergy === 3) {
      return tasks.filter(t => t.suitableEnergy === "low" || t.suitableEnergy === "stable");
    }
    // 4 or 5
    const highLoad = tasks.filter(t => t.cognitiveLoad === "high");
    const others = tasks.filter(t => t.cognitiveLoad !== "high");
    return [...highLoad, ...others];
  };

  const matchedTasks = getMatchedTasks().filter(t => t.status === "todo");

  const handleCheckIn = (level: EnergyLevel) => {
    addLog(level, selectedTime);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Today</h1>
        <p className="text-slate-500">{format(new Date(), "EEEE, MMMM do, yyyy")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column - Energy Checkin */}
        <div className="md:col-span-7 space-y-6">
          <Card className="border-indigo-100 shadow-sm overflow-hidden">
            <div className="bg-indigo-50/50 p-6 border-b border-indigo-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg text-indigo-950 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  Energy Check-In
                </h2>
                <p className="text-sm text-indigo-700/70 mt-1">How is your sensory & cognitive battery right now?</p>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
                {(["morning", "noon", "afternoon", "evening"] as const).map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-all",
                      selectedTime === time ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-3">
                {([1, 2, 3, 4, 5] as EnergyLevel[]).map(level => {
                  const { icon: Icon, color, bg, label } = ENERGY_ICONS[level];
                  return (
                    <button
                      key={level}
                      onClick={() => handleCheckIn(level)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-95",
                        currentEnergy === level ? `border-${color.split('-')[1]}-400 ${bg}` : "border-slate-100 hover:border-slate-200 bg-white"
                      )}
                    >
                      <div className={cn("p-3 rounded-full", bg, color)}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 text-center">{label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick drain event log */}
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Log a drain event</h3>
                  <p className="text-xs text-slate-500">Just experienced sensory overload or heavy drain?</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setDrainDialogOpen(true)}>Log Event</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Task Matcher */}
        <div className="md:col-span-5 space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                Energy-Matched Tasks
              </CardTitle>
              <CardDescription>
                {currentEnergy === null ? "Check in to get task recommendations." :
                 currentEnergy <= 2 ? "Low energy mode. Light tasks only." :
                 currentEnergy === 3 ? "Stable energy. Balanced tasks." :
                 "Peak energy! Tackle high cognitive load tasks now."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3">
              {currentEnergy && currentEnergy <= 2 && matchedTasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mb-3 opacity-50" />
                  <p className="text-sm font-medium text-slate-700">No suitable tasks.</p>
                  <p className="text-xs text-slate-500 mt-1">Please rest and initiate recovery protocol.</p>
                  <Button variant="outline" size="sm" className="mt-4">Go to First Aid</Button>
                </div>
              ) : (
                matchedTasks.map((task, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                      task.status === "done" ? "bg-indigo-500 border-indigo-500" : "border-slate-300 group-hover:border-indigo-400"
                    )}>
                      {task.status === "done" && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium", task.status === "done" ? "line-through text-slate-400" : "text-slate-700")}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-medium",
                          task.cognitiveLoad === "high" ? "bg-rose-100 text-rose-700" :
                          task.cognitiveLoad === "medium" ? "bg-amber-100 text-amber-700" :
                          "bg-emerald-100 text-emerald-700"
                        )}>
                          {task.cognitiveLoad} load
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {task.startupDifficulty === "ritual" ? "Needs Ritual" : "Easy Start"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Drain Event Dialog */}
      <DrainEventDialog open={drainDialogOpen} onOpenChange={setDrainDialogOpen} />
    </div>
  );
}

// Quick helper
function Activity({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
}