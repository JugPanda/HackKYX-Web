# KYX Game Build Service

A standalone Python service that builds pygame games using pygbag and uploads them to Supabase Storage.

## 🎯 Overview

This service handles the heavy lifting of building games:
- Receives build requests from the Next.js app
- Uses pygbag to convert Python games to WebAssembly
- Uploads built games to Supabase Storage
- Updates the database with build status

## 🚀 Quick Deploy

### Option 1: Railway (Recommended - Easiest)

1. **Create a Railway account**: https://railway.app
2. **Create a new project** → "Deploy from GitHub repo"
3. **Select this repository** and choose the `build-service` directory
4. **Set environment variables** (see below)
5. **Deploy!** Railway will automatically detect the Dockerfile

### Option 2: Render

1. **Create a Render account**: https://render.com
2. **New Web Service** → Connect your GitHub repo
3. **Root Directory**: `build-service`
4. **Environment**: Docker
5. **Set environment variables** (see below)
6. **Create Web Service**

### Option 3: Fly.io

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Login**: `fly auth login`
3. **Navigate to build-service**: `cd build-service`
4. **Deploy**: `fly launch` (follow prompts)
5. **Set secrets**: 
   ```bash
   fly secrets set SUPABASE_URL="your-url"
   fly secrets set SUPABASE_SERVICE_KEY="your-key"
   fly secrets set BUILD_SERVICE_SECRET="your-secret"
   ```

## 🔐 Environment Variables

Set these in your deployment platform:

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | `eyJhbG...` (from Supabase settings) |
| `BUILD_SERVICE_SECRET` | Secret key for authentication | Generate a random string |
| `PORT` | Port to run on (optional) | `8080` (default) |

### Getting Supabase Keys:

1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy **Project URL** (`SUPABASE_URL`)
4. Copy **service_role secret** (`SUPABASE_SERVICE_KEY`)

### Generating BUILD_SERVICE_SECRET:

```bash
# Generate a secure random string
openssl rand -hex 32
```

## 🔗 Connect to Your Next.js App

After deploying, add these environment variables to your **Vercel** project:

1. Go to Vercel → Your Project → **Settings** → **Environment Variables**
2. Add:
   - `BUILD_SERVICE_URL` = Your deployed service URL (e.g., `https://kyx-build-service.railway.app`)
   - `BUILD_SERVICE_SECRET` = Same secret you used in the build service

## 🧪 Testing

After deployment, test the health endpoint:

```bash
curl https://your-service-url.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "kyx-build-service",
  "version": "1.0.0"
}
```

## 📦 Supabase Storage Setup

Make sure you have a storage bucket in Supabase:

1. Go to **Storage** in your Supabase dashboard
2. Create a bucket named `game-bundles`
3. Set bucket to **Public** (or configure RLS policies)

## 🛠️ Local Development

To run locally for testing:

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export SUPABASE_URL="your-url"
export SUPABASE_SERVICE_KEY="your-key"
export BUILD_SERVICE_SECRET="test-secret"

# Run the service
python app.py
```

The service will start on `http://localhost:8080`

## 🔍 Monitoring

### Check Logs:

**Railway**: Dashboard → Deployments → View Logs

**Render**: Dashboard → Your Service → Logs

**Fly.io**: `fly logs`

### Common Issues:

**Build times out**:
- Increase timeout in `app.py` (line 83)
- Use a paid tier for more resources

**Out of memory**:
- Upgrade to a paid plan with more RAM
- Optimize the build process

**Storage upload fails**:
- Verify Supabase credentials
- Check storage bucket exists and is public
- Review bucket policies

## 🎮 How It Works

1. Next.js app creates a game entry in the database
2. Next.js app calls `/api/games/build` 
3. Build route sends request to this service at `/build`
4. Service:
   - Creates temp directory
   - Writes `game_config.json` and `main.py`
   - Runs `pygbag --build main.py`
   - Zips the output
   - Uploads to Supabase Storage
   - Updates database with status and bundle URL
5. User can play the game from the community page

## 🆘 Support

**Service Health**: Check `/health` endpoint

**Build Failures**: Check logs in your deployment platform

**Database Issues**: Verify Supabase credentials and table structure

## 📝 API Endpoints

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "kyx-build-service",
  "version": "1.0.0"
}
```

### `POST /build`
Process a game build.

**Headers:**
- `X-Build-Secret`: Authentication secret
- `Content-Type`: application/json

**Body:**
```json
{
  "buildId": "uuid",
  "gameId": "uuid",
  "config": { /* game config object */ },
  "generatedCode": "# Python game code (optional)"
}
```

**Response (Success):**
```json
{
  "success": true,
  "bundleUrl": "https://...",
  "message": "Build completed successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🚨 Security Notes

- Never commit `.env` files or expose secrets
- Use strong random strings for `BUILD_SERVICE_SECRET`
- Keep `SUPABASE_SERVICE_KEY` private (full database access)
- The secret must match between build service and Next.js app

## 🎉 You're All Set!

Once deployed:
1. ✅ Build service is running
2. ✅ Environment variables are set
3. ✅ Vercel knows where to find the build service
4. ✅ Users can build and share games!

