#!/usr/bin/env bash
set -euo pipefail

# Lighthouse Performance Budget Check
# Asserts: LCP < 2s, bundle < 250 KB gzipped
# Usage: scripts/lighthouse-check.sh [url]

URL="${1:-http://localhost:3000}"

echo "=== Lighthouse Performance Budget Check ==="
echo "Target: $URL"
echo ""

# Check if lhci is installed
if ! command -v lhci &>/dev/null; then
  echo "Installing @lhci/cli..."
  npm install -g @lhci/cli
fi

lhci autorun \
  --collect.url="$URL" \
  --collect.numberOfRuns=3 \
  --assert.preset=lighthouse:no-pwa \
  --assert.assertions.largest-contentful-paint='["error",{"maxNumericValue":2000}]' \
  --assert.assertions.total-byte-weight='["error",{"maxNumericValue":256000}]' \
  --upload.target=temporary-public-storage

echo ""
echo "=== Lighthouse check passed ==="
