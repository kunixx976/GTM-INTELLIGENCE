"use client";

import React, { useState } from "react";
import { FileText, Download, Eye, Calendar, Clock, BarChart } from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  size: string;
  status: "READY" | "GENERATING";
}

const DEFAULT_REPORTS: Report[] = [
  { id: "rep-1", title: "Monthly Competitor Pricing Audit", type: "PDF Document", date: "May 24, 2026", size: "2.4 MB", status: "READY" },
  { id: "rep-2", title: "Autonomous GTM Buyer Intent Vector Anomaly Analysis", type: "CSV Spreadsheet", date: "May 20, 2026", size: "1.8 MB", status: "READY" },
  { id: "rep-3", title: "EMEA Regional Competitive Strategy Briefing", type: "JSON Report", date: "May 15, 2026", size: "512 KB", status: "READY" },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(DEFAULT_REPORTS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDownload = (title: string) => {
    triggerToast(`Initiating download: ${title}...`);
    setTimeout(() => {
      triggerToast(`Successfully downloaded: ${title}`);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-zinc-200">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#1f1f22] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-medium text-zinc-100">GTM Reports & Briefings</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Download structured competitive records, pricing summaries, and audit logs.</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">Available Packages</h3>
        <div className="grid grid-cols-3 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-colors h-48"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-zinc-400" />
                  </div>
                  <span className="text-[9.5px] font-bold px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded uppercase">
                    {report.type.split(" ")[0]}
                  </span>
                </div>
                <h4 className="text-[13.5px] font-medium text-zinc-200 leading-snug line-clamp-2">{report.title}</h4>
              </div>

              <div className="pt-3 border-t border-zinc-900/60 flex items-center justify-between">
                <div className="flex flex-col text-[10px] text-zinc-500">
                  <span>{report.date}</span>
                  <span>{report.size}</span>
                </div>
                <button
                  onClick={() => handleDownload(report.title)}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded transition-all text-zinc-300 cursor-pointer"
                >
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast notifications */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 bg-zinc-950 border border-zinc-800 text-zinc-200 px-4 py-2.5 rounded-lg shadow-xl text-[12.5px] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {toastMsg}
        </div>
      )}
    </div>
  );
}
