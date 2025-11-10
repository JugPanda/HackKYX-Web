# Deploying KYX to Vercel 🚀

## Overview

Your KYX platform has two components:
1. **Next.js App** (landing-page) → Deploy to **Vercel**
2. **Build Service** (Python Flask) → Deploy to **separate hosting** (Railway, Render, or DigitalOcean)

## Part 1: Deploy Next.js to Vercel

### Step 1: Prepare Your Repository

Make sure all changes are committed:
```bash
git add .
git commit -m "Fix: Python games working with proper headers and hidden debug console"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Select your `HackKentucky-KYX` repository
5. Configure project settings:

**Framework Preset:** Next.js  
**Root Directory:** `landing-page`  
**Build Command:** `npm run build`  
**Output Directory:** `.next`

### Step 3: Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI (for AI game generation)
OPENAI_API_KEY=your_openai_api_key

# Build Service (will set after deploying build service)
BUILD_SERVICE_URL=https://your-build-service.railway.app
BUILD_SERVICE_SECRET=your-secret-key-here
```

### Step 4: Deploy

Click **"Deploy"** and wait ~2-3 minutes.

Your Next.js app will be live at: `https://your-project.vercel.app`

---

## Part 2: Deploy Build Service

The Python build service **cannot** run on Vercel (serverless doesn't support Pygbag). You need a separate platform.

### Option A: Railway (Recommended - Easy)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Configure:
   - **Root Directory:** `build-service`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`

6. Add Environment Variables:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   BUILD_SERVICE_SECRET=your-secret-key-here
   PORT=8080
   ```

7. Deploy and note the URL: `https://your-build-service.railway.app`

### Option B: Render.com

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect your repo
4. Configure:
   - **Name:** kyx-build-service
   - **Root Directory:** `build-service`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`

5. Add same environment variables as Railway

### Option C: DigitalOcean App Platform

Similar process - deploy Python app with Dockerfile or buildpack.

---

## Part 3: Connect Build Service to Vercel

After deploying the build service:

1. Go back to **Vercel Dashboard**
2. Your project → Settings → Environment Variables
3. Add/Update:
   ```env
   BUILD_SERVICE_URL=https://your-build-service.railway.app
   BUILD_SERVICE_SECRET=same-secret-as-build-service
   ```

4. Redeploy your Vercel app:
   - Deployments tab → Click ⋯ → "Redeploy"

---

## Part 4: Configure Supabase for Production

### Update CORS Settings

1. Go to Supabase Dashboard
2. Settings → API → CORS Configuration
3. Add your domains:
   ```
   https://your-project.vercel.app
   https://*.vercel.app
   ```

### Check Storage Bucket

1. Storage → game-bundles bucket
2. Make sure it's **public**
3. Update bucket policies if needed

---

## Part 5: Test Production Deployment

### 1. Test Sign Up/Sign In
- Go to `https://your-project.vercel.app/auth/sign-in`
- Create account
- Verify email works

### 2. Test Game Creation
- Go to `/lab`
- Fill out form
- Click "Build & Publish Game"
- Wait ~30 seconds

### 3. Check Build Service Logs
- Railway/Render dashboard → Logs
- Should see: "Processing build request"
- Should see: "Build completed successfully"

### 4. Test Game Loading
- Go to Dashboard
- Click on your game
- Game should load (may take 10-15 seconds first time)

---

## Common Issues & Fixes

### Issue 1: Build Service Not Reachable

**Error:** "Failed to start build" or timeout

**Fix:**
1. Check `BUILD_SERVICE_URL` is correct in Vercel
2. Check build service is running (Railway/Render dashboard)
3. Check build service logs for errors
4. Test manually: `curl https://your-build-service.railway.app/health`

### Issue 2: CORS Errors in Production

**Error:** "CORS policy: No 'Access-Control-Allow-Origin' header"

**Fix:**
1. Make sure Supabase CORS settings include your Vercel domain
2. Check `/api/play/[...path]/route.ts` has CORS headers (already fixed!)

### Issue 3: Games Don't Load in Production

**Error:** APK download fails or stuck on loading

**Fix:**
1. Check Supabase Storage permissions
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
3. Check Network tab in browser DevTools
4. Look for 404 errors on game files

### Issue 4: Environment Variables Not Working

**Error:** "Missing API keys" or undefined errors

**Fix:**
1. Redeploy after adding environment variables
2. Variables must start with `NEXT_PUBLIC_` to be available client-side
3. Check Vercel logs for specific errors

---

## File Structure for Deployment

Your repo should look like:

```
HackKentucky-KYX/
├── landing-page/           ← Deploy to Vercel
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
├── build-service/          ← Deploy to Railway/Render
│   ├── app.py
│   ├── requirements.txt
│   ├── demo-game/
│   └── test-game.py
│
├── demo-game/              ← Not deployed (template only)
└── docs/                   ← Not deployed
```

---

## Vercel-Specific Configurations

### vercel.json (Optional)

Create `landing-page/vercel.json` if you need custom config:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/api/play/:path*",
      "headers": [
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "credentialless"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "unsafe-none"
        },
        {
          "key": "Cross-Origin-Resource-Policy",
          "value": "cross-origin"
        }
      ]
    }
  ]
}
```

**Note:** We already set these headers in the API route, so this is optional.

---

## Performance Optimizations for Production

### 1. Enable Vercel Analytics (Optional)
- Vercel Dashboard → Analytics tab
- Enable Speed Insights
- Monitor game loading times

### 2. Configure Caching
Already done in your code:
```typescript
"Cache-Control": "public, max-age=31536000" // 1 year for assets
```

### 3. Monitor Build Service
- Set up Railway/Render alerts
- Monitor for timeout errors
- Consider increasing timeout if needed

---

## Cost Estimates

### Vercel (Next.js)
- **Hobby Plan:** FREE
  - 100 GB bandwidth/month
  - Unlimited requests
  - Perfect for hackathon/MVP

### Railway (Build Service)
- **Free Trial:** $5 credit (good for ~500 builds)
- **Starter Plan:** $5/month
  - 8GB RAM, 8vCPU
  - 100GB bandwidth

### Total Monthly Cost
- **Development:** $0 (free tiers)
- **Production:** ~$5-10/month

---

## Deployment Checklist

Before deploying:
- [ ] All code committed and pushed to GitHub
- [ ] Environment variables prepared
- [ ] Supabase project configured
- [ ] OpenAI API key ready
- [ ] Build service deployment platform chosen

Deployment steps:
- [ ] Deploy Next.js to Vercel
- [ ] Deploy build service to Railway/Render
- [ ] Configure environment variables in both
- [ ] Test game creation end-to-end
- [ ] Test game loading in production
- [ ] Monitor logs for errors

---

## Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Vercel: Settings → Domains
   - Add your domain (e.g., kyx.games)

2. **Monitoring**
   - Set up Vercel Analytics
   - Monitor build service logs
   - Track game creation success rate

3. **Scale Up**
   - If you get lots of users, upgrade Railway plan
   - Consider CDN for game assets
   - Optimize Pygbag build times

---

## Getting Help

If deployment fails:
1. Check Vercel deployment logs
2. Check build service logs (Railway/Render)
3. Check browser console for client errors
4. Verify all environment variables are set

---

**Status:** Ready to Deploy! 🚀

Your local setup is working perfectly. Now it's time to deploy to production!

**Recommended Order:**
1. Deploy build service to Railway first
2. Get the Railway URL
3. Deploy Next.js to Vercel with Railway URL
4. Test end-to-end

