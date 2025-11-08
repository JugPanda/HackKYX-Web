# KYX Build Service - Setup Checklist

## ✅ What Was Created

The separate build service is now complete! Here's what was added to your repo:

### 📁 New Files:
- `build-service/app.py` - Flask application that handles game builds
- `build-service/requirements.txt` - Python dependencies (Flask, pygbag, supabase)
- `build-service/Dockerfile` - Docker configuration for deployment
- `build-service/railway.json` - Railway deployment config
- `build-service/render.yaml` - Render deployment config
- `build-service/fly.toml` - Fly.io deployment config
- `build-service/README.md` - Complete technical documentation
- `build-service/DEPLOY_GUIDE.md` - Step-by-step deployment instructions

### 🔧 Updated Files:
- `landing-page/app/api/games/build/route.ts` - Now calls external build service
- `README.md` - Added build service documentation

---

## 🚀 Next Steps (What YOU Need to Do)

### Step 1: Deploy the Build Service (15 minutes)

Follow the guide: [`build-service/DEPLOY_GUIDE.md`](./build-service/DEPLOY_GUIDE.md)

**Quick version:**
1. Go to https://railway.app and sign up
2. Create new project → Deploy from GitHub
3. Select your repo, set root directory to `build-service`
4. Add environment variables:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_KEY` - From Supabase Settings → API
   - `BUILD_SERVICE_SECRET` - Generate with: `openssl rand -hex 32`
5. Deploy! (Railway does this automatically)
6. Copy the service URL (e.g., `https://kyx-build-service.railway.app`)

### Step 2: Configure Vercel (2 minutes)

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add TWO new variables:
   ```
   BUILD_SERVICE_URL=https://your-railway-url.railway.app
   BUILD_SERVICE_SECRET=same-secret-from-railway
   ```
3. Go to Deployments tab → Click "..." → Redeploy

### Step 3: Create Supabase Storage Bucket (1 minute)

1. Supabase Dashboard → Storage → New Bucket
2. Name: `game-bundles`
3. Make it **Public**
4. Create!

---

## 🧪 Testing

After setup, test the build service:

```bash
# Check if service is alive
curl https://your-railway-url/health

# Should return:
# {"status":"healthy","service":"kyx-build-service","version":"1.0.0"}
```

Then on your site:
1. Sign in
2. Go to "Create Game" (`/lab`)
3. Fill out the form
4. Click "Build & Publish Game"
5. Check your dashboard - build should process!

---

## 💰 Cost Estimate

**Current Setup (All FREE):**
- ✅ Vercel (Hobby tier) - FREE
- ✅ Railway (free tier) - FREE for 500 hours/month
- ✅ Supabase (free tier) - FREE up to 500MB storage
- ✅ OpenAI API - Pay per use (~$0.01 per game generation)

**Expected costs:**
- First 100 games built: **$0**
- With moderate usage: **$0-5/month**

---

## 🎯 How It Works Now

### Before (Broken on Vercel):
```
User clicks "Build" 
  → Vercel tries to run Python (❌ doesn't work)
  → Build fails
```

### After (With Build Service):
```
User clicks "Build"
  → Next.js adds job to database
  → Calls Railway build service
  → Railway has Python + pygbag
  → Builds game → Uploads to Supabase
  → Updates database
  → User sees completed game! ✅
```

---

## 📊 What You Get

- ✅ **Working game builds** - No more Vercel limitations
- ✅ **Scalable architecture** - Can handle many concurrent builds
- ✅ **Easy monitoring** - Check Railway logs for build issues
- ✅ **Cost effective** - Free tier covers most usage
- ✅ **Future-proof** - Can easily upgrade or switch providers

---

## 🆘 Common Issues

### "Build service not configured"
→ Add `BUILD_SERVICE_URL` and `BUILD_SERVICE_SECRET` to Vercel, then redeploy

### Build stays "pending"
→ Check Railway logs. Probably missing Supabase credentials or storage bucket

### "Unauthorized" error
→ Make sure `BUILD_SERVICE_SECRET` matches exactly in both Railway and Vercel

### Storage upload fails
→ Create the `game-bundles` bucket in Supabase and make it public

---

## 📚 Resources

- **Deploy Guide**: [`build-service/DEPLOY_GUIDE.md`](./build-service/DEPLOY_GUIDE.md)
- **Full Documentation**: [`build-service/README.md`](./build-service/README.md)
- **Railway Docs**: https://docs.railway.app
- **Supabase Storage**: https://supabase.com/docs/guides/storage

---

## 🎉 Status

- [x] Build service created
- [x] Documentation written
- [x] Pushed to GitHub
- [ ] **→ Deploy to Railway** ← YOU ARE HERE
- [ ] Configure Vercel
- [ ] Create storage bucket
- [ ] Test end-to-end

**Ready to deploy!** Follow the [Deploy Guide](./build-service/DEPLOY_GUIDE.md) now! 🚀

