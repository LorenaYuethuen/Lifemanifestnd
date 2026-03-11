import { EnergyLevel } from "../context/EnergyContext";

export interface EnergyConfig {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  desc: string;
}

export const ENERGY_CONFIG: Record<EnergyLevel, EnergyConfig> = {
  1: {
    label: "极低",
    emoji: "🪫",
    color: "#C85C45",
    bgColor: "#FDF0ED",
    desc: "停止工作，进入恢复模式"
  },
  2: {
    label: "低",
    emoji: "🌧️",
    color: "#C4865A",
    bgColor: "#FDF5EC",
    desc: "仅做简单事，注意恢复"
  },
  3: {
    label: "稳定",
    emoji: "🌤️",
    color: "#A89040",
    bgColor: "#FDFAED",
    desc: "稳定运转，适合常规任务"
  },
  4: {
    label: "良好",
    emoji: "☀️",
    color: "#5D8C6A",
    bgColor: "#EFF7F1",
    desc: "正常执行，状态良好"
  },
  5: {
    label: "峰值",
    emoji: "⚡",
    color: "#3D7A5A",
    bgColor: "#E8F5EE",
    desc: "深度专注工作的黄金时段"
  }
};

export interface TimeSlot {
  key: "morning" | "noon" | "afternoon" | "evening";
  label: string;
  icon: string;
  hours: string;
}

export const TIME_SLOTS: TimeSlot[] = [
  { key: "morning", label: "晨间", icon: "🌅", hours: "06:00–09:00" },
  { key: "noon", label: "午间", icon: "🌞", hours: "11:00–13:00" },
  { key: "afternoon", label: "午后", icon: "🌥️", hours: "14:00–17:00" },
  { key: "evening", label: "晚间", icon: "🌙", hours: "19:00–22:00" }
];

export interface RecoveryProtocol {
  time: string;
  color: string;
  bg: string;
  icon: string;
  note: string;
  items: string[];
}

export const RECOVERY_PROTOCOLS: Record<"mild" | "moderate" | "severe", RecoveryProtocol> = {
  mild: {
    time: "5–15 分钟",
    color: "#5D8C6A",
    bg: "#EFF7F1",
    icon: "🌿",
    note: "你还有能量，只是需要微调。",
    items: [
      "深呼吸 4-7-8 法，5分钟",
      "冷水冲手腕，感受温度",
      "听一首熟悉的歌",
      "走到窗边，看远处",
      "喝一杯温水，慢慢喝完"
    ]
  },
  moderate: {
    time: "15–45 分钟",
    color: "#C4865A",
    bg: "#FDF5EC",
    icon: "🌙",
    note: "允许自己慢下来。今天的生产力已经够了。",
    items: [
      "离开当前空间，去安静处",
      "戴上降噪耳机平躺",
      "做一套8分钟瑜伽",
      "写脑力倾泻日记，不加评判",
      "取消后续低优先级安排"
    ]
  },
  severe: {
    time: "45 分钟以上",
    color: "#C85C45",
    bg: "#FDF0ED",
    icon: "🛑",
    note: "你没有失败。你的神经系统正在保护你。",
    items: [
      "完全停止当日剩余安排",
      "进入感官最小化空间",
      "睡眠或深度休息",
      "联系一个支持你的人",
      "不做任何决策，直到明天"
    ]
  }
};

export const SOS_STEPS = [
  { icon: "🚪", title: "离开", desc: "离开当前的物理环境" },
  { icon: "🎧", title: "安抚", desc: "启动你的感官安抚方式" },
  { icon: "⏱️", title: "计时", desc: "给自己设定一个恢复计时" }
];
