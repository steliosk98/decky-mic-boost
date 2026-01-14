# Decky Mic Boost

A Decky Loader plugin for Steam Deck that boosts microphone input above 100% using WirePlumber `wpctl`.

## Features
- Slider to boost mic input from 100% to 500% in 10% increments.
- Live percentage display and reset button.
- Warning about potential clipping.
- Settings persist across reloads.

## Structure
- `src/` Frontend UI (Decky plugin panel)
- `backend/` Python backend for `wpctl` calls
- `plugin.json` Decky plugin manifest
- `MCP.md` Project specification

## Development
Install dependencies and build the frontend:
```sh
npm install
npm run build
```

Run the frontend dev server:
```sh
npm run dev
```

## Notes
- The backend uses `wpctl` on `@DEFAULT_AUDIO_SOURCE@` and allows values above 1.0 via `-l`.
- Decky provides the Python runtime and `decky_plugin` module in production.
