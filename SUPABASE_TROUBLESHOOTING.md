# Supabase "Failed to Fetch" Error - Troubleshooting Guide

## Problem

Users getting "failed to fetch" error when trying to sign in or sign up.

## Root Cause

This error typically occurs due to one of these issues:
1. **CORS Configuration** - Supabase not configured to accept requests from your domain
2. **Project Status** - Supabase project is paused or deleted
3. **Network Issues** - Connectivity problems or firewall blocking
4. **Invalid Credentials** - Wrong API keys or URL

## Quick Fix Checklist

### 1. Verify Supabase Project Status

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `qgnxrhsjvgtwhcutaknx`
3. Check if project shows as "Active" (not paused)
4. If paused, click "Resume project"

### 2. Configure Allowed URLs (MOST COMMON FIX)

The most common cause is missing URL configuration in Supabase Auth settings.

**Steps:**

1. Go to Supabase Dashboard → Your Project
2. Navigate to **Authentication** → **URL Configuration**
3. Under **Site URL**, ensure it's set to your current environment:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

4. Under **Redirect URLs**, add these URLs:
   ```
   http://localhost:3000/**
   http://localhost:3000/auth/callback
   http://localhost:3000/auth/reset-password
   https://your-production-domain.com/**
   https://your-production-domain.com/auth/callback
   https://your-production-domain.com/auth/reset-password
   ```

5. Click **Save**

### 3. Check Environment Variables

Verify your `.env.local` file has the correct values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://qgnxrhsjvgtwhcutaknx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** 
- After changing `.env.local`, restart your development server
- Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` to git (it's in `.gitignore`)

### 4. Restart Development Server

After making changes:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd landing-page
npm run dev
```

### 5. Check Browser Console

Open browser DevTools (F12) and check the Console tab for detailed errors:

- **CORS Error**: "Access-Control-Allow-Origin" → Fix URLs in Supabase
- **Network Error**: "Failed to fetch" → Check internet connection
- **401 Unauthorized**: Invalid API keys → Check environment variables
- **403 Forbidden**: Project paused → Resume in Supabase dashboard

### 6. Test Supabase Connection

The sign-in/sign-up pages now include a status checker that will show:
- ✅ **Green**: Supabase connected successfully
- ⚠️ **Yellow**: Configuration missing
- ❌ **Red**: Connection failed with specific error

Visit `/auth/sign-in` or `/auth/sign-up` to see the status.

## Detailed Solutions

### Solution A: Configure CORS in Supabase

1. **Navigate to Auth Settings**
   ```
   Supabase Dashboard → Authentication → URL Configuration
   ```

2. **Add All Development URLs**
   ```
   Site URL: http://localhost:3000
   ```

3. **Add Redirect URLs** (one per line):
   ```
   http://localhost:3000/**
   http://127.0.0.1:3000/**
   ```

4. **For Production**, also add:
   ```
   Site URL: https://your-domain.com
   
   Redirect URLs:
   https://your-domain.com/**
   ```

### Solution B: Check Supabase Project Health

1. **Project Dashboard**: https://app.supabase.com/project/qgnxrhsjvgtwhcutaknx
2. **Check these indicators**:
   - Project status: Should be "Active"
   - Database: Should be "Healthy"
   - API: Should show green status
   - Auth: Should be enabled

3. **If project is paused**:
   - Free tier projects pause after 1 week of inactivity
   - Click "Restore project" to reactivate
   - Wait 2-5 minutes for full restoration

### Solution C: Verify API Credentials

1. **Get Fresh Credentials**:
   ```
   Supabase Dashboard → Settings → API
   ```

2. **Copy these values**:
   - **URL**: Should match `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: Should match `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Update `.env.local`** if they don't match

4. **Restart dev server**:
   ```bash
   npm run dev
   ```

### Solution D: Network & Firewall Issues

1. **Test Supabase directly**:
   ```bash
   curl https://qgnxrhsjvgtwhcutaknx.supabase.co/rest/v1/
   ```

2. **Check if blocked**:
   - Try disabling VPN
   - Try different network (mobile hotspot)
   - Check corporate firewall settings
   - Try incognito/private browsing mode

3. **Check DNS**:
   ```bash
   nslookup qgnxrhsjvgtwhcutaknx.supabase.co
   ```

### Solution E: Database Connection Issues

If Supabase is configured correctly but still failing:

1. **Check database connection**:
   ```sql
   -- Run in Supabase SQL Editor
   SELECT 1;
   ```

2. **Verify auth schema**:
   ```sql
   SELECT * FROM auth.users LIMIT 1;
   ```

3. **Check if auth is enabled**:
   ```
   Supabase Dashboard → Authentication → Providers
   Email provider should be enabled
   ```

## Testing the Fix

After applying fixes:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard reload** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Go to sign-in page**: http://localhost:3000/auth/sign-in
4. **Check status indicator** at the top of the page
5. **Try signing up** with a test email
6. **Check browser console** for any errors

## Still Not Working?

### Debug Steps

1. **Enable detailed logging**:
   ```typescript
   // Add to lib/supabase/client.ts temporarily
   export function createClient() {
     const client = createBrowserClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     );
     console.log('Supabase client created:', {
       url: process.env.NEXT_PUBLIC_SUPABASE_URL,
       hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
     });
     return client;
   }
   ```

2. **Test with curl**:
   ```bash
   curl -X POST 'https://qgnxrhsjvgtwhcutaknx.supabase.co/auth/v1/signup' \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

3. **Check Supabase logs**:
   ```
   Supabase Dashboard → Logs → Auth Logs
   ```

### Get Support

If none of these solutions work:

1. **Check Supabase Status**: https://status.supabase.com
2. **Supabase Discord**: https://discord.supabase.com
3. **GitHub Issues**: https://github.com/supabase/supabase/issues

## Common Error Messages

### "Failed to fetch"
- **Cause**: CORS or network issue
- **Fix**: Add localhost to Supabase URL configuration

### "Invalid API key"
- **Cause**: Wrong anon key in environment variables
- **Fix**: Copy fresh key from Supabase dashboard

### "Project paused"
- **Cause**: Free tier inactivity timeout
- **Fix**: Resume project in dashboard

### "Network request failed"
- **Cause**: Internet connectivity or firewall
- **Fix**: Check connection, disable VPN, try different network

### "Access-Control-Allow-Origin"
- **Cause**: CORS not configured
- **Fix**: Add your domain to Supabase Auth settings

## Prevention

To avoid this issue in the future:

1. **Keep project active**: Login to Supabase dashboard at least once per week
2. **Document URLs**: Keep a list of all allowed URLs
3. **Environment sync**: Ensure `.env.local` matches Supabase dashboard
4. **Upgrade plan**: Consider paid plan to avoid auto-pause
5. **Monitor status**: Subscribe to Supabase status updates

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [CORS Configuration Guide](https://supabase.com/docs/guides/api/cors)
- [Troubleshooting Guide](https://supabase.com/docs/guides/platform/troubleshooting)
