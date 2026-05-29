"""
ShadowRep AI — Database Layer
Async SQLite database with schema auto-creation.
"""

import aiosqlite
from config import settings

DB_PATH = settings.DATABASE_URL


async def get_db() -> aiosqlite.Connection:
    """Get a database connection (use as async context manager or dependency)."""
    db = await aiosqlite.connect(DB_PATH)
    db.row_factory = aiosqlite.Row
    return db


async def init_db():
    """Create all tables if they don't exist."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.executescript(SCHEMA_SQL)
        await db.commit()
    print("[DB] Schema initialized successfully.")


SCHEMA_SQL = """
-- AI Agents
CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    codename TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    cpu REAL NOT NULL DEFAULT 0,
    memory TEXT NOT NULL DEFAULT '0 MB',
    tokens_per_sec REAL NOT NULL DEFAULT 0,
    active_task TEXT NOT NULL DEFAULT '',
    recent_log TEXT NOT NULL DEFAULT '',
    latency TEXT NOT NULL DEFAULT '0ms',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Competitors
CREATE TABLE IF NOT EXISTS competitors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT NOT NULL DEFAULT '',
    logo TEXT NOT NULL DEFAULT '',
    pricing_status TEXT NOT NULL DEFAULT 'UNKNOWN',
    last_scraped TEXT NOT NULL DEFAULT 'Never',
    hiring_intent TEXT NOT NULL DEFAULT 'LOW',
    cta_changes INTEGER NOT NULL DEFAULT 0,
    progress INTEGER NOT NULL DEFAULT 50,
    color TEXT NOT NULL DEFAULT '#52525b',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GTM Activity Feed
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'INFO',
    source TEXT NOT NULL DEFAULT 'SYSTEM',
    message TEXT NOT NULL,
    impact_score INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL DEFAULT '',
    severity TEXT NOT NULL DEFAULT 'MEDIUM',
    time TEXT NOT NULL DEFAULT '1m',
    color TEXT NOT NULL DEFAULT '#f59e0b',
    resolved INTEGER NOT NULL DEFAULT 0,
    agent_origin TEXT NOT NULL DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Insights / Briefings
CREATE TABLE IF NOT EXISTS insights (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    full_report TEXT NOT NULL DEFAULT '',
    insight_type TEXT NOT NULL DEFAULT 'briefing',
    generated_by TEXT NOT NULL DEFAULT 'GEMINI',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market Intelligence Events
CREATE TABLE IF NOT EXISTS market_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL DEFAULT 'GENERAL',
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    source_url TEXT NOT NULL DEFAULT '',
    relevance_score INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat History
CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pricing Trend Data (for charts)
CREATE TABLE IF NOT EXISTS pricing_trends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time_label TEXT NOT NULL,
    competitor_name TEXT NOT NULL,
    price_index REAL NOT NULL DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dashboard Metrics
CREATE TABLE IF NOT EXISTS metrics (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    change REAL NOT NULL DEFAULT 0,
    is_positive INTEGER NOT NULL DEFAULT 1,
    telemetry_type TEXT NOT NULL DEFAULT 'cyan'
);
"""
