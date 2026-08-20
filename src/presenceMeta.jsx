import React from "react";
import {
  Box,
  Video,
  VideoOff,
  WifiOff,
} from "lucide-react";

function HoneycombModeIcon({ size = 12, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="3.8" r="2.35" fill="currentColor" />
      <circle cx="4.7" cy="10.3" r="2.35" fill="currentColor" />
      <circle cx="11.3" cy="10.3" r="2.35" fill="currentColor" />
    </svg>
  );
}

function BasicModeIcon({ size = 12, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.5" y="2" width="11" height="9" rx="1.25" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 11v2.25M5.75 14h4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function AudioWaveModeIcon({ size = 12, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="2" height="4" rx="1" fill="currentColor" />
      <rect x="5" y="3.5" width="2" height="9" rx="1" fill="currentColor" />
      <rect x="8" y="5" width="2" height="6" rx="1" fill="currentColor" />
      <rect x="11" y="2" width="2" height="12" rx="1" fill="currentColor" />
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
  basic: { id: "basic", label: "Basic", Icon: BasicModeIcon },
  "2d": { id: "2d", label: "2D", Icon: HoneycombModeIcon },
  "3d": { id: "3d", label: "3D", Icon: Box },
  audio: { id: "audio", label: "Audio", tooltip: "Audio only", Icon: AudioWaveModeIcon },
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
