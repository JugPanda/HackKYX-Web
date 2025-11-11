#!/bin/bash

# Quick script to check game status
# Usage: ./check-game.sh YOUR_GAME_ID

if [ -z "$1" ]; then
    echo "Usage: ./check-game.sh YOUR_GAME_ID"
    echo ""
    echo "Example: ./check-game.sh abc123-def456-..."
    exit 1
fi

GAME_ID=$1
PORT=3000

echo "🔍 Checking game: $GAME_ID"
echo ""
echo "📊 Fetching game info from debug API..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -s "http://localhost:$PORT/api/debug/game/$GAME_ID" | jq '.'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Tips:"
echo "  • Check 'game.status' - should be 'published'"
echo "  • Check 'game.bundle_url' - should be set"
echo "  • Check 'storage.files' - should contain index.html"
echo ""
echo "🎮 Test the game at:"
echo "  http://localhost:$PORT/api/play/$GAME_ID/"

