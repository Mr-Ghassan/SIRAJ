#!/usr/bin/env bash
# SIRAJ v1.0 — rebuild the release ZIPs from the parts and verify them against the published SHA-256 sums.
# Usage: bash join.sh [output-dir]   (default: ./out)
set -euo pipefail
cd "$(dirname "$0")"
OUT="${1:-out}"; mkdir -p "$OUT"
for f in parts/*.part00; do
  name="$(basename "$f" .part00)"
  cat parts/"$name".part* > "$OUT/$name"
done
cp whole/*.zip "$OUT/"
cp SIRAJ_v1.0_SHA256SUMS.txt "$OUT/"
cd "$OUT"
if command -v sha256sum >/dev/null; then sha256sum -c SIRAJ_v1.0_SHA256SUMS.txt; else shasum -a 256 -c SIRAJ_v1.0_SHA256SUMS.txt; fi
echo "All 10 SIRAJ v1.0 packages rebuilt and verified in: $(pwd)"
