#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${ROOT_DIR}/release"
PLUGIN_NAME="decky-mic-boost"
ZIP_PATH="${OUT_DIR}/${PLUGIN_NAME}.zip"

mkdir -p "${OUT_DIR}"

cd "${ROOT_DIR}"
npm run build

rm -f "${ZIP_PATH}"

# Package the plugin directory contents for Decky installation.
zip -r "${ZIP_PATH}" \
  plugin.json \
  dist \
  backend \
  README.md

echo "Created ${ZIP_PATH}"
