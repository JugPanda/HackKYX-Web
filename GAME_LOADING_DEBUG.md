# Game Loading Debug Guide

## Problem
Game page shows game info but the game iframe doesn't load.

## What I've Added

### 1. Enhanced Error Logging (`/api/play/[...path]/route.ts`)
- Added detailed console logs to track file loading
- Added helpful error page when files aren't found
- Shows storage path and error details

### 2. Debug API Endpoint (`/api/debug/game/[gameId]/route.ts`)
- Check game status in database
- List files in storage
- Verify build completion

### 3. Better Status Display (`/community/[username]/[slug]/page.tsx`)
- Shows warning to owner if game status isn't "published"
- Shows helpful messages about build status

## How to Debug Your Game

### Step 1: Check the Server Console
1. Look at your Next.js dev server console
2. When you try to load the game, look for logs starting with `[PLAY API]`
3. You should see:
   ```
   [PLAY API] Request path segments: ['YOUR_GAME_ID']
   [PLAY API] Resolved storage path: games/YOUR_GAME_ID/index.html
   [PLAY API] Attempting to download from: games/YOUR_GAME_ID/index.html
   ```

4. If there's an error, you'll see:
   ```
   [PLAY API] File not found: games/YOUR_GAME_ID/index.html
   [PLAY API] Error details: { ... }
   ```

### Step 2: Use the Debug Endpoint
Visit: `http://localhost:3000/api/debug/game/YOUR_GAME_ID`

This will show you:
- Game status in database
- Whether bundle_url is set
- What files (if any) exist in storage

Example response:
```json
{
  "success": true,
  "game": {
    "id": "...",
    "title": "Test Demo Game",
    "status": "published",  // ← Check this
    "bundle_url": "https://...",  // ← Should exist
    ...
  },
  "storage": {
    "path": "games/.../",
    "files": [],  // ← Should contain index.html, etc.
    "error": null
  }
}
```

### Step 3: Check Your Game's Status

The issue is likely one of these:

#### A. Game Was Never Built
- **Status:** `draft`
- **Bundle URL:** `null`
- **Fix:** Go to dashboard and click "Build Game"

#### B. Build Failed
- **Status:** `failed` or `building` (stuck)
- **Bundle URL:** May be `null`
- **Fix:** Check build-service logs, try rebuilding

#### C. Build Completed But Files Missing
- **Status:** `published`
- **Bundle URL:** Set (e.g., `https://...`)
- **Storage Files:** Empty array `[]`
- **Fix:** This is the bug! The build service set the status but didn't upload files

#### D. Wrong Storage Path
- **Status:** `published`
- **Bundle URL:** Set
- **Storage Files:** Files exist but at wrong path
- **Fix:** Check that files are at `games/{gameId}/index.html`

## Common Fixes

### Fix 1: Rebuild the Game
1. Go to your dashboard
2. Find the game
3. Click "Build Game" (or "Rebuild")
4. Wait for build to complete
5. Refresh the game page

### Fix 2: Check Build Service
If the build service isn't running:

```bash
cd build-service
python app.py
```

The build service should be running on http://localhost:5001

### Fix 3: Manually Verify Storage
You can check Supabase Storage directly:
1. Go to your Supabase dashboard
2. Navigate to Storage
3. Open the `game-bundles` bucket
4. Look for `games/YOUR_GAME_ID/`
5. Should contain: `index.html`, `.js` files, `.wasm` files, etc.

### Fix 4: Check Environment Variables
Make sure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

The `SUPABASE_SERVICE_ROLE_KEY` is needed to access storage.

## Expected File Structure in Storage

After a successful build, storage should look like:
```
game-bundles/
  └── games/
      └── YOUR_GAME_ID/
          ├── index.html
          ├── main.py.js
          ├── main.py.wasm
          ├── main.py.data
          └── kyx-build-xxx.apk (optional)
```

## Testing the Fix

1. Open browser DevTools (F12)
2. Go to Console tab
3. Load the game page
4. Check for errors in the iframe
5. If you see the error page I created, it will show you the exact storage path and error

## Next Steps

1. ✅ Check server console for `[PLAY API]` logs
2. ✅ Visit `/api/debug/game/YOUR_GAME_ID`
3. ✅ Identify which scenario (A, B, C, or D) you're in
4. ✅ Apply the appropriate fix
5. ✅ Report back what you find!

