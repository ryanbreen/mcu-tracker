# MCU Film Tracker

Interactive MCU film checklist served by a Cloudflare Worker at `ryanbreen.com/mcu`

## Architecture

Single Cloudflare Worker (`src/index.js`) that does everything:
- Serves the full HTML/CSS/JS frontend inline (no build step, no static assets)
- Provides a JSON API for reading/writing watched state
- Stores state in Cloudflare KV as a JSON object with two arrays (seen, seenWithGus)

## Routes

- `GET /mcu` — HTML page
- `GET /mcu/api/state` — returns `{ seen: [...], seenWithGus: [...] }`
- `PUT /mcu/api/state` — accepts `{ seen: [...], seenWithGus: [...] }`, writes to KV

## Cloudflare Resources

- **Account ID:** `1c4242a5ff4262714297ce7b929c0bf8`
- **Zone:** `ryanbreen.com` (zone ID `7ea8d5c3f5bb220b82b66f15d1620e7d`)
- **Worker name:** `mcu-tracker`
- **KV namespace:** `mcu-tracker-MCU_DATA` (ID `3419c2f0975044698794f3db406702a3`)
- **Route pattern:** `ryanbreen.com/mcu*`

## Deployment

```sh
npm run deploy
```

This sources the Cloudflare API token from `../sawneebean_cams/.env` (`CLOUDFLARE_TOKEN`). No separate `.env` file in this repo.

## Local Dev

```sh
npm run dev    # wrangler dev — serves on localhost:8787
```

KV is simulated locally by wrangler. State won't persist between dev restarts unless you use `--persist`.

## Film Data

Films are hardcoded in `src/index.js` in the `FILMS` array, organized by MCU phase (1-6). Films only — no Disney+ series. The list includes announced future films through Avengers: Secret Wars (2027).

## State Format

KV key `seen` stores a JSON object with two arrays, e.g.:
```json
{
  "seen": ["Iron Man", "The Avengers", "Black Panther"],
  "seenWithGus": ["Iron Man"]
}
```

The GET endpoint auto-migrates the old format (plain array) to the new object format. The frontend uses `Set` objects for O(1) lookups and syncs to KV on every toggle. Each film has two independent checkboxes: "Me" (red) and "Gus" (blue). Films dim when both are checked.
