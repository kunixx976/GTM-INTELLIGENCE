"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  BarChart2,
  Bell,
  Bot,
  FileText,
  GitBranch,
  Settings,
  HelpCircle,
  ChevronDown,
} from "lucide-react";





const navItems = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { label: "Competitors", path: "/dashboard/competitors", icon: Users },
  { label: "AI Insights", path: "/dashboard/insights", icon: Lightbulb },
  { label: "Market Intelligence", path: "/dashboard/market-intel", icon: BarChart2 },
  { label: "Alerts", path: "/dashboard/alerts", icon: Bell },
  { label: "Agents", path: "/dashboard/agents", icon: Bot },
  { label: "Reports", path: "/dashboard/reports", icon: FileText },
  { label: "Workflows", path: "/dashboard/workflows", icon: GitBranch },
];

const bottomItems = [
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
  { label: "Help & Support", path: "/dashboard/help", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-[155px] min-w-[155px] h-screen bg-[#0e0e16] border-r border-[#1e1e2e] overflow-hidden select-none">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[#1e1e2e]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] shrink-0">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold text-white">ShadowRep AI</span>
          <span className="text-[10px] text-[#6666aa]">Autonomous GTM</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 text-[13px] ${isActive
                  ? "bg-[#7c3aed] text-white"
                  : "text-[#8888aa] hover:text-[#ccccee] hover:bg-[#ffffff08]"
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="pb-3 px-2 border-t border-[#1e1e2e] pt-3 flex flex-col gap-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-[#8888aa] hover:text-[#ccccee] hover:bg-[#ffffff08] transition-all duration-150 text-[13px]">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}

        {/* Profile */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 mt-1 rounded-lg cursor-pointer hover:bg-[#ffffff08] transition-all">
          <div className="w-7 h-7 rounded-full bg-[#2a2a3a] flex items-center justify-center text-[11px] font-bold text-[#8888aa] shrink-0">
            DA
          </div>
          <div className="flex flex-col leading-tight flex-1 min-w-0">
            <span className="text-[12px] font-semibold text-[#ccccee] truncate">Divya Arora</span>
            <span className="text-[10px] text-[#6666aa]">Admin</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#6666aa] shrink-0" />
        </div>
      </div>
    </aside>
  );
}