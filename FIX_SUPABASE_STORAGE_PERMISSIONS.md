# Fix Supabase Storage 404 Errors for JavaScript Games

## Problem
JavaScript games are building successfully and uploading to Supabase Storage, but return 404 errors when trying to access them.

**Build logs show:** ✅ Upload successful  
**Browser shows:** ❌ 404 Not Found

## Root Cause
The `game-bundles` storage bucket might have restrictive RLS (Row Level Security) policies that prevent public access.

---

## ✅ **SOLUTION: Update Supabase Storage Policies**

### Step 1: Go to Supabase Dashboard

1. Open your Supabase project: https://supabase.com/dashboard
2. Click on **Storage** in the left sidebar
3. Find the **`game-bundles`** bucket
4. Click the **Policies** button (or three dots → Policies)

### Step 2: Check Current Policies

You should see policies for this bucket. Check if there's a **SELECT** policy that allows public access.

### Step 3: Add Public Read Policy (If Missing)

If there's no public read policy, create one:

**Click "New Policy"** → **"For full customization"**

**Policy Name:** `Public read access for game bundles`

**Allowed operation:** `SELECT`

**Target roles:** Leave as default (authenticated users)

**Policy definition (SQL):**
```sql
true
```

Or for completely public access:
```sql
bucket_id = 'game-bundles'
```

**OR use the simple approach:**

Click "New Policy" → **"Allow public access"** template

### Step 4: Verify Bucket is Public

1. In Storage → `game-bundles` bucket
2. Check that "Public bucket" toggle is **ON** (enabled)
3. If it's OFF, toggle it ON

---

## 🧪 **Test the Fix**

### Option 1: Direct URL Test

Try accessing the file directly in your browser:

```
https://qgnxrhsjvgtwhcutaknx.supabase.co/storage/v1/object/public/game-bundles/games/e94c8a0e-07e8-4e81-b7a8-fc6caaf78cba/index.html
```

**Expected:** HTML file downloads or displays  
**If 404:** Bucket permissions are still wrong

### Option 2: Test in Your App

1. Go back to your mario game page
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check if the game loads

---

## 🔍 **Alternative: Check Via SQL**

Run this in Supabase SQL Editor to check bucket settings:

```sql
SELECT * FROM storage.buckets WHERE name = 'game-bundles';
```

**Look for:** `public` column should be `true`

**To fix via SQL if needed:**
```sql
UPDATE storage.buckets 
SET public = true 
WHERE name = 'game-bundles';
```

---

## 📋 **Complete Bucket Policy Setup**

Here's what your `game-bundles` bucket policies should look like:

### Policy 1: Public READ access
```sql
-- Name: Allow public to read game bundles
-- Operation: SELECT
-- Policy:
(bucket_id = 'game-bundles'::text)
```

### Policy 2: Authenticated users can INSERT
```sql
-- Name: Allow authenticated users to upload
-- Operation: INSERT  
-- Policy:
(bucket_id = 'game-bundles'::text AND auth.role() = 'authenticated'::text)
```

### Policy 3: Users can UPDATE their own games
```sql
-- Name: Allow service role to update
-- Operation: UPDATE
-- Policy:
(bucket_id = 'game-bundles'::text AND auth.role() = 'service_role'::text)
```

---

## 🚨 **If Still Not Working**

### Check if file actually exists:

In Supabase Dashboard → Storage → `game-bundles` → navigate to:
```
games/e94c8a0e-07e8-4e81-b7a8-fc6caaf78cba/index.html
```

**If file is there:** Permissions issue (follow steps above)  
**If file is NOT there:** Build service issue (rerun the build)

### Rebuild the game:

1. Go to Dashboard
2. Find "mario" game
3. Click "Edit" 
4. Click "Build & Publish Game" again

---

## ✅ **Expected Result After Fix**

1. JavaScript games load instantly (no 404 errors)
2. Games are playable immediately
3. Network tab shows all files loading successfully (200 OK)

---

**Summary:** Make the `game-bundles` bucket PUBLIC or add a policy that allows public SELECT access to fix the 404 errors.


