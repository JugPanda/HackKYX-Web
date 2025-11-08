# 🚀 Quick Deploy Guide for KYX Build Service

## Step-by-Step: Railway (Easiest Option)

### 1. Prepare Your Secrets

First, generate a secure secret:
```bash
# Run this in your terminal:
openssl rand -hex 32
```

Copy this value - you'll need it for both Railway and Vercel.

### 2. Get Your Supabase Credentials

1. Open your Supabase project: https://supabase.com/dashboard
2. Go to **Settings** → **API**
3. Copy these values:
   - **Project URL** (starts with `https://`)
   - **service_role** key (the long secret key)

### 3. Deploy to Railway

1. Go to https://railway.app and sign up/login
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account and select this repo
5. Railway will ask for the root directory - enter: `build-service`
6. Click **"Add Variables"** and add:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG...your-long-key
BUILD_SERVICE_SECRET=the-secret-you-generated-above
```

7. Click **"Deploy"** - Railway will build and deploy automatically!
8. Once deployed, copy the **public URL** (looks like: `https://kyx-build-service.railway.app`)

### 4. Configure Vercel

1. Go to https://vercel.com/dashboard
2. Select your KYX project
3. Go to **Settings** → **Environment Variables**
4. Add these two variables:

```
BUILD_SERVICE_URL=https://kyx-build-service.railway.app
BUILD_SERVICE_SECRET=the-same-secret-you-used-in-railway
```

5. **Important**: Redeploy your Vercel app:
   - Go to **Deployments** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**

### 5. Create Supabase Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **"New bucket"**
3. Name it: `game-bundles`
4. Make it **Public**
5. Click **"Create bucket"**

### 6. Test It!

1. Go to your deployed KYX site
2. Sign in (or create an account)
3. Go to **"Create Game"** (`/lab`)
4. Fill out the form and click **"Build & Publish Game"**
5. Check the dashboard - the build should start!

---

## Troubleshooting

### ❌ "Build service not configured"
- Make sure `BUILD_SERVICE_URL` and `BUILD_SERVICE_SECRET` are set in Vercel
- Redeploy your Vercel app after adding environment variables

### ❌ Build stays in "pending" or "processing"
- Check Railway logs: Dashboard → Your Service → Logs
- Common issues:
  - Incorrect Supabase credentials
  - Storage bucket doesn't exist
  - Timeout (builds take 1-2 minutes)

### ❌ "Unauthorized" error
- Make sure `BUILD_SERVICE_SECRET` matches in both Railway and Vercel
- Secrets are case-sensitive!

### ❌ Storage upload fails
- Verify the `game-bundles` bucket exists in Supabase
- Make sure the bucket is set to **Public**
- Check your `SUPABASE_SERVICE_KEY` is correct

---

## Alternative: Deploy to Render

If Railway doesn't work, try Render (also free):

1. Go to https://render.com
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `build-service`
   - **Environment**: Docker
   - **Instance Type**: Free
5. Add the same environment variables
6. Click **"Create Web Service"**
7. Copy the service URL and add to Vercel (same as step 4 above)

---

## Need Help?

Check the full [README.md](./README.md) for more details or contact support!

