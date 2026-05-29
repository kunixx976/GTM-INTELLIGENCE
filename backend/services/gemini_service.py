"""
ShadowRep AI — Gemini AI Service
Wraps Google Gemini for GTM-contextual chat and briefing generation.
Falls back to smart mock responses when no API key is configured.
"""

from config import settings

# Try to import google generativeai
_gemini_available = False
_model = None

try:
    import google.generativeai as genai

    if settings.has_gemini_key:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        _model = genai.GenerativeModel("gemini-2.0-flash")
        _gemini_available = True
        print("[GEMINI] Initialized with API key. Live AI responses enabled.")
    else:
        print("[GEMINI] No API key configured. Using mock responses.")
except ImportError:
    print("[GEMINI] google-generativeai package not installed. Using mock responses.")


# ─── System Prompt ───
SYSTEM_PROMPT = """You are ShadowRep AI, an autonomous GTM (Go-To-Market) revenue intelligence agent.

Your capabilities:
- Analyze competitor pricing changes, CTA modifications, and market positioning shifts
- Track executive hiring movements and organizational changes at competitor companies
- Monitor SEC filings (10-K, 8-K), patent databases, and press releases
- Detect buying intent signals from target accounts
- Generate tactical sales intelligence and counter-campaign recommendations

When responding:
- Be concise and data-driven
- Use specific numbers, percentages, and competitor names
- Format findings as actionable intelligence
- Reference specific agents (SEC_SCOUT, PRICING_HAWK, TALENT_CRAWLER, PATENT_TRACKER) when relevant
- Maintain a professional, intelligence-analyst tone

Current tracked competitors: Datadog, Dynatrace, New Relic, Grafana Labs, Salesforce, Snowflake, Gong, Clari, Outreach
Active agents: SEC Scout Pro, Pricing Hawk, Talent Crawler, Patent Tracker
"""


async def chat(user_message: str, context: str = "") -> str:
    """
    Process a chat message and return AI response.
    Uses Gemini if available, otherwise returns contextual mock responses.
    """
    if _gemini_available and _model:
        try:
            prompt = f"{SYSTEM_PROMPT}\n\nAdditional context:\n{context}\n\nUser query: {user_message}"
            response = await _model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            print(f"[GEMINI] Error: {e}")
            return _mock_chat_response(user_message)
    else:
        return _mock_chat_response(user_message)


async def generate_briefing(competitor_data: list[dict] = None, topic: str = "general") -> dict:
    """
    Generate a strategic GTM briefing report.
    Returns dict with title, summary, and full_report.
    """
    if _gemini_available and _model:
        try:
            prompt = f"""{SYSTEM_PROMPT}

Generate a strategic GTM intelligence briefing report.
Topic: {topic}
Competitor data: {competitor_data}

Format the response as a detailed markdown report with:
1. Executive Summary
2. Key Findings (3-5 bullet points with specific data)
3. Competitive Threat Assessment
4. Recommended Actions (prioritized list)

Be specific with competitor names, pricing changes, and market signals."""

            response = await _model.generate_content_async(prompt)
            report_text = response.text

            return {
                "title": f"GTM Intelligence Briefing — {topic.replace('_', ' ').title()}",
                "summary": report_text[:200] + "..." if len(report_text) > 200 else report_text,
                "full_report": report_text,
            }
        except Exception as e:
            print(f"[GEMINI] Briefing error: {e}")
            return _mock_briefing()
    else:
        return _mock_briefing()


def _mock_chat_response(query: str) -> str:
    """Generate contextual mock responses based on query keywords."""
    q = query.lower()

    if "datadog" in q:
        return ("Datadog Inc. currently has a HIGH buying intent signals score (92/100). "
                "Recent activity includes 3 CTA alterations and standard pricing tiers "
                "adjustment in EMEA region (+18%). Our PRICING_HAWK agent detected the "
                "shift at 22:38:12 UTC. Recommend immediate competitive response playbook.")
    elif "pricing" in q:
        return ("Average price shift across monitored sectors: +4.2% stable. Key changes:\n"
                "• Datadog: +20% on Standard Tier in EMEA\n"
                "• Clari: Pivoting to usage-based model (deprecated per-seat)\n"
                "• Grafana: Expanded free tier limits +40%\n"
                "• Snowflake: Stable, no changes detected in 30 days")
    elif "competitor" in q:
        return ("Active target competitors tracked by ShadowRep agents:\n"
                "• Datadog Inc. — INCREASED pricing, HIGH hiring intent, 3 CTA changes\n"
                "• Dynatrace — STABLE pricing, HIGH hiring intent\n"
                "• New Relic — DECREASED pricing, MEDIUM hiring intent, 4 CTA changes\n"
                "• Grafana Labs — STABLE, LOW hiring intent\n"
                "Total footprint: 25 nodes globally across 4 autonomous agents.")
    elif "alert" in q or "threat" in q:
        return ("Current threat assessment:\n"
                "• 2 CRITICAL alerts active (Datadog EMEA repricing, Clari pricing undercut)\n"
                "• 1 HIGH alert (AI adoption rate shift +23%)\n"
                "• Agent PRICING_HAWK running at 72% CPU processing competitor diffs\n"
                "Recommend reviewing EMEA competitive positioning within 24 hours.")
    elif "hiring" in q or "talent" in q:
        return ("Talent intelligence summary from TALENT_CRAWLER:\n"
                "• 47 senior-level openings indexed across 6 competitors\n"
                "• VP Enterprise Sales at Dynatrace → Elastic (significant movement)\n"
                "• Confluent: 8 new enterprise AE positions in APAC\n"
                "• Snowflake: New Director of RevOps role created\n"
                "Elevated hiring signals expansion campaigns within 2-3 quarters.")
    elif "sec" in q or "filing" in q:
        return ("SEC filing intelligence from SEC_SCOUT:\n"
                "• Confluent Inc Form 8-K: pricing tier restructuring language detected\n"
                "• Datadog 10-K: mentions 'consumption-based pricing evolution'\n"
                "• New Relic: Patent filed for automated telemetry load-balancing\n"
                "• 142 tokens/sec processing rate on active SEC analysis pipeline")
    else:
        return ("I analyzed GTM intelligence databases across all active agents. "
                "No direct threats detected in that specific sector. "
                "Current system status: 14/16 agents active, 1,248 buying signals "
                "detected this cycle, 42 pricing incidents under monitoring. "
                "Specify a competitor name, topic (pricing/hiring/SEC), or "
                "threat area for detailed analysis.")


def _mock_briefing() -> dict:
    """Return a pre-computed mock briefing for demo purposes."""
    return {
        "title": "GTM Intelligence Briefing — Competitive Landscape Q2 2026",
        "summary": "Autonomous agents detected 3 major pricing events and 2 critical hiring signals across tracked competitors in the last 48 hours.",
        "full_report": """## Executive Summary

Our autonomous agent network detected **3 major pricing events** and **2 critical hiring signals** across tracked competitors in the last 48 hours.

### Key Findings

1. **Datadog EMEA Repricing** (+20%): Standard Tier moved from $15/host/month to $18/host/month. This signals premium positioning in European markets. Impact Score: 92/100.

2. **Clari Usage-Based Pivot**: Deprecated per-seat model in favor of consumption-based pricing. Mid-market customers likely to be attracted. Monitor adoption rates.

3. **Grafana Labs Freemium Expansion**: Free tier limits expanded by 40%. Competitive pressure against Datadog's open-source alternatives.

4. **VP Enterprise Sales Movement**: Dynatrace → Elastic lateral move detected by TALENT_CRAWLER. Signals potential strategic shift at Dynatrace.

5. **Confluent SEC Filing**: Form 8-K language indicates pricing tier restructuring imminent. SEC_SCOUT confidence: HIGH.

### Competitive Threat Assessment

| Competitor | Threat Level | Key Signal |
|-----------|-------------|-----------|
| Datadog | 🔴 HIGH | Pricing increase may open competitive window |
| Clari | 🟡 MEDIUM | Usage-based pivot disrupts competitive positioning |
| Grafana | 🟡 MEDIUM | Freemium expansion targets developer segment |
| Dynatrace | 🟢 LOW | Stable pricing, but leadership changes warrant monitoring |

### Recommended Actions

1. **Immediate**: Deploy EMEA competitive pricing playbook to sales teams
2. **This Week**: Analyze Clari's usage-based model for counter-positioning
3. **This Month**: Evaluate developer tier pricing against Grafana's expanded free tier
4. **Ongoing**: Monitor Dynatrace leadership changes via TALENT_CRAWLER alerts""",
    }
