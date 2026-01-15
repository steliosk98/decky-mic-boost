import logging

class Plugin:
    async def _main(self):
        logging.info("Decky Mic Boost Plugin Loaded")

    async def _unload(self):
        logging.info("Decky Mic Boost Plugin Unloaded")