import json
import os
import subprocess
from typing import Dict, Any

DEFAULT_PERCENT = 100
MIN_PERCENT = 100
MAX_PERCENT = 500


class Plugin:
    def __init__(self):
        self.settings_path = os.path.join(os.getcwd(), "settings.json")

    async def set_mic_boost(self, percent: int) -> Dict[str, Any]:
        if not isinstance(percent, int):
            return {"error": "percent must be an integer"}
        if percent < MIN_PERCENT or percent > MAX_PERCENT:
            return {"error": f"percent must be between {MIN_PERCENT} and {MAX_PERCENT}"}

        value = percent / 100.0
        result = self._run_wpctl(value)
        if result is not None:
            return result

        self._write_settings({"percent": percent})
        return {"percent": percent}

    async def reset_mic_boost(self) -> Dict[str, Any]:
        result = self._run_wpctl(1.0)
        if result is not None:
            return result

        self._write_settings({"percent": DEFAULT_PERCENT})
        return {"percent": DEFAULT_PERCENT}

    async def get_state(self) -> Dict[str, Any]:
        data = self._read_settings()
        return {"percent": data.get("percent", DEFAULT_PERCENT)}

    def _run_wpctl(self, value: float) -> Dict[str, Any] | None:
        try:
            completed = subprocess.run(
                ["wpctl", "set-volume", "-l", str(value), "@DEFAULT_AUDIO_SOURCE@", str(value)],
                check=True,
                capture_output=True,
                text=True,
            )
        except FileNotFoundError:
            return {"error": "wpctl not found on system"}
        except subprocess.CalledProcessError as exc:
            return {"error": exc.stderr.strip() or "wpctl failed"}

        if completed.stderr:
            return {"error": completed.stderr.strip()}

        return None

    def _read_settings(self) -> Dict[str, Any]:
        if not os.path.exists(self.settings_path):
            return {}

        try:
            with open(self.settings_path, "r", encoding="utf-8") as handle:
                return json.load(handle)
        except (json.JSONDecodeError, OSError):
            return {}

    def _write_settings(self, data: Dict[str, Any]) -> None:
        try:
            with open(self.settings_path, "w", encoding="utf-8") as handle:
                json.dump(data, handle)
        except OSError:
            pass

