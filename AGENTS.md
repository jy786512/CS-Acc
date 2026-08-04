<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

"Customer Pulse" (`cs-acc`) is a single Next.js 16 App Router app (TypeScript + Tailwind v4). There is no database, backend service, or auth — it is the only process to run. Standard commands live in `package.json` and `README.md`; use `npm run dev` (dev server on port 3000), `npm run lint`, and `npm run build`.

Non-obvious notes:
- `OPENAI_API_KEY` is optional. When unset (the default in this environment), `src/lib/ai-analyzer.ts` uses a deterministic rule-based keyword fallback, so the full analyze flow works end-to-end without any external service. Set the key in `.env.local` only to exercise the real OpenAI path.
- All persistence is client-side in the browser `localStorage` (`src/lib/storage.ts`). There is nothing to persist or migrate server-side; a fresh browser/profile starts with an empty dashboard.
- `POST /api/analyze` expects `transcript` to be a parsed `ParsedTranscript` object (with a `segments` array), not a raw string. The UI parses pasted/uploaded text into that shape via `src/lib/transcript-parser.ts` before calling the API — sending a raw string directly will error.
- The favicon `404` in the browser console is harmless and unrelated to app functionality.
