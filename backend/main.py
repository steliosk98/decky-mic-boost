import json
import os
import subprocess
from typing import Any, Dict

DEFAULT_PERCENT = 100
MIN_PERCENT = 100
MAX_PERCENT = 500

try:
    from decky_plugin import DECKY_PLUGIN_SETTINGS_DIR, logger
except ImportError:
    import logging

    logger = logging.getLogger(__name__)
    DECKY_PLUGIN_SETTINGS_DIR = os.getcwd()


class Plugin:
    def __init__(self):
        self.settings_path = os.path.join(DECKY_PLUGIN_SETTINGS_DIR, "settings.json")

    async def set_mic_boost(self, percent: int) -> Dict[str, Any]:
        if not isinstance(percent, (int, float)):
            return {"error": "percent must be a number"}
        percent = int(percent)
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
        percent = data.get("percent", DEFAULT_PERCENT)
        if not isinstance(percent, int) or percent < MIN_PERCENT or percent > MAX_PERCENT:
            percent = DEFAULT_PERCENT
        return {"percent": percent}

    def _run_wpctl(self, value: float) -> Dict[str, Any] | None:
        try:
            completed = subprocess.run(
                ["wpctl", "set-volume", "-l", str(value), "@DEFAULT_AUDIO_SOURCE@", str(value)],
                check=True,
                capture_output=True,
                text=True,
            )
        except FileNotFoundError:
            logger.error("wpctl not found on system")
            return {"error": "wpctl not found on system"}
        except subprocess.CalledProcessError as exc:
            logger.error("wpctl failed: %s", exc.stderr.strip())
            return {"error": exc.stderr.strip() or "wpctl failed"}

        if completed.stderr:
            logger.error("wpctl stderr: %s", completed.stderr.strip())
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
