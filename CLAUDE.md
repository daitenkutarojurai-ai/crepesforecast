# Glaces en Seine · Briefing Dimanche

Sunday-briefing dashboard for a food caravan (crêpes / gaufres / glaces) on
the Quai de Seine between **La Frette-sur-Seine (95530)** and
**Cormeilles-en-Parisis (95240)**. Every metric targets the **upcoming
Sunday**; the briefing is refreshed several times during the week so the
forecast sharpens as Sunday approaches. Rolls to the next Sunday at Monday
00:00 local.

Coordinates used: `48.9843, 2.1836`.

---

## Stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** with the light "seine" palette (`seine-*`) — cream page,
  pastel-blue header, rounded white cards with soft shadows
- **lucide-react** for iconography
- Server components for the initial briefing, client component for refresh
- Single `/api/briefing` route returns the full engine output as JSON
- All copy in **French**

## Project layout

```
app/
  layout.tsx                # root layout, light theme, viewport
  page.tsx                  # SSR entrypoint, builds briefing + renders Dashboard
  globals.css               # Tailwind + cream background
  api/briefing/route.ts     # JSON endpoint, no-store
components/
  Dashboard.tsx             # top-level client shell, 5-min auto-refresh
  Header.tsx                # pastel-blue band, date, Grand-Mère, Mode toggle, refresh
  Card.tsx                  # shared rounded-card primitive (+ Chip, Stat helpers)
  QuickView.tsx             # top "Aperçu · Dimanche" card (5-number snapshot)
  WeatherCustomerCard.tsx   # Météo & Clientèle (stats + hourly bars + clientèle)
  EventsCrowdCard.tsx       # Événements & Affluence (pulses + agenda + social)
  MenuSpecialsCard.tsx      # Menu & Specials (topping, bribe, horoscope)
  Details.tsx               # Below-the-fold grid: napkin / lycra / poussette / nutella / Vigicrues
  GrandMereLight.tsx        # Chip with pulsing red indicator when Ct > 15
  ModeToggle.tsx            # Crêpe / Glace pill toggle
  SourcesPanel.tsx          # Data confidence badges
lib/
  types.ts                  # Shared domain types (+ targetDate)
  time.ts                   # resolveTargetSunday, French date formatters
  engine.ts                 # Ct, Pt, Bm, pulses, napkin/lycra/poussette/horoscope
  weather.ts                # Open-Meteo fetch for the target Sunday
  externals.ts              # Vigicrues fetch + stubs for non-free APIs
  briefing.ts               # Composes the full Briefing object (target-Sunday)
```

## Logic engine (implemented)

| Metric | Formula | File |
| ------ | ------- | ---- |
| Cardigan Threshold `Ct` | `(T × S) − W` with S = 1.0 sun / 0.5 sinon. `> 15` → Grand-Mère RED | `lib/engine.ts:computeCardigan` |
| Thermal Pivot `Pt` | `((T + S) − 21) / 5`, S = +3 sun / 0 clouds. `< 0` Crepe, `> 0` Glace, `> 2` Heat Drink Alert | `lib/engine.ts:computePivot` |
| Bribe-O-Meter `Bm` | `(dist_parking / avg_child_age) × fatigue`. Active 16:00–17:30 | `lib/engine.ts:computeBribeOMeter` |
| Pulse timeline | Ferry 10:00 / 12:30 / 14:00 / 18:00, Amen Rush 11:45, Théâtre 16:30, SNCF >15 min | `lib/engine.ts:buildPulses` |
| Recipe Scaler | Batter % = 100 + rain adj + event bumps + Grand-Mère. Topping + staffing decision | `lib/engine.ts:buildRecommendation` |
| Lycra Coefficient | Weather-driven cycling proxy | `lib/engine.ts:lycraCoefficient` |
| Poussette Factor | Spring months + 15:00–17:00 window | `lib/engine.ts:poussetteFactor` |
| Napkin Forecast | RNSA pollen risk → napkin multiplier | `lib/engine.ts:napkinForecast` |
| Nutella Index | Deterministic weekday proxy (no public promo API) | `lib/engine.ts:nutellaIndex` |
| Celestial Sales | Date-seeded Saturn's Roadblock toggle | `lib/engine.ts:horoscope` |
| Social Sentiment | #QuaiDeSeine spike % | `lib/engine.ts:socialSentiment` |
| Competitor Proxy | Google "Busier than usual" status | `lib/engine.ts:competitorProxy` |

## UX decisions

- **Aperçu first.** `QuickView` is the top card: a 6-stat strip that answers
  "what should I expect on Sunday?" in 5 seconds — feels-like, mode, cardigan,
  batter %, staffing, affluence.
- **Météo & Clientèle** card merges weather stats + hourly temperature bars
  with a "who's coming" block driven by pivot / bribe / poussette.
- **Événements & Affluence** card merges the pulse timeline (ferry / church /
  theater) with the local events list (brocante, régate, marché) and social +
  concurrence signals — one scroll, one card.
- **Menu & Specials** card exposes the recipe-scaler output (topping, batter %,
  staffing), the kid-bribe window, and the celestial special.
- **Détails** grid holds secondary signals (napkin, lycra, poussette, nutella,
  Vigicrues) below the fold — part of the report without competing for
  attention.
- **Grand-Mère chip** sits in the header with a pulsing red indicator when
  `Ct > 15`.
- **Mode toggle** (Crêpe / Glace) sits in the header; defaults to the engine
  recommendation and can be overridden.
- **Data confidence badges** (live / simulé / indispo.) are always visible at
  the bottom — no silent fake data.
- **Sunday targeting.** `lib/time.ts:resolveTargetSunday` resolves the upcoming
  Sunday at 10:00 local. Weather is fetched for that specific date via
  Open-Meteo `start_date=end_date=`, and every engine function (`buildPulses`,
  `computeBribeOMeter`, `poussetteFactor`, `horoscope`, `nutellaIndex`,
  `buildCatalog`) is anchored on the target date rather than "now".

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

---

## API feedback — what actually works vs. what's stubbed

### Live (no key required)

- **Open-Meteo** (`api.open-meteo.com`) — temperature, apparent temperature,
  wind speed, UV, cloud cover, hourly precipitation probability, daily
  sunrise/sunset. Free, no auth, generous rate limits. Solid for our needs.

### Best-effort (may fall back)

- **Vigicrues** — we hit
  `https://www.vigicrues.gouv.fr/services/observations.json/...`. Works but
  requires a confirmed station code (`CdStationHydro`) for the exact Seine
  section; the current code is a plausible placeholder. **TODO:** confirm the
  La Frette / Herblay station code. If the call fails or returns no data we
  fall back to a deterministic daily estimate and tag the source as
  `simulated`.

### Not reachable from this sandbox / require keys

| Signal | Why it's stubbed | Suggested path |
| ------ | ---------------- | -------------- |
| **SNCF Ligne J delays** | SNCF's Navitia API needs a token (`SNCF_NAVITIA_TOKEN`). Not present here. | Register at navitia.io (free), call `coverage/sncf/stop_areas/stop_area:SNCF:87381616/disruptions`. |
| **RNSA pollen** | No free public JSON; weekly bulletins are HTML/PDF only. | Airparif has a pollen bulletin you can scrape weekly, or purchase RNSA feed. |
| **Instagram / TikTok** `#QuaiDeSeine` | Both platforms gate tag search behind Business API review. Scraping violates ToS. | Option A: Meta Business API w/ approved app. Option B: paid proxy (Bright Data, Apify). Option C: Nitter / RSS where possible. |
| **Google Maps "Busier than usual"** | `populartimes` isn't exposed in the official Places API and community libraries get rate-limited. | Places API with Current Popularity (beta, needs contact) or scheduled scraping with rotating UA. |
| **Leclerc / supermarket promos ("Nutella Index")** | No public promo API. Drive catalogues are HTML per store. | Weekly scraper against `drive.leclerc` leaflet for magasin `Cormeilles`. |
| **Celestial transits** | Several APIs (astrologyapi.com, prokerala) are behind paywalls. | Bundle `swisseph` server-side (LGPL), compute local transits offline. |
| **Cormeilles / La Frette events agenda** | Municipal sites are hand-curated HTML. | Weekly cron scraping `cormeilles95.fr`, `lafrette95.fr`, `sortir.valdoise.fr` with a simple event extractor. |

Every stubbed source is tagged in `lib/externals.ts` with a `SourceStatus` and
rendered in the UI with a clear `SIMULATED` / `UNAVAILABLE` badge so no one
mistakes a guess for a live signal.

---

## TODO — next iterations

### Near term (data reliability)

- [ ] Confirm the Vigicrues `CdStationHydro` for the exact Seine section at
      La Frette-sur-Seine and wire the real flow value.
- [ ] Register for the SNCF Navitia API, wire Ligne J live delays (env var
      `SNCF_NAVITIA_TOKEN`), and replace the `sncfDelayMin: 0` baseline.
- [ ] Add a weekly cron that scrapes `sortir.valdoise.fr` +
      `cormeilles95.fr` + `lafrette95.fr` into `lib/externals.ts:CATALOG`.
- [ ] Pollen: weekly Airparif scrape → persist to `data/pollen.json`.
- [ ] Supermarket promos: scrape `drive.leclerc` Cormeilles leaflet once per
      week, expose via `lib/nutella.ts`.

### Near term (features)

- [ ] Real "Social Sentiment" feed (Nitter RSS fallback for `#QuaiDeSeine`).
- [ ] Local transit API: push-notify the sister at `T−15′` before each pulse.
- [ ] Sell-through log: accept a nightly `{date, crepes, glaces, waffles}` POST
      and train a lightweight regression on historical sales vs. briefing
      signals. Show "prediction vs. actual" on Monday morning.
- [ ] Offline PWA manifest + install prompt (she'll check this with spotty 4G
      on the quai).
- [ ] Add a "Shopping List" generator (butter, eggs, nutella jars, cream,
      sugar, cones) scaled by the recipe-scaler batter %.

### Polish

- [ ] Replace deterministic `hashDay()` stubs with real feeds.
- [ ] Add a Grand-Mère RED audible test button (so the sister can verify her
      phone volume before opening).
- [ ] Light theme for bright-sun readability on the quai.
- [ ] i18n: full French copy on a `fr` toggle (currently mixed).
- [ ] Unit tests for `engine.ts` (Cardigan, Pivot, Bribe at boundary values).

### Ops

- [ ] Deploy to Vercel with a single env block (`SNCF_NAVITIA_TOKEN`,
      `AIRPARIF_KEY` when available).
- [ ] Budget alert on external API calls (Open-Meteo is free; others may bill).

---

## Conventions

- Keep all numeric formulas in `lib/engine.ts` so the sister can audit one
  file.
- Every new data source MUST return a `SourceStatus` and be surfaced in
  `SourcesPanel`. No silent fake data.
- The weather panel stays as the top-priority card — secondary / fun metrics
  always render below the fold.
