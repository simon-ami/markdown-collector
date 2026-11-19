#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$ROOT_DIR/dist"
SOURCE_DIR="$DIST_DIR/extension"

# Only the files needed by the Firefox add-on belong in the package.
rm -rf "$SOURCE_DIR"
mkdir -p "$SOURCE_DIR"

for path in manifest.json icons fonts styles legal LICENSE scripts libs; do
  if [[ ! -e "$ROOT_DIR/$path" ]]; then
    echo "Missing required extension file: $path" >&2
    exit 1
  fi
  cp -R "$ROOT_DIR/$path" "$SOURCE_DIR/"
done

for page in "$ROOT_DIR"/*.html; do
  [[ -f "$page" ]] && cp "$page" "$SOURCE_DIR/"
done

# Existing AMO listings require their original Gecko add-on ID when updating.
# The release workflow retrieves it from Mozilla's public API and passes it
# here; development builds can omit it.
if [[ -n "${AMO_ADDON_ID:-}" ]]; then
  EXTENSION_MANIFEST="$SOURCE_DIR/manifest.json" node <<'NODE'
const fs = require("node:fs");
const path = process.env.EXTENSION_MANIFEST;
const id = process.env.AMO_ADDON_ID;
const manifest = JSON.parse(fs.readFileSync(path, "utf8"));
manifest.browser_specific_settings ??= {};
manifest.browser_specific_settings.gecko ??= {};
const existing = manifest.browser_specific_settings.gecko.id;
if (existing && existing !== id) {
  throw new Error("AMO add-on ID differs from the manifest's Gecko ID.");
}
manifest.browser_specific_settings.gecko.id = id;
fs.writeFileSync(path, JSON.stringify(manifest, null, 2) + "\n");
NODE
fi

VERSION="$(node -p "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).version" "$SOURCE_DIR/manifest.json")"
ZIP_FILE="$DIST_DIR/markdown-collector-${VERSION}.zip"
rm -f "$ZIP_FILE"
(cd "$SOURCE_DIR" && zip -q -r "$ZIP_FILE" .)
echo "Built $ZIP_FILE"
