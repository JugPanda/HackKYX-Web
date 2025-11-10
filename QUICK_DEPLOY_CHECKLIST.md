# Quick Vercel Deployment Checklist ✅

## 🚀 Fast Track Deployment (15 minutes)

### Step 1: Commit Everything (2 min)
```bash
git add .
git commit -m "feat: Python games working with proper headers"
git push origin main
```

### Step 2: Deploy Build Service to Railway (5 min)
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo
4. Settings:
   - Root Directory: `build-service`
   - Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT`
5. Variables:
   ```
   SUPABASE_URL=<from your .env.local>
   SUPABASE_SERVICE_KEY=<from your .env.local>
   BUILD_SERVICE_SECRET=hackathon-secret-123
   PORT=8080
   ```
6. Deploy → Copy the URL (like `kyx-build.railway.app`)

### Step 3: Deploy Next.js to Vercel (5 min)
1. Go to [vercel.com](https://vercel.com)
2. New Project → Import from GitHub
3. Select `HackKentucky-KYX` repo
4. Settings:
   - Root Directory: `landing-page`
   - Framework: Next.js
5. Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<from .env.local>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<from .env.local>
   SUPABASE_SERVICE_ROLE_KEY=<from .env.local>
   OPENAI_API_KEY=<from .env.local>
   BUILD_SERVICE_URL=https://kyx-build.railway.app
   BUILD_SERVICE_SECRET=hackathon-secret-123
   ```
6. Deploy!

### Step 4: Test (3 min)
1. Visit `https://your-project.vercel.app`
2. Sign up / Sign in
3. Go to `/lab`
4. Create a test game
5. Play it!

---

## 🔥 Critical Environment Variables

### In Railway (Build Service):
```env
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
BUILD_SERVICE_SECRET=
PORT=8080
```

### In Vercel (Next.js):
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
BUILD_SERVICE_URL=
BUILD_SERVICE_SECRET=
```

---

## ⚠️ Common Gotchas

1. **BUILD_SERVICE_SECRET must match** in both Railway and Vercel
2. **ROOT DIRECTORY** must be set correctly (landing-page for Vercel, build-service for Railway)
3. After adding env vars in Vercel, **click "Redeploy"**
4. Check Supabase Storage → game-bundles bucket is **public**

---

## 🧪 Quick Test Commands

Test build service:
```bash
curl https://your-build-service.railway.app/health
# Should return: {"status":"healthy","service":"kyx-build-service"}
```

Test Next.js:
```bash
curl https://your-project.vercel.app/api/health
# Should return JSON if you have a health endpoint
```

---

## 📱 What Should Work

After deployment:
- ✅ Sign up / Sign in
- ✅ Create games via /lab
- ✅ Games build in ~30 seconds
- ✅ Games load and play in browser
- ✅ Community page shows games
- ✅ No debug console visible

---

## 🆘 If Something Breaks

### Build Service 404
→ Check Railway logs for errors  
→ Verify BUILD_SERVICE_URL is correct in Vercel  
→ Make sure BUILD_SERVICE_SECRET matches

### Games Don't Load
→ Check Supabase Storage bucket is public  
→ Check browser console for CORS errors  
→ Verify SUPABASE_SERVICE_ROLE_KEY is set

### AI Generation Fails
→ Check OPENAI_API_KEY is valid  
→ Check Vercel function logs

---

**That's it! You're live! 🎉**

