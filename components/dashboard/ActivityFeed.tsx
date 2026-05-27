"use client";

import React from "react";
import { GtmActivity } from "../../types/agent";
import { Terminal, ShieldAlert, Cpu, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityFeedProps {
  activities: GtmActivity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="font-mono text-xs flex flex-col gap-2 h-[340px] overflow-y-auto pr-1">
      <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-1 text-[10px] text-slate-500 font-extrabold tracking-wider">
        <Terminal className="w-3.5 h-3.5" />
        <span>CHRONOLOGICAL WORKSPACE TELEMETRY STREAM</span>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {activities.map((activity, idx) => {
            const isCritical = activity.category === "CRITICAL";
            const isSignal = activity.category === "SIGNAL";
            const isWarning = activity.category === "WARNING";

            const tagColor = isCritical
              ? "text-rose-500 border-rose-950 bg-rose-950/10"
              : isSignal
              ? "text-cyan-400 border-cyan-950 bg-cyan-950/10"
              : isWarning
              ? "text-amber-500 border-amber-950 bg-amber-950/10"
              : "text-emerald-400 border-emerald-950 bg-emerald-950/10";

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="flex flex-col gap-1.5 p-2 bg-[#040810]/60 border border-slate-950 hover:border-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-500">[{activity.timestamp}]</span>
                    <span className={`text-[9px] border px-1 font-bold ${tagColor}`}>
                      {activity.category}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-bold">IMP_IDX: {activity.impactScore}%</span>
                </div>

                <p className="text-[11px] text-slate-300 tracking-tight leading-4">
                  {activity.message}
                </p>

                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 border-t border-slate-900/60 pt-1">
                  {isCritical ? (
                    <ShieldAlert className="w-3 h-3 text-rose-500" />
                  ) : isSignal ? (
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                  ) : (
                    <Cpu className="w-3 h-3 text-emerald-400" />
                  )}
                  <span>SOURCE: {activity.source}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
