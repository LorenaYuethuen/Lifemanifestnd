import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/Button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useEnergy } from "../../context/EnergyContext";
import { Users, Brain, Ear, Heart, Dumbbell } from "lucide-react";
import { cn } from "../../lib/utils";

interface DrainEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = [
  { value: "social", label: "社交", icon: Users, description: "人际互动、会议、人群" },
  { value: "sensory", label: "感官", icon: Ear, description: "噪音、强光、不适纹理" },
  { value: "cognitive", label: "认知", icon: Brain, description: "脑力劳动、连续决策" },
  { value: "emotional", label: "情绪", icon: Heart, description: "压力、冲突、内耗" },
  { value: "physical", label: "身体", icon: Dumbbell, description: "体力劳动、疼痛、疲劳" },
] as const;

const SEVERITIES = [
  { value: "mild", label: "轻度", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "moderate", label: "中度", color: "bg-orange-100 text-orange-700 border-orange-300" },
  { value: "severe", label: "重度", color: "bg-rose-100 text-rose-700 border-rose-300" },
] as const;

export function DrainEventDialog({ open, onOpenChange }: DrainEventDialogProps) {
  const { addDrainEvent } = useEnergy();
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("moderate");
  const [category, setCategory] = useState<"social" | "sensory" | "cognitive" | "emotional" | "physical">("sensory");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    addDrainEvent({
      description: description.trim(),
      severity,
      category,
    });
    
    // Reset form
    setDescription("");
    setSeverity("moderate");
    setCategory("sensory");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>记录耗能事件</DialogTitle>
          <DialogDescription>
            记录刚刚消耗你能量的事件，帮助识别未来的耗能模式和触发源。
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>发生了什么？</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如：参加了 12 个人的视频会议，而且荧光灯一直闪烁..."
              className="min-h-[80px] resize-none"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>耗能类别</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:scale-[1.02]",
                      category === cat.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", category === cat.value ? "text-indigo-600" : "text-slate-400")} />
                    <span className={cn("text-xs font-medium", category === cat.value ? "text-indigo-900" : "text-slate-600")}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>严重程度</Label>
            <div className="flex gap-2">
              {SEVERITIES.map((sev) => (
                <button
                  key={sev.value}
                  type="button"
                  onClick={() => setSeverity(sev.value)}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-lg border-2 font-medium text-sm transition-all",
                    severity === sev.value
                      ? sev.color
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {sev.label}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={!description.trim()}>
              保存记录
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}