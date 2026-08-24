# Apagón Puerto Rico

Live dashboard of power outages across Puerto Rico, built on LUMA Energy's public
outage feed, with U.S. Census context on the communities affected.

**Live:** https://www.apagonpuertorico.com

## Features

- Island-wide and per-region customers without service, refreshed every 5 minutes
- Severity choropleth map (Mapbox) with hover/tap details and a legend
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
| `CENSUS_API_KEY` | U.S. Census Bureau API key (free: https://api.census.gov/data/key_signup.html). Without it the Census API redirects to an HTML page and the demographic sections are skipped. |

## Data sources

- Outages: `https://api.miluma.lumapr.com/miluma-outage-api/outage/regionsWithoutService` (proxied through `/api/outages`, cached for 5 minutes). Timestamps are Atlantic Standard Time.
- Demographics: U.S. Census Bureau API, ACS 1-year estimates (tables S1701, S1901, B20017, S2301, S1501, S2701), cached for 24 hours.

Region polygons live in `lib/puerto-rico.json` and are joined to the LUMA feed by region name.

## Disclaimer

Not affiliated with the Government of Puerto Rico or LUMA Energy.
