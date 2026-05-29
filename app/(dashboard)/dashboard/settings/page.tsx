"use client";

import React, { useState } from "react";
import { Settings2, Shield, Eye, EyeOff, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("YOUR_API_KEY");
  const [showKey, setShowKey] = useState(false);
  const [slackUrl, setSlackUrl] = useState("YOUR_SLACK_WEBHOOK_URL");
  const [activeModel, setActiveModel] = useState("gemini-3.5-flash");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("Settings saved and updated successfully");
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-zinc-200">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#1f1f22] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-medium text-zinc-100">Diagnostics & Settings</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Configure cognitive models, workspace API tokens, and Slack alerts webhooks.</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          {/* API Keys */}
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
              <Shield className="w-4 h-4 text-zinc-400" />
              <h3 className="text-[13.5px] font-semibold text-zinc-300">Authentication & Workspace Tokens</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-zinc-500">Workspace API Secret Key</label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-[12.5px] px-3 py-2 rounded pr-10 text-zinc-300 focus:outline-none focus:border-zinc-700 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-zinc-500 block">Use this secret key to authenticate custom GTM scraper webhooks.</span>
            </div>
          </div>

          {/* Webhooks integration */}
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
              <Settings2 className="w-4 h-4 text-zinc-400" />
              <h3 className="text-[13.5px] font-semibold text-zinc-300">Third-Party Channels</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-zinc-500">Slack Webhook URL</label>
              <input
                type="text"
                value={slackUrl}
                onChange={(e) => setSlackUrl(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-[12.5px] px-3 py-2 rounded text-zinc-300 focus:outline-none focus:border-zinc-700 font-mono"
                required
              />
              <span className="text-[11px] text-zinc-500 block">Threat alarms will post structured messages to this endpoint channel.</span>
            </div>
          </div>

          {/* AI Model Configurations */}
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
              <Settings2 className="w-4 h-4 text-zinc-400" />
              <h3 className="text-[13.5px] font-semibold text-zinc-300">Cognitive Orchestrator Model</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-zinc-500">Active Pipeline Inference Model</label>
              <select
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-[13px] px-3 py-2 rounded text-zinc-300 focus:outline-none focus:border-zinc-700"
              >
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Optimized Speed)</option>
                <option value="gemini-3.5-pro">Gemini 3.5 Pro (Deep Strategy Reasoning)</option>
                <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (High Accuracy)</option>
              </select>
              <span className="text-[11px] text-zinc-500 block">Select the model which processes competitor web updates.</span>
            </div>
          </div>

          {/* Form action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium text-[13px] rounded-lg transition-colors cursor-pointer border border-zinc-300"
            >
              <Save className="w-4 h-4" /> Save Diagnostics
            </button>
          </div>
        </form>
      </div>

      {/* Toast notifications */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-zinc-950 border border-zinc-800 text-zinc-200 px-4 py-2.5 rounded-lg shadow-xl text-[12.5px] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}