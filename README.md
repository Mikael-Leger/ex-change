# EX·change

A modern, glassmorphism currency converter with live rates, historical trends and a multi-currency markets view.

## Features
- **Live conversion** — instant, client-side conversion (no round-trip per keystroke) using rates fetched once on load.
- **Searchable currency picker** — type-to-filter by code or name, each with a country flag.
- **Rate trend + sparkline** — 7 / 30 / 90-day historical chart with the period change %, served by `/history`.
- **Markets panel** — convert the same amount into several popular currencies at once.
- **Glassmorphism UI** — animated aurora background, frosted-glass cards, fully responsive.
- Selection (from / to / amount) persists in `localStorage`.

# Versions

## Frontend
- Typescript: 5.6.2
- React: 18.3.12
- Vite: 6.0.1

## Backend
- Python: 3.12.0
- Flask: 3.1.0

# Architecture
- **Frontend** — a Vite/React SPA. All conversion happens client-side from a single `/rates` fetch.
- **Backend** — an API-only Flask app at [`backend/index.py`](backend/index.py) (`/rates`, `/convert`, `/history`, `/api`). It does **not** serve the SPA.
- On **Vercel** ([`vercel.json`](vercel.json)) two builders run: `@vercel/static-build` (root [`package.json`](package.json) → builds the SPA to `frontend/dist`, served from the CDN) and `@vercel/python` (the Flask function). The API paths route to the function; everything else falls back to the SPA's `index.html`.

# Get started

## Configure
Create `backend/.env`:
```.env
API_URL=https://api.freecurrencyapi.com
API_KEY=YOUR-API-KEY
```
Get a free key at https://freecurrencyapi.com. Without it, `/rates` returns a 503 and the UI shows a friendly "not configured" message (the historical sparkline still works — it uses a key-less API).

## Run locally (hot reload)
Two terminals — Vite proxies the API routes to Flask on `:5000`:
```bash
pip install -r backend/requirements.txt && python backend/index.py   # Flask API on :5000
cd frontend && npm install && npm run dev                             # SPA on :5173
```
Open http://localhost:5173.

## API routes (backend)
- `GET  /rates` — latest rates (freecurrencyapi).
- `POST /convert` — server-side conversion helper (the SPA also converts client-side).
- `GET  /history?from=USD&to=EUR&days=30` — historical series for the sparkline (ECB data via frankfurter.app; key-less). Returns `{ "history": [] }` for unsupported pairs so the UI degrades gracefully.
- `GET  /api` — reports the configured rates API URL.

## Deploy (Vercel)
Push to the connected Git repo and Vercel builds from [`vercel.json`](vercel.json). Requirements:

1. **Root Directory** = repo root (Settings → General → Root Directory = `./`).
2. Env vars **`API_URL`** = `https://api.freecurrencyapi.com` and **`API_KEY`** set for the Production environment (Settings → Environment Variables).

> Because `vercel.json` declares an explicit `builds` array, the dashboard Framework Preset / Output Directory settings are ignored.
