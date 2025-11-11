# Quick script to check game status
# Usage: .\check-game.ps1 YOUR_GAME_ID

param(
    [Parameter(Mandatory=$true)]
    [string]$GameId
)

$Port = 3000

Write-Host "🔍 Checking game: $GameId" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Fetching game info from debug API..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:$Port/api/debug/game/$GameId"
    $response | ConvertTo-Json -Depth 10
    
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Host ""
    
    # Show status
    if ($response.success) {
        Write-Host "✅ Game found!" -ForegroundColor Green
        Write-Host "   Status: $($response.game.status)" -ForegroundColor $(if ($response.game.status -eq "published") { "Green" } else { "Yellow" })
        Write-Host "   Bundle URL: $(if ($response.game.bundle_url) { '✓ Set' } else { '✗ Not set' })"
        Write-Host "   Files in storage: $($response.storage.files.Count)"
        
        if ($response.storage.files.Count -eq 0) {
            Write-Host ""
            Write-Host "⚠️  WARNING: No files found in storage!" -ForegroundColor Red
            Write-Host "   This means the game was marked as published but files weren't uploaded." -ForegroundColor Red
            Write-Host "   Try rebuilding the game from your dashboard." -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Error: $($response.error)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "💡 Tips:" -ForegroundColor Cyan
    Write-Host "  • Check 'game.status' - should be 'published'"
    Write-Host "  • Check 'game.bundle_url' - should be set"
    Write-Host "  • Check 'storage.files' - should contain index.html"
    Write-Host ""
    Write-Host "🎮 Test the game at:" -ForegroundColor Cyan
    Write-Host "  http://localhost:$Port/api/play/$GameId/" -ForegroundColor Blue
    
} catch {
    Write-Host "❌ Error connecting to API: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure your Next.js dev server is running on port $Port" -ForegroundColor Yellow
}

