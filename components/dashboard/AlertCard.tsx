"use client";

import React from "react";
import { SystemAlert } from "../../types/agent";
import { AlertCircle, ShieldAlert, CheckCircle, Clock } from "lucide-react";

interface AlertCardProps {
  alert: SystemAlert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const isCritical = alert.severity === "CRITICAL";
  const isHigh = alert.severity === "HIGH";
  const isMedium = alert.severity === "MEDIUM";

  const colorClass = isCritical
    ? "border-rose-950/40 bg-rose-950/5 text-rose-400"
    : isHigh
    ? "border-amber-950/40 bg-amber-950/5 text-amber-400"
    : isMedium
    ? "border-cyan-950/40 bg-cyan-950/5 text-cyan-400"
    : "border-slate-800 bg-slate-950/5 text-slate-400";

  const glowDot = isCritical
    ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
    : isHigh
    ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]"
    : isMedium
    ? "bg-cyan-500 shadow-[0_0_8px_#06b6d4]"
    : "bg-slate-600";

  return (
    <div className={`border p-3 font-mono text-xs flex flex-col gap-1.5 transition-all ${colorClass}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-extrabold uppercase text-[10px]">
          {isCritical ? (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          <span>{alert.severity} SEVERITY</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-slate-500">
          <Clock className="w-3 h-3" />
          <span>{alert.timestamp}</span>
        </div>
      </div>

      <p className="text-[11px] font-semibold text-slate-200 tracking-tight leading-4">
        {alert.title}
      </p>

      <div className="flex items-center justify-between mt-1 border-t border-slate-900/50 pt-2 text-[9px] text-slate-500">
        <span>ORIGIN: {alert.agentOrigin}</span>
        {alert.resolved ? (
          <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
            <CheckCircle className="w-3 h-3" /> RESOLVED
          </span>
        ) : (
          <span className="flex items-center gap-1 font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${glowDot} animate-pulse`} /> UNRESOLVED
          </span>
        )}
      </div>
    </div>
  );
}
