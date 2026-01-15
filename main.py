import subprocess
import logging

class Plugin:
    async def get_mic_volume(self):
        """Get current microphone volume percentage"""
        try:
            result = subprocess.run(
                ["pactl", "get-source-volume", "@DEFAULT_SOURCE@"],
                capture_output=True,
                text=True,
                check=True
            )
            # Parse output like "Volume: front-left: 65536 / 100% / 0.00 dB"
            output = result.stdout
            if "%" in output:
                # Extract first percentage value
                percent = output.split("%")[0].split()[-1]
                return int(percent)
            return 100
        except Exception as e:
            logging.error(f"Error getting mic volume: {e}")
            return 100

    async def set_mic_volume(self, volume: int):
        """Set microphone volume (100-500%)"""
        try:
            # Clamp between 100 and 500
            volume = max(100, min(500, volume))
            
            subprocess.run(
                ["pactl", "set-source-volume", "@DEFAULT_SOURCE@", f"{volume}%"],
                check=True
            )
            return {"success": True, "volume": volume}
        except Exception as e:
            logging.error(f"Error setting mic volume: {e}")
            return {"success": False, "error": str(e)}

    async def reset_mic_volume(self):
        """Reset microphone to 100%"""
        return await self.set_mic_volume(100)

    async def _main(self):
        logging.info("Mic Boost Plugin Loaded")

    async def _unload(self):
        # Reset to default on unload
        await self.reset_mic_volume()
        logging.info("Mic Boost Plugin Unloaded")