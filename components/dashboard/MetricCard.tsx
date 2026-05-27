"use client";

import React from "react";
import { Metric } from "../../types/agent";
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  metric: Metric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const isGreen = metric.telemetryType === "green";
  const isCyan = metric.telemetryType === "cyan";
  const isAmber = metric.telemetryType === "amber";
  const isCrimson = metric.telemetryType === "crimson";

  const glowTextClass = isGreen
    ? "text-emerald-400 text-glow-green"
    : isCyan
    ? "text-cyan-400 text-glow-cyan"
    : isAmber
    ? "text-amber-400 text-glow-amber"
    : "text-rose-500 text-glow-crimson";

  const borderClass = isGreen
    ? "border-emerald-950/40"
    : isCyan
    ? "border-cyan-950/40"
    : isAmber
    ? "border-amber-950/40"
    : "border-rose-950/40";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative border ${borderClass} bg-[#070c17]/60 p-4 font-mono shadow-lg backdrop-blur-md flex flex-col justify-between h-28 overflow-hidden`}
    >
      {/* Corner dynamic indicators */}
      <div className={`absolute top-0 left-0 w-1.5 h-1.5 border-t border-l ${
        isGreen ? "border-emerald-500" : isCyan ? "border-cyan-500" : isAmber ? "border-amber-500" : "border-rose-500"
      }`} />

      <div className="flex items-center justify-between text-[10px] text-slate-500 tracking-wider font-extrabold uppercase">
        <span>{metric.label}</span>
        <RefreshCw className="w-2.5 h-2.5 animate-spin text-slate-700" style={{ animationDuration: "8s" }} />
      </div>

      <div className="my-2 flex items-baseline gap-2">
        <span className={`text-xl font-extrabold tracking-tight ${glowTextClass}`}>
          {metric.value}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-slate-900/60 pt-2 text-[10px]">
        <span className="text-slate-500">SYS_TELEMETRY</span>
        <span className={`flex items-center gap-0.5 font-bold ${metric.isPositive ? "text-emerald-400" : "text-rose-500"}`}>
          {metric.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {metric.isPositive ? "+" : ""}{metric.change}%
        </span>
      </div>
    </motion.div>
  );
}
