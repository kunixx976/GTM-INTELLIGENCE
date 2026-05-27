export interface Agent {
  id: string;
  name: string;
  codename: string;
  status: "ACTIVE" | "IDLE" | "DEPRECATED" | "DRY_RUN";
  cpu: number;
  memory: string;
  tokensPerSec: number;
  activeTask: string;
  recentLog: string;
  latency: string;
}

export interface GtmActivity {
  id: string;
  timestamp: string;
  category: "CRITICAL" | "SIGNAL" | "INFO" | "WARNING";
  source: string;
  message: string;
  impactScore: number;
}

export interface Competitor {
  id: string;
  domain: string;
  name: string;
  pricingStatus: "INCREASED" | "DECREASED" | "STABLE" | "UNKNOWN";
  lastScraped: string;
  hiringIntent: "HIGH" | "MEDIUM" | "LOW";
  ctaChanges: number;
}

export interface Metric {
  id: string;
  label: string;
  value: string | number;
  change: number;
  isPositive: boolean;
  telemetryType: "cyan" | "green" | "amber" | "crimson";
}

export interface SystemAlert {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  timestamp: string;
  resolved: boolean;
  agentOrigin: string;
}