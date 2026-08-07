import React from "react";
import {
  Box,
  Mic,
  Monitor,
  Video,
  VideoOff,
  WifiOff,
} from "lucide-react";

function HoneycombModeIcon({ size = 12, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="4" r="2" fill="currentColor" />
      <circle cx="5" cy="10" r="2" fill="currentColor" />
      <circle cx="11" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

const LIVE_CONDITIONS = Object.freeze({
  "video-starting": {
    label: "Video starting",
    tooltip: "Video is starting and will be visible to others shortly.",
    tone: "blue",
    Icon: Video,
  },
  "weak-connection": {
    label: "Weak connection",
    tooltip: "Connection is weak. Audio or video may be briefly interrupted.",
    tone: "amber",
    Icon: WifiOff,
  },
  "video-unavailable": {
    label: "Video unavailable",
    tooltip: "Video is unavailable to other people in the room.",
    tone: "berry",
    Icon: VideoOff,
  },
});

const MODES = Object.freeze({
  basic: { id: "basic", label: "Basic", Icon: Monitor },
  "2d": { id: "2d", label: "2D", Icon: HoneycombModeIcon },
  "3d": { id: "3d", label: "3D", Icon: Box },
  audio: { id: "audio", label: "Audio", Icon: Mic },
});

export function getLiveConditionMeta(condition) {
  return LIVE_CONDITIONS[condition] || null;
}

export function getModeMeta(mode) {
  const normalized = mode === "essential" ? "basic" : mode || "3d";
  return MODES[normalized] || MODES["3d"];
}

export function isDefaultMode(mode) {
  return getModeMeta(mode).label === "3D";
}

export function LiveConditionIcon({ condition, size = 14, className = "" }) {
  const meta = getLiveConditionMeta(condition);
  if (!meta) return null;
  const Icon = meta.Icon;
  return <Icon className={className} size={size} strokeWidth={2} aria-hidden="true" />;
}

export function ModeIcon({ mode, size = 12, className = "" }) {
  const meta = getModeMeta(mode);
  const Icon = meta.Icon;
  return <Icon className={className} size={size} strokeWidth={1.9} aria-hidden="true" />;
}

export function ModeIndicator({ mode, showLabel = false, textOnly = false, className = "" }) {
  const meta = getModeMeta(mode);
  if (meta.label === "3D") return null;
  const Icon = meta.Icon;
  return (
    <span className={`presence-mode-indicator ${showLabel ? "with-label" : "icon-only"} ${textOnly ? "text-only" : ""} ${className}`.trim()} aria-label={`${meta.label} mode`}>
      {!textOnly ? <Icon size={showLabel ? 13 : 12} strokeWidth={1.9} aria-hidden="true" /> : null}
      {showLabel ? <span>{textOnly ? `${meta.label} mode` : meta.label}</span> : null}
    </span>
  );
}
