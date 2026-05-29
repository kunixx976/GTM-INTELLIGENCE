"""
ShadowRep AI — Seed Data
Populates the database with mock data matching the frontend's mockData.ts.
Run once: python seed_data.py
"""

import asyncio
import aiosqlite  
from database import DB_PATH, init_db


SEED_AGENTS = [
    ("a-1", "SEC Scout Pro", "SEC_SCOUT", "ACTIVE", 48, "2.4 GB", 142,
     "Parsing SEC Form 10-K from Datadog Inc.",
     "Extracted strategic pivot clause relating to usage pricing shifts", "12ms"),
    ("a-2", "Pricing Hawk", "PRICING_HAWK", "ACTIVE", 72, "4.1 GB", 284,
     "Diffing HTML tables on Snowflake /pricing endpoint",
     "Detected CTA alteration from 'Get Started' to 'Book Demo' in APAC region", "28ms"),
    ("a-3", "Talent Crawler", "TALENT_CRAWLER", "IDLE", 4, "512 MB", 0,
     "Awaiting next batch schedule (hiring target filters)",
     "Indexed 18 leadership roles at Confluent in EMEA", "8ms"),
    ("a-4", "Patent Tracker", "PATENT_TRACKER", "DRY_RUN", 18, "1.2 GB", 54,
     "Simulating pipeline parsing on USPTO vector updates",
     "Dry run validation completed. Ready for ingestion trigger.", "45ms"),
]

SEED_COMPETITORS = [
    ("c-1", "Datadog Inc.", "datadoghq.com", "DD", "INCREASED", "3 mins ago", "HIGH", 3, 92, "#3f3f46"),
    ("c-2", "Dynatrace", "dynatrace.com", "DY", "STABLE", "18 mins ago", "HIGH", 1, 68, "#52525b"),
    ("c-3", "New Relic", "newrelic.com", "NR", "DECREASED", "1 hour ago", "MEDIUM", 4, 61, "#71717a"),
    ("c-4", "Grafana Labs", "grafana.com", "GL", "STABLE", "2 hours ago", "LOW", 0, 48, "#a1a1aa"),
    ("c-5", "Salesforce", "salesforce.com", "SF", "STABLE", "30 mins ago", "HIGH", 2, 92, "#3f3f46"),
    ("c-6", "Snowflake", "snowflake.com", "SN", "INCREASED", "15 mins ago", "MEDIUM", 1, 68, "#52525b"),
    ("c-7", "Gong", "gong.io", "G", "STABLE", "45 mins ago", "HIGH", 0, 61, "#71717a"),
    ("c-8", "Clari", "clari.com", "CL", "DECREASED", "10 mins ago", "MEDIUM", 2, 48, "#a1a1aa"),
    ("c-9", "Outreach", "outreach.io", "O", "STABLE", "1 hour ago", "LOW", 0, 32, "#d4d4d8"),
]

SEED_ACTIVITIES = [
    ("ac-1", "22:38:12", "CRITICAL", "PRICING_HAWK",
     "Datadog changed Standard Tier pricing from $15/host to $18/host in EMEA.", 92),
    ("ac-2", "22:35:48", "SIGNAL", "TALENT_CRAWLER",
     "VP of Enterprise Sales at competitor Dynatrace transitioned to key account target Elastic.", 84),
    ("ac-3", "22:30:15", "INFO", "SEC_SCOUT",
     "Confluent Inc filed Form 8-K. Extracted text indicates pricing tier restructuring.", 45),
    ("ac-4", "22:15:33", "WARNING", "PRICING_HAWK",
     "Grafana Labs updated pricing table layouts on enterprise landing pages.", 71),
    ("ac-5", "21:58:02", "SIGNAL", "SEC_SCOUT",
     "New patent filed by New Relic for automated telemetry stream load-balancing.", 68),
]

SEED_ALERTS = [
    ("al-1", "Competitor undercut detected", "Clari launched new pricing",
     "CRITICAL", "5m", "#f43f5e", 0, "PRICING_HAWK"),
    ("al-2", "Market shift detected", "AI adoption rate increased 23%",
     "HIGH", "15m", "#f59e0b", 0, "SEC_SCOUT"),
    ("al-3", "High intent account identified", "Acme Corp showing strong intent",
     "MEDIUM", "28m", "#f59e0b", 0, "TALENT_CRAWLER"),
    ("al-4", "Datadog pricing shift detected on EMEA endpoints",
     "Standard tier +20% in EMEA region", "CRITICAL", "3m", "#f43f5e", 0, "PRICING_HAWK"),
    ("al-5", "Anomalous headcount adjustment at Dynatrace EMEA",
     "15 new senior roles posted", "HIGH", "20m", "#f59e0b", 0, "TALENT_CRAWLER"),
]

SEED_METRICS = [
    ("m-1", "AUTONOMOUS AGENTS ACTIVE", "14 / 16", 12.5, 1, "green"),
    ("m-2", "BUYING SIGNAL DETECTIONS", "1,248", 18.4, 1, "cyan"),
    ("m-3", "COMPETITOR PRICING ALERTS", "42 incidents", -4.2, 0, "amber"),
    ("m-4", "METERED CREDIT BUFFER", "89,240 / 100k", 98.7, 1, "cyan"),
]

SEED_PRICING_TRENDS = [
    ("09:00", "Datadog", 100), ("11:00", "Datadog", 102), ("13:00", "Datadog", 105),
    ("15:00", "Datadog", 104), ("17:00", "Datadog", 109), ("19:00", "Datadog", 112),
    ("09:00", "Dynatrace", 98), ("11:00", "Dynatrace", 98), ("13:00", "Dynatrace", 99),
    ("15:00", "Dynatrace", 99), ("17:00", "Dynatrace", 100), ("19:00", "Dynatrace", 100),
    ("09:00", "NewRelic", 105), ("11:00", "NewRelic", 104), ("13:00", "NewRelic", 101),
    ("15:00", "NewRelic", 99), ("17:00", "NewRelic", 98), ("19:00", "NewRelic", 98),
]

SEED_INSIGHTS = [
    ("ins-1", "Competitor Pricing Shift Analysis — Q2 2026",
     "Datadog and Clari have made significant pricing adjustments in the EMEA region. Datadog increased Standard Tier by 20%, while Clari introduced a new usage-based model.",
     "## Executive Summary\n\nOur autonomous agents detected **3 major pricing events** across tracked competitors in the last 48 hours.\n\n### Key Findings\n\n1. **Datadog EMEA Repricing**: Standard Tier pricing moved from $15/host/month to $18/host/month (+20%). This signals a shift toward premium positioning in European markets.\n\n2. **Clari Usage-Based Pivot**: Clari deprecated their per-seat model in favor of consumption-based pricing. This could attract mid-market customers.\n\n3. **Grafana Labs Freemium Expansion**: Grafana expanded free tier limits by 40%, likely to compete with Datadog's open-source alternatives.\n\n### Recommended Actions\n\n- Deploy competitive pricing playbook for EMEA sales teams\n- Monitor Clari's usage-based adoption rates over next 30 days\n- Consider matching Grafana's freemium expansion for developer tier",
     "briefing", "GEMINI"),
    ("ins-2", "Hiring Intent Signal Report — Enterprise Sales",
     "Multiple competitors showing elevated hiring intent in Enterprise Sales leadership roles, suggesting expansion campaigns.",
     "## Hiring Intelligence Brief\n\nOur Talent Crawler agent indexed **47 senior-level openings** across 6 tracked competitors.\n\n### Notable Movements\n\n- **Dynatrace**: VP of Enterprise Sales departed for Elastic (competitor-to-target movement)\n- **Confluent**: 8 new enterprise AE positions posted in APAC\n- **Snowflake**: Director of Revenue Operations role created (new function)\n\n### Implications\n\nElevated hiring in enterprise sales roles typically precedes aggressive market expansion within 2-3 quarters. Recommend preemptive territory coverage review.",
     "report", "GEMINI"),
]

SEED_CHAT = [
    ("ai", "Autonomous GTM agent initialized. Type a query to scan market data..."),
]


async def seed():
    await init_db()

    async with aiosqlite.connect(DB_PATH) as db:
        # Clear existing data
        for table in ["agents", "competitors", "activities", "alerts", "metrics",
                       "pricing_trends", "insights", "chat_history"]:
            await db.execute(f"DELETE FROM {table}")

        # Seed agents
        await db.executemany(
            "INSERT INTO agents (id, name, codename, status, cpu, memory, tokens_per_sec, active_task, recent_log, latency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            SEED_AGENTS
        )

        # Seed competitors
        await db.executemany(
            "INSERT INTO competitors (id, name, domain, logo, pricing_status, last_scraped, hiring_intent, cta_changes, progress, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            SEED_COMPETITORS
        )

        # Seed activities
        await db.executemany(
            "INSERT INTO activities (id, timestamp, category, source, message, impact_score) VALUES (?, ?, ?, ?, ?, ?)",
            SEED_ACTIVITIES
        )

        # Seed alerts
        await db.executemany(
            "INSERT INTO alerts (id, title, subtitle, severity, time, color, resolved, agent_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            SEED_ALERTS
        )

        # Seed metrics
        await db.executemany(
            "INSERT INTO metrics (id, label, value, change, is_positive, telemetry_type) VALUES (?, ?, ?, ?, ?, ?)",
            SEED_METRICS
        )

        # Seed pricing trends
        await db.executemany(
            "INSERT INTO pricing_trends (time_label, competitor_name, price_index) VALUES (?, ?, ?)",
            SEED_PRICING_TRENDS
        )

        # Seed insights
        await db.executemany(
            "INSERT INTO insights (id, title, summary, full_report, insight_type, generated_by) VALUES (?, ?, ?, ?, ?, ?)",
            SEED_INSIGHTS
        )

        # Seed chat history
        await db.executemany(
            "INSERT INTO chat_history (sender, message) VALUES (?, ?)",
            SEED_CHAT
        )

        await db.commit()

    print("[SEED] Database seeded successfully with mock data.")


if __name__ == "__main__":
    asyncio.run(seed())
