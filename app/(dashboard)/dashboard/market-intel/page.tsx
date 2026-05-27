"use client";

import React, { useState } from "react";
import { BarChart2, ShieldAlert, FileText, CheckCircle2, ChevronRight, Search } from "lucide-react";

interface Filing {
  id: string;
  competitor: string;
  formType: string;
  date: string;
  summary: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
}

const DEFAULT_FILINGS: Filing[] = [
  {
    id: "sec-1",
    competitor: "Snowflake Inc.",
    formType: "Form 8-K",
    date: "May 25, 2026",
    summary: "Disclosed material expansion of AI platform collaborations and GPU infrastructure lease arrangements.",
    impact: "HIGH",
  },
  {
    id: "sec-2",
    competitor: "Salesforce Inc.",
    formType: "Form 10-Q",
    date: "May 22, 2026",
    summary: "Quarterly performance reports show a 23% intent spike in manufacturing industry cloud sectors, offset by higher acquisition costs.",
    impact: "MEDIUM",
  },
  {
    id: "sec-3",
    competitor: "Confluent Inc.",
    formType: "Form 8-K",
    date: "May 18, 2026",
    summary: "Amended executive performance compensation structures and announced EMEA field operations restructuring plans.",
    impact: "LOW",
  },
];

export default function MarketIntelPage() {
  const [filings, setFilings] = useState<Filing[]>(DEFAULT_FILINGS);
  const [activeFiling, setActiveFiling] = useState<Filing | null>(DEFAULT_FILINGS[0]);
  const [search, setSearch] = useState("");

  const filtered = filings.filter(
    (f) =>
      f.competitor.toLowerCase().includes(search.toLowerCase()) ||
      f.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-zinc-200">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#1f1f22] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-medium text-zinc-100">Market Intelligence</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Scans SEC Edgar filings, patents databases, and major corporate declarations.</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left List */}
        <div className="w-[360px] border-r border-[#1f1f22] flex flex-col overflow-hidden bg-[#0c0c0f]">
          {/* Search bar */}
          <div className="p-3 border-b border-[#1f1f22] flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <input
              type="text"
              placeholder="Search filings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#18181b] border border-zinc-800 text-[12.5px] px-2.5 py-1.5 rounded text-zinc-200 w-full focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.map((filing) => (
              <div
                key={filing.id}
                onClick={() => setActiveFiling(filing)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  activeFiling?.id === filing.id
                    ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                    : "border-zinc-850 bg-[#18181b] hover:border-zinc-850 hover:bg-zinc-900/50 text-zinc-400"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[12px] font-medium text-zinc-200">{filing.competitor}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    filing.impact === "HIGH" ? "bg-rose-950/20 text-rose-400 border border-rose-950" :
                    filing.impact === "MEDIUM" ? "bg-amber-950/20 text-amber-400 border border-amber-950" :
                    "bg-zinc-800 text-zinc-400 border border-zinc-750"
                  }`}>{filing.impact}</span>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>{filing.formType}</span>
                  <span>{filing.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {activeFiling ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">SEC Ingestion Pipeline Active</span>
                  <h2 className="text-[18px] font-medium text-zinc-100 mt-2">{activeFiling.competitor}</h2>
                  <p className="text-[12.5px] text-zinc-500 mt-1">{activeFiling.formType} • Filed on {activeFiling.date}</p>
                </div>
              </div>

              {/* Ingestion Report */}
              <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5 space-y-3 font-sans">
                <h3 className="text-[13px] font-semibold text-zinc-300">Extracted Tactical Summary</h3>
                <p className="text-[13px] text-zinc-300 leading-relaxed">
                  {activeFiling.summary}
                </p>
                <p className="text-[12px] text-zinc-500 leading-normal">
                  ShadowRep autonomous parsing nodes successfully monitored the Edgar RSS endpoints.
                  The document has been scanned, indexed, and correlated with existing competitor GTM threat footprints.
                </p>
              </div>

              {/* Action Recommendation */}
              <div className="border border-zinc-800 bg-[#0c0c0f] rounded-xl p-4 flex gap-3.5 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-[13px] font-semibold text-zinc-300">Recommended Battlecard Action</h4>
                  <p className="text-[12px] text-zinc-500 leading-relaxed">
                    Update marketing assets and value deck modules associated with {activeFiling.competitor}. Flag accounts
                    interested in scalable database telemetry blocks.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <span className="text-[12.5px] text-zinc-500">Select a filing report on the side menu to examine SEC data details.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
