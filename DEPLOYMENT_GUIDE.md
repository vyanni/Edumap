# Edumap Backend Deployment Guide (Vercel)

## Overview

This guide explains how to deploy the Edumap backend as a separate Vercel project. The frontend and backend run as independent deployments:

- **Frontend**: `edumap.vercel.app` (deployed from `edumap-frontend/`)
- **Backend**: `edumap-backend.vercel.app` (deployed from `edumap-backend/`)

## Architecture

```
User → vercel.com/app → React SPA
  ↓ (API calls)
  → vercel.com/backend → Express API
  ↓ (Database queries)
  → Supabase (production database)
```

## Step-by-Step Deployment

### 1. **Deploy Backend First**

#### Prerequisites:
- Vercel account (vercel.com)
- GitHub repo with this code

#### Steps:

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"** → **"Import Git Repository"**
3. Select your GitHub repo
4. **IMPORTANT**: Set the root directory to `edumap-backend/`
   - In "Project Settings" → "Root Directory" → type `edumap-backend`
5. Click **"Environment Variables"** and add:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key
   NODE_ENV=production
   ```
6. Click **"Deploy"**

**Result**: You'll get a domain like `edumap-backend.vercel.app`

### 2. **Update Frontend with Backend URL**

Once backend is deployed:

1. Go to your repo and update `edumap-frontend/.env.production`:
   ```
   VITE_API_URL=https://edumap-backend.vercel.app
   ```
2. Commit and push this change

### 3. **Deploy Frontend**

1. Go to [vercel.com](https://vercel.com) → **"Add New Project"**
2. Import the same GitHub repo
3. **IMPORTANT**: Set root directory to `edumap-frontend/`
4. Add environment variables:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=https://edumap-backend.vercel.app
   ```
5. Build command should auto-detect as `npm run build`
6. Click **"Deploy"**

**Result**: You'll get `edumap.vercel.app` or similar

## What Vercel Does Under the Hood

### Backend Deployment Process:
```
1. Vercel clones your repo
2. Navigates to edumap-backend/
3. Runs: npm install
4. Runs: npm run build (tsc --noEmit)
5. Converts Express server into serverless functions
6. Each route becomes a function:
   /api/terms → function 1
   /api/courses → function 2
   /api/programs → function 3
   etc.
7. These functions are distributed across Vercel's global edge network
8. Automatically scales up/down based on traffic
```

### Frontend Deployment Process:
```
1. Vercel clones your repo
2. Navigates to edumap-frontend/
3. Runs: npm install
4. Runs: npm run build (vite build)
5. Creates optimized static files in dist/
6. Deploys to Vercel CDN (edge locations worldwide)
7. Caches assets for fast loading
```

## How It Works in Production

### Flow:
```
1. User visits edumap.vercel.app
2. Browser downloads React app from Vercel CDN
3. React app loads and calls API:
   fetch('https://edumap-backend.vercel.app/api/terms')
4. Request routed to nearest Vercel edge function
5. Express handler runs and queries Supabase
6. Data returned to frontend
7. React renders the UI
```

### Why Serverless Functions?
- **No server to manage** - Vercel manages infrastructure
- **Pay per invocation** - Only pay for actual requests
- **Auto-scaling** - Handles traffic spikes automatically
- **Global** - Functions run near users for low latency

## Local Development

When developing locally:

1. **Frontend**: runs on `localhost:5173`
2. **Backend**: runs on `localhost:8000`
3. Frontend's `.env.development` points to `http://localhost:8000`

This is already configured in the code.

## Testing

### After Backend Deployment:
```bash
# Test backend endpoint
curl https://edumap-backend.vercel.app/api/terms
# Should return array of terms
```

### After Frontend Deployment:
1. Visit `https://edumap.vercel.app`
2. Go to `/planning` page
3. Should see terms and courses loaded
4. Check browser console for any errors

## Environment Variables Reference

### Backend (.env in `edumap-backend/`)
```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key (for admin operations)
PORT=8000 (Vercel ignores this, uses dynamic port)
```

### Frontend (.env in `edumap-frontend/`)
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://your-backend-domain (no trailing slash)
```

## Troubleshooting

### "Backend returns 400 errors"
- Check environment variables in Vercel dashboard
- Ensure `SUPABASE_ANON_KEY` is correct JWT token

### "Frontend can't reach backend"
- Verify `VITE_API_URL` is correct in frontend `.env.production`
- Check CORS is enabled in backend (`cors` package already configured)
- Check browser console for actual error message

### "Functions timing out"
- Some operations take longer than 10s
- Increase `maxDuration` in `vercel.json` (max is 60s for paid plans)

### "Deploy fails with TypeScript errors"
- Run `npm run build` locally to check for errors
- Fix any TypeScript issues before pushing

## Custom Domain Setup (Optional)

To use a custom domain instead of `vercel.app`:

1. In Vercel project settings → **"Domains"**
2. Add your domain (e.g., `api.yourdomain.com`)
3. Update DNS records as instructed by Vercel
4. Update frontend's `VITE_API_URL` to use your custom domain

## CI/CD Pipeline

After setup, every push triggers:

1. **Backend**: Automatically rebuilds and deploys `edumap-backend/`
2. **Frontend**: Automatically rebuilds and deploys `edumap-frontend/`

You can view deployment status and logs in Vercel dashboard.

## Key Files

- `edumap-backend/vercel.json` - Backend deployment config
- `edumap-backend/package.json` - Build scripts (build, start)
- `edumap-frontend/src/config/apiConfig.ts` - API URL configuration
- `edumap-frontend/.env.production` - Production environment
- `edumap-frontend/.env.development` - Development environment

## Next Steps

1. ✅ Backend configured with `vercel.json`
2. ✅ Frontend configured with API_BASE_URL
3. 📋 Create two Vercel projects (one for each folder)
4. 📋 Add environment variables
5. 📋 Deploy and test

Good luck! 🚀
