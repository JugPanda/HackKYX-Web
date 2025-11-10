# Testing Instructions - Pygbag Game Loading Fix

## Quick Test (5 minutes)

### 1. Restart Next.js Dev Server
```powershell
cd landing-page
npm run dev
```

Wait for it to start on `localhost:3001`

### 2. Test a Game

#### Option A: Test Existing Demo
If you have the public demo game in storage:
1. Go to `http://localhost:3001/community/[username]/[slug]`
2. Look for the game iframe
3. Check browser console (F12) for errors

#### Option B: Build a New Test Game
1. Go to `http://localhost:3001/lab`
2. Fill in the form:
   - Hero: "Test Hero"
   - Enemy: "Test Enemy"
   - Goal: "Test the game loading"
3. Click "🧪 Test Demo" button (this uses a known-working test game)
4. Wait 20-30 seconds for build
5. Go to dashboard and find your game
6. Click to play it

### 3. What to Look For

✅ **Success Signs:**
- Game iframe loads with loading screen
- No CORS errors in console
- No "SharedArrayBuffer" errors
- Game eventually loads and displays

❌ **Failure Signs:**
- Blank iframe
- CORS errors in console
- "SharedArrayBuffer is not defined" errors
- Game stuck on loading screen forever

## Deep Debugging

### Check Response Headers
1. Open DevTools (F12)
2. Go to Network tab
3. Load a game page
4. Find the request to `/api/play/[gameId]/`
5. Check Response Headers should include:
   ```
   Cross-Origin-Embedder-Policy: credentialless
   Cross-Origin-Opener-Policy: unsafe-none
   Cross-Origin-Resource-Policy: cross-origin
   Access-Control-Allow-Origin: *
   ```

### Check Game Files in Storage
Visit the debug endpoint:
```
http://localhost:3001/api/debug/game/YOUR_GAME_ID
```

This shows:
- Game status (should be "published")
- Bundle URL (should exist)
- Files in storage (should include index.html, .js, .wasm, etc.)

### Common Issues

#### Issue: "Game files could not be loaded"
**Cause:** Files not in storage
**Fix:** Rebuild the game from dashboard

#### Issue: CORS errors in console
**Cause:** Headers not being applied
**Fix:** Make sure you restarted the Next.js dev server

#### Issue: SharedArrayBuffer errors
**Cause:** Old headers still cached
**Fix:** Hard refresh (Ctrl+Shift+R) or clear browser cache

#### Issue: Game loads but is black screen
**Cause:** Python code error or missing assets
**Fix:** Check browser console for Python/Pygame errors

## Performance Notes

### Expected Load Times
- **First load:** 5-15 seconds (downloads Python WASM)
- **Subsequent loads:** 2-5 seconds (cached)
- **File size:** 10-15 MB total

### Browser Compatibility
Works best on:
- ✅ Chrome 109+
- ✅ Edge 109+
- ✅ Firefox 121+
- ✅ Safari 17+

May not work on:
- ❌ Older browsers
- ❌ Some mobile browsers
- ❌ Browsers with strict security policies

## If It Still Doesn't Work

### Try These Steps:
1. **Clear all caches:**
   - Browser cache (Ctrl+Shift+Delete)
   - Service workers
   - Local storage

2. **Check build service logs:**
   ```powershell
   cd build-service
   python app.py
   ```
   Look for errors during build process

3. **Test in different browser:**
   - Sometimes specific browsers have issues
   - Try Chrome if you're using Firefox, etc.

4. **Check Supabase Storage:**
   - Log into Supabase dashboard
   - Go to Storage > game-bundles
   - Look for `games/YOUR_GAME_ID/`
   - Should have index.html and other files

### Still Not Working?

If games still won't load after:
- ✅ Restarting dev server
- ✅ Rebuilding games
- ✅ Clearing caches
- ✅ Trying different browsers

Then the issue might be fundamental to Pygbag/WebAssembly, and **switching to JavaScript** would be the better solution.

## Alternative: JavaScript Implementation

Benefits of switching to JavaScript:
- ✅ No build process needed
- ✅ 50-200 KB instead of 10-15 MB
- ✅ Instant loading
- ✅ Works in ALL browsers
- ✅ Perfect iframe compatibility
- ✅ Easier to debug

I can help convert the platform to use Phaser.js if needed!

---

**Note:** The main fix was the headers, not the Pygbag version. The headers now allow:
1. Cross-origin resource loading
2. SharedArrayBuffer usage
3. Iframe embedding

Let me know the test results! 🎮

