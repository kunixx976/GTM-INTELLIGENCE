import anthropic
import os

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def score_buying_signal(company_data: str) -> dict:
    """Ask Claude to score how likely this company is to buy"""
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"""
            You are a GTM analyst. Based on this company data, score the buying intent from 1-10 and explain why.
            Return JSON only: {{"score": 7, "reason": "...", "recommended_action": "..."}}
            
            Company data: {company_data}
            """
        }]
    )
    import json
    return json.loads(message.content[0].text)
