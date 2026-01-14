# Decky Mic Boost

A Decky Loader plugin for Steam Deck that boosts microphone input above 100% using WirePlumber `wpctl`.

## Status
Scaffold only. Frontend and backend skeletons are in place.

## Structure
- `src/` Frontend UI (Decky plugin panel)
- `backend/` Python backend for `wpctl` calls
- `plugin.json` Decky plugin manifest
- `MCP.md` Project specification

## Next steps
1. Add a frontend build pipeline that outputs `dist/index.js`.
2. Implement backend logic and settings persistence.
3. Wire frontend to backend methods.

