"""
ShadowRep AI — Slack Notifier
Posts formatted alert notifications to Slack via incoming webhook.
Graceful no-op when webhook URL is not configured.
"""

import httpx
from config import settings


async def send_slack_alert(title: str, severity: str, details: str = ""):
    """
    Send a formatted alert notification to Slack.
    No-ops gracefully if SLACK_WEBHOOK_URL is not configured.
    """
    if not settings.has_slack_webhook:
        print(f"[SLACK] Alert suppressed (no webhook): [{severity}] {title}")
        return False

    # Map severity to Slack emoji
    emoji_map = {
        "CRITICAL": "🔴",
        "HIGH": "🟠",
        "MEDIUM": "🟡",
        "LOW": "🟢",
    }
    emoji = emoji_map.get(severity, "⚪")

    payload = {
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": f"{emoji} ShadowRep Alert: {title}",
                    "emoji": True,
                },
            },
            {
                "type": "section",
                "fields": [
                    {"type": "mrkdwn", "text": f"*Severity:*\n{severity}"},
                    {"type": "mrkdwn", "text": f"*Source:*\nShadowRep AI Engine"},
                ],
            },
        ],
    }

    if details:
        payload["blocks"].append({
            "type": "section",
            "text": {"type": "mrkdwn", "text": f"*Details:*\n{details}"},
        })

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                settings.SLACK_WEBHOOK_URL,
                json=payload,
                timeout=10.0,
            )
            if response.status_code == 200:
                print(f"[SLACK] Alert sent: [{severity}] {title}")
                return True
            else:
                print(f"[SLACK] Failed ({response.status_code}): {title}")
                return False
    except Exception as e:
        print(f"[SLACK] Error sending alert: {e}")
        return False
