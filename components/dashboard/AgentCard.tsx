"use client";

import React from "react";
import { Agent } from "../../types/agent";
import { Cpu, Database, Activity, AlertTriangle, ShieldCheck } from "lucide-react";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const isActive = agent.status === "ACTIVE";
  const isIdle = agent.status === "IDLE";
  const isDryRun = agent.status === "DRY_RUN";

  const statusColor = isActive
    ? "text-emerald-400 border-emerald-900 bg-emerald-950/20"
    : isIdle
    ? "text-slate-400 border-slate-800 bg-slate-950/20"
    : "text-cyan-400 border-cyan-900 bg-cyan-950/20";

  const ledPulse = isActive
    ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
    : isIdle
    ? "bg-slate-700"
    : "bg-cyan-500 shadow-[0_0_8px_#06b6d4]";

  return (
    <div className="border border-slate-900 bg-[#070c17]/40 p-3 font-mono text-xs flex flex-col gap-2 relative">
      {/* LED Telemetry Dot */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${ledPulse} ${isActive ? "animate-pulse" : ""}`} />
        <span className={`text-[9px] font-bold border px-1 ${statusColor}`}>{agent.status}</span>
      </div>

      <div className="flex flex-col">
        <span className="font-extrabold text-slate-300 text-sm">{agent.name}</span>
        <span className="text-[10px] text-slate-500 tracking-wider">CODE: {agent.codename}</span>
      </div>

      {/* Dynamic Telemetry Specs */}
      <div className="grid grid-cols-3 gap-1 bg-[#040810] p-1.5 border border-slate-950/80">
        <div className="flex items-center gap-1 text-[10px]">
          <Cpu className="w-3 h-3 text-slate-600" />
          <span className="text-slate-400">{agent.cpu}%</span>
        </div>
        <div className="flex items-center gap-1 text-[10px]">
          <Database className="w-3 h-3 text-slate-600" />
          <span className="text-slate-400 text-ellipsis overflow-hidden whitespace-nowrap">{agent.memory}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px]">
          <Activity className="w-3 h-3 text-slate-600" />
          <span className="text-slate-400">{agent.tokensPerSec} t/s</span>
        </div>
      </div>

      {/* Active Process Log */}
      <div className="flex flex-col gap-1 bg-[#03060c] p-2 border-l border-cyan-500">
        <div className="flex items-center gap-1 text-[9px] text-cyan-400 font-extrabold tracking-wider">
          <ShieldCheck className="w-3 h-3" />
          <span>CURRENT_OPERATION:</span>
        </div>
        <p className="text-[10px] text-slate-400 line-clamp-1 leading-4">{agent.activeTask}</p>
        <p className="text-[9px] text-slate-600 line-clamp-1 italic">Log: {agent.recentLog}</p>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between text-[9px] text-slate-600 mt-1 border-t border-slate-900 pt-1.5">
        <span>LATENCY: {agent.latency}</span>
        <span>NODE_SYS: 0x98A</span>
      </div>
    </div>
  );
}
