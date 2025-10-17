# Discovrr Dashboard - Usage Guide

## Overview

This is a fully interactive prototype of the Discovrr Analytics dashboard for AcmeCRM. The dashboard provides comprehensive insights into how AI platforms (LLMs) present your brand.

## How to Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:8080`

## Navigation

The dashboard includes 7 main sections accessible via the left sidebar:

### 1. **Overview** (`/overview`)
The main dashboard showing:
- **Top Row**: 5 key metric cards (click any card to see detailed view)
  - Visibility Score (gauge visualization)
  - Overall Ranking
  - Top Answer Rate
  - Topic Sources count
  - Sentiment Score
- **Bottom Section**: Full prompts table with filtering and search
  - Click any row to open the detailed prompt drawer

### 2. **Visibility** (`/visibility`)
Deep dive into the Visibility Score:
- Overall score with delta
- Component breakdown (LLM Presence, Authority Reach, Coverage, Freshness)
- Top contributing prompts list

### 3. **Ranking** (`/ranking`)
Competitive ranking analysis:
- Average rank position
- #1 rankings count
- Top 3 rankings count
- Ranked leaderboard of all prompts

### 4. **Topics** (`/topics`)
Traffic source analysis:
- Top 3 sources highlight cards
- Full domain list with DA (Domain Authority)
- Citation distribution visualization
- Domain types: owned, earned, competitor

### 5. **Competitors** (`/competitors`)
Competitive intelligence:
- Share of Voice (SOV) comparison
- Competitor gap analysis
- Detailed comparison table with overlap index

### 6. **Sentiment** (`/sentiment`)
Sentiment analysis:
- Overall sentiment score
- Positive/Neutral/Negative distribution
- Prompts ranked by sentiment
- Sample snippets

### 7. **Demo Mode** (`/demo`)
Interactive simulation:
- Click "Run Simulation" to see before/after metrics
- Simulates adding high-DA citations + improved AIR
- Shows projected impact on all key metrics
- Click "Reset" to return to baseline

## Key Features

### Interactive Elements
- **Metric Cards**: Click to navigate to detail pages
- **Prompts Table**: Click rows to open detail drawer
- **Domain Badges**: Clickable (in detail views)
- **Export Evidence**: Download CSV of prompt evidence from drawer

### Filters & Controls
- **Search**: Filter prompts in real-time
- **Engine Filter**: Toggle LLM engines (header dropdown)
- **Dev Mode**: Toggle developer view (shows raw data/formulas)
- **Date Range**: Currently set to "Last 28 days" (badge in header)

### Detail Views
- **Prompt Drawer**: Slide-over with per-engine analysis
  - Accordion per engine
  - Raw snippets with highlighted mentions
  - Citing domains with DA scores
  - Export to CSV

## Seed Data

The prototype uses built-in mock data for AcmeCRM including:
- 5 sample prompts with varying performance
- 3 competitors (HubSpot, Salesforce, Zoho)
- 5 topic sources with DA scores
- Multiple engine responses per prompt
- Mixed sentiment scores

## Metrics Formulas

All formulas are shown in tooltips (hover the info icon on metric cards):

- **AIR** = (answers_including_brand / total_answers) × 100
- **Visibility Score** = 0.5×PromptVis + 0.2×Authority + 0.2×Coverage + 0.1×Freshness
- **SOV** = brand_citations / total_citations × 100
- **Sentiment** = avg(-1 to 1 scale) across all mentions

## Customization

To replace seed data with real LLM ingestion:

1. Update `src/data/seedData.ts` with your data
2. Modify types in `src/types/index.ts` as needed
3. Adjust formulas in `src/lib/metrics.ts`

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts (sparklines)
- **Animations**: Framer Motion
- **Routing**: React Router v6

## Design System

The design uses a professional blue/purple gradient scheme:
- Primary: HSL(240, 78%, 62%) - Analytics blue
- Secondary: HSL(260, 70%, 55%) - Purple accent
- Accent: HSL(25, 95%, 60%) - Orange for CTAs
- Success/Warning/Destructive for sentiment indicators

All colors are defined in `src/index.css` using CSS variables and consumed via Tailwind utilities.
