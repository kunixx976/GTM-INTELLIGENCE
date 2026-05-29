"use client";

import React from "react";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function DashboardCard({
  title,
  subtitle,
  children,
  className = "",
  headerAction
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative hud-corners border border-slate-800 bg-[#070c17]/90 p-4 shadow-2xl backdrop-blur-md ${className}`}
    >
      {/* Top corner brackets indicators */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500" />

      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
        <div className="font-mono">
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {headerAction && <div className="text-xs">{headerAction}</div>}
      </div>

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
