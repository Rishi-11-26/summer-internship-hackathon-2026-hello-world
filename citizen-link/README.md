# T-Sahaya — Telangana Schemes Portal

> **"Sahaya" means Help in Telugu.**
> T-Sahaya is an AI-powered government scheme eligibility platform built exclusively for the citizens of Telangana, India. It provides instant, accurate, multilingual guidance on 14+ state welfare schemes — no internet required, no API costs, no crashes.

---

## Why T-Sahaya?

Millions of eligible Telangana citizens miss out on government welfare schemes simply because they don't know about them or how to apply. Uneducated and rural citizens face even higher barriers — spelling errors, language gaps, and complex procedures block access to their rightful benefits.

T-Sahaya solves this by providing:

- ✅ **Instant Eligibility Analysis** — Select a scheme, enter your age and income; our local Smart Engine checks real eligibility rules instantly.
- ✅ **Strict Age Validation** — Every scheme has official minimum/maximum age rules that are verified against your input. If you don't qualify, you are told clearly — no false hopes.
- ✅ **14+ Telangana Schemes** — Agriculture, health, education, housing, marriage, pensions, maternity, handlooms, and more.
- ✅ **Clear Actionable Steps** — Step-by-step application instructions, not vague summaries.
- ✅ **3-Language Full UI** — The entire interface (labels, buttons, results) switches to English, Hindi, or Telugu instantly.
- ✅ **Zero API Dependencies** — Works completely offline with a hardcoded local Smart Engine. No rate limits, no quota errors, no crashes during demos.
- ✅ **Auto-Updating Eligibility Rules** — A GitHub Actions pipeline runs daily, scraping official scheme portals and automatically updating age/income limits if the government changes them.

---

## Supported Schemes

| Scheme | Category | Age Eligibility |
|---|---|---|
| Maha Lakshmi Scheme | Women / Free Bus | 18+ |
| Rythu Bharosa / Rythu Bandhu | Agriculture | 18+ |
| Gruha Jyothi Scheme | Free Electricity (200 units) | 18+ |
| Telangana ePASS | Scholarships (Inter, B.Tech, Degree, PG) | 16 – 35 |
| Aasara Pensions | Elderly / Widow / Disability | 18+ (Old Age: 57+) |
| Kalyana Lakshmi / Shaadi Mubarak | Marriage Assistance | Bride 18+, Groom 21+ |
| Rajiv Aarogyasri | Health Insurance | All ages |
| Telangana Dalit Bandhu | Dalit Empowerment (₹10 Lakhs) | 18+ |
| KCR Kit / Amma Vodi | Maternity Support | 18 – 45 |
| Indiramma Indlu | Housing Scheme | 18+ |
| Kanti Velugu | Free Eye Checkups & Surgeries | All ages |
| CM Overseas Scholarship | Study Abroad for Minorities | 18 – 35 |
| Golla Kuruma Sheep Distribution | Livestock / Rural Economy | 18+ |
| Nethannaku Cheyutha | Handloom Weavers Saving Scheme | 18+ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| AI Engine | Local Telangana Smart Engine (zero external API) |
| Automation | Python + BeautifulSoup + GitHub Actions |

---

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── orchestrate/
│   │   │       └── route.ts          # Local Smart Engine — reads from schemes_eligibility.json at runtime
│   │   ├── page.tsx                  # Main UI with full i18n translation (EN / HI / TE)
│   │   ├── layout.tsx                # App layout & SEO metadata
│   │   └── globals.css               # Global styles
│   └── components/
│       └── LogStream.tsx             # Live agent streaming log component
│
├── public/
│   └── data.json                     # Auto-updated: portal news + services (daily scrape)
│
├── schemes_eligibility.json          # Auto-updated: official age/income rules per scheme (daily scrape)
├── scout_agent.py                    # Python scraper: scrapes portal + scheme pages, updates both JSONs
│
└── .github/
    └── workflows/
        └── update_data.yml           # GitHub Actions: runs scout_agent.py daily at 00:00 UTC
```

---

## How the Auto-Update Pipeline Works

Every day at midnight UTC, the GitHub Actions pipeline runs automatically:

```
scout_agent.py
   │
   ├─► Scrapes telangana.gov.in for latest news & services
   │         → Updates public/data.json
   │
   └─► Visits each scheme's official portal
             (aarogyasri.telangana.gov.in, kalyanalakshmi.telangana.gov.in, etc.)
             → Extracts updated age/income eligibility numbers via regex
             → Updates schemes_eligibility.json

If anything changed:
   └─► Auto-commits both files: "Automated Govt Data Sync [Skip CI]"
             → Vercel detects commit → auto-redeploys
             → route.ts reads new values at next request ✅
```

> **Safety:** If a government website is unreachable, the scraper keeps the existing known-good value. It never writes incorrect data.


## Built For

This project was built for the citizens of **Telangana, India** to improve government service delivery and accessibility.

---

*Made with ❤️ for the people of Telangana.*
