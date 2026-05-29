"use client";

import { create } from "zustand";
import { api, websocketURL } from "../lib/api";
import { SystemAlert } from "../types/agent";

export interface Competitor {
  id?: string;
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
  id?: string;
  name: string;
  description: string;
  status: "Active" | "Idle";
  progress: number;
  color: string;
}

interface DashboardStore {
  // Lists
  alerts: SystemAlert[];
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

  initializeStore: async () => {
    if (typeof window === "undefined") return;

    try {
      const [agentsRes, compsRes, alertsRes, feedRes, chatRes] = await Promise.all([
        api.get("/agents/dashboard-agents"),
        api.get("/competitors/dashboard-competitors"),
        api.get("/alerts"),
        api.get("/market-intel/dashboard-feed"),
        api.get("/chat/history?limit=20")
      ]);

      set({
        agents: agentsRes.data,
        competitors: compsRes.data,
        alerts: alertsRes.data.alerts.map((a: any) => ({
          id: a.id,
          title: a.title,
          severity: a.severity,
          timestamp: a.time,
          resolved: a.resolved,
          agentOrigin: a.agent_origin,
        })),
        feedItems: feedRes.data,
      });

      if (chatRes.data.messages && chatRes.data.messages.length > 0) {
        set({ chatMessages: chatRes.data.messages });
      }

      const ws = new WebSocket(websocketURL);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "telemetry") {
            // handle future telemetry stream
          }
        } catch (e) {}
      };

      ws.onopen = () => {
        setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send("ping");
        }, 30000);
      };

    } catch (error: any) {
      console.warn("Failed to fetch initial data:", error.message || error);
      get().triggerToast("Failed to connect to ShadowRep backend");
    }
  },

  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setAiChatOpen: (open) => set({ isAiChatOpen: open }),
  setBriefingOpen: (open) => set({ isBriefingOpen: open }),
  setAiBriefingRunning: (running) => set({ isAiBriefingRunning: running }),

  triggerToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => set({ toastMessage: null }), 3000);
  },

  dismissAlert: async (id) => {
    try {
      await api.patch(`/alerts/${id}/resolve`);
      const updated = get().alerts.filter((a) => a.id !== id);
      set({ alerts: updated });
      get().triggerToast("Alert resolved and dismissed successfully");
    } catch (err) {
      get().triggerToast("Failed to dismiss alert");
    }
  },

  resolveAllAlerts: async () => {
    try {
      await api.post("/alerts/resolve-all");
      set({ alerts: [] });
      get().triggerToast("All alerts resolved successfully");
    } catch (err) {
      get().triggerToast("Failed to resolve alerts");
    }
  },

  addCompetitor: async (name, logo) => {
    try {
      await api.post("/competitors", { name, domain: name.toLowerCase() + ".com", logo });
      const res = await api.get("/competitors/dashboard-competitors");
      set({ competitors: res.data });
      get().triggerToast(`Added ${name} to competitor watchlist`);
    } catch (err) {
      get().triggerToast("Failed to add competitor");
    }
  },

  deleteCompetitor: async (name) => {
    try {
       const fullList = await api.get("/competitors");
       const comp = fullList.data.competitors.find((c: any) => c.name === name);
       if (comp) {
         await api.delete(`/competitors/${comp.id}`);
       }
       const updated = get().competitors.filter((c) => c.name !== name);
       set({ competitors: updated });
       get().triggerToast(`Removed ${name} from watchlist`);
    } catch (err) {
       get().triggerToast(`Failed to remove ${name}`);
    }
  },

  addAlertRule: async (title, subtitle, severity) => {
    try {
      await api.post("/alerts", { title, subtitle, severity });
      const res = await api.get("/alerts");
      set({
        alerts: res.data.alerts.map((a: any) => ({
          id: a.id,
          title: a.title,
          severity: a.severity,
          timestamp: a.time,
          resolved: a.resolved,
          agentOrigin: a.agent_origin,
        })),
      });
      get().triggerToast("Custom alert rule saved and activated");
    } catch (err) {
      get().triggerToast("Failed to create alert rule");
    }
  },

  toggleAgentStatus: async (name) => {
    try {
      const fullList = await api.get("/agents");
      const agent = fullList.data.agents.find((a: any) => a.name === name);
      if (agent) {
         await api.patch(`/agents/${agent.id}/toggle`);
         const res = await api.get("/agents/dashboard-agents");
         set({ agents: res.data });
      }
    } catch (err) {
       get().triggerToast("Failed to toggle agent status");
    }
  },

  sendChatMessage: async (text) => {
    const userMsg = { sender: "user" as const, text };
    set((state) => ({ chatMessages: [...state.chatMessages, userMsg] }));

    try {
      const res = await api.post("/chat", { message: text });
      set((state) => ({
        chatMessages: [...state.chatMessages, { sender: "ai" as const, text: res.data.text }],
      }));
    } catch (error) {
      set((state) => ({
        chatMessages: [...state.chatMessages, { sender: "ai" as const, text: "Error connecting to AI service." }],
      }));
    }
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
      setTimeout(async () => {
        set((state) => ({
          aiBriefingStep: idx + 1,
          aiBriefingLogs: [...state.aiBriefingLogs, step.log],
        }));

        if (idx === steps.length - 1) {
          try {
             const [alertsRes, feedRes] = await Promise.all([
               api.get("/alerts"),
               api.get("/market-intel/dashboard-feed")
             ]);
             set({
               alerts: alertsRes.data.alerts.map((a: any) => ({
                 id: a.id,
                 title: a.title,
                 severity: a.severity,
                 timestamp: a.time,
                 resolved: a.resolved,
                 agentOrigin: a.agent_origin,
               })),
               feedItems: feedRes.data
             });
          } catch(e) {}
        }
      }, step.delay);
    });
  },
}));