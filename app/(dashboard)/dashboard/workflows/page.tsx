"use client";

import React, { useState } from "react";
import { GitBranch, Plus, ToggleLeft, ToggleRight, Play, Server, AlertCircle } from "lucide-react";

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
}

const DEFAULT_WORKFLOWS: Workflow[] = [
  { id: "wf-1", name: "Datadog Pricing Alert Pipeline", trigger: "Competitor Price Shift Detected", action: "Post Rich Block to Slack #gtm-threats", active: true },
  { id: "wf-2", name: "SEC Edgar Crawler Syndication", trigger: "New 8-K / 10-K Ingested", action: "Trigger Cognitive Report & Email Exec Board", active: true },
  { id: "wf-3", name: "Intent Spike Marketing Campaign", trigger: "Buying Intent Score > 85", action: "Auto-add Target Accounts to Outreach Sequence", active: false },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(DEFAULT_WORKFLOWS);
  const [newWfName, setNewWfName] = useState("");
  const [newWfTrigger, setNewWfTrigger] = useState("Competitor Price Shift Detected");
  const [newWfAction, setNewWfAction] = useState("Post Rich Block to Slack #gtm-threats");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleActive = (id: string) => {
    setWorkflows(
      workflows.map((wf) => {
        if (wf.id === id) return { ...wf, active: !wf.active };
        return wf;
      })
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWfName.trim()) return;

    const added: Workflow = {
      id: Date.now().toString(),
      name: newWfName,
      trigger: newWfTrigger,
      action: newWfAction,
      active: true,
    };

    setWorkflows([...workflows, added]);
    setNewWfName("");
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-zinc-200">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#1f1f22] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-medium text-zinc-100">GTM Workflows</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Automate alerts, data dispatches, and trigger campaigns based on competitor actions.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-950 font-medium text-[13px] rounded-lg cursor-pointer border border-zinc-300"
        >
          <Plus className="w-4 h-4" /> New Workflow
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {/* Form panel */}
        {isFormOpen && (
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5 max-w-lg space-y-4">
            <h3 className="text-[13px] font-semibold text-zinc-300">Create Automation Workflow</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-zinc-500">Workflow Name</label>
                <input
                  type="text"
                  placeholder="e.g. Snowflake SEC filing alert"
                  value={newWfName}
                  onChange={(e) => setNewWfName(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 text-[12.5px] px-3 py-2 rounded text-zinc-200 focus:outline-none focus:border-zinc-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-500">When Trigger Occurs</label>
                  <select
                    value={newWfTrigger}
                    onChange={(e) => setNewWfTrigger(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-800 text-[12.5px] px-3 py-1.5 rounded text-zinc-200 focus:outline-none focus:border-zinc-700"
                  >
                    <option value="Competitor Price Shift Detected">Competitor Price Shift Detected</option>
                    <option value="New 8-K / 10-K Ingested">New SEC Filing Ingested</option>
                    <option value="Buying Intent Score > 85">Buying Intent Score &gt; 85</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-500">Execute Action</label>
                  <select
                    value={newWfAction}
                    onChange={(e) => setNewWfAction(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-800 text-[12.5px] px-3 py-1.5 rounded text-zinc-200 focus:outline-none focus:border-zinc-700"
                  >
                    <option value="Post Rich Block to Slack #gtm-threats">Post Rich Block to Slack #gtm-threats</option>
                    <option value="Trigger Cognitive Report & Email Exec Board">Trigger Report & Email Exec Board</option>
                    <option value="Auto-add Target Accounts to Outreach Sequence">Add to Outreach Sequence</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3 py-1.5 border border-zinc-800 rounded text-[12px] text-zinc-400 hover:bg-zinc-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-100 text-zinc-950 rounded text-[12px] font-medium hover:bg-zinc-200 cursor-pointer"
                >
                  Activate Workflow
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Workflow List */}
        <div className="space-y-3">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-6 hover:border-zinc-750 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <GitBranch className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[13.5px] font-medium text-zinc-200 truncate">{wf.name}</h4>
                  <div className="flex items-center gap-2 text-[11.5px] text-zinc-500">
                    <span className="font-mono text-zinc-400">WHEN</span>
                    <span>{wf.trigger}</span>
                    <span className="font-mono text-zinc-400">THEN</span>
                    <span>{wf.action}</span>
                  </div>
                </div>
              </div>

              <button onClick={() => toggleActive(wf.id)} className="text-zinc-400 hover:text-zinc-200 transition-colors shrink-0">
                {wf.active ? (
                  <ToggleRight className="w-8 h-8 text-zinc-300" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-zinc-650" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
