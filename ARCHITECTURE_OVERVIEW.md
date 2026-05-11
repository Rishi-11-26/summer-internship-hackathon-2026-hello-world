# T-Sahaya — Architecture Overview

## Overview

T-Sahaya is an AI-powered Telangana government schemes eligibility platform designed to provide fast, multilingual, and reliable welfare scheme guidance for citizens. The platform is built with a lightweight, scalable, and API-independent architecture to ensure smooth performance, low operational cost, and high reliability.

The system combines:
- A responsive multilingual frontend
- A local smart eligibility engine
- Automated government data synchronization
- Continuous deployment infrastructure

---

# System Architecture

```text
User Interface (Next.js + Tailwind CSS)
                │
                ▼
Application Layer (App Router + API Routes)
                │
                ▼
Local Smart Eligibility Engine
(route.ts + schemes_eligibility.json)
                │
                ▼
Eligibility Analysis & Validation
                │
                ▼
Multilingual Results + Application Guidance
```

---

# Core Components

## 1. Frontend Layer

### Technologies Used
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

### Responsibilities
- Responsive UI rendering
- User input collection
- Multilingual interface support
- Displaying eligibility results
- User-friendly navigation and accessibility

The frontend is optimized for both desktop and mobile users to maximize accessibility for urban and rural citizens.

---

## 2. Local Smart Eligibility Engine

### Core Logic
The platform uses a custom-built local eligibility engine instead of relying on external AI APIs.

### Responsibilities
- Reads official scheme rules from `schemes_eligibility.json`
- Performs:
  - age validation
  - income validation
  - scheme-specific eligibility checks
- Generates instant eligibility decisions
- Provides application guidance and next steps

### Advantages
- Zero API cost
- No external dependency failures
- No rate limits
- Offline-friendly architecture
- Fast response time

---

## 3. Multilingual Translation System

The application supports:
- English
- Hindi
- Telugu

### Features
- Dynamic UI translation
- Localized labels and buttons
- Accessible communication for diverse users

This improves accessibility for citizens from different educational and linguistic backgrounds.

---

## 4. Automated Government Data Sync Pipeline

### Technologies Used
- Python
- BeautifulSoup
- GitHub Actions

### Workflow

```text
GitHub Actions Scheduler
            │
            ▼
Runs scout_agent.py daily
            │
            ▼
Scrapes Telangana government portals
            │
            ▼
Extracts updated eligibility values
            │
            ▼
Updates:
- public/data.json
- schemes_eligibility.json
            │
            ▼
Auto-commit changes
            │
            ▼
Vercel auto-redeploys updated platform
```

### Safety Mechanism
If any government portal becomes unavailable:
- Existing verified values are retained
- Invalid or empty data is never written

This ensures system reliability and prevents incorrect eligibility information.

---

## 5. Deployment Architecture

### Frontend Hosting
- Vercel

### Continuous Deployment
- Automatic redeployment triggered by GitHub commits

### Benefits
- Fast CDN delivery
- High uptime
- Scalable infrastructure
- Seamless updates

---

# Data Flow

```text
User Inputs:
- Scheme Selection
- Age
- Income
        │
        ▼
Next.js Frontend
        │
        ▼
API Route (route.ts)
        │
        ▼
Local Smart Eligibility Engine
        │
        ▼
Eligibility Validation
        │
        ▼
Personalized Guidance Returned
```

---

# Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── orchestrate/
│   │   │       └── route.ts
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   └── components/
│       └── LogStream.tsx
│
├── public/
│   └── data.json
│
├── schemes_eligibility.json
├── scout_agent.py
│
└── .github/
    └── workflows/
        └── update_data.yml
```

---

# Scalability & Future Scope

Planned future improvements include:
- Voice-based assistance
- OCR document verification
- AI chatbot support
- Aadhaar-based personalization
- Real-time government notifications
- Mobile application support
- Additional Indian state integrations

---

# Key Technical Highlights

- Fully multilingual interface
- AI-powered eligibility analysis
- Zero external AI/API dependency
- Automated government data synchronization
- Lightweight scalable architecture
- Continuous deployment pipeline
- Rural accessibility focused design

---

# Conclusion

T-Sahaya is designed as a citizen-first digital welfare accessibility platform that simplifies access to Telangana government schemes through automation, multilingual accessibility, and intelligent eligibility analysis.

The architecture prioritizes:
- reliability
- accessibility
- scalability
- speed
- low operational cost
- real-world usability
