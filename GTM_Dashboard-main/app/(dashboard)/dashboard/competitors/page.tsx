"use client";

import React, { useState, useEffect } from "react";
import { Plus, Eye, Trash2, ArrowUpRight, ShieldAlert, Globe, Compass, ExternalLink } from "lucide-react";

interface Competitor {
  name: string;
  logo: string;
  progress: number;
  color: string;
}

const DEFAULT_COMPETITORS: Competitor[] = [
  { name: "Salesforce", logo: "SF", progress: 92, color: "#3f3f46" },
  { name: "Snowflake",  logo: "SN", progress: 68, color: "#52525b" },
  { name: "Gong",       logo: "G",  progress: 61, color: "#71717a" },
  { name: "Clari",      logo: "CL", progress: 48, color: "#a1a1aa" },
  { name: "Outreach",   logo: "O",  progress: 32, color: "#d4d4d8" },
];

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [activeComp, setActiveComp] = useState<Competitor | null>(null);
  const [newCompName, setNewCompName] = useState("");
  const [newCompLogo, setNewCompLogo] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gtm_competitors");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCompetitors(parsed);
        if (parsed.length > 0) setActiveComp(parsed[0]);
      } else {
        setCompetitors(DEFAULT_COMPETITORS);
        localStorage.setItem("gtm_competitors", JSON.stringify(DEFAULT_COMPETITORS));
        setActiveComp(DEFAULT_COMPETITORS[0]);
      }
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim()) return;

    const added: Competitor = {
      name: newCompName,
      logo: newCompLogo.trim() || newCompName.substring(0, 2).toUpperCase(),
      progress: Math.floor(Math.random() * 40) + 40,
      color: "#52525b",
    };

    const updated = [added, ...competitors];
    setCompetitors(updated);
    localStorage.setItem("gtm_competitors", JSON.stringify(updated));
    setActiveComp(added);
    setNewCompName("");
    setNewCompLogo("");
  };

  const handleDelete = (name: string) => {
    const updated = competitors.filter((c) => c.name !== name);
    setCompetitors(updated);
    localStorage.setItem("gtm_competitors", JSON.stringify(updated));
    if (activeComp?.name === name) {
      setActiveComp(updated.length > 0 ? updated[0] : null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-zinc-200">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#1f1f22] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-medium text-zinc-100">Competitor Watchlist</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Track competitor landing pages, pricing schemas, and intent structures.</p>
        </div>
      </div>

      {/* Workspace splits */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: List & Form */}
        <div className="w-[340px] border-r border-[#1f1f22] flex flex-col justify-between overflow-y-auto">
          <div className="p-4 space-y-4">
            <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">Tracked Nodes</h3>
            <div className="space-y-1">
              {competitors.map((comp) => (
                <div
                  key={comp.name}
                  onClick={() => setActiveComp(comp)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                    activeComp?.name === comp.name ? "bg-zinc-800 text-zinc-100" : "hover:bg-zinc-900/50 text-zinc-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6.5 h-6.5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-bold">
                      {comp.logo}
                    </div>
                    <span className="text-[13px] font-medium truncate">{comp.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500">{comp.progress}%</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(comp.name);
                      }}
                      className="opacity-0 hover:opacity-100 group-hover:opacity-100 text-zinc-500 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick add */}
          <div className="p-4 border-t border-[#1f1f22] bg-[#0c0c0f]">
            <h4 className="text-[11px] font-semibold text-zinc-500 uppercase mb-2">Monitor New Domain</h4>
            <form onSubmit={handleAdd} className="space-y-2">
              <input
                type="text"
                placeholder="Competitor Name"
                value={newCompName}
                onChange={(e) => setNewCompName(e.target.value)}
                className="w-full bg-[#18181b] border border-zinc-800 text-[12.5px] px-2.5 py-1.5 rounded text-zinc-200 focus:outline-none focus:border-zinc-700"
                required
              />
              <input
                type="text"
                placeholder="Logo Abbreviation (e.g. SF)"
                value={newCompLogo}
                onChange={(e) => setNewCompLogo(e.target.value)}
                className="w-full bg-[#18181b] border border-zinc-800 text-[12.5px] px-2.5 py-1.5 rounded text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
              <button
                type="submit"
                className="w-full bg-zinc-200 text-zinc-950 font-medium py-1.5 rounded text-[12px] hover:bg-zinc-300 transition-colors cursor-pointer"
              >
                Track Footprint
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Competitor Detail analysis */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeComp ? (
            <div className="space-y-6">
              {/* Profile Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[18px] font-bold text-zinc-300">
                    {activeComp.logo}
                  </div>
                  <div>
                    <h2 className="text-[18px] font-medium text-zinc-100">{activeComp.name}</h2>
                    <div className="flex items-center gap-3 mt-1 text-[12.5px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" />
                        {activeComp.name.toLowerCase()}.com
                      </span>
                      <span>•</span>
                      <span className="text-emerald-500 font-medium">Scanning Node Active</span>
                    </div>
                  </div>
                </div>
                <a
                  href={`https://${activeComp.name.toLowerCase()}.com`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[12px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded hover:bg-zinc-800 transition-all"
                >
                  Visit Site <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4">
                  <span className="text-[11px] uppercase text-zinc-500 font-semibold">GTM Activity Index</span>
                  <div className="text-[24px] font-semibold text-zinc-100 mt-1">{activeComp.progress}%</div>
                  <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-400 rounded-full" style={{ width: `${activeComp.progress}%` }} />
                  </div>
                </div>

                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4">
                  <span className="text-[11px] uppercase text-zinc-500 font-semibold">Pricing Anomaly Status</span>
                  <div className="text-[14px] font-medium text-emerald-400 mt-1 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    STABLE_NODE
                  </div>
                  <span className="text-[11px] text-zinc-500 block mt-2">Verified 18 minutes ago</span>
                </div>

                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4">
                  <span className="text-[11px] uppercase text-zinc-500 font-semibold">Threat Threshold Level</span>
                  <div className="text-[14px] font-medium text-amber-500 mt-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    MODERATE_THREAT
                  </div>
                  <span className="text-[11px] text-zinc-500 block mt-2">Intent score: 71/100</span>
                </div>
              </div>

              {/* Automated Competitor SWAT Summary */}
              <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5 space-y-3">
                <h3 className="text-[13px] font-semibold text-zinc-300">Autonomous SWAT Profiling</h3>
                <p className="text-[12.5px] text-zinc-400 leading-relaxed">
                  Active monitoring indicates structured pivot signals in product value propositions. Dynamic web scanning
                  crawled recent updates on enterprise deployment setups showing layout structure optimizations. Buying signal logs
                  indicate intent targets primarily in telemetry and GTM workflow segments.
                </p>
                <div className="pt-2 grid grid-cols-2 gap-4 text-[12px]">
                  <div className="bg-zinc-900/50 p-2.5 rounded border border-zinc-800">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Key Strengths</span>
                    <span className="text-zinc-300">Scalable enterprise deployment base, rapid regional GTM expansion</span>
                  </div>
                  <div className="bg-zinc-900/50 p-2.5 rounded border border-zinc-800">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Vulnerability Vector</span>
                    <span className="text-zinc-300">Restructured core value proposition pricing could prompt churn risk</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center space-y-2">
              <span className="text-[13px] text-zinc-500 block">No competitor selected.</span>
              <p className="text-[12px] text-zinc-600">Track a new competitor footprint below to begin intelligence streaming.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}