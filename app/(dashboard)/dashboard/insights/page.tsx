"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Terminal, Filter, RefreshCw, Send, Brain, Eye } from "lucide-react";

interface FeedItem {
  time: string;
  text: string;
  tag: string;
  tagColor: string;
}

const DEFAULT_FEED_ITEMS: FeedItem[] = [
  { time: "2m ago",  text: "Snowflake expands platform with AI Data Cloud capabilities",          tag: "COMPETITOR",    tagColor: "#3b82f6" },
  { time: "7m ago",  text: "Salesforce launches new industry cloud for manufacturing",             tag: "COMPETITOR",    tagColor: "#3b82f6" },
  { time: "12m ago", text: 'High buying intent detected for "revenue intelligence platform"',     tag: "BUYING SIGNAL", tagColor: "#a855f7" },
  { time: "18m ago", text: "New funding round: Gong raises $200M Series E",                       tag: "COMPETITOR",    tagColor: "#3b82f6" },
];

export default function InsightsPage() {
  const [signals, setSignals] = useState<FeedItem[]>([]);
  const [filterTag, setFilterTag] = useState<string>("ALL");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gtm_feed");
      if (stored) {
        setSignals(JSON.parse(stored));
      } else {
        setSignals(DEFAULT_FEED_ITEMS);
        localStorage.setItem("gtm_feed", JSON.stringify(DEFAULT_FEED_ITEMS));
      }
    }
  }, []);

  const handleTriggerReport = () => {
    setIsGenerating(true);
    setAiReport("Parsing workspace nodes...");
    
    const steps = [
      "Defragmenting signals across 25 nodes...",
      "Correlating Snowflake platform expansion with buyer intent vectors...",
      "Distilling competitive battlecard summaries...",
      "Report finalized:\n\n1. Snowflake expands AI Data Cloud capabilities, triggering a 23% intent spike in database metrics.\n2. Salesforce pricing layouts adjusted in Manufacturing sectors, suggesting target account capture shifts.\n3. Dynamic intelligence indicates Grafana Labs is targeting telemetry segments in EMEA with lower entry pricing tiers."
    ];

    steps.forEach((txt, idx) => {
      setTimeout(() => {
        setAiReport(txt);
        if (idx === steps.length - 1) {
          setIsGenerating(false);
        }
      }, (idx + 1) * 900);
    });
  };

  const tags = ["ALL", "COMPETITOR", "BUYING SIGNAL", "SYSTEM SIGNAL"];
  const filteredSignals = filterTag === "ALL" ? signals : signals.filter(s => s.tag === filterTag);

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-zinc-200">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#1f1f22] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-medium text-zinc-100">GTM AI Insights</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Automated strategic takeaways synthesized from raw digital market records.</p>
        </div>
        <button
          onClick={handleTriggerReport}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 text-zinc-950 font-medium text-[13px] rounded-lg transition-all cursor-pointer border border-zinc-300"
        >
          <Brain className="w-4 h-4" />
          {isGenerating ? "Synthesizing..." : "Generate GTM Brief"}
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left pane: feed list */}
        <div className="col-span-7 border-r border-[#1f1f22] flex flex-col overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3 border-b border-[#1f1f22] bg-[#0c0c0f] flex items-center gap-1.5 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setFilterTag(t)}
                className={`text-[11px] px-2 py-0.5 rounded border transition-all cursor-pointer whitespace-nowrap ${
                  filterTag === t ? "border-zinc-500 text-zinc-100 bg-zinc-800" : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredSignals.length === 0 ? (
              <div className="py-20 text-center">
                <span className="text-[12.5px] text-zinc-500">No signals matched the filter node.</span>
              </div>
            ) : (
              filteredSignals.map((sig, idx) => (
                <div key={idx} className="bg-[#18181b] border border-zinc-850 rounded-xl p-4 space-y-2 hover:border-zinc-800 transition-colors">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-[11px] font-semibold text-zinc-500">{sig.time}</span>
                    <span className="text-[9.5px] font-bold px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded uppercase">
                      {sig.tag}
                    </span>
                  </div>
                  <p className="text-[13px] text-zinc-200 leading-relaxed font-sans">{sig.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right pane: AI synthesiser display */}
        <div className="col-span-5 flex flex-col overflow-hidden p-6 bg-[#0c0c0f]">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-zinc-500" />
            <h3 className="text-[13px] font-semibold text-zinc-300">Cognitive Report Panel</h3>
          </div>

          <div className="flex-1 bg-black/40 border border-zinc-900 rounded-xl p-4 font-mono text-[12px] leading-relaxed text-zinc-400 overflow-y-auto whitespace-pre-wrap select-text">
            {aiReport ? (
              aiReport
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-zinc-600">
                <Brain className="w-8 h-8 opacity-40" />
                <p>Click "Generate GTM Brief" above to aggregate and synthesize active competitor signals into a comprehensive tactical brief.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}