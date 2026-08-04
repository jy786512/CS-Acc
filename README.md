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
# Add your OPENAI_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

1. Push this repo to GitHub (already connected to `jy786512/CS-Acc`)
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Add environment variable: `OPENAI_API_KEY` = your OpenAI API key
4. Deploy

> **Note:** Without `OPENAI_API_KEY`, the app uses rule-based fallback analysis. Add the key for full AI-powered insights.

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
| `OPENAI_API_KEY` | Recommended | OpenAI API key for AI sentiment analysis |

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (trend visualization)
- **OpenAI GPT-4o-mini** (sentiment analysis)
- **LocalStorage** (client-side data persistence)

## Data Storage

Analysis data is stored in browser localStorage. Use Export/Import to backup or transfer data between devices. For team-wide persistence, consider adding Vercel Postgres or KV in a future iteration.

## License

Private — Neuron7 / CS-Acc
