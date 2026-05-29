"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Bell, Trash2, CheckCircle2, ShieldAlert, Filter } from "lucide-react";

import { useDashboardStore } from "../../../store/useDashboardStore";

export default function AlertsPage() {
  const { alerts, dismissAlert, resolveAllAlerts } = useDashboardStore();
  const [filterSeverity, setFilterSeverity] = useState<"ALL" | "CRITICAL" | "HIGH">("ALL");

  const filtered = filterSeverity === "ALL" 
    ? alerts 
    : alerts.filter(a => filterSeverity === "CRITICAL" ? a.severity === "CRITICAL" : a.severity === "HIGH");

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-zinc-200">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#1f1f22] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-medium text-zinc-100">Threat Alerts & Incidents</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Auditing logs of automated triggers, competitive maneuvers, and market signals.</p>
        </div>
        {alerts.length > 0 && (
          <button
            onClick={resolveAllAlerts}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-[13px] rounded-lg cursor-pointer"
          >
            Resolve All
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Filter and List */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Filter sub bar */}
          <div className="p-3 bg-[#0c0c0f] border-b border-[#1f1f22] flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <button
              onClick={() => setFilterSeverity("ALL")}
              className={`text-[11px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                filterSeverity === "ALL" ? "border-zinc-500 text-zinc-100 bg-zinc-800" : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setFilterSeverity("CRITICAL")}
              className={`text-[11px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                filterSeverity === "CRITICAL" ? "border-rose-950 text-rose-400 bg-rose-950/20" : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
              }`}
            >
              Critical Only
            </button>
            <button
              onClick={() => setFilterSeverity("HIGH")}
              className={`text-[11px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                filterSeverity === "HIGH" ? "border-amber-950 text-amber-400 bg-amber-950/20" : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
              }`}
            >
              Warning Only
            </button>
          </div>

          {/* List panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {filtered.length === 0 ? (
              <div className="py-24 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-[13px] font-semibold text-zinc-400">All alerts resolved</h3>
                <p className="text-[12px] text-zinc-500">Your enterprise GTM nodes are currently clear of critical warnings.</p>
              </div>
            ) : (
              filtered.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border"
                      style={{
                        borderColor: alert.severity === "CRITICAL" ? "rgba(244,63,94,0.2)" : "rgba(245,158,11,0.2)",
                        backgroundColor: alert.severity === "CRITICAL" ? "rgba(244,63,94,0.05)" : "rgba(245,158,11,0.05)",
                      }}
                    >
                      <AlertTriangle className="w-4 h-4" style={{ color: alert.severity === "CRITICAL" ? "#f43f5e" : "#f59e0b" }} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13px] font-semibold text-zinc-200">{alert.title}</h4>
                        <span className="text-[10px] text-zinc-500">({alert.timestamp} ago)</span>
                      </div>
                      <p className="text-[12px] text-zinc-400 leading-normal">{alert.agentOrigin}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-[11px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1 rounded text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
                  >
                    Resolve Alert
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right side: rules statistics or system stats */}
        <div className="w-[300px] border-l border-[#1f1f22] p-6 space-y-6 bg-[#0c0c0f] overflow-y-auto shrink-0">
          <div className="space-y-2">
            <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">System Coverage</h3>
            <p className="text-[12px] text-zinc-500 leading-relaxed">
              ShadowRep active crawlers check GTM segments on an 18-minute recurring interval. Threshold logs automatically dispatches to configured Slack webhooks.
            </p>
          </div>

          <div className="bg-[#18181b] border border-zinc-850 rounded-xl p-4 space-y-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Trigger Profiles Active</span>
            <div className="space-y-1.5 text-[12px] text-zinc-400">
              <div className="flex justify-between">
                <span>Pricing alteration</span>
                <span className="text-zinc-200 font-medium">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span>Patent filings scan</span>
                <span className="text-zinc-200 font-medium">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span>CTA text change</span>
                <span className="text-zinc-200 font-medium">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span>SEC form declarations</span>
                <span className="text-zinc-200 font-medium">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}