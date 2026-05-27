"use client";

import { create } from "zustand";

export interface Alert {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  color: string;
}

export interface Competitor {
  name: string;
  logo: string;
  progress: number;
  color: string;
}

export interface FeedItem {
  time: string;
  text: string;
  tag: string;
  tagColor: string;
}

export interface Agent {
  name: string;
  description: string;
  status: "Active" | "Idle";
  progress: number;
  color: string;
}

interface DashboardStore {
  // Lists
  alerts: Alert[];
  competitors: Competitor[];
  feedItems: FeedItem[];
  agents: Agent[];

  // Modal / UI states
  isSearchOpen: boolean;
  isAiChatOpen: boolean;
  isBriefingOpen: boolean;
  isAiBriefingRunning: boolean;
  aiBriefingLogs: string[];
  aiBriefingStep: number;
  toastMessage: string | null;

  // AI Chat Messages
  chatMessages: { sender: "user" | "ai"; text: string }[];

  // Actions
  initializeStore: () => void;
  setSearchOpen: (open: boolean) => void;
  setAiChatOpen: (open: boolean) => void;
  setBriefingOpen: (open: boolean) => void;
  setAiBriefingRunning: (running: boolean) => void;
  triggerToast: (msg: string) => void;
  dismissAlert: (id: string) => void;
  resolveAllAlerts: () => void;
  addCompetitor: (name: string, logo: string) => void;
  deleteCompetitor: (name: string) => void;
  addAlertRule: (title: string, subtitle: string, severity: string) => void;
  sendChatMessage: (text: string) => void;
  runBriefing: () => void;
  toggleAgentStatus: (name: string) => void;
}

const DEFAULT_AGENTS: Agent[] = [
  { name: "Competitor Hunter", description: "Tracking 25 competitors", status: "Active", progress: 92, color: "#10b981" },
  { name: "Market Sentinel",   description: "Scanning market shifts",   status: "Active", progress: 88, color: "#10b981" },
  { name: "Deal Whisperer",    description: "Analyzing buying intent",  status: "Active", progress: 75, color: "#10b981" },
  { name: "Content Radar",     description: "Monitoring content gaps",  status: "Idle",   progress: 35, color: "#f59e0b" },
];

const DEFAULT_FEED_ITEMS: FeedItem[] = [
  { time: "2m ago",  text: "Snowflake expands platform with AI Data Cloud capabilities",          tag: "COMPETITOR",    tagColor: "#3b82f6" },
  { time: "7m ago",  text: "Salesforce launches new industry cloud for manufacturing",             tag: "COMPETITOR",    tagColor: "#3b82f6" },
  { time: "12m ago", text: 'High buying intent detected for "revenue intelligence platform"',     tag: "BUYING SIGNAL", tagColor: "#a855f7" },
  { time: "18m ago", text: "New funding round: Gong raises $200M Series E",                       tag: "COMPETITOR",    tagColor: "#3b82f6" },
];

const DEFAULT_ALERTS: Alert[] = [
  { id: "1", title: "Competitor undercut detected", subtitle: "Clari launched new pricing",       time: "5m",  color: "#f43f5e" },
  { id: "2", title: "Market shift detected",        subtitle: "AI adoption rate increased 23%",   time: "15m", color: "#f59e0b" },
  { id: "3", title: "High intent account identified", subtitle: "Acme Corp showing strong intent", time: "28m", color: "#f59e0b" },
];

const DEFAULT_COMPETITORS: Competitor[] = [
  { name: "Salesforce", logo: "SF", progress: 92, color: "#3f3f46" },
  { name: "Snowflake",  logo: "SN", progress: 68, color: "#52525b" },
  { name: "Gong",       logo: "G",  progress: 61, color: "#71717a" },
  { name: "Clari",      logo: "CL", progress: 48, color: "#a1a1aa" },
  { name: "Outreach",   logo: "O",  progress: 32, color: "#d4d4d8" },
];

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  alerts: [],
  competitors: [],
  feedItems: [],
  agents: [],

  isSearchOpen: false,
  isAiChatOpen: false,
  isBriefingOpen: false,
  isAiBriefingRunning: false,
  aiBriefingLogs: [],
  aiBriefingStep: 0,
  toastMessage: null,

  chatMessages: [
    { sender: "ai", text: "Autonomous GTM agent initialized. Type a query to scan market data..." },
  ],

  initializeStore: () => {
    if (typeof window === "undefined") return;

    const storedAgents = localStorage.getItem("gtm_agents");
    const storedFeed = localStorage.getItem("gtm_feed");
    const storedAlerts = localStorage.getItem("gtm_alerts");
    const storedComps = localStorage.getItem("gtm_competitors");

    set({
      agents: storedAgents ? JSON.parse(storedAgents) : DEFAULT_AGENTS,
      feedItems: storedFeed ? JSON.parse(storedFeed) : DEFAULT_FEED_ITEMS,
      alerts: storedAlerts ? JSON.parse(storedAlerts) : DEFAULT_ALERTS,
      competitors: storedComps ? JSON.parse(storedComps) : DEFAULT_COMPETITORS,
    });
  },

  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setAiChatOpen: (open) => set({ isAiChatOpen: open }),
  setBriefingOpen: (open) => set({ isBriefingOpen: open }),
  setAiBriefingRunning: (running) => set({ isAiBriefingRunning: running }),

  triggerToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => set({ toastMessage: null }), 3000);
  },

  dismissAlert: (id) => {
    const updated = get().alerts.filter((a) => a.id !== id);
    set({ alerts: updated });
    localStorage.setItem("gtm_alerts", JSON.stringify(updated));
    get().triggerToast("Alert resolved and dismissed successfully");
  },

  resolveAllAlerts: () => {
    set({ alerts: [] });
    localStorage.setItem("gtm_alerts", JSON.stringify([]));
    get().triggerToast("All alerts resolved successfully");
  },

  addCompetitor: (name, logo) => {
    const newComp: Competitor = {
      name,
      logo: logo || name.substring(0, 2).toUpperCase(),
      progress: Math.floor(Math.random() * 40) + 40,
      color: "#52525b",
    };
    const updated = [newComp, ...get().competitors];
    set({ competitors: updated });
    localStorage.setItem("gtm_competitors", JSON.stringify(updated));

    const newFeed: FeedItem = {
      time: "Just now",
      text: `Initialized tracking module for new competitor footprint: ${name}`,
      tag: "SYSTEM SIGNAL",
      tagColor: "#71717a",
    };
    const updatedFeed = [newFeed, ...get().feedItems];
    set({ feedItems: updatedFeed });
    localStorage.setItem("gtm_feed", JSON.stringify(updatedFeed));

    get().triggerToast(`Added ${name} to competitor watchlist`);
  },

  deleteCompetitor: (name) => {
    const updated = get().competitors.filter((c) => c.name !== name);
    set({ competitors: updated });
    localStorage.setItem("gtm_competitors", JSON.stringify(updated));
    get().triggerToast(`Removed ${name} from watchlist`);
  },

  addAlertRule: (title, subtitle, severity) => {
    const newAl: Alert = {
      id: Date.now().toString(),
      title,
      subtitle: subtitle || "Custom configured trigger fired",
      time: "1m",
      color: severity === "CRITICAL" ? "#f43f5e" : "#f59e0b",
    };
    const updated = [newAl, ...get().alerts];
    set({ alerts: updated });
    localStorage.setItem("gtm_alerts", JSON.stringify(updated));
    get().triggerToast("Custom alert rule saved and activated");
  },

  toggleAgentStatus: (name) => {
    const updated = get().agents.map((a) => {
      if (a.name === name) {
        const nextStatus = a.status === "Active" ? "Idle" : "Active";
        const nextColor = nextStatus === "Active" ? "#10b981" : "#f59e0b";
        return { ...a, status: nextStatus, color: nextColor } as Agent;
      }
      return a;
    });
    set({ agents: updated });
    localStorage.setItem("gtm_agents", JSON.stringify(updated));
  },

  sendChatMessage: (text) => {
    const userMsg = { sender: "user" as const, text };
    set((state) => ({ chatMessages: [...state.chatMessages, userMsg] }));

    setTimeout(() => {
      let reply = "I analyzed GTM databases. No direct threats detected in that sector.";
      const query = text.toLowerCase();
      if (query.includes("datadog")) {
        reply = "Datadog Inc. currently has a HIGH buying intent signals score (92/100). Recent activity includes 3 CTA alterations and standard pricing tiers adjustment in EMEA region (+18%).";
      } else if (query.includes("pricing")) {
        reply = "Average price shift across monitored sectors: +4.2% stable. Clari and Datadog recently modified pricing plans, while Snowflake remains stable.";
      } else if (query.includes("competitor")) {
        reply = `Active target competitors: ${get().competitors.map((c) => c.name).join(", ")}. Tracking a total footprint of 25 nodes globally.`;
      }
      set((state) => ({
        chatMessages: [...state.chatMessages, { sender: "ai" as const, text: reply }],
      }));
    }, 1000);
  },

  runBriefing: () => {
    set({
      isAiBriefingRunning: true,
      aiBriefingStep: 0,
      aiBriefingLogs: ["Booting ShadowRep search nodes...", "Connecting target endpoints..."],
    });

    const steps = [
      { delay: 1000, log: "Analyzing SEC Form 8-K records for recent filings..." },
      { delay: 2000, log: "Scraping competitor pricing pages & diffing HTML tables..." },
      { delay: 3000, log: "Running heuristic GTM buyer intent evaluation model..." },
      { delay: 4000, log: "Generated strategic brief: Found 3 high-impact competitor actions." },
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        set((state) => ({
          aiBriefingStep: idx + 1,
          aiBriefingLogs: [...state.aiBriefingLogs, step.log],
        }));

        if (idx === steps.length - 1) {
          // Add GTM feed item
          const newFeed: FeedItem = {
            time: "Just now",
            text: "AI Intel Report: Datadog restructured API logging pricing tier in EMEA regions.",
            tag: "BUYING SIGNAL",
            tagColor: "#a855f7",
          };
          const updatedFeed = [newFeed, ...get().feedItems];
          set({ feedItems: updatedFeed });
          localStorage.setItem("gtm_feed", JSON.stringify(updatedFeed));

          // Add warning alert
          const newAl: Alert = {
            id: Date.now().toString(),
            title: "Datadog API restructuring",
            subtitle: "EMEA price tier modified 18%",
            time: "1m",
            color: "#f43f5e",
          };
          const updatedAlerts = [newAl, ...get().alerts];
          set({ alerts: updatedAlerts });
          localStorage.setItem("gtm_alerts", JSON.stringify(updatedAlerts));
        }
      }, step.delay);
    });
  },
}));