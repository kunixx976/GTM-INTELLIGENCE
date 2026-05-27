import { Agent, GtmActivity, Competitor, Metric, SystemAlert } from "../types/agent";

export const mockMetrics: Metric[] = [
  {
    id: "m-1",
    label: "AUTONOMOUS AGENTS ACTIVE",
    value: "14 / 16",
    change: 12.5,
    isPositive: true,
    telemetryType: "green"
  },
  {
    id: "m-2",
    label: "BUYING SIGNAL DETECTIONS",
    value: "1,248",
    change: 18.4,
    isPositive: true,
    telemetryType: "cyan"
  },
  {
    id: "m-3",
    label: "COMPETITOR PRICING ALERTS",
    value: "42 incidents",
    change: -4.2,
    isPositive: false,
    telemetryType: "amber"
  },
  {
    id: "m-4",
    label: "METERED CREDIT BUFFER",
    value: "89,240 / 100k",
    change: 98.7,
    isPositive: true,
    telemetryType: "cyan"
  }
];

export const mockAgents: Agent[] = [
  {
    id: "a-1",
    name: "SEC Scout Pro",
    codename: "SEC_SCOUT",
    status: "ACTIVE",
    cpu: 48,
    memory: "2.4 GB",
    tokensPerSec: 142,
    activeTask: "Parsing SEC Form 10-K from Datadog Inc.",
    recentLog: "Extracted strategic pivot clause relating to usage pricing shifts",
    latency: "12ms"
  },
  {
    id: "a-2",
    name: "Pricing Hawk",
    codename: "PRICING_HAWK",
    status: "ACTIVE",
    cpu: 72,
    memory: "4.1 GB",
    tokensPerSec: 284,
    activeTask: "Diffing HTML tables on Snowflake `/pricing` endpoint",
    recentLog: "Detected CTA alteration from 'Get Started' to 'Book Demo' in APAC region",
    latency: "28ms"
  },
  {
    id: "a-3",
    name: "Talent Crawler",
    codename: "TALENT_CRAWLER",
    status: "IDLE",
    cpu: 4,
    memory: "512 MB",
    tokensPerSec: 0,
    activeTask: "Awaiting next batch schedule (hiring target filters)",
    recentLog: "Indexed 18 leadership roles at Confluent in EMEA",
    latency: "8ms"
  },
  {
    id: "a-4",
    name: "Patent Tracker",
    codename: "PATENT_TRACKER",
    status: "DRY_RUN",
    cpu: 18,
    memory: "1.2 GB",
    tokensPerSec: 54,
    activeTask: "Simulating pipeline parsing on USPTO vector updates",
    recentLog: "Dry run validation completed. Ready for ingestion trigger.",
    latency: "45ms"
  }
];

export const mockActivities: GtmActivity[] = [
  {
    id: "ac-1",
    timestamp: "22:38:12",
    category: "CRITICAL",
    source: "PRICING_HAWK",
    message: "Datadog changed Standard Tier pricing from $15/host to $18/host in EMEA.",
    impactScore: 92
  },
  {
    id: "ac-2",
    timestamp: "22:35:48",
    category: "SIGNAL",
    source: "TALENT_CRAWLER",
    message: "VP of Enterprise Sales at competitor Dynatrace transitioned to key account target Elastic.",
    impactScore: 84
  },
  {
    id: "ac-3",
    timestamp: "22:30:15",
    category: "INFO",
    source: "SEC_SCOUT",
    message: "Confluent Inc filed Form 8-K. Extracted text indicates pricing tier restructuring.",
    impactScore: 45
  },
  {
    id: "ac-4",
    timestamp: "22:15:33",
    category: "WARNING",
    source: "PRICING_HAWK",
    message: "Grafana Labs updated pricing table layouts on enterprise landing pages.",
    impactScore: 71
  },
  {
    id: "ac-5",
    timestamp: "21:58:02",
    category: "SIGNAL",
    source: "SEC_SCOUT",
    message: "New patent filed by New Relic for automated telemetry stream load-balancing.",
    impactScore: 68
  }
];

export const mockCompetitors: Competitor[] = [
  {
    id: "c-1",
    name: "Datadog Inc.",
    domain: "datadoghq.com",
    pricingStatus: "INCREASED",
    lastScraped: "3 mins ago",
    hiringIntent: "HIGH",
    ctaChanges: 3
  },
  {
    id: "c-2",
    name: "Dynatrace",
    domain: "dynatrace.com",
    pricingStatus: "STABLE",
    lastScraped: "18 mins ago",
    hiringIntent: "HIGH",
    ctaChanges: 1
  },
  {
    id: "c-3",
    name: "New Relic",
    domain: "newrelic.com",
    pricingStatus: "DECREASED",
    lastScraped: "1 hour ago",
    hiringIntent: "MEDIUM",
    ctaChanges: 4
  },
  {
    id: "c-4",
    name: "Grafana Labs",
    domain: "grafana.com",
    pricingStatus: "STABLE",
    lastScraped: "2 hours ago",
    hiringIntent: "LOW",
    ctaChanges: 0
  }
];

export const mockAlerts: SystemAlert[] = [
  {
    id: "al-1",
    title: "Datadog pricing shift detected on EMEA endpoints",
    severity: "CRITICAL",
    timestamp: "3 mins ago",
    resolved: false,
    agentOrigin: "PRICING_HAWK"
  },
  {
    id: "al-2",
    title: "Anomalous headcount adjustment at Dynatrace EMEA",
    severity: "HIGH",
    timestamp: "20 mins ago",
    resolved: false,
    agentOrigin: "TALENT_CRAWLER"
  },
  {
    id: "al-3",
    title: "Grafana HTML structural change broke selector triggers",
    severity: "MEDIUM",
    timestamp: "1 hour ago",
    resolved: false,
    agentOrigin: "PRICING_HAWK"
  },
  {
    id: "al-4",
    title: "SEC Crawler successfully rotated corporate proxy logs",
    severity: "LOW",
    timestamp: "4 hours ago",
    resolved: true,
    agentOrigin: "SEC_SCOUT"
  }
];

export const mockTrendData = [
  { time: "09:00", Datadog: 100, Dynatrace: 98, NewRelic: 105 },
  { time: "11:00", Datadog: 102, Dynatrace: 98, NewRelic: 104 },
  { time: "13:00", Datadog: 105, Dynatrace: 99, NewRelic: 101 },
  { time: "15:00", Datadog: 104, Dynatrace: 99, NewRelic: 99 },
  { time: "17:00", Datadog: 109, Dynatrace: 100, NewRelic: 98 },
  { time: "19:00", Datadog: 112, Dynatrace: 100, NewRelic: 98 }
];