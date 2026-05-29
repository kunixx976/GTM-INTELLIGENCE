"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle2 } from "lucide-react";

interface FAQ {
  q: string;
  a: string;
}

const FAQS: FAQ[] = [
  {
    q: "How frequently do the scraping crawlers run?",
    a: "By default, active scanning nodes query competitor digital footprints (pricing tables, landing page structures, patent listings) every 18 minutes. This frequency can be customized in the GTM Workflows section.",
  },
  {
    q: "How does the AI model evaluate Competitor Threat Levels?",
    a: "ShadowRep employs heuristic cognitive scoring models that evaluate landing page text shifts, corporate hiring profiles, and pricing modifications. These indicators are weighted to produce an aggregate Risk Score (1-100).",
  },
  {
    q: "Can I connect custom webhook endpoints?",
    a: "Yes. In the Diagnostics & Settings section, you can configure custom Slack webhook URLs. Dynamic alert triggers will automatically dispatch structured telemetry payloads directly to these channels.",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-zinc-200">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#1f1f22] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-medium text-zinc-100">Help & Documentation</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Explore active scanning architectures and submit diagnostic support tickets.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Side: FAQ indices */}
        <div className="col-span-7 p-6 overflow-y-auto space-y-4">
          <h3 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">Frequently Asked Questions</h3>
          <div className="space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#18181b] border border-zinc-800 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 flex items-center justify-between text-[13.5px] font-medium text-zinc-200 hover:bg-zinc-800/40 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-[12.5px] text-zinc-400 leading-relaxed border-t border-zinc-900/40 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Ticket Submission */}
        <div className="col-span-5 border-l border-[#1f1f22] p-6 bg-[#0c0c0f] overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-zinc-500" />
              <h3 className="text-[13.5px] font-semibold text-zinc-300">Submit Support Ticket</h3>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-950/20 border border-emerald-900 rounded-xl p-5 text-center space-y-2.5 py-10">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-[13.5px] font-semibold text-emerald-500">Ticket submitted successfully</h4>
                <p className="text-[12.5px] text-zinc-500 leading-normal">
                  ShadowRep engineering logs are associated with this diagnostics ticket. A developer will review your request.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setTicketSubject("");
                    setTicketDesc("");
                  }}
                  className="text-[11.5px] text-zinc-400 underline hover:text-zinc-200 mt-2 block mx-auto cursor-pointer"
                >
                  Create another ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-500">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Ingestion latency anomaly"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-800 text-[12.5px] px-3 py-2 rounded text-zinc-200 focus:outline-none focus:border-zinc-700"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-500">Description</label>
                  <textarea
                    placeholder="Provide details on the node or configuration anomaly..."
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-800 text-[12.5px] px-3 py-2 rounded text-zinc-200 focus:outline-none focus:border-zinc-700 h-32"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium text-[12.5px] rounded-lg transition-colors cursor-pointer border border-zinc-300"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
