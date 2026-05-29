"use client";

import React, { useState, useEffect } from "react";
import { Bot, Play, Pause, Terminal, Settings2, BarChart2, ShieldAlert } from "lucide-react";

interface Agent {
  name: string;
  description: string;
  status: "Active" | "Idle";
  progress: number;
  color: string;
}

const DEFAULT_AGENTS: Agent[] = [
  { name: "Competitor Hunter", description: "Tracking 25 competitors", status: "Active", progress: 92, color: "#10b981" },
  { name: "Market Sentinel",   description: "Scanning market shifts",   status: "Active", progress: 88, color: "#10b981" },
  { name: "Deal Whisperer",    description: "Analyzing buying intent",  status: "Active", progress: 75, color: "#10b981" },
  { name: "Content Radar",     description: "Monitoring content gaps",  status: "Idle",   progress: 35, color: "#f59e0b" },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gtm_agents");
      if (stored) {
        const parsed = JSON.parse(stored);
        setAgents(parsed);
        if (parsed.length > 0) setActiveAgent(parsed[0]);
      } else {
        setAgents(DEFAULT_AGENTS);
        localStorage.setItem("gtm_agents", JSON.stringify(DEFAULT_AGENTS));
        setActiveAgent(DEFAULT_AGENTS[0]);
      }
    }
  }, []);

  const toggleAgentStatus = (name: string) => {
    const updated = agents.map((a) => {
      if (a.name === name) {
        const nextStatus = a.status === "Active" ? "Idle" : "Active";
        const nextColor = nextStatus === "Active" ? "#10b981" : "#f59e0b";
        return { ...a, status: nextStatus, color: nextColor } as Agent;
      }
      return a;
    });
    setAgents(updated);
    localStorage.setItem("gtm_agents", JSON.stringify(updated));
    if (activeAgent?.name === name) {
      setActiveAgent(updated.find((a) => a.name === name) || null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-zinc-200">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#1f1f22] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-medium text-zinc-100">AI Agents Orchestrator</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Manage, configure, and monitor your autonomous target market intelligence crawlers.</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Agent List */}
        <div className="w-[340px] border-r border-[#1f1f22] p-4 space-y-4 overflow-y-auto bg-[#0c0c0f]">
          <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">Monitored Archetypes</h3>
          <div className="space-y-2">
            {agents.map((agent) => (
              <div
                key={agent.name}
                onClick={() => setActiveAgent(agent)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeAgent?.name === agent.name
                    ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                    : "border-zinc-850 bg-[#18181b] hover:border-zinc-800 hover:bg-zinc-900/50 text-zinc-400"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] font-medium text-zinc-200">{agent.name}</span>
                  <span className="text-[11px]" style={{ color: agent.color }}>
                    {agent.status}
                  </span>
                </div>
                <p className="text-[11.5px] text-zinc-500 leading-normal mb-2">{agent.description}</p>
                <div className="flex justify-end gap-1.5 pt-1 border-t border-zinc-900/40">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAgentStatus(agent.name);
                    }}
                    className="flex items-center gap-1 text-[10px] px-2 py-0.5 border border-zinc-700 hover:border-zinc-500 bg-zinc-900 text-zinc-300 rounded cursor-pointer"
                  >
                    {agent.status === "Active" ? (
                      <>
                        <Pause className="w-3 h-3" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-emerald-500" /> Start
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Detailed logs / run configs */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {activeAgent ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-medium text-zinc-100">{activeAgent.name}</h2>
                    <p className="text-[12.5px] text-zinc-500 mt-0.5">{activeAgent.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeAgent.color }} />
                  <span className="text-[12.5px] font-medium text-zinc-400">Agent {activeAgent.status}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4">
                  <span className="text-[11px] uppercase text-zinc-500 font-semibold">Active Pipeline Progress</span>
                  <div className="text-[22px] font-semibold text-zinc-200 mt-1">{activeAgent.progress}%</div>
                  <div className="h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-zinc-400" style={{ width: `${activeAgent.progress}%` }} />
                  </div>
                </div>

                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4">
                  <span className="text-[11px] uppercase text-zinc-500 font-semibold">Inference Latency</span>
                  <div className="text-[22px] font-semibold text-zinc-200 mt-1">12ms</div>
                  <span className="text-[11px] text-zinc-500 block mt-2">Ultra low latency nodes</span>
                </div>

                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4">
                  <span className="text-[11px] uppercase text-zinc-500 font-semibold">Allocated Model Token Cost</span>
                  <div className="text-[22px] font-semibold text-zinc-200 mt-1">0.024¢ <span className="text-[11px] font-normal text-zinc-500">/ 1k tkn</span></div>
                  <span className="text-[11px] text-zinc-500 block mt-2">Standard pipeline efficiency</span>
                </div>
              </div>

              {/* Real-time telemetry log */}
              <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4 space-y-3 font-mono text-[12px] text-zinc-400">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                  <span className="text-[11px] font-semibold uppercase text-zinc-500">Cognitive Execution Log</span>
                  <span className="text-[10px] text-zinc-600">STDOUT</span>
                </div>
                <div className="space-y-1.5 leading-relaxed bg-black/30 p-3 rounded border border-zinc-900 h-32 overflow-y-auto">
                  <div>&gt; Initialized model weight vectors context.</div>
                  <div>&gt; Accessing corporate registry DNS mappings...</div>
                  {activeAgent.status === "Active" ? (
                    <>
                      <div>&gt; Listening to live WebSocket signals stream on port 443.</div>
                      <div className="text-emerald-500">&gt; Scanning active node targets: Ingestion verified.</div>
                    </>
                  ) : (
                    <div className="text-amber-500">&gt; Operational state paused. Awaiting restart command trigger.</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <span className="text-[13.5px] text-zinc-500">No GTM Agent selected.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}