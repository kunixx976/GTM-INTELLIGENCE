"use client";

import React, { useState } from "react";
import {
  Plus,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Bot,
  Target,
  Eye,
  Zap,
  Download,
  Bell,
  X,
  Send,
  Loader,
} from "lucide-react";
import { useDashboardStore } from "../../../store/useDashboardStore";

const chartPoints = [38, 45, 42, 55, 52, 58, 62, 55, 60, 68, 65, 72, 68, 75, 48];

export default function DashboardPage() {
  // ─── Zustand Bindings ──────────────────────────────────────────────────────
  const {
    agents,
    feedItems,
    alerts,
    competitors,
    
    isBriefingOpen,
    setBriefingOpen,
    isAiBriefingRunning,
    setAiBriefingRunning,
    aiBriefingLogs,
    aiBriefingStep,
    
    isAiChatOpen,
    setAiChatOpen,
    chatMessages,
    sendChatMessage,
    
    dismissAlert,
    addCompetitor,
    addAlertRule,
    runBriefing,
    triggerToast,
  } = useDashboardStore();

  // ─── Local Modal States ────────────────────────────────────────────────────
  const [isCompetitorModalOpen, setIsCompetitorModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Form Inputs
  const [newComp, setNewComp] = useState({ name: "", logo: "" });
  const [newRule, setNewRule] = useState({ title: "", subtitle: "", severity: "HIGH" });
  const [newBrief, setNewBrief] = useState({ domain: "", scanType: "All" });

  // ─── Event Handlers ────────────────────────────────────────────────────────
  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComp.name.trim()) return;
    addCompetitor(newComp.name, newComp.logo);
    setNewComp({ name: "", logo: "" });
    setIsCompetitorModalOpen(false);
  };

  const handleCreateAlertRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.title.trim()) return;
    addAlertRule(newRule.title, newRule.subtitle, newRule.severity);
    setNewRule({ title: "", subtitle: "", severity: "HIGH" });
    setIsAlertModalOpen(false);
  };

  const handleCreateBriefing = (e: React.FormEvent) => {
    e.preventDefault();
    setBriefingOpen(false);
    triggerToast(`Initializing scanning module on domain: ${newBrief.domain}`);
    setTimeout(() => {
      runBriefing();
    }, 800);
  };

  const handleExport = (format: string) => {
    triggerToast(`Exporting analytics package as ${format.toUpperCase()}...`);
    setIsExportModalOpen(false);
    setTimeout(() => {
      triggerToast(`ShadowRep_GTM_Diagnostics.${format} exported successfully`);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#09090b]">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between px-6 pt-5 pb-4 shrink-0 border-b border-[#1f1f22]">
        <div>
          <h1 className="text-[20px] font-medium text-zinc-100">Welcome back, Divya 👋</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Autonomous GTM Intelligence hub. Clean system nodes functional.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Sparkles AI button */}
          <button
            onClick={() => setAiChatOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-colors text-zinc-300 text-[13px] rounded-lg cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            AI Console
          </button>
          {/* New Briefing button */}
          <button
            onClick={() => setBriefingOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-950 text-[13px] font-medium rounded-lg cursor-pointer border border-zinc-300"
          >
            <Plus className="w-3.5 h-3.5" />
            New Briefing
          </button>
        </div>
      </div>

      {/* ── Scrollable Dashboard Grid ── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {/* ── Row 1: Flat Metric Cards ── */}
        <div className="grid grid-cols-4 gap-4">
          {/* AI Agents Active */}
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">AI Agents Active</span>
              <span className="text-[28px] font-semibold text-zinc-100 mt-1 leading-none">12 <span className="text-[15px] text-zinc-600 font-normal">/ 16</span></span>
              <span className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                All workflows operational
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-zinc-400" />
            </div>
          </div>

          {/* Buying Signals */}
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Buying Signals</span>
              <span className="text-[28px] font-semibold text-zinc-100 mt-1 leading-none">48</span>
              <span className="text-[11px] text-emerald-500 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +18% vs yesterday
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4 text-zinc-400" />
            </div>
          </div>

          {/* Alerts Triggered */}
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Alerts Triggered</span>
              <span className="text-[28px] font-semibold text-zinc-100 mt-1 leading-none">{alerts.length}</span>
              <span className={`text-[11px] mt-2 flex items-center gap-1.5 ${alerts.length > 0 ? "text-rose-500" : "text-zinc-500"}`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                {alerts.length > 0 ? "Requires action profile" : "No active warnings"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-zinc-400" />
            </div>
          </div>

          {/* Overall Market Index */}
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Market Score</span>
              <span className="text-[28px] font-semibold text-zinc-100 mt-1 leading-none">78 <span className="text-[15px] text-zinc-600 font-normal">/ 100</span></span>
              <span className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-zinc-500" />
                Baseline stable
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* ── Row 2: AI Agents | Live Feed | Alerts ── */}
        <div className="grid grid-cols-12 gap-4">
          {/* AI Agents Monitoring */}
          <div className="col-span-4 bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold text-zinc-300">Active GTM Agents</h3>
                <span className="text-[11px] text-zinc-500">Live monitoring</span>
              </div>
              <div className="divide-y divide-zinc-800">
                {agents.map((agent) => (
                  <div key={agent.name} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[12.5px] font-medium text-zinc-200">{agent.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                          agent.status === "Active" ? "border-emerald-950 text-emerald-500 bg-emerald-950/20" : "border-zinc-800 text-zinc-500"
                        }`}>{agent.status}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate">{agent.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between">
              <button
                onClick={() => runBriefing()}
                className="w-full text-center text-[12px] text-zinc-300 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
              >
                Scan Workspace Data
              </button>
            </div>
          </div>

          {/* Live Intelligence Feed */}
          <div className="col-span-4 bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold text-zinc-300">Live Intelligence Feed</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="divide-y divide-zinc-800 max-h-[220px] overflow-y-auto pr-1">
                {feedItems.map((item, idx) => (
                  <div key={idx} className="py-2.5 space-y-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-[10px] text-zinc-500 shrink-0">{item.time}</span>
                      <span className="text-[9px] font-medium px-1 bg-zinc-800 text-zinc-400 rounded shrink-0">{item.tag}</span>
                    </div>
                    <p className="text-[12px] text-zinc-300 leading-normal">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Critical Warnings / Active Alerts */}
          <div className="col-span-4 bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold text-zinc-300">Workspace Threat Alerts</h3>
                <span className="text-[11px] text-zinc-500">{alerts.length} Warnings</span>
              </div>
              <div className="divide-y divide-zinc-800 max-h-[220px] overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-[12px] text-zinc-500">No active warnings in stream.</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="py-2.5 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: alert.severity === 'CRITICAL' ? '#f43f5e' : alert.severity === 'HIGH' ? '#f59e0b' : '#3b82f6' }} />
                          <h4 className="text-[12.5px] font-medium text-zinc-200 truncate block">{alert.title}</h4>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{alert.agentOrigin} • {alert.timestamp}</p>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-[10px] border border-zinc-800 hover:border-zinc-700 bg-zinc-900 px-2 py-0.5 rounded text-zinc-400 shrink-0 cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: Simple Buying Signals Graph & Watchlist ── */}
        <div className="grid grid-cols-12 gap-4">
          {/* Signal chart */}
          <div className="col-span-5 bg-[#18181b] border border-zinc-800 rounded-xl p-4">
            <h3 className="text-[13px] font-semibold text-zinc-300 mb-4">Buying Signals (Last 15 days)</h3>
            <div className="h-[120px] w-full flex items-end justify-between gap-1.5 pt-2">
              {chartPoints.map((val, idx) => {
                const heightPct = `${(val / 80) * 100}%`;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full bg-zinc-800 group-hover:bg-zinc-600 rounded transition-colors relative" style={{ height: heightPct }}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 text-zinc-300">
                        {val} sig
                      </span>
                    </div>
                    <span className="text-[9px] text-zinc-600 select-none">{idx + 10}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Competitors watchlist */}
          <div className="col-span-4 bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold text-zinc-300">Tracked Competitors Watchlist</h3>
                <button
                  onClick={() => setIsCompetitorModalOpen(true)}
                  className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              </div>
              <div className="divide-y divide-zinc-800 max-h-[140px] overflow-y-auto pr-1">
                {competitors.map((c) => (
                  <div key={c.name} className="py-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-400 shrink-0">
                        {c.logo}
                      </div>
                      <span className="text-[12px] font-medium text-zinc-200 truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-zinc-500">Activity score</span>
                      <span className="text-[12px] font-semibold text-zinc-200 w-8 text-right">{c.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Matrix */}
          <div className="col-span-3 bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-[13px] font-semibold text-zinc-300 mb-3">Diagnostic Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {/* Run Briefing */}
                <button
                  onClick={() => runBriefing()}
                  className="p-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg hover:bg-zinc-800/50 transition-all text-left flex flex-col justify-between h-20 cursor-pointer text-zinc-300"
                >
                  <Zap className="w-4 h-4 text-zinc-400" />
                  <span className="text-[11.5px] font-medium text-zinc-200 leading-tight">Run Briefing</span>
                </button>

                {/* Add competitor */}
                <button
                  onClick={() => setIsCompetitorModalOpen(true)}
                  className="p-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg hover:bg-zinc-800/50 transition-all text-left flex flex-col justify-between h-20 cursor-pointer text-zinc-300"
                >
                  <Eye className="w-4 h-4 text-zinc-400" />
                  <span className="text-[11.5px] font-medium text-zinc-200 leading-tight">Add Watch</span>
                </button>

                {/* Create Trigger */}
                <button
                  onClick={() => setIsAlertModalOpen(true)}
                  className="p-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg hover:bg-zinc-800/50 transition-all text-left flex flex-col justify-between h-20 cursor-pointer text-zinc-300"
                >
                  <Bell className="w-4 h-4 text-zinc-400" />
                  <span className="text-[11.5px] font-medium text-zinc-200 leading-tight">Alert Trigger</span>
                </button>

                {/* Export data */}
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="p-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg hover:bg-zinc-800/50 transition-all text-left flex flex-col justify-between h-20 cursor-pointer text-zinc-300"
                >
                  <Download className="w-4 h-4 text-zinc-400" />
                  <span className="text-[11.5px] font-medium text-zinc-200 leading-tight">Export XML</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODALS ─── */}

      {/* 1. New Briefing Setup Modal */}
      {isBriefingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[14.5px] font-semibold text-zinc-100">Setup GTM Briefing Scanner</h3>
              <button onClick={() => setBriefingOpen(false)} className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateBriefing} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-zinc-500">Competitor Domain</label>
                <input
                  type="text"
                  placeholder="e.g. competitor.com"
                  value={newBrief.domain}
                  onChange={(e) => setNewBrief({ ...newBrief, domain: e.target.value })}
                  className="w-full bg-[#18181b] border border-zinc-800 text-[13px] px-3 py-2 rounded text-zinc-200 focus:outline-none focus:border-zinc-650"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-zinc-500">Scan Pipeline</label>
                <select
                  value={newBrief.scanType}
                  onChange={(e) => setNewBrief({ ...newBrief, scanType: e.target.value })}
                  className="w-full bg-[#18181b] border border-zinc-800 text-[13px] px-3 py-2 rounded text-zinc-200 focus:outline-none focus:border-zinc-650"
                >
                  <option value="All">All Sources (Filing, CTA, Price)</option>
                  <option value="Pricing">Pricing Endpoints Only</option>
                  <option value="Regulatory">SEC Edgar / Patents Only</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBriefingOpen(false)}
                  className="px-3 py-1.5 border border-zinc-800 rounded text-[12.5px] text-zinc-400 hover:bg-zinc-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-100 text-zinc-950 rounded text-[12.5px] font-medium hover:bg-zinc-200 cursor-pointer"
                >
                  Initialize Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Track Competitor Modal */}
      {isCompetitorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[14.5px] font-semibold text-zinc-100">Add Watchlist Competitor</h3>
              <button onClick={() => setIsCompetitorModalOpen(false)} className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddCompetitor} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-zinc-500">Competitor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Datadog Inc."
                  value={newComp.name}
                  onChange={(e) => setNewComp({ ...newComp, name: e.target.value })}
                  className="w-full bg-[#18181b] border border-zinc-800 text-[13px] px-3 py-2 rounded text-zinc-200 focus:outline-none focus:border-zinc-650"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-zinc-500">Logo Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. DD"
                  value={newComp.logo}
                  onChange={(e) => setNewComp({ ...newComp, logo: e.target.value })}
                  className="w-full bg-[#18181b] border border-zinc-800 text-[13px] px-3 py-2 rounded text-zinc-200 focus:outline-none focus:border-zinc-650"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCompetitorModalOpen(false)}
                  className="px-3 py-1.5 border border-zinc-800 rounded text-[12.5px] text-zinc-400 hover:bg-zinc-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-100 text-zinc-950 rounded text-[12.5px] font-medium hover:bg-zinc-200 cursor-pointer"
                >
                  Track Footprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Create Alert Trigger Rule Modal */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[14.5px] font-semibold text-zinc-100">Setup Threat Trigger</h3>
              <button onClick={() => setIsAlertModalOpen(false)} className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateAlertRule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-zinc-500">Alert Title</label>
                <input
                  type="text"
                  placeholder="e.g. Dynamic Pricing Drop Identified"
                  value={newRule.title}
                  onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                  className="w-full bg-[#18181b] border border-zinc-800 text-[13px] px-3 py-2 rounded text-zinc-200 focus:outline-none focus:border-zinc-650"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-zinc-500">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Snowflake EMEA page changed pricing structure"
                  value={newRule.subtitle}
                  onChange={(e) => setNewRule({ ...newRule, subtitle: e.target.value })}
                  className="w-full bg-[#18181b] border border-zinc-800 text-[13px] px-3 py-2 rounded text-zinc-200 focus:outline-none focus:border-zinc-650"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-zinc-500">Severity Metric</label>
                <select
                  value={newRule.severity}
                  onChange={(e) => setNewRule({ ...newRule, severity: e.target.value })}
                  className="w-full bg-[#18181b] border border-zinc-800 text-[13px] px-3 py-2 rounded text-zinc-200 focus:outline-none focus:border-zinc-650"
                >
                  <option value="CRITICAL">CRITICAL (Red Index)</option>
                  <option value="HIGH">HIGH (Amber Index)</option>
                  <option value="MEDIUM">MEDIUM (Gray Index)</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAlertModalOpen(false)}
                  className="px-3 py-1.5 border border-zinc-800 rounded text-[12.5px] text-zinc-400 hover:bg-zinc-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-100 text-zinc-950 rounded text-[12.5px] font-medium hover:bg-zinc-200 cursor-pointer"
                >
                  Activate Trigger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Export Report Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[14.5px] font-semibold text-zinc-100">Export Analytics Report</h3>
              <button onClick={() => setIsExportModalOpen(false)} className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[12.5px] text-zinc-400">Generate structured corporate diagnostics metrics for GTM briefings.</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleExport("xml")}
                className="py-3 border border-zinc-800 bg-[#18181b] hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 font-mono text-[12px] rounded cursor-pointer"
              >
                Structured XML
              </button>
              <button
                onClick={() => handleExport("csv")}
                className="py-3 border border-zinc-800 bg-[#18181b] hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 font-mono text-[12px] rounded cursor-pointer"
              >
                CSV Table
              </button>
              <button
                onClick={() => handleExport("json")}
                className="py-3 border border-zinc-800 bg-[#18181b] hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 font-mono text-[12px] rounded cursor-pointer"
              >
                Raw JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}