#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${ROOT_DIR}/release"
PLUGIN_NAME="decky-mic-boost"
VERSION="$(node -p "require('./package.json').version")"
ZIP_PATH="${OUT_DIR}/${PLUGIN_NAME}-${VERSION}.zip"
STAGE_DIR="$(mktemp -d)"

mkdir -p "${OUT_DIR}"

cd "${ROOT_DIR}"
npm run build

rm -f "${ZIP_PATH}"

mkdir -p "${STAGE_DIR}/${PLUGIN_NAME}"
cp -R plugin.json package.json dist backend README.md "${STAGE_DIR}/${PLUGIN_NAME}"

# Package with a top-level folder so Decky can detect it.
(
  cd "${STAGE_DIR}"
  zip -r "${ZIP_PATH}" "${PLUGIN_NAME}"
)

rm -rf "${STAGE_DIR}"

echo "Created ${ZIP_PATH}"
