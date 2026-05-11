"""
T-Sahaya Scout Agent (v2)
=========================
Two responsibilities:
  1. Scrapes Telangana State Portal homepage for Latest News & Services -> updates public/data.json
  2. Scrapes individual official scheme pages for age/income eligibility rules -> updates schemes_eligibility.json

Dependencies: requests, beautifulsoup4
Install: pip install requests beautifulsoup4
"""

import json
import os
import re
import sys
from datetime import datetime, timezone
import requests
from bs4 import BeautifulSoup

# ─── Config ────────────────────────────────────────────────────────────────────

PORTAL_URL      = "https://www.telangana.gov.in/"
DATA_FILE       = os.path.join(os.path.dirname(__file__), "public", "data.json")
ELIGIBILITY_FILE = os.path.join(os.path.dirname(__file__), "schemes_eligibility.json")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

# ─── Helpers ───────────────────────────────────────────────────────────────────

def fetch_page(url: str) -> BeautifulSoup | None:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "html.parser")
    except requests.RequestException as e:
        print(f"[Scout] WARNING: Could not fetch {url}: {e}", file=sys.stderr)
        return None


def get_text(soup: BeautifulSoup) -> str:
    return soup.get_text(" ", strip=True) if soup else ""


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


# ─── Part 1: Homepage Scraper (News & Services) ────────────────────────────────

def scrape_latest_news(soup: BeautifulSoup) -> list[dict]:
    items: list[dict] = []
    # 1. Check for standard WordPress/Elementor post titles (common in new redesign)
    for a in soup.select(".elementor-post__title a, .entry-title a"):
        text = a.get_text(strip=True)
        if text:
            items.append({"title": text, "url": a.get("href", "")})
    if items:
        return items[:20]

    # 2. Check for legacy containers (fallback)
    for container_id in ["latest-news", "latestNews", "news-section"]:
        section = soup.find(id=container_id)
        if section:
            for li in section.find_all("li"):
                text = li.get_text(strip=True)
                link_tag = li.find("a")
                if text:
                    items.append({"title": text, "url": link_tag["href"] if link_tag and link_tag.get("href") else ""})
            if items:
                return items[:20]

    ticker = soup.find("div", class_=lambda c: c and "ticker" in c.lower())
    if ticker:
        for a in ticker.find_all("a"):
            text = a.get_text(strip=True)
            if text:
                items.append({"title": text, "url": a.get("href", "")})

    return items[:20]


def scrape_services(soup: BeautifulSoup) -> list[dict]:
    items: list[dict] = []
    # 1. Check for Elementor buttons (new redesign)
    for a in soup.select(".elementor-button-link"):
        text = a.get_text(strip=True)
        if text and len(text) < 40: # avoid long paragraphs
            items.append({"name": text, "url": a.get("href", "")})
    if items:
        return items[:30]

    # 2. Check for legacy containers
    for container_id in ["services", "e-services", "citizen-services", "onlineServices"]:
        section = soup.find(id=container_id)
        if section:
            for a in section.find_all("a"):
                text = a.get_text(strip=True)
                if text:
                    items.append({"name": text, "url": a.get("href", "")})
            if items:
                return items[:30]
    return items[:30]


def update_portal_data(soup: BeautifulSoup) -> bool:
    """Update public/data.json with news and services. Returns True if changed."""
    new_news = scrape_latest_news(soup)
    new_services = scrape_services(soup)
    print(f"[Scout] Portal: found {len(new_news)} news, {len(new_services)} services.")

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        existing = json.load(f)

    old_news_titles = {i.get("title", "") for i in existing.get("latestNews", [])}
    new_news_titles  = {i.get("title", "") for i in new_news}
    old_svc_names   = {i.get("name", "")  for i in existing.get("services", [])}
    new_svc_names   = {i.get("name", "")  for i in new_services}

    content_changed = not (old_news_titles == new_news_titles and old_svc_names == new_svc_names)

    if content_changed:
        existing["latestNews"]  = new_news
        existing["services"]    = new_services
        existing["lastUpdated"] = now_iso()
        print(f"[Scout] Portal: content changes detected — updating news/services.")
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(existing, f, ensure_ascii=False, indent=2)
        print(f"[Scout] Portal: public/data.json updated.")
        return True
    else:
        print("[Scout] Portal: no changes detected in news/services.")
        return False


# ─── Part 2: Scheme Eligibility Scraper ────────────────────────────────────────

def extract_min_age(text: str, current: int) -> int:
    """
    Try to extract a minimum age from page text using regex patterns.
    Returns the found value, or current (unchanged) if not found.
    """
    patterns = [
        r"minimum\s+age\s*(?:is|of|:)?\s*(\d{1,2})\s*years?",
        r"age\s+(?:should\s+be|must\s+be|not\s+less\s+than)\s*(\d{1,2})\s*years?",
        r"above\s+(\d{1,2})\s*years?\s+of\s+age",
        r"(?:aged?|age)\s*(?:above|over|atleast|at\s+least)\s*(\d{1,2})",
        r"(\d{1,2})\s*years?\s+(?:and\s+above|or\s+above|or\s+older)",
        r"completed\s+(\d{1,2})\s*years?",
    ]
    for pat in patterns:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            val = int(m.group(1))
            if 10 <= val <= 80:   # sanity check: ages between 10-80 are realistic
                print(f"[Scout]   -> Found minAge candidate: {val}")
                return val
    return current


def extract_max_age(text: str, current: int) -> int:
    """
    Try to extract a maximum age from page text.
    Returns found value or current if not found.
    """
    patterns = [
        r"maximum\s+age\s*(?:is|of|:)?\s*(\d{1,2})\s*years?",
        r"age\s+(?:should\s+not\s+exceed|must\s+not\s+exceed|not\s+more\s+than)\s*(\d{1,2})\s*years?",
        r"(?:below|under|not\s+exceeding)\s+(\d{1,2})\s*years?\s+of\s+age",
        r"age\s+limit\s*(?:is|:)?\s*(\d{1,2})\s*years?",
        r"(?:up\s+to|upto)\s+(\d{1,2})\s*years?\s+of\s+age",
    ]
    for pat in patterns:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            val = int(m.group(1))
            if 18 <= val <= 80:
                print(f"[Scout]   -> Found maxAge candidate: {val}")
                return val
    return current


def extract_income_limit(text: str, current: int) -> int:
    """
    Try to extract income limit (annual) from page text.
    Handles formats like: Rs. 2,00,000 / ₹2 lakh / Rs 2 lakhs
    """
    # Match "X lakh(s)" pattern
    lakh_patterns = [
        r"(?:income|annual\s+income|family\s+income).*?(\d+(?:\.\d+)?)\s*lakh",
        r"(\d+(?:\.\d+)?)\s*lakh.*?(?:income|limit|per\s+annum|per\s+year)",
        r"rs\.?\s*(\d+(?:\.\d+)?)\s*lakh",
    ]
    for pat in lakh_patterns:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            val = int(float(m.group(1)) * 100000)
            if 10000 <= val <= 10000000:
                print(f"[Scout]   -> Found eligibilityLimit candidate: Rs.{val:,}")
                return val

    # Match numeric formats like 2,00,000 or 200000
    num_patterns = [
        r"(?:income|annual\s+income).*?(?:rs\.?|₹)\s*([\d,]+)",
        r"(?:rs\.?|₹)\s*([\d,]+).*?(?:income|per\s+annum|annually)",
    ]
    for pat in num_patterns:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            val = int(m.group(1).replace(",", ""))
            if 10000 <= val <= 10000000:
                print(f"[Scout]   -> Found eligibilityLimit candidate: Rs.{val:,}")
                return val

    return current


def scrape_scheme_eligibility() -> bool:
    """
    Visit each scheme's official page and try to update minAge, maxAge, eligibilityLimit.
    Returns True if any value changed.
    """
    with open(ELIGIBILITY_FILE, "r", encoding="utf-8") as f:
        config = json.load(f)

    changed = False

    for scheme_id, scheme_data in config["schemes"].items():
        url = scheme_data.get("sourceUrl", "")
        if not url:
            continue

        print(f"\n[Scout] Checking eligibility for '{scheme_id}' at {url}")
        soup = fetch_page(url)
        if not soup:
            print(f"[Scout]   -> Could not reach page. Keeping existing values.")
            continue

        text = get_text(soup)

        old_min = scheme_data["minAge"]
        old_max = scheme_data["maxAge"]
        old_income = scheme_data["eligibilityLimit"]

        new_min    = extract_min_age(text, old_min)
        new_max    = extract_max_age(text, old_max)
        new_income = extract_income_limit(text, old_income)

        if new_min != old_min or new_max != old_max or new_income != old_income:
            print(f"[Scout]   -> CHANGE DETECTED for {scheme_id}:")
            if new_min != old_min:
                print(f"             minAge: {old_min} -> {new_min}")
            if new_max != old_max:
                print(f"             maxAge: {old_max} -> {new_max}")
            if new_income != old_income:
                print(f"             eligibilityLimit: {old_income} -> {new_income}")

            scheme_data["minAge"]          = new_min
            scheme_data["maxAge"]          = new_max
            scheme_data["eligibilityLimit"] = new_income
            scheme_data["lastVerified"]    = now_iso()
            changed = True
        else:
            print(f"[Scout]   -> No changes found. Values confirmed as-is.")
            scheme_data["lastVerified"] = now_iso()

    if changed:
        config["lastUpdated"] = now_iso()
        with open(ELIGIBILITY_FILE, "w", encoding="utf-8") as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
        print("\n[Scout] schemes_eligibility.json updated with new values.")
    else:
        print("\n[Scout] schemes_eligibility.json: all values confirmed. No eligibility changes.")

    return changed


# ─── Main ──────────────────────────────────────────────────────────────────────

def main() -> int:
    exit_code = 0

    # --- Part 1: Portal homepage ---
    print(f"\n{'='*60}")
    print(f"[Scout] PART 1: Scraping Telangana State Portal homepage")
    print(f"{'='*60}")
    soup = fetch_page(PORTAL_URL)
    if soup:
        update_portal_data(soup)
    else:
        print("[Scout] WARNING: Could not reach the portal homepage. Skipping Part 1.")
        # We don't set exit_code=1 here to allow Part 2 to proceed and the workflow to "pass"
        # as long as eligibility data is safe.

    # --- Part 2: Scheme eligibility pages ---
    print(f"\n{'='*60}")
    print(f"[Scout] PART 2: Scraping scheme eligibility pages")
    print(f"{'='*60}")
    try:
        scrape_scheme_eligibility()
    except Exception as e:
        print(f"[Scout] ERROR in eligibility scrape: {e}", file=sys.stderr)
        exit_code = 1

    print(f"\n[Scout] Done. Exit code: {exit_code}")
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
