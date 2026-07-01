# 🔧 Supabase Setup Guide - Quick 5-Minute Setup

## Why You Can't Sign In

The app needs a Supabase backend configured. Here's how to fix it:

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name**: tnr-tracker
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
6. Click "Create new project"
7. **Wait 2 minutes** for project to initialize

### Step 2: Get Your API Keys

1. In Supabase dashboard, click "Project Settings" (gear icon)
2. Click "API" in sidebar
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJ...` (long key)

### Step 3: Update Your .env File

1. Open `.env` file in your project
2. Replace with your values:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
```

### Step 4: Run Database Setup

1. In Supabase dashboard, click "SQL Editor"
2. Click "New Query"
3. Copy and paste `supabase/schema.sql` → Click "Run"
4. Copy and paste `supabase/migration_v2.sql` → Click "Run"
5. (Optional) Copy and paste `supabase/seed.sql` → Click "Run" (adds test data)

### Step 5: Enable Google OAuth (Optional)

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. Find "Google" and click "Enable"
3. Go to https://console.cloud.google.com/apis/credentials
4. Create OAuth Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret to Supabase
6. Click "Save"

### Step 6: Enable GitHub OAuth (Optional)

1. In Supabase dashboard, go to "Authentication" → "Providers"  
2. Find "GitHub" and click "Enable"
3. Go to https://github.com/settings/developers
4. Click "New OAuth App"
5. Fill in:
   - Application name: TNR Tracker
   - Homepage URL: http://localhost:5173
   - Authorization callback URL: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to Supabase
7. Click "Save"

---

## ✅ Test It Works

```bash
npm run dev
```

1. Go to http://localhost:5173/auth
2. Click "Sign up"  
3. Enter email and password
4. You should be logged in!

Or click "Continue with Google" or "Continue with GitHub"

---

## 🚀 Deploy to Vercel

### Step 1: Push to GitHub (Already Done!)

Your code is at: https://github.com/kishansaaai/ohmahkitty

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Import from GitHub: `kishansaaai/ohmahkitty`
4. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```
5. Click "Deploy"
6. Wait 2 minutes
7. Your app is live!

### Step 3: Update OAuth Redirect URLs

In Supabase dashboard:
1. Go to "Authentication" → "URL Configuration"
2. Add your Vercel URL: `https://your-app.vercel.app`
3. Save

For Google/GitHub OAuth:
- Update redirect URLs to: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`

---

## 🔒 Deploy Edge Functions (For AI Scanner)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR-PROJECT-ID

# Deploy Gemini proxy
supabase functions deploy gemini-proxy

# Set secrets
supabase secrets set GEMINI_API_KEY=your-gemini-key
supabase secrets set GEMINI_MODEL=gemini-2.5-flash
```

---

## 📊 Verify Everything Works

✅ **Local Dev**: http://localhost:5173  
✅ **Production**: https://your-app.vercel.app  
✅ **Authentication**: Can sign up/sign in  
✅ **Google OAuth**: Works  
✅ **GitHub OAuth**: Works  
✅ **Database**: Data saves correctly  

---

## 🆘 Troubleshooting

### "Invalid API key" Error
- Check `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server: `npm run dev`

### "Email not confirmed" Error
- Go to Supabase → Authentication → Settings
- Disable "Enable email confirmations"

### OAuth Doesn't Work
- Check redirect URLs match exactly
- Must be: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`

### Can't See Data
- Run database setup scripts in correct order:
  1. schema.sql
  2. migration_v2.sql  
  3. seed.sql (optional)

---

## ⏱️ Time to Complete

- Supabase setup: 5 minutes
- Database schema: 2 minutes
- OAuth (optional): 5 minutes per provider
- Vercel deploy: 3 minutes

**Total: 10-20 minutes to fully working app!**

---

## 🎉 You're Done!

Your TNR Tracker is now:
✅ Live on Vercel  
✅ Connected to Supabase  
✅ OAuth enabled  
✅ Ready for #hackthekitty submission!

Good luck! 🐈
