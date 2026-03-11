这份需求文档写得非常专业。我来帮你把最核心的功能做成一个可交互原型——这样你在搭建Notion系统时有具体的参照物，也能验证交互逻辑是否符合你的真实使用感受。

```jsx
import { useState, useEffect, useRef } from "react";

const ENERGY_CONFIG = {
  1: { label: "极低", emoji: "🪫", color: "#C85C45", bgColor: "#FDF0ED", desc: "停止工作，进入恢复模式" },
  2: { label: "低", emoji: "🌧️", color: "#C4865A", bgColor: "#FDF5EC", desc: "仅做简单事，注意恢复" },
  3: { label: "稳定", emoji: "🌤️", color: "#A89040", bgColor: "#FDFAED", desc: "稳定运转，适合常规任务" },
  4: { label: "良好", emoji: "☀️", color: "#5D8C6A", bgColor: "#EFF7F1", desc: "正常执行，状态良好" },
  5: { label: "峰值", emoji: "⚡", color: "#3D7A5A", bgColor: "#E8F5EE", desc: "深度专注工作的黄金时段" },
};

const TIME_SLOTS = [
  { key: "晨间", icon: "🌅", hours: "06:00–09:00" },
  { key: "午间", icon: "🌞", hours: "11:00–13:00" },
  { key: "午后", icon: "🌥️", hours: "14:00–17:00" },
  { key: "晚间", icon: "🌙", hours: "19:00–22:00" },
];

const TASKS = [
  { id: 1, title: "整理神经美学内容草稿", cogLoad: "高", startup: "仪式", suitable: "峰值", project: "LNA实验室" },
  { id: 2, title: "回复小红书评论", cogLoad: "低", startup: "即刻", suitable: "低能量", project: "内容创作" },
  { id: 3, title: "更新饮食计划数据库", cogLoad: "低", startup: "即刻", suitable: "低能量", project: "身体管理" },
  { id: 4, title: "Figma UI原型设计", cogLoad: "高", startup: "仪式", suitable: "峰值", project: "Career 2.0" },
  { id: 5, title: "阅读神经科学论文摘要", cogLoad: "中", startup: "仪式", suitable: "稳定", project: "知识管理" },
  { id: 6, title: "整理本周支出记录", cogLoad: "低", startup: "即刻", suitable: "低能量", project: "财务管理" },
  { id: 7, title: "学习pandas数据清洗", cogLoad: "高", startup: "仪式", suitable: "峰值", project: "AI数据分析" },
  { id: 8, title: "更新越南旅行行前清单", cogLoad: "低", startup: "即刻", suitable: "稳定", project: "活动计划" },
];

const RECOVERY = {
  轻度: {
    time: "5–15 分钟", color: "#5D8C6A", bg: "#EFF7F1", icon: "🌿",
    note: "你还有能量，只是需要微调。",
    items: ["深呼吸 4-7-8 法，5分钟", "冷水冲手腕，感受温度", "听一首熟悉的歌", "走到窗边，看远处", "喝一杯温水，慢慢喝完"],
  },
  中度: {
    time: "15–45 分钟", color: "#C4865A", bg: "#FDF5EC", icon: "🌙",
    note: "允许自己慢下来。今天的生产力已经够了。",
    items: ["离开当前空间，去安静处", "戴上降噪耳机平躺", "做一套8分钟瑜伽", "写脑力倾泻日记，不加评判", "取消后续低优先级安排"],
  },
  重度: {
    time: "45 分钟以上", color: "#C85C45", bg: "#FDF0ED", icon: "🛑",
    note: "你没有失败。你的神经系统正在保护你。",
    items: ["完全停止当日剩余安排", "进入感官最小化空间", "睡眠或深度休息", "联系一个支持你的人", "不做任何决策，直到明天"],
  },
};

const SOS_STEPS = [
  { icon: "🚪", title: "离开", desc: "离开当前的物理环境" },
  { icon: "🎧", title: "安抚", desc: "启动你的感官安抚方式" },
  { icon: "⏱️", title: "计时", desc: "给自己设定一个恢复计时" },
];

function getMatchedTasks(level) {
  if (!level) return [];
  if (level <= 2) return TASKS.filter(t => t.suitable === "低能量" && t.startup === "即刻");
  if (level === 3) return TASKS.filter(t => t.suitable !== "峰值");
  return [...TASKS].sort((a, b) => (b.cogLoad === "高" ? 1 : 0) - (a.cogLoad === "高" ? 1 : 0));
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&family=Instrument+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F4EFE6; }
  .app { font-family: 'Instrument Sans', sans-serif; background: #F4EFE6; min-height: 100vh; color: #2A2420; }
  .serif { font-family: 'Noto Serif SC', serif; }
  .card { background: #fff; border-radius: 18px; box-shadow: 0 1px 8px rgba(42,36,32,0.07); }
  .fade { animation: fadeUp 0.28s cubic-bezier(.22,.68,0,1.2); }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .pulse { animation: pulse 2.4s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(200,92,69,.4); } 50% { box-shadow: 0 0 0 8px rgba(200,92,69,0); } }
  .overlay { position: fixed; inset: 0; background: rgba(20,12,8,.93); display: flex; align-items: center; justify-content: center; z-index: 999; }
  .energy-btn { cursor: pointer; border: 2px solid transparent; transition: transform .18s, border-color .18s, background .18s; border-radius: 14px; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 6px; font-family: inherit; }
  .energy-btn:hover { transform: scale(1.06); }
  .energy-btn.sel { transform: scale(1.09); }
  .tab { cursor: pointer; border: none; background: none; font-family: inherit; font-size: 13px; font-weight: 500; padding: 8px 16px; border-radius: 50px; transition: all .2s; white-space: nowrap; }
  .tab.on { background: #4A6952; color: #fff; }
  .tab.off { color: #7A6E67; }
  .recover-btn { width: 100%; border: 2px solid #EDE8E0; border-radius: 16px; padding: 18px 20px; background: #fff; cursor: pointer; font-family: inherit; text-align: left; transition: border-color .2s, background .2s; display: flex; justify-content: space-between; align-items: center; }
  .task-row { background: #fff; border-radius: 14px; padding: 14px 16px; box-shadow: 0 1px 6px rgba(42,36,32,.06); }
  .badge { font-size: 11px; padding: 3px 9px; border-radius: 20px; font-weight: 600; }
  .timer-display { font-size: 72px; font-weight: 200; letter-spacing: -2px; font-variant-numeric: tabular-nums; }
  .sos-close { background: none; border: none; color: rgba(255,255,255,.4); font-size: 13px; cursor: pointer; margin-top: 20px; font-family: inherit; }
  .bar { border-radius: 8px; transition: height .6s cubic-bezier(.34,1.56,.64,1); }
  button:focus-visible { outline: 2px solid #4A6952; outline-offset: 2px; }
`;

export default function App() {
  const [tab, setTab] = useState("energy");
  const [checkIns, setCheckIns] = useState({});
  const [showSOS, setShowSOS] = useState(false);
  const [sosStep, setSosStep] = useState(0);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const [timerSecs, setTimerSecs] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&family=Instrument+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    let id;
    if (timerActive && timerSecs > 0) {
      id = setInterval(() => setTimerSecs(s => s - 1), 1000);
    } else if (timerSecs === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(id);
  }, [timerActive, timerSecs]);

  const latestEnergy = TIME_SLOTS.reduce((acc, s) => checkIns[s.key] ?? acc, null);
  const energyCfg = latestEnergy ? ENERGY_CONFIG[latestEnergy] : null;
  const matched = getMatchedTasks(latestEnergy);
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* ── SOS Overlay ── */}
        {showSOS && (
          <div className="overlay" onClick={e => e.target === e.currentTarget && (setShowSOS(false), setSosStep(0))}>
            <div style={{maxWidth:360,width:"90%",color:"#fff",textAlign:"center"}}>
              {sosStep < 3 ? (
                <div className="fade" key={sosStep}>
                  <div style={{fontSize:11,letterSpacing:3,opacity:.4,textTransform:"uppercase",marginBottom:36}}>崩溃预防协议</div>
                  <div style={{fontSize:88,lineHeight:1,marginBottom:20}}>{SOS_STEPS[sosStep].icon}</div>
                  <div className="serif" style={{fontSize:52,fontWeight:400,marginBottom:10}}>{SOS_STEPS[sosStep].title}</div>
                  <div style={{fontSize:18,opacity:.6,marginBottom:44}}>{SOS_STEPS[sosStep].desc}</div>

                  {sosStep === 2 && (
                    <div style={{marginBottom:32}}>
                      {!timerActive && timerSecs === 0 && (
                        <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:16}}>
                          {[5,10,20].map(m => (
                            <button key={m} onClick={() => { setTimerSecs(m*60); setTimerActive(true); }}
                              style={{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.25)",color:"#fff",borderRadius:10,padding:"10px 18px",cursor:"pointer",font:"500 15px inherit"}}>
                              {m} 分钟
                            </button>
                          ))}
                        </div>
                      )}
                      {(timerActive || timerSecs > 0) && (
                        <div>
                          <div className="timer-display">{fmt(timerSecs)}</div>
                          <div style={{fontSize:13,opacity:.4,marginTop:6}}>{timerActive ? "计时中…" : "计时结束"}</div>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:32}}>
                    {SOS_STEPS.map((_,i) => (
                      <div key={i} style={{height:6,borderRadius:3,background:i===sosStep?"#fff":i<sosStep?"rgba(255,255,255,.5)":"rgba(255,255,255,.2)",width:i===sosStep?28:8,transition:"all .3s"}}/>
                    ))}
                  </div>

                  <button onClick={() => setSosStep(s => s+1)}
                    style={{background:"#fff",color:"#2A2420",border:"none",borderRadius:50,padding:"14px 44px",fontSize:16,fontWeight:600,cursor:"pointer"}}>
                    {sosStep < 2 ? "下一步 →" : "完成"}
                  </button>
                </div>
              ) : (
                <div className="fade">
                  <div style={{fontSize:80,marginBottom:24}}>🌱</div>
                  <div className="serif" style={{fontSize:36,marginBottom:12}}>你安全了</div>
                  <div style={{fontSize:16,opacity:.6,lineHeight:1.9,marginBottom:36}}>急救流程已完成。<br/>现在选择你的恢复方式。</div>
                  <button onClick={() => { setShowSOS(false); setSosStep(0); setTab("firstaid"); }}
                    style={{background:"#fff",color:"#2A2420",border:"none",borderRadius:50,padding:"14px 40px",fontSize:16,fontWeight:600,cursor:"pointer"}}>
                    进入恢复菜单 →
                  </button>
                  <div><button className="sos-close" onClick={() => { setShowSOS(false); setSosStep(0); }}>关闭</button></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <div style={{background:"#fff",borderBottom:"1px solid #EDE8E0",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100}}>
          <div>
            <div style={{fontSize:10,letterSpacing:3,color:"#A89C94",textTransform:"uppercase"}}>LIFE COMPASS</div>
            <div className="serif" style={{fontSize:17,fontWeight:600,marginTop:1}}>能量感知系统</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {energyCfg && (
              <div style={{background:energyCfg.bgColor,padding:"5px 12px",borderRadius:50,display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:15}}>{energyCfg.emoji}</span>
                <span style={{fontSize:12,fontWeight:600,color:energyCfg.color}}>{energyCfg.label}</span>
              </div>
            )}
            <button className="pulse" onClick={() => { setShowSOS(true); setSosStep(0); }}
              style={{background:"#C85C45",color:"#fff",border:"none",borderRadius:50,padding:"8px 16px",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
              🆘 急救
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{padding:"14px 20px 0",display:"flex",gap:6,overflowX:"auto"}}>
          {[{id:"energy",label:"🔋 今日能量"},{id:"tasks",label:"✅ 任务匹配"},{id:"firstaid",label:"🛡️ 急救包"}].map(t => (
            <button key={t.id} className={`tab ${tab===t.id?"on":"off"}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        <div style={{padding:"20px",maxWidth:560,margin:"0 auto"}}>

          {/* ── ENERGY TAB ── */}
          {tab === "energy" && (
            <div className="fade">
              <div style={{fontSize:12,color:"#A89C94",marginBottom:6}}>
                {new Date().toLocaleDateString("zh-CN",{weekday:"long",month:"long",day:"numeric"})}
              </div>
              <h2 className="serif" style={{fontSize:24,fontWeight:600,marginBottom:22}}>今日能量签到</h2>

              <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
                {TIME_SLOTS.map(slot => {
                  const checked = checkIns[slot.key];
                  const cfg = checked ? ENERGY_CONFIG[checked] : null;
                  return (
                    <div key={slot.key} className="card" style={{padding:18}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:18}}>{slot.icon}</span>
                          <div>
                            <div style={{fontSize:15,fontWeight:600}}>{slot.key}</div>
                            <div style={{fontSize:11,color:"#A89C94"}}>{slot.hours}</div>
                          </div>
                        </div>
                        {cfg && (
                          <div style={{background:cfg.bgColor,color:cfg.color,padding:"4px 12px",borderRadius:50,fontSize:12,fontWeight:600}}>
                            {cfg.emoji} {cfg.label}
                          </div>
                        )}
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        {[1,2,3,4,5].map(lv => {
                          const c = ENERGY_CONFIG[lv];
                          const sel = checked === lv;
                          return (
                            <button key={lv} className={`energy-btn ${sel?"sel":""}`}
                              onClick={() => setCheckIns(p => ({...p, [slot.key]: lv}))}
                              style={{flex:1,background:sel?c.bgColor:"#F6F2EC",borderColor:sel?c.color:"transparent",color:sel?c.color:"#C0B4AC"}}>
                              <span style={{fontSize:22}}>{c.emoji}</span>
                              <span style={{fontSize:11,fontWeight:sel?600:400}}>{lv}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Timeline chart */}
              {Object.keys(checkIns).length > 0 && (
                <div className="card" style={{padding:20,marginBottom:16}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#7A6E67",marginBottom:16,letterSpacing:.5,textTransform:"uppercase"}}>今日走势</div>
                  <div style={{display:"flex",alignItems:"flex-end",height:90,gap:10}}>
                    {TIME_SLOTS.map(slot => {
                      const lv = checkIns[slot.key];
                      const cfg = lv ? ENERGY_CONFIG[lv] : null;
                      return (
                        <div key={slot.key} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8,height:"100%",justifyContent:"flex-end"}}>
                          <div className="bar" style={{
                            width:"100%",
                            height: lv ? `${(lv/5)*80}px` : "6px",
                            background: cfg ? cfg.bgColor : "#EDE8E0",
                            border: cfg ? `2px solid ${cfg.color}` : "2px solid #DDD8D0",
                          }}/>
                          <div style={{fontSize:11,color:"#A89C94",textAlign:"center"}}>{slot.key}</div>
                        </div>
                      );
                    })}
                  </div>

                  {latestEnergy && latestEnergy <= 2 && (
                    <div style={{marginTop:16,background:"#FDF0ED",borderRadius:12,padding:"12px 14px",borderLeft:"3px solid #C85C45"}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#C85C45",marginBottom:4}}>⚠️ 能量预警</div>
                      <div style={{fontSize:12,color:"#9A6258",marginBottom:10}}>能量处于危险水平，建议立即进入恢复模式。</div>
                      <button onClick={() => setTab("firstaid")} style={{fontSize:12,color:"#C85C45",background:"none",border:"1px solid #C85C45",borderRadius:8,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit"}}>
                        前往急救包 →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Legend */}
              <div className="card" style={{padding:18,background:"#F8F4EE"}}>
                <div style={{fontSize:11,color:"#A89C94",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>能量等级说明</div>
                {[5,4,3,2,1].map(lv => {
                  const c = ENERGY_CONFIG[lv];
                  return (
                    <div key={lv} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <span style={{fontSize:18,width:26}}>{c.emoji}</span>
                      <span style={{fontSize:12,fontWeight:600,color:c.color,width:20}}>{lv}</span>
                      <span style={{fontSize:12,fontWeight:600,color:"#4A3E38",width:36}}>{c.label}</span>
                      <span style={{fontSize:12,color:"#9A8E86"}}>— {c.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── TASKS TAB ── */}
          {tab === "tasks" && (
            <div className="fade">
              <h2 className="serif" style={{fontSize:24,fontWeight:600,marginBottom:6}}>任务匹配</h2>

              {!latestEnergy ? (
                <div className="card" style={{padding:48,textAlign:"center"}}>
                  <div style={{fontSize:48,marginBottom:16}}>🔋</div>
                  <div style={{fontSize:16,fontWeight:600,marginBottom:8}}>先完成一次能量签到</div>
                  <div style={{fontSize:14,color:"#7A6E67",marginBottom:24,lineHeight:1.7}}>系统需要了解你的当前状态，才能推荐适合的任务。</div>
                  <button onClick={() => setTab("energy")} style={{background:"#4A6952",color:"#fff",border:"none",borderRadius:50,padding:"11px 28px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                    去签到 →
                  </button>
                </div>
              ) : (
                <>
                  <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:energyCfg.bgColor,borderRadius:14,marginBottom:20}}>
                    <span style={{fontSize:28}}>{energyCfg.emoji}</span>
                    <div>
                      <div style={{fontSize:11,color:"#7A6E67"}}>当前能量</div>
                      <div style={{fontSize:17,fontWeight:600,color:energyCfg.color}}>{latestEnergy} · {energyCfg.label}</div>
                    </div>
                    <div style={{marginLeft:"auto",fontSize:13,color:"#A89C94"}}>{matched.length} 个适配</div>
                  </div>

                  {latestEnergy >= 4 && (
                    <div style={{fontSize:12,color:"#3D7A5A",padding:"8px 14px",background:"#E8F5EE",borderRadius:10,marginBottom:14}}>
                      ⚡ 能量峰值——高认知任务优先推荐
                    </div>
                  )}
                  {latestEnergy <= 2 && (
                    <div style={{fontSize:12,color:"#C4865A",padding:"8px 14px",background:"#FDF5EC",borderRadius:10,marginBottom:14}}>
                      🌧️ 低能量模式——只显示低启动阻力任务
                    </div>
                  )}

                  {matched.length === 0 ? (
                    <div className="card" style={{padding:36,textAlign:"center"}}>
                      <div style={{fontSize:40,marginBottom:12}}>🌱</div>
                      <div style={{fontSize:16,fontWeight:600,marginBottom:8}}>当前无适配任务</div>
                      <div style={{fontSize:13,color:"#7A6E67",marginBottom:20}}>建议进入恢复模式。</div>
                      <button onClick={() => setTab("firstaid")} style={{background:"#C85C45",color:"#fff",border:"none",borderRadius:50,padding:"10px 24px",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>
                        进入恢复模式
                      </button>
                    </div>
                  ) : (
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {matched.map(task => {
                        const done = completedTasks.has(task.id);
                        const cogColors = {低:["#EFF7F1","#5D8C6A"],中:["#FDF5EC","#C4865A"],高:["#FDF0ED","#C85C45"]};
                        const [cbg,ctxt] = cogColors[task.cogLoad];
                        return (
                          <div key={task.id} className="task-row" style={{opacity:done?.5:1,transition:"opacity .2s"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                              <div style={{display:"flex",gap:10,alignItems:"flex-start",flex:1}}>
                                <button onClick={() => setCompletedTasks(p => { const n=new Set(p); n.has(task.id)?n.delete(task.id):n.add(task.id); return n; })}
                                  style={{width:20,height:20,borderRadius:50,border:`2px solid ${done?"#5D8C6A":"#C0B4AC"}`,background:done?"#5D8C6A":"none",cursor:"pointer",flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center"}}>
                                  {done && <span style={{color:"#fff",fontSize:10}}>✓</span>}
                                </button>
                                <span style={{fontSize:15,fontWeight:500,textDecoration:done?"line-through":"none",color:done?"#A89C94":"#2A2420"}}>{task.title}</span>
                              </div>
                              <span className="badge" style={{background:cbg,color:ctxt,marginLeft:8,flexShrink:0}}>{task.cogLoad}负荷</span>
                            </div>
                            <div style={{display:"flex",gap:10,alignItems:"center",paddingLeft:30}}>
                              <span style={{fontSize:11,color:"#A89C94"}}>📂 {task.project}</span>
                              <span style={{fontSize:11,color:"#C8C0B8"}}>·</span>
                              <span style={{fontSize:11,color:task.startup==="即刻"?"#5D8C6A":"#C4865A"}}>
                                {task.startup==="即刻" ? "▶ 可立即启动" : "🕯 需要仪式感"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── FIRST AID TAB ── */}
          {tab === "firstaid" && (
            <div className="fade">
              <h2 className="serif" style={{fontSize:24,fontWeight:600,marginBottom:6}}>感官急救包</h2>
              <div style={{fontSize:14,color:"#7A6E67",marginBottom:20}}>选择你现在的状态</div>

              {/* Big SOS card */}
              <div style={{background:"#2A2420",borderRadius:18,padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div>
                  <div style={{color:"#fff",fontSize:16,fontWeight:600,marginBottom:4}}>立即崩溃了？</div>
                  <div style={{color:"rgba(255,255,255,.4)",fontSize:13}}>启动3步急救协议</div>
                </div>
                <button className="pulse" onClick={() => { setShowSOS(true); setSosStep(0); }}
                  style={{background:"#C85C45",color:"#fff",border:"none",borderRadius:50,padding:"12px 22px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  🆘 急救
                </button>
              </div>

              {["轻度","中度","重度"].map(sev => {
                const r = RECOVERY[sev];
                const open = selectedSeverity === sev;
                return (
                  <div key={sev} style={{marginBottom:12}}>
                    <button className="recover-btn" onClick={() => setSelectedSeverity(open?null:sev)}
                      style={{borderColor:open?r.color:"#EDE8E0",background:open?r.bg:"#fff"}}>
                      <div style={{display:"flex",alignItems:"center",gap:14}}>
                        <span style={{fontSize:26}}>{r.icon}</span>
                        <div>
                          <div style={{fontSize:16,fontWeight:600,color:open?r.color:"#2A2420"}}>{sev}触发</div>
                          <div style={{fontSize:12,color:"#A89C94",marginTop:2}}>恢复时间 {r.time}</div>
                        </div>
                      </div>
                      <span style={{color:open?r.color:"#C8C0B8",fontSize:16}}>{open?"▲":"▼"}</span>
                    </button>

                    {open && (
                      <div className="fade" style={{background:r.bg,border:`1px solid ${r.color}30`,borderTop:"none",borderRadius:"0 0 16px 16px",padding:"18px 20px"}}>
                        <div style={{fontSize:14,color:r.color,fontStyle:"italic",marginBottom:18,lineHeight:1.7}}>"{r.note}"</div>
                        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
                          {r.items.map((item,i) => (
                            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                              <div style={{width:24,height:24,borderRadius:50,background:"#fff",border:`1.5px solid ${r.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:r.color,fontWeight:700,flexShrink:0,marginTop:1}}>
                                {i+1}
                              </div>
                              <div style={{fontSize:14,lineHeight:1.6,color:"#2A2420"}}>{item}</div>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => setTab("energy")}
                          style={{width:"100%",background:r.color,color:"#fff",border:"none",borderRadius:12,padding:13,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                          恢复完成后，记录能量状态 →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              <div style={{marginTop:8,padding:"14px 16px",background:"#F0EBE2",borderRadius:12,textAlign:"center"}}>
                <div style={{fontSize:13,color:"#7A6E67"}}>
                  不确定严重程度？从 <strong style={{color:"#C4865A"}}>中度</strong> 开始，给自己多一点空间。
                </div>
              </div>
            </div>
          )}

          <div style={{height:40}}/>
        </div>
      </div>
    </>
  );
}
```

这个原型覆盖了需求文档里最核心的三个模块——**能量签到**、**任务匹配**和**急救包**，全部可交互。你现在可以真实操作它来感受：

签到→任务匹配的流程对你来说顺不顺手？急救包三个严重程度的划分符不符合你的实际体感？SOS的3步流程够不够简单？

这些体验反馈会直接决定你在Notion里怎么搭对应的数据库结构。想先从哪个模块开始深化？