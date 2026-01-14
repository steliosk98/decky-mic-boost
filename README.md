# Decky Mic Boost

```
                                                                                                                                  
 ▄▄▄▄▄                         ▄▄                  ▄▄▄  ▄▄▄     ██               ▄▄▄▄▄▄                                           
 ██▀▀▀██                       ██                  ███  ███     ▀▀               ██▀▀▀▀██                                  ██     
 ██    ██   ▄████▄    ▄█████▄  ██ ▄██▀   ▀██  ███  ████████   ████      ▄█████▄  ██    ██   ▄████▄    ▄████▄   ▄▄█████▄  ███████  
 ██    ██  ██▄▄▄▄██  ██▀    ▀  ██▄██      ██▄ ██   ██ ██ ██     ██     ██▀    ▀  ███████   ██▀  ▀██  ██▀  ▀██  ██▄▄▄▄ ▀    ██     
 ██    ██  ██▀▀▀▀▀▀  ██        ██▀██▄      ████▀   ██ ▀▀ ██     ██     ██        ██    ██  ██    ██  ██    ██   ▀▀▀▀██▄    ██     
 ██▄▄▄██   ▀██▄▄▄▄█  ▀██▄▄▄▄█  ██  ▀█▄      ███    ██    ██  ▄▄▄██▄▄▄  ▀██▄▄▄▄█  ██▄▄▄▄██  ▀██▄▄██▀  ▀██▄▄██▀  █▄▄▄▄▄██    ██▄▄▄  
 ▀▀▀▀▀       ▀▀▀▀▀     ▀▀▀▀▀   ▀▀   ▀▀▀     ██     ▀▀    ▀▀  ▀▀▀▀▀▀▀▀    ▀▀▀▀▀   ▀▀▀▀▀▀▀     ▀▀▀▀      ▀▀▀▀     ▀▀▀▀▀▀      ▀▀▀▀  
                                          ███                                                                                     
                                                                                                                                               
```

Turn your Steam Deck mic up to 11 (and then some). This Decky Loader plugin lets you crank microphone input from 100% to 500% with a big, friendly slider.

## Features
- Boost mic input from 100% to 500% in 10% steps.
- Live percentage display and one-tap reset.
- Optional warning so you remember clipping is a thing.
- Settings persist across reloads.

## Install on Steam Deck (Decky)
Pick your favorite route:

### Option A: Install from GitHub Release (recommended)
1. Download the latest `decky-mic-boost-<version>.zip` from GitHub Releases.
2. On your Deck, open Desktop Mode.
3. Extract the ZIP into your Decky plugins folder:
   - Default path: `~/homebrew/plugins/`
4. Make sure the folder looks like:
   - `~/homebrew/plugins/decky-mic-boost/plugin.json`
   - `~/homebrew/plugins/decky-mic-boost/backend/main.py`
   - `~/homebrew/plugins/decky-mic-boost/dist/index.js`
5. Return to Gaming Mode and open Decky. The plugin shows up under the list.

### Option B: Install from source (devs and tinkerers)
```sh
npm install
npm run build
```
Copy the folder into `~/homebrew/plugins/` (same structure as above).

## How it works
The backend calls WirePlumber via `wpctl` on `@DEFAULT_AUDIO_SOURCE@` with a higher limit, mapping:
- 100% -> 1.0
- 500% -> 5.0

## Development
Run the frontend dev server:
```sh
npm run dev
```

Build for production:
```sh
npm run build
```

## Release
Builds the frontend and creates a Decky-ready ZIP at `release/decky-mic-boost-<version>.zip`:
```sh
npm run release
```

## Notes and caveats
- Boosting above 100% can add noise or clipping. Use your ears.
- `wpctl` must be available (SteamOS includes it).
- Decky provides the Python runtime and `decky_plugin` module in production.

## Structure
- `src/` Frontend UI (Decky plugin panel)
- `backend/` Python backend for `wpctl` calls
- `plugin.json` Decky plugin manifest
- `MCP.md` Project spec
