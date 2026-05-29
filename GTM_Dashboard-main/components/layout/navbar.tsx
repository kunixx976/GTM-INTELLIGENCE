"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, Sparkles, X, ShieldAlert, LogOut, Settings, HelpCircle } from "lucide-react";
import { useDashboardStore } from "../../store/useDashboardStore";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const {
    alerts,
    dismissAlert,
    setSearchOpen,
    isSearchOpen,
    setAiChatOpen,
    isAiChatOpen,
    triggerToast,
  } = useDashboardStore();

  const [isAlertMenuOpen, setIsAlertMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const alertRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (alertRef.current && !alertRef.current.contains(e.target as Node)) {
        setIsAlertMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    triggerToast("Logging out operator...");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <header className="flex items-center justify-between px-6 h-14 bg-[#09090b] border-b border-[#1f1f22] shrink-0 relative">
      {/* Search */}
      <div
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#8888aa] w-64 cursor-pointer hover:border-[#3f3f46] transition-colors"
      >
        <Search className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[13px] flex-1">Search anything...</span>
        <span className="text-[11px] bg-zinc-800 px-1.5 py-0.5 rounded text-[#8888aa]">⌘K</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Bell Alerts Trigger */}
        <div className="relative" ref={alertRef}>
          <button
            onClick={() => setIsAlertMenuOpen(!isAlertMenuOpen)}
            className="relative w-9 h-9 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center hover:border-[#3f3f46] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-zinc-400" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center text-[9px] font-bold text-zinc-950 border border-zinc-900">
                {alerts.length}
              </span>
            )}
          </button>

          {/* Active alerts dropdown overlay */}
          {isAlertMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 p-3 py-3 space-y-2.5 font-sans">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <span className="text-[12px] font-semibold text-zinc-300">Unresolved Incidents</span>
                <span className="text-[10px] text-zinc-500">{alerts.length} Active</span>
              </div>
              <div className="divide-y divide-zinc-900 max-h-60 overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <div className="py-6 text-center">
                    <span className="text-[11.5px] text-zinc-500">All threat matrices are cleared.</span>
                  </div>
                ) : (
                  alerts.map((al) => (
                    <div key={al.id} className="py-2.5 flex items-start justify-between gap-3 text-left">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: al.color }} />
                          <span className="text-[12px] font-medium text-zinc-200 truncate block">{al.title}</span>
                        </div>
                        <p className="text-[10.5px] text-zinc-500 mt-0.5 truncate">{al.subtitle}</p>
                      </div>
                      <button
                        onClick={() => dismissAlert(al.id)}
                        className="text-[9.5px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 cursor-pointer"
                      >
                        Triage
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sparkle/AI Drawer Trigger */}
        <button
          onClick={() => setAiChatOpen(true)}
          className="w-9 h-9 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center hover:border-[#3f3f46] transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-zinc-400" />
        </button>

        {/* Avatar Profile Trigger */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-9 h-9 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[12px] font-bold text-zinc-200 cursor-pointer hover:border-zinc-400 transition-colors"
          >
            DA
          </div>

          {/* Profile Dropdown panel */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 p-1.5 font-sans">
              <div className="px-3 py-2 border-b border-zinc-900 mb-1 leading-snug">
                <p className="text-[12.5px] font-medium text-zinc-200">Divya Arora</p>
                <p className="text-[10px] text-zinc-500">GTM Operator</p>
              </div>
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  router.push("/dashboard/settings");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[12.5px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                <Settings className="w-3.5 h-3.5" /> settings
              </button>
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  router.push("/dashboard/help");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[12.5px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Documentation
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[12.5px] text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border-t border-zinc-900/60 mt-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Terminate Session
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}