import React, { useMemo } from "react";
import { useEnergy } from "../../context/EnergyContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { format, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Activity, Droplets, AlertCircle } from "lucide-react";

const TIME_OF_DAY_MAP = {
  morning: "早晨",
  noon: "中午",
  afternoon: "下午",
  evening: "晚间"
};

const CATEGORY_MAP: Record<string, string> = {
  social: "社交",
  sensory: "感官",
  cognitive: "认知",
  emotional: "情绪",
  physical: "身体",
  environmental: "环境"
};

export function EnergyTracker() {
  const { logs, drainEvents, triggerRecords } = useEnergy();

  const chartData = useMemo(() => {
    const dailyMap: Record<string, { date: string, total: number, count: number }> = {};
    
    logs.forEach(log => {
      if (!dailyMap[log.date]) {
        dailyMap[log.date] = { date: log.date, count: 0, total: 0 };
      }
      dailyMap[log.date].total += log.level;
      dailyMap[log.date].count += 1;
    });

    return Object.values(dailyMap)
      .map(d => ({ ...d, id: `chart-${d.date}`, avg: Number((d.total / d.count).toFixed(1)) }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7); // Last 7 days
  }, [logs]);

  const drainPattern = useMemo(() => {
    const counts: Record<string, number> = { social: 0, sensory: 0, cognitive: 0, emotional: 0, physical: 0 };
    drainEvents.forEach(e => { if (e.category in counts) counts[e.category]++; });
    return Object.entries(counts)
      .map(([name, count]) => ({ id: `drain-${name}`, name: CATEGORY_MAP[name] || name, count }))
      .filter(d => d.count > 0);
  }, [drainEvents]);

  const triggerPattern = useMemo(() => {
    const counts: Record<string, number> = { sensory: 0, emotional: 0, social: 0, cognitive: 0, environmental: 0 };
    triggerRecords.forEach(e => {
      if (e.triggerCategory in counts) counts[e.triggerCategory]++;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ id: `trigger-${name}`, name: CATEGORY_MAP[name] || name, count }))
      .filter(d => d.count > 0);
  }, [triggerRecords]);

  const COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#eab308', '#a855f7'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">能量分析与复盘</h1>
        <p className="text-slate-500">追踪历史数据与耗能模式，帮助调整日常节奏。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              7天平均能量趋势
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid key="grid-line" strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis key="xaxis-line" dataKey="date" tickFormatter={(val) => format(parseISO(val), 'M月d日')} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis key="yaxis-line" domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  key="tooltip-line"
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelFormatter={(val) => format(parseISO(val), 'MMMdo eeee', { locale: zhCN })}
                />
                <Line key="line-avg" type="monotone" dataKey="avg" name="平均能量" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff"}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-rose-500" />
              耗能事件分布
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            {drainPattern.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={drainPattern} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                  <CartesianGrid key="grid-bar" strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis key="xaxis-bar" dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis key="yaxis-bar" allowDecimals={false} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip key="tooltip-bar" cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar key="bar-drain" dataKey="count" name="次数" fill="#f43f5e" radius={[4, 4, 0, 0]}>
                    {drainPattern.map((entry) => (
                      <Cell key={entry.id} fill="#f43f5e" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm">暂无耗能事件记录。</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              感官触发源分布
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            {triggerPattern.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    key="pie-trigger"
                    data={triggerPattern}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#84cc16"
                    dataKey="count"
                    nameKey="name"
                  >
                    {triggerPattern.map((entry, index) => (
                      <Cell key={entry.id} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    key="tooltip-pie"
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm">暂无触发源记录。</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
             <CardTitle>近期记录</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-3">
               {logs.slice(-5).reverse().map(log => (
                 <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                   <div>
                     <p className="text-sm font-medium text-slate-700">{format(parseISO(log.date), 'M月d日')} - {TIME_OF_DAY_MAP[log.timeOfDay] || log.timeOfDay}</p>
                   </div>
                   <div className="flex items-center gap-1.5">
                     能量等级: <span className="font-bold">{log.level}/5</span>
                   </div>
                 </div>
               ))}
               {logs.length === 0 && (
                 <p className="text-slate-400 text-sm py-2">暂无记录。</p>
               )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}