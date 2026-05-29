"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../components/layout/sidebar";
import { Navbar } from "../../components/layout/navbar";
import { useDashboardStore } from "../../store/useDashboardStore";
import { X, Search, Bot, Send, Loader } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // Zustand States
  const {
    alerts,
    initializeStore,
    isSearchOpen,
    setSearchOpen,
    isAiChatOpen,
    setAiChatOpen,
    chatMessages,
    sendChatMessage,
    toastMessage,
    isAiBriefingRunning,
    aiBriefingLogs,
    aiBriefingStep,
    setAiBriefingRunning,
  } = useDashboardStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [chatInput, setChatInput] = useState("");

  // Initialize Store
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Bind Command-K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  // Pages database for Command Palette
  const PAGES = [
    { name: "Overview Command Center", path: "/dashboard", desc: "Global telemetry statistics and workspace logs" },
    { name: "Competitors Tracking Profile", path: "/dashboard/competitors", desc: "Detailed SWAT profiles, domains, and scraper settings" },
    { name: "GTM AI Insights Terminal", path: "/dashboard/insights", desc: "Typewriter briefings synthesiser and correlated signals" },
    { name: "Market Intelligence SEC Edgar", path: "/dashboard/market-intel", desc: "Edgar filings index and financial change charts" },
    { name: "Workspace Threat Alerts", path: "/dashboard/alerts", desc: "Active system logs, alarms configuration, and triage rules" },
    { name: "AI Agent Orchestrator", path: "/dashboard/agents", desc: "Model parameters configurations and Play/Pause runtime stats" },
    { name: "GTM Reports package downloads", path: "/dashboard/reports", desc: "Exportable pricing spreadsheets and strategy PDFs" },
    { name: "Automations Workflows mapper", path: "/dashboard/workflows", desc: "Integrate trigger engines and webhook pipelines" },
    { name: "Diagnostics Settings & Webhooks", path: "/dashboard/settings", desc: "Credentials secret keys and model selector values" },
    { name: "Help documentation indices", path: "/dashboard/help", desc: "Crawler FAQs and support diagnostics ticketing" },
  ];

  const filteredPages = PAGES.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigate = (path: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(path);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput);
    setChatInput("");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-[#09090b]">
          {children}
        </main>
      </div>

      {/* ─── 1. GLOBAL COMMAND PALETTE (SEARCH) ─── */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-[15vh]">
          <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-zinc-900 shrink-0">
              <Search className="w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search GTM workspace tools, dashboards, and routes... (Esc to exit)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[13px] text-zinc-200 focus:outline-none placeholder-zinc-600"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
              <span className="text-[10px] font-semibold text-zinc-600 uppercase px-2 py-1 block">Navigation Routes</span>
              {filteredPages.length === 0 ? (
                <span className="text-[12px] text-zinc-500 px-2 py-4 block text-center">No GTM workspaces matched search index.</span>
              ) : (
                filteredPages.map((page) => (
                  <div
                    key={page.path}
                    onClick={() => handleNavigate(page.path)}
                    className="p-2.5 rounded-lg hover:bg-zinc-900 cursor-pointer flex flex-col gap-0.5 group transition-colors"
                  >
                    <span className="text-[12.5px] font-medium text-zinc-200 group-hover:text-zinc-100">{page.name}</span>
                    <span className="text-[11px] text-zinc-500">{page.desc}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. GLOBAL AI CHAT CONSOLE ─── */}
      {isAiChatOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col justify-between font-mono">
          <div className="p-4 border-b border-zinc-900 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-zinc-400" />
              <span className="text-[13px] font-semibold text-zinc-200">SHADOWREP_COGNITIVE_TERMINAL</span>
            </div>
            <button onClick={() => setAiChatOpen(false)} className="text-zinc-500 hover:text-zinc-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[12px]">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <span className="text-[10px] text-zinc-600 mb-0.5">{msg.sender === "user" ? "OPERATOR" : "COGNITIVE_CORE"}</span>
                <div className={`p-3 rounded-lg leading-normal max-w-[85%] border ${
                  msg.sender === "user" ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-[#18181b] border-zinc-900 text-zinc-300"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-4 border-t border-zinc-900 flex gap-2 shrink-0 bg-[#0c0c0f]">
            <input
              type="text"
              placeholder="Query agents..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-[#18181b] border border-zinc-800 text-[12.5px] px-3 py-2 rounded focus:outline-none focus:border-zinc-700 text-zinc-200 font-mono"
            />
            <button
              type="submit"
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 p-2 rounded cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ─── 3. GLOBAL TELEMETRY BRIEFING MODAL ─── */}
      {isAiBriefingRunning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4 font-mono">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <span className="text-[12px] font-semibold text-zinc-400 flex items-center gap-2">
                {aiBriefingStep < 4 ? <Loader className="w-3.5 h-3.5 animate-spin" /> : null}
                SHADOWREP_ORCHESTRATOR_RUN
              </span>
              <button
                onClick={() => setAiBriefingRunning(false)}
                className="text-zinc-500 hover:text-zinc-300"
                disabled={aiBriefingStep < 4}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-black/50 border border-zinc-900 rounded p-3 text-[11.5px] text-zinc-400 h-48 overflow-y-auto space-y-2">
              {aiBriefingLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 items-start leading-normal">
                  <span className="text-zinc-600">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
            {aiBriefingStep === 4 ? (
              <div className="bg-emerald-950/20 border border-emerald-900 rounded p-3 flex flex-col items-center justify-center text-center gap-1">
                <span className="text-[13px] font-semibold text-emerald-500">Briefing Ingestion Finished</span>
                <span className="text-[11px] text-zinc-500">Signal stream updated & threat alarm updated</span>
              </div>
            ) : null}
            <div className="flex justify-end pt-2">
              <button
                disabled={aiBriefingStep < 4}
                onClick={() => setAiBriefingRunning(false)}
                className={`px-4 py-1.5 rounded text-[12.5px] font-mono ${
                  aiBriefingStep < 4 ? "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed" : "bg-zinc-100 text-zinc-950 hover:bg-zinc-200 cursor-pointer"
                }`}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 4. GLOBAL TOAST ─── */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-zinc-950 border border-zinc-800 text-zinc-200 px-4 py-2.5 rounded-lg shadow-xl text-[12.5px] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}