#!/bin/bash
# Seed Meilisearch with sample movie data
# Usage: bash sample/seed.sh

MEILI_HOST="${MEILI_HOST:-http://localhost:7700}"
MEILI_KEY="${MEILI_MASTER_KEY:-changeme}"

echo "Indexing sample movies..."
curl -s -X POST "$MEILI_HOST/indexes/movies/documents" \
  -H "Authorization: Bearer $MEILI_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @"$(dirname "$0")/movies.json"

echo ""
echo "Waiting for indexing to complete..."
sleep 2

echo ""
echo "=== Search: 'matrix' ==="
curl -s "$MEILI_HOST/indexes/movies/search" \
  -H "Authorization: Bearer $MEILI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"q": "matrix"}' | python -m json.tool 2>/dev/null || curl -s "$MEILI_HOST/indexes/movies/search" \
  -H "Authorization: Bearer $MEILI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"q": "matrix"}'

echo ""
echo "=== Search with typo: 'interstllar' ==="
curl -s "$MEILI_HOST/indexes/movies/search" \
  -H "Authorization: Bearer $MEILI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"q": "interstllar"}' | python -m json.tool 2>/dev/null || curl -s "$MEILI_HOST/indexes/movies/search" \
  -H "Authorization: Bearer $MEILI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"q": "interstllar"}'

echo ""
echo "=== Filter: genre = 'action' ==="
curl -s -X PATCH "$MEILI_HOST/indexes/movies/settings" \
  -H "Authorization: Bearer $MEILI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"filterableAttributes": ["genre", "year"]}' > /dev/null
sleep 1
curl -s "$MEILI_HOST/indexes/movies/search" \
  -H "Authorization: Bearer $MEILI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"q": "", "filter": "genre = action"}' | python -m json.tool 2>/dev/null || curl -s "$MEILI_HOST/indexes/movies/search" \
  -H "Authorization: Bearer $MEILI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"q": "", "filter": "genre = action"}'

echo ""
echo "Done! Try your own searches at $MEILI_HOST"
