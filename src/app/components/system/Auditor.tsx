import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Network, ArrowRight, Package, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "../../lib/utils";

const DECISION_TREE = {
  question: "你想要记录什么？",
  options: [
    {
      label: "一个待办任务",
      next: {
        question: "它是一个多步骤的项目，还是一个单一的行动？",
        options: [
          { label: "单一行动", result: "GTD 任务管理（添加能量维度）" },
          { label: "多步骤", result: "项目管理" }
        ]
      }
    },
    {
      label: "我学到/读到的东西",
      result: "R.I.A. 阅读与知识系统"
    },
    {
      label: "一个习惯或日常惯例",
      result: "LIFEMATRICES 日常打卡表"
    },
    {
      label: "我现在的感受或状态",
      next: {
        question: "这是一次普通的签到，还是突发的崩溃/严重耗能？",
        options: [
          { label: "普通的能量签到", result: "能量追踪器 (Check-in)" },
          { label: "突发崩溃/重度耗能", result: "SOS 感官急救 / 记录耗能事件" }
        ]
      }
    }
  ]
};

export function Auditor() {
  const [history, setHistory] = useState<any[]>([DECISION_TREE]);
  const [activeTab, setActiveTab] = useState("tree");

  const currentStep = history[history.length - 1];

  const handleSelect = (option: any) => {
    if (option.next) {
      setHistory([...history, option.next]);
    } else if (option.result) {
      setHistory([...history, { result: option.result }]);
    }
  };

  const reset = () => setHistory([DECISION_TREE]);

  const MODULES = [
    { name: "能量追踪器", priority: "Daily", status: "active", description: "多时段能量签到与数据复盘" },
    { name: "今日看板", priority: "Daily", status: "active", description: "快速签到与任务推荐" },
    { name: "任务管理", priority: "Daily", status: "active", description: "基于能量感知的任务排序" },
    { name: "SOS 感官急救", priority: "As-Needed", status: "active", description: "紧急状态恢复协议与触发源记录" },
    { name: "系统审计", priority: "Occasional", status: "active", description: "决策树与模块审查，降低认知摩擦" },
  ];

  const renderModuleReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-emerald-100 bg-emerald-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              日常维护 (Daily)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MODULES.filter(m => m.priority === "Daily").map((mod, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-emerald-100">
                <span className="text-sm font-medium text-slate-700">{mod.name}</span>
                <span className="text-xs text-emerald-600 font-semibold">DAILY</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-blue-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              按需使用 (As-Needed)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MODULES.filter(m => m.priority !== "Daily").map((mod, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-100">
                <span className="text-sm font-medium text-slate-700">{mod.name}</span>
                <span className="text-xs text-blue-600 font-semibold uppercase">{mod.priority}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-100 bg-amber-50/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            系统健康报告
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-800">未发现重复模块</p>
              <p className="text-xs text-slate-500 mt-1">所有模块均有唯一且明确的功能边界</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-800">清晰的导航结构</p>
              <p className="text-xs text-slate-500 mt-1">4 个主要页面 + 1 个紧急救援页面</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-800">云端数据同步</p>
              <p className="text-xs text-slate-500 mt-1">已接入 Supabase，实现跨设备状态持久化</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">系统审计</h1>
        <p className="text-slate-500">减少认知摩擦。不知道记在哪里时，请使用决策树。</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tree">录入决策树</TabsTrigger>
          <TabsTrigger value="report">模块审查报告</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tree" className="mt-6">
          <Card className="border-indigo-100 shadow-sm">
            <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
              <CardTitle className="flex items-center gap-2 text-indigo-950">
                 <Network className="w-5 h-5 text-indigo-500" />
                 录入决策树
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 min-h-[300px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {currentStep.result ? (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center p-4 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                      <ArrowRight className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl text-slate-600">你应该把它记录在：</h3>
                    <div className="text-3xl font-black text-slate-900">{currentStep.result}</div>
                    <div className="pt-8">
                      <Button variant="outline" onClick={reset}>重新开始</Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="question" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-lg space-y-6">
                    <h3 className="text-2xl font-bold text-center text-slate-800">{currentStep.question}</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {currentStep.options.map((opt: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleSelect(opt)}
                          className="p-4 text-left rounded-xl border-2 border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all font-medium text-slate-700"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
            {history.length > 1 && (
                      <div className="text-center pt-4">
                        <button onClick={() => setHistory(history.slice(0, -1))} className="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-2">
                          返回上一步
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="mt-6">
          {renderModuleReport()}
        </TabsContent>
      </Tabs>
    </div>
  );
}