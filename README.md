# Apagón Puerto Rico

Live dashboard of power outages across Puerto Rico, built on LUMA Energy's public
outage feed, with U.S. Census context on the communities affected.

**Live:** https://www.apagonpuertorico.com

## Features

- Island-wide and per-region customers without service, refreshed every 5 minutes
- Severity choropleth map: a lightweight inline-SVG map by default (no tiles, fast on weak signal), with the Mapbox map one tap away
- Installable web app (manifest + service worker): opens offline with the last saved numbers, and serves the cached page after 4 s on a slow connection
- Freshness indicator — flags when LUMA's last update is more than 30 minutes old
- Spanish / English toggle (persisted in a cookie, no flash on reload)
- ACS 1-year Census data: poverty, income, gender wage gap, employment, education, health insurance
- Links to relief organizations and petitions

## Stack

Next.js (App Router) · React 19 · Tailwind CSS v4 · SWR · react-map-gl / Mapbox GL. Charts are plain HTML/CSS — no charting library.

## Development

```bash
yarn install
cp .env.local.example .env.local   # add your Mapbox public token
yarn dev
```

### Environment variables

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public access token used by the outage map |
| `DATABASE_URL` | Neon Postgres connection string. Enables outage history (`/api/history`, the History section). Optional — everything else works without it. |
| `CRON_SECRET` | Bearer token required by `/api/cron/snapshot`. Vercel Cron sends it automatically. |
| `CENSUS_API_KEY` | U.S. Census Bureau API key (free: https://api.census.gov/data/key_signup.html). Without it the Census API redirects to an HTML page and the demographic sections are skipped. |

## Outage history (Neon + Drizzle)

LUMA only exposes the current state, so the site records it:

- `lib/db/schema.ts` — `outage_snapshots` (one row per distinct LUMA update, deduplicated on LUMA's timestamp), `region_snapshots`, `system_snapshots` (grid demand/reserve, ~every 5 min).
- Writes happen in two places: as a side effect of `/api/outages` and `/api/system` (`after()`, so responses aren't delayed), and from `/api/cron/snapshot`, which Vercel Cron calls every 5 minutes (`vercel.json`; needs a Pro plan). Both paths are idempotent.
- `/api/history?range=24h|7d|30d` serves the series, bucketed in SQL to at most ~600 points; `components/History.tsx` draws it with plain SVG.

Setup:

```bash
# 1. create a Neon project, copy the pooled connection string into .env.local as DATABASE_URL
# 2. create the tables
yarn db:push
# 3. on Vercel: add DATABASE_URL and CRON_SECRET
```

`yarn db:studio` opens Drizzle Studio against the database.

## Map

The default map is inline SVG. Its paths come from `lib/puerto-rico.json` via `node scripts/build-map-paths.mjs` (writes `lib/pr-paths.ts`).

## Data sources

- Outages: `https://api.miluma.lumapr.com/miluma-outage-api/outage/regionsWithoutService` (proxied through `/api/outages`, cached for 5 minutes). Timestamps are Atlantic Standard Time.
- Demographics: U.S. Census Bureau API, ACS 1-year estimates (tables S1701, S1901, B20017, S2301, S1501, S2701), cached for 24 hours.

Region polygons live in `lib/puerto-rico.json` and are joined to the LUMA feed by region name.

## Disclaimer

Not affiliated with the Government of Puerto Rico or LUMA Energy.
