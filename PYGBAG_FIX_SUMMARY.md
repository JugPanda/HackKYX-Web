# Pygbag Game Loading Fix - November 10, 2025

## Problem
Python games compiled with Pygbag were not loading in the browser when embedded in iframes on the KYX platform.

## Root Cause
**Missing COOP/COEP HTTP headers** required for SharedArrayBuffer support, which is essential for Pygbag/Pyodide (Python WebAssembly) to function properly in modern browsers.

## Solution Applied

### 1. Added Required Security Headers
Updated `/landing-page/app/api/play/[...path]/route.ts` to include:

```typescript
"Cross-Origin-Embedder-Policy": "require-corp"
"Cross-Origin-Opener-Policy": "same-origin"
"Cross-Origin-Resource-Policy": "cross-origin"
```

These headers enable SharedArrayBuffer, which is required by:
- Pyodide (Python interpreter in WebAssembly)
- Pygame-ce (Browser version of Pygame)
- Multi-threaded operations in WASM

### 2. Added OPTIONS Handler
Added CORS preflight request handler to ensure browsers can successfully negotiate the security headers.

### 3. Verified Existing Configuration
✅ **Pygbag Version**: Already at 0.9.2 (latest stable)
✅ **Async Main Loop**: Game already implements `async def main()` with `await asyncio.sleep(0)`
✅ **File Structure**: Proper build output structure in place

## Technical Details

### Why These Headers Matter
Modern browsers require explicit permission to use SharedArrayBuffer due to security concerns (Spectre/Meltdown vulnerabilities). The headers work together:

1. **COOP (Cross-Origin-Opener-Policy)**: Isolates the browsing context
2. **COEP (Cross-Origin-Embedder-Policy)**: Ensures all resources are loaded securely
3. **CORP (Cross-Origin-Resource-Policy)**: Allows cross-origin access when needed

### What Changed
**Before:**
```typescript
headers: {
  "Content-Type": contentType,
  "Cache-Control": "public, max-age=3600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
}
```

**After:**
```typescript
headers: {
  "Content-Type": contentType,
  "Cache-Control": "public, max-age=3600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  // Required headers for Pygbag/SharedArrayBuffer support
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "cross-origin",
}
```

## Testing Instructions

### 1. Start the Development Server
```bash
cd landing-page
npm run dev
```

### 2. Start the Build Service
```bash
cd build-service
python app.py
```

### 3. Create a Test Game
1. Go to http://localhost:3001/lab
2. Sign in
3. Fill out the game form
4. Click "Build & Publish Game"
5. Wait for build to complete (~30 seconds)

### 4. Play the Game
1. Go to dashboard
2. Click on your game
3. The game should now load in the iframe
4. You should see the Python game running with:
   - Canvas rendering
   - Keyboard controls working
   - No "SharedArrayBuffer" errors in console

### 5. Check Browser Console
Open DevTools (F12) and verify:
- No COOP/COEP errors
- No SharedArrayBuffer warnings
- Game loads and initializes properly

## Browser Compatibility

These headers are supported in:
- ✅ Chrome 88+
- ✅ Firefox 79+
- ✅ Safari 15.2+
- ✅ Edge 88+

## Alternative Solution (If Issues Persist)

If Pygbag games still don't load reliably, consider migrating to **JavaScript/Phaser.js**:

### Advantages of JavaScript:
- **Smaller files**: 50-200 KB vs 10-15 MB
- **Instant loading**: No WASM download
- **No headers needed**: Works everywhere
- **Better AI generation**: LLMs excel at JavaScript
- **No build service**: Games run directly

### Migration Path:
1. Update `/api/generate-game-code` to output Phaser.js
2. Remove build service dependency
3. Store games as simple HTML files in Supabase
4. Update game player component to load HTML directly

## References

- [Pygbag Documentation](https://pygame-web.github.io/wiki/pygbag/)
- [SharedArrayBuffer and Security Requirements](https://web.dev/cross-origin-isolation-guide/)
- [COOP/COEP Headers Explained](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
- [Itch.io Forum Discussion on Pygbag Loading Issues](https://itch.io/t/5229127/games-have-suddenly-stopped-working-in-the-browser)

## Status

✅ **Fixed**: Added required COOP/COEP headers
✅ **Verified**: Pygbag version is up to date (0.9.2)
✅ **Verified**: Async main loop implemented correctly
⏳ **Testing**: Requires manual testing to confirm games load

## Next Steps

1. Test with a new game build
2. Monitor browser console for any remaining errors
3. If issues persist, consider JavaScript migration
4. Update documentation for future developers

