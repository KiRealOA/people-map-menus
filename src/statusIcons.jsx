import React from "react";
import {
  CircleCheck,
  Cross,
  LockKeyhole,
  Users,
  Moon,
  Palmtree,
  Utensils,
  Target,
  Zap,
} from "lucide-react";

export const STATUS_ICON_OPTIONS = [
  { id: "focus", label: "Focus time", Icon: Target, tone: "violet" },
  { id: "lunch", label: "At lunch", Icon: Utensils, tone: "amber" },
  { id: "heads-down", label: "Heads down", Icon: Zap, tone: "blue" },
  { id: "sick", label: "Out sick", Icon: Cross, tone: "violet" },
  { id: "vacation", label: "On vacation", Icon: Palmtree, tone: "green" },
  { id: "away", label: "Away", Icon: Moon, tone: "amber" },
  { id: "conversation", label: "In conversation", Icon: Users, tone: "blue" },
  { id: "private", label: "Private", Icon: LockKeyhole, tone: "red" },
];

export const SYSTEM_STATUS_META = Object.freeze({
  Away: { iconId: "away", description: "Away · Camera and microphone are off" },
  "In conversation": { iconId: "conversation", description: "In conversation" },
  Private: { iconId: "private", description: "Private" },
  Guest: { iconId: "conversation", description: "Guest" },
  Available: { iconId: "available", description: "Available" },
});

export const CUSTOM_STATUS_PRESETS = [
  { iconId: "focus", text: "Focus time", duration: "hour" },
  { iconId: "lunch", text: "At lunch", duration: "hour" },
  { iconId: "heads-down", text: "Heads down", duration: "four-hours" },
  { iconId: "sick", text: "Out sick", duration: "today" },
  { iconId: "vacation", text: "On vacation", duration: "never" },
];

export function getStatusMeta(status) {
  return SYSTEM_STATUS_META[status] || { description: status };
}

export function getStatusIconOption(iconId) {
  if (iconId === "available") return { id: "available", label: "Available", Icon: CircleCheck, tone: "green" };
  return STATUS_ICON_OPTIONS.find((option) => option.id === iconId) || null;
}

export function StatusIcon({ iconId, emoji, className = "", size = 16 }) {
  if (emoji) return <span className={className}>{emoji}</span>;
  const option = getStatusIconOption(iconId);
  if (!option) return <span className={className}>{emoji || "•"}</span>;
  const Icon = option.Icon;
  return <Icon className={className} size={size} strokeWidth={1.8} aria-hidden="true" />;
}
