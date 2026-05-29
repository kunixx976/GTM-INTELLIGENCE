from fastapi import FastAPI
from pydantic import BaseModel
from app.agents.scraper import scrape_company_page, serp_search
from app.agents.scorer import score_buying_signal

app = FastAPI()

class EnrichRequest(BaseModel):
    company_name: str
    company_url: str

@app.post("/enrich")
async def enrich_account(req: EnrichRequest):
    # 1. Scrape company page
    raw_html = scrape_company_page(req.company_url)
    
    # 2. Search for recent news
    news = serp_search(f"{req.company_name} funding OR hiring OR expansion 2026")
    
    # 3. Score with Claude
    score = score_buying_signal(f"Company: {req.company_name}\nNews: {news}\nPage: {raw_html[:2000]}")
    
    return {
        "company": req.company_name,
        "signal_score": score["score"],
        "reason": score["reason"],
        "action": score["recommended_action"]
    }

@app.get("/health")
def health():
    return {"status": "ok"}
