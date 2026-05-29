import requests
import os

BRIGHTDATA_API_KEY = os.getenv("BRIGHTDATA_API_KEY")

def scrape_company_page(url: str) -> str:
    """Use Bright Data Web Unlocker to fetch any page"""
    response = requests.get(
        "https://api.brightdata.com/request",
        params={"url": url},
        headers={
            "Authorization": f"Bearer {BRIGHTDATA_API_KEY}",
            "Content-Type": "application/json"
        }
    )
    return response.text

def serp_search(query: str) -> dict:
    """Use Bright Data SERP API to get search results"""
    response = requests.get(
        "https://api.brightdata.com/serp",
        params={"q": query, "num": 10},
        headers={"Authorization": f"Bearer {BRIGHTDATA_API_KEY}"}
    )
    return response.json()
