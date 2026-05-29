"""
ShadowRep AI — Agent Scheduler
Background task that simulates live agent activity with realistic metric drift.
Pushes updates via WebSocket to create the "living, breathing" dashboard effect.
"""

import asyncio
import random
import uuid
from datetime import datetime

import aiosqlite
from config import settings
from database import DB_PATH
from services.websocket_manager import ws_manager
from app.agents.scraper import scrape_company_page
from app.agents.scorer import score_buying_signal


# Activity event templates for random generation
ACTIVITY_TEMPLATES = [
    {"category": "CRITICAL", "source": "PRICING_HAWK",
     "messages": [
         "Competitor pricing page DOM structure changed — parsing diff results.",
         "Detected enterprise tier pricing adjustment on target domain.",
         "CTA button text changed from 'Start Free Trial' to 'Contact Sales'.",
     ]},
    {"category": "SIGNAL", "source": "TALENT_CRAWLER",
     "messages": [
         "Senior VP of Sales role posted at tracked competitor.",
         "Director of Revenue Operations moved to key target account.",
         "Bulk hiring detected: 12 new AE roles posted in APAC region.",
     ]},
    {"category": "INFO", "source": "SEC_SCOUT",
     "messages": [
         "Form 10-K annual report successfully parsed and indexed.",
         "New patent application detected in automated intelligence category.",
         "Quarterly earnings call transcript analysis completed.",
     ]},
    {"category": "WARNING", "source": "PATENT_TRACKER",
     "messages": [
         "USPTO feed returned partial data — retrying with backup proxy.",
         "Patent classification overlap detected with internal IP portfolio.",
         "Citation network analysis flagged potential competitive risk.",
     ]},
]


class AgentScheduler:
    """
    Background scheduler that ticks at a configurable interval,
    updating agent metrics and broadcasting telemetry via WebSocket.
    """

    def __init__(self):
        self._running = False
        self._tick_count = 0
        self._real_scrape_task = None

    async def run(self):
        """Main scheduler loop."""
        self._running = True
        print(f"[SCHEDULER] Started with {settings.AGENT_TICK_INTERVAL}s tick interval.")
        self._real_scrape_task = asyncio.create_task(self._real_scrape_loop())

        while self._running:
            try:
                await asyncio.sleep(settings.AGENT_TICK_INTERVAL)
                self._tick_count += 1
                await self._tick()
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"[SCHEDULER] Tick error: {e}")

    def stop(self):
        """Stop the scheduler."""
        self._running = False
        if self._real_scrape_task:
            self._real_scrape_task.cancel()
        print("[SCHEDULER] Stopped.")

    async def _tick(self):
        """Single scheduler tick — update metrics and broadcast."""
        async with aiosqlite.connect(DB_PATH) as db:
            db.row_factory = aiosqlite.Row

            # 1. Update active agent metrics with realistic drift
            agents = await db.execute_fetchall(
                "SELECT * FROM agents WHERE status = 'ACTIVE'"
            )

            for agent in agents:
                agent_dict = dict(agent)
                new_cpu = max(5, min(95, agent_dict["cpu"] + random.uniform(-8, 8)))
                new_tps = max(10, agent_dict["tokens_per_sec"] + random.uniform(-20, 20))
                new_latency = f"{max(3, random.randint(5, 50))}ms"

                await db.execute(
                    """UPDATE agents SET cpu = ?, tokens_per_sec = ?, latency = ?,
                       updated_at = CURRENT_TIMESTAMP WHERE id = ?""",
                    (round(new_cpu, 1), round(new_tps, 1), new_latency, agent_dict["id"])
                )

                # Broadcast individual agent telemetry
                await ws_manager.broadcast_agent_telemetry({
                    "agent_id": agent_dict["id"],
                    "name": agent_dict["name"],
                    "codename": agent_dict["codename"],
                    "cpu": round(new_cpu, 1),
                    "memory": agent_dict["memory"],
                    "tokens_per_sec": round(new_tps, 1),
                    "active_task": agent_dict["active_task"],
                    "latency": new_latency,
                    "timestamp": datetime.utcnow().isoformat(),
                })

            # 2. Randomly generate a new activity event (30% chance per tick)
            if random.random() < 0.3:
                template = random.choice(ACTIVITY_TEMPLATES)
                message = random.choice(template["messages"])
                activity_id = f"ac-auto-{uuid.uuid4().hex[:8]}"
                timestamp = datetime.utcnow().strftime("%H:%M:%S")

                await db.execute(
                    "INSERT INTO activities (id, timestamp, category, source, message, impact_score) VALUES (?, ?, ?, ?, ?, ?)",
                    (activity_id, timestamp, template["category"], template["source"],
                     message, random.randint(30, 95))
                )

                await ws_manager.broadcast_activity({
                    "id": activity_id,
                    "timestamp": timestamp,
                    "category": template["category"],
                    "source": template["source"],
                    "message": message,
                    "impact_score": random.randint(30, 95),
                })

            # 3. Update dashboard metrics periodically (every 6 ticks ~30s)
            if self._tick_count % 6 == 0:
                active_count = await db.execute_fetchall(
                    "SELECT COUNT(*) as cnt FROM agents WHERE status = 'ACTIVE'"
                )
                total_count = await db.execute_fetchall(
                    "SELECT COUNT(*) as cnt FROM agents"
                )
                active = active_count[0]["cnt"] if active_count else 0
                total = total_count[0]["cnt"] if total_count else 0

                # Update agent metric
                await db.execute(
                    "UPDATE metrics SET value = ? WHERE id = 'm-1'",
                    (f"{active} / {total}",)
                )

                # Drift buying signals metric
                signals_row = await db.execute_fetchall(
                    "SELECT value FROM metrics WHERE id = 'm-2'"
                )
                if signals_row:
                    try:
                        current_signals = int(signals_row[0]["value"].replace(",", ""))
                        new_signals = max(1000, current_signals + random.randint(-5, 15))
                        await db.execute(
                            "UPDATE metrics SET value = ?, change = ? WHERE id = 'm-2'",
                            (f"{new_signals:,}", round(random.uniform(10, 25), 1))
                        )
                    except (ValueError, IndexError):
                        pass

                await ws_manager.broadcast_metric_update({
                    "updated_at": datetime.utcnow().isoformat(),
                })

            await db.commit()

    async def _real_scrape_loop(self):
        """Real scraping background loop using Bright Data and Claude."""
        while self._running:
            try:
                # Sleep a fixed interval (e.g., 60 seconds)
                await asyncio.sleep(60)
                
                async with aiosqlite.connect(DB_PATH) as db:
                    db.row_factory = aiosqlite.Row
                    
                    # Fetch one competitor (e.g. oldest last_scraped)
                    rows = await db.execute_fetchall(
                        "SELECT * FROM competitors ORDER BY last_scraped ASC LIMIT 1"
                    )
                    if not rows:
                        continue
                        
                    comp = dict(rows[0])
                    domain = comp["domain"]
                    if not domain:
                        continue
                        
                    print(f"[SCHEDULER] Scraping real competitor: {comp['name']} ({domain})")
                    
                    # Scrape
                    url = f"https://{domain}" if not domain.startswith("http") else domain
                    try:
                        html = await asyncio.to_thread(scrape_company_page, url)
                    except Exception as e:
                        print(f"[SCHEDULER] Scrape failed for {comp['name']}: {e}")
                        continue
                        
                    # Score
                    company_data_snippet = html[:3000] # Take first 3000 chars to avoid token limits
                    try:
                        score_result = await asyncio.to_thread(
                            score_buying_signal, 
                            f"Company: {comp['name']}\nData: {company_data_snippet}"
                        )
                    except Exception as e:
                        print(f"[SCHEDULER] Score failed for {comp['name']}: {e}")
                        continue
                        
                    score = score_result.get("score", 5)
                    reason = score_result.get("reason", "No reason provided.")
                    
                    # Log activity
                    activity_id = f"ac-real-{uuid.uuid4().hex[:8]}"
                    timestamp = datetime.utcnow().strftime("%H:%M:%S")
                    category = "SIGNAL" if score >= 7 else "INFO"
                    
                    await db.execute(
                        "INSERT INTO activities (id, timestamp, category, source, message, impact_score) VALUES (?, ?, ?, ?, ?, ?)",
                        (activity_id, timestamp, category, "GTM_CLAUDE", f"{comp['name']}: {reason}", score * 10)
                    )
                    
                    await ws_manager.broadcast_activity({
                        "id": activity_id,
                        "timestamp": timestamp,
                        "category": category,
                        "source": "GTM_CLAUDE",
                        "message": f"{comp['name']}: {reason}",
                        "impact_score": score * 10,
                    })
                    
                    # If high score, create alert
                    if score >= 7:
                        alert_id = f"al-real-{uuid.uuid4().hex[:8]}"
                        await db.execute(
                            "INSERT INTO alerts (id, title, subtitle, severity, time, color, resolved, agent_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                            (alert_id, f"High Intent: {comp['name']}", score_result.get("recommended_action", "Investigate immediately."), "HIGH", timestamp, "#ef4444", 0, "CLAUDE_SCORER")
                        )
                    
                    # Update competitor
                    await db.execute(
                        "UPDATE competitors SET last_scraped = ?, progress = ? WHERE id = ?",
                        (datetime.utcnow().isoformat(), random.randint(50, 100), comp["id"])
                    )
                    await db.commit()
                    print(f"[SCHEDULER] Scored {comp['name']} -> {score}/10")
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"[SCHEDULER] Real scrape loop error: {e}")
