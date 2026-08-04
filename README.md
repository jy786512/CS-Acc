# Customer Pulse

AI-powered customer sentiment analysis from meeting transcripts. Built for Neuron7 customer success teams to track customer health over time.

## Features

- **Transcript Upload & Paste** — Support for `.txt`, `.vtt`, `.srt`, and `.json` formats (Zoom, Teams, Otter, plain text)
- **Smart Speaker Filtering** — Automatically excludes Neuron7 team members; only analyzes customer speech
- **AI Disposition Analysis** — Classifies customers as **Red** (at risk), **Yellow** (needs attention), or **Green** (healthy)
- **Health Dashboard** — Visual meters, trend charts, and per-customer disposition tracking
- **Export for PM Tools** — JSON and CSV export ready to feed into your project management customer health metric
- **Vercel Ready** — Deploy in one click

## Quick Start

### Local Development

```bash
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

The app is configured for Vercel out of the box (`vercel.json`, Next.js App Router, Node 20+).

1. Import [jy786512/CS-Acc](https://github.com/jy786512/CS-Acc) at [vercel.com/new](https://vercel.com/new)
2. Use **Production Branch:** `main`
3. Framework preset should auto-detect as **Next.js** — no custom build settings needed
4. Add this environment variable in **Project → Settings → Environment Variables**:

| Variable | Environments | Required |
|----------|--------------|----------|
| `GEMINI_API_KEY` | Production, Preview, Development | Optional (enables AI analysis via Google Gemini; without it the app uses rule-based fallback) |

5. Click **Deploy**

After the first deploy, every push to `main` triggers a production deployment. Pull request previews are created automatically for other branches.

> **Note:** Analysis data is stored in the browser (`localStorage`), not on Vercel — no database or KV store is required.

## Usage

### 1. Upload a Transcript

Go to **Upload** and either:
- Drop a transcript file (`.txt`, `.vtt`, `.srt`, `.json`)
- Paste transcript text directly

Supported format example:
```
Sarah (Acme Corp): We're really happy with the progress so far.
John (Neuron7): Great to hear! Let me share the roadmap.
Sarah (Acme Corp): Actually, we have some concerns about the timeline.
```

### 2. Configure Meeting Details

- **Customer Name** — The company/customer being analyzed
- **Meeting Title** — Optional meeting name
- **Additional Neuron7 Speakers** — Comma-separated names to exclude (auto-detects "neuron7" in speaker names)

### 3. Analyze & View Dashboard

Click **Analyze Customer Tone** to get a red/yellow/green disposition with health score, summary, and key signals.

The dashboard shows:
- Per-customer health meters
- Trend over time (improving / stable / declining)
- Overall stats and charts

### 4. Export Data

Export JSON (full analysis history) or CSV (customer health summary) from the dashboard for your PM tool integration.

## Transcript Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| Plain text | `.txt` | `Speaker Name: what they said` |
| WebVTT | `.vtt` | Standard subtitle format with speakers |
| SubRip | `.srt` | Standard subtitle format |
| JSON | `.json` | Array of `{speaker, text}` or Zoom/Otter export |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Recommended | Google AI Studio / Gemini API key for AI sentiment analysis |

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (trend visualization)
- **Google Gemini** (sentiment analysis)
- **LocalStorage** (client-side data persistence)

## Data Storage

Analysis data is stored in browser localStorage. Use Export/Import to backup or transfer data between devices. For team-wide persistence, consider adding Vercel Postgres or KV in a future iteration.

## License

Private — Neuron7 / CS-Acc
