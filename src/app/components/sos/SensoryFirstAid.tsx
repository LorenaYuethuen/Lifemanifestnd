import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Play, Pause, RotateCcw, ShieldAlert, Ear, Wind, EyeOff, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/Button";
import { useEnergy } from "../../context/EnergyContext";
import { cn } from "../../lib/utils";

const RECOVERY_PROTOCOLS = {
  mild: {
    title: "轻度超载",
    time: 15, // mins
    activities: ["喝一杯冷水", "进行盒式呼吸 (4-4-4-4)", "听棕式噪音或白噪音"],
    color: "bg-amber-500",
  },
  moderate: {
    title: "中度超载",
    time: 30, // mins
    activities: ["在黑暗的房间躺下", "戴上降噪耳机", "深压觉放松（使用加重毯）", "取消下一个低优先级的任务"],
    color: "bg-orange-500",
  },
  severe: {
    title: "重度超载",
    time: 60, // mins
    activities: ["立刻阻断所有感官输入", "清空今天剩余的所有任务", "保持非语言状态（不说话）", "平躺休息或睡觉"],
    color: "bg-rose-600",
  }
};

export function SensoryFirstAid() {
  const [step, setStep] = useState<"crash-sop" | "severity-select" | "timer" | "trigger-record">("crash-sop");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("moderate");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [triggerCategory, setTriggerCategory] = useState<"sensory" | "emotional" | "social" | "cognitive" | "environmental">("sensory");
  const [triggerDescription, setTriggerDescription] = useState("");

  const { addTriggerRecord } = useEnergy();
  const navigate = useNavigate();

  React.useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Crash Prevention SOP - 3 Simple Steps
  const renderSOP = () => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12"
    >
      <div className="space-y-4">
        <ShieldAlert className="w-20 h-20 text-rose-500 mx-auto" />
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">感官急救协议 (SOS)</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {[
          { icon: Wind, title: "1. 离开", desc: "立刻物理离开当前环境，寻找安全角落。" },
          { icon: Ear, title: "2. 阻断", desc: "戴上降噪耳机或耳塞，切断听觉输入。" },
          { icon: EyeOff, title: "3. 避光", desc: "闭上眼睛或寻找黑暗安静的空间。" },
        ].map((item, i) => (
          <div key={i} className="bg-slate-100 p-8 rounded-3xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <item.icon className="w-8 h-8 text-slate-700" />
            </div>
            <h2 className="text-2xl font-bold">{item.title}</h2>
            <p className="text-slate-600 font-medium">{item.desc}</p>
          </div>
        ))}
      </div>

      <Button size="lg" className="h-16 px-12 text-xl rounded-2xl bg-slate-900 hover:bg-slate-800" onClick={() => setStep("severity-select")}>
        我已安全，开始恢复协议
      </Button>
    </motion.div>
  );

  const renderSeveritySelect = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto w-full space-y-8"
    >
      <h2 className="text-3xl font-bold text-center">评估当前的超载严重程度</h2>
      
      <div className="flex flex-col gap-4 w-full">
        {(Object.keys(RECOVERY_PROTOCOLS) as Array<keyof typeof RECOVERY_PROTOCOLS>).map(level => (
          <button
            key={level}
            onClick={() => {
              setSeverity(level);
              setTimeLeft(RECOVERY_PROTOCOLS[level].time * 60);
              setStep("timer");
            }}
            className={`p-6 rounded-2xl text-white font-bold text-xl md:text-2xl text-left flex justify-between items-center transition-transform hover:scale-[1.02] active:scale-95 ${RECOVERY_PROTOCOLS[level].color}`}
          >
            <span>{RECOVERY_PROTOCOLS[level].title}</span>
            <span className="text-white/80 text-lg">{RECOVERY_PROTOCOLS[level].time} 分钟恢复</span>
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderTimer = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const p = RECOVERY_PROTOCOLS[severity];

    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center min-h-[80vh] justify-center max-w-3xl mx-auto w-full space-y-12"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-500 tracking-widest">{p.title} 恢复中</h2>
          <div className="text-[120px] leading-none font-black text-slate-900 tracking-tighter tabular-nums">
            {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg" variant={isActive ? "outline" : "default"} className="h-16 w-32 rounded-2xl text-xl" onClick={() => setIsActive(!isActive)}>
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </Button>
          <Button size="lg" variant="secondary" className="h-16 w-16 rounded-2xl" onClick={() => setTimeLeft(p.time * 60)}>
            <RotateCcw className="w-6 h-6" />
          </Button>
        </div>

        <div className="w-full bg-slate-100 p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 text-center text-slate-700">恢复建议</h3>
          <ul className="space-y-4 text-xl font-medium text-slate-600 text-center">
            {p.activities.map((act, i) => (
              <li key={i}>{act}</li>
            ))}
          </ul>
        </div>
        
        {timeLeft === 0 && !isActive && (
           <div className="flex flex-col gap-4">
             <Button variant="outline" size="lg" onClick={() => setStep("trigger-record")}>
               <FileText className="w-5 h-5 mr-2" />
               记录导致超载的原因
             </Button>
             <Button size="lg" onClick={() => navigate('/')}>
               跳过并返回首页
             </Button>
           </div>
        )}
      </motion.div>
    );
  };

  const renderTriggerRecord = () => {
    const TRIGGER_CATEGORIES = [
      { value: "sensory", label: "感官触发", desc: "噪音、强光、不适的纹理、刺鼻气味" },
      { value: "emotional", label: "情绪触发", desc: "冲突、压力、过度共情、强烈情感" },
      { value: "social", label: "社交触发", desc: "人群密集、闲聊、社交场合" },
      { value: "cognitive", label: "认知触发", desc: "需要做太多决定、信息过载" },
      { value: "environmental", label: "环境触发", desc: "温度不适、空间拥挤、杂乱" },
    ] as const;

    const handleSave = () => {
      addTriggerRecord({
        triggerCategory,
        description: triggerDescription || undefined,
        severity,
        recoveryProtocol: `${RECOVERY_PROTOCOLS[severity].title} (${RECOVERY_PROTOCOLS[severity].time}分钟)`
      });
      setTriggerDescription("");
      navigate('/');
    };

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto w-full space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">记录触发源</h2>
          <p className="text-slate-500">记录是什么导致了这次崩溃，帮助识别耗能模式。</p>
        </div>
        
        <div className="w-full space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">是什么导致了这次超载？</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TRIGGER_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setTriggerCategory(cat.value)}
                  className={cn(
                    "flex flex-col items-start gap-1 p-4 rounded-xl border-2 transition-all text-left",
                    triggerCategory === cat.value
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <span className={cn("font-semibold", triggerCategory === cat.value ? "text-indigo-900" : "text-slate-700")}>
                    {cat.label}
                  </span>
                  <span className="text-xs text-slate-500">{cat.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">补充细节（选填）</label>
            <textarea
              value={triggerDescription}
              onChange={(e) => setTriggerDescription(e.target.value)}
              placeholder="例如：会议室的荧光灯太亮了，而且大家都在同时说话..."
              className="w-full min-h-[100px] px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" size="lg" className="flex-1" onClick={() => navigate('/')}>
              跳过
            </Button>
            <Button size="lg" className="flex-1" onClick={handleSave}>
              保存并返回
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-6 md:p-12">
      <Link to="/" className="absolute top-6 left-6 p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
        <ArrowLeft className="w-6 h-6 text-slate-700" />
      </Link>

      <AnimatePresence mode="wait">
        {step === "crash-sop" && <div key="sop">{renderSOP()}</div>}
        {step === "severity-select" && <div key="sev">{renderSeveritySelect()}</div>}
        {step === "timer" && <div key="timer">{renderTimer()}</div>}
        {step === "trigger-record" && <div key="trigger">{renderTriggerRecord()}</div>}
      </AnimatePresence>
    </div>
  );
}