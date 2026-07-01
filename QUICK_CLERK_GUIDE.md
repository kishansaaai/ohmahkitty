# ⚡ Quick Start: Get Your App Running in 5 Minutes

## What Just Happened?

Your TNR Tracker now uses **Clerk** instead of Supabase for authentication! This means:
- ✅ **Much faster setup** (5 min vs 30 min)
- ✅ **OAuth works instantly** (Google + GitHub)
- ✅ **No database required** for authentication
- ✅ **Free tier:** 10,000 users/month

---

## 🚀 3 Steps to Get It Working

### Step 1: Get Clerk Key (2 minutes)

1. Go to: **https://clerk.com**
2. Click **"Start building for free"**
3. Sign in with GitHub or Google
4. Create new application:
   - Name: `TNR Tracker`
   - Enable: ✅ Google, ✅ GitHub
   - Click **Create**
5. **Copy your Publishable Key** (starts with `pk_test_`)

### Step 2: Update .env File (30 seconds)

Open `.env` and paste your key:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Step 3: Test Locally (1 minute)

```bash
npm run dev
```

Open: **http://localhost:5173/auth**

Click **"Continue with Google"** or **"Continue with GitHub"** → Done! ✅

---

## 🌐 Deploy to Vercel (5 minutes)

### Step 1: Add Clerk Key to Vercel

1. Go to: **https://vercel.com/dashboard**
2. Click your **ohmahkitty** project
3. Go to: **Settings** → **Environment Variables**
4. Add:
   - Name: `VITE_CLERK_PUBLISHABLE_KEY`
   - Value: `pk_test_your_actual_key_here`
5. Click **Save**

### Step 2: Add Your Domain to Clerk

1. Go to Clerk Dashboard: **https://dashboard.clerk.com**
2. Click **Domains** in sidebar
3. Click **"Add domain"**
4. Enter: `https://ohmahkitty.vercel.app`
5. Click **Add**

### Step 3: Redeploy

1. In Vercel Dashboard
2. Go to **Deployments** tab
3. Click **"Redeploy"** on the latest deployment
4. Wait 2 minutes

### Step 4: Test Production

Open: **https://ohmahkitty.vercel.app/auth**

Try OAuth → Should work! ✅

---

## 🆘 Common Issues

### "Missing Clerk Publishable Key"
- Check `.env` has `VITE_CLERK_PUBLISHABLE_KEY`
- Restart: `npm run dev`

### OAuth Buttons Don't Show Up
- Check `CLERK_SETUP.md` for full setup
- Make sure Google/GitHub enabled in Clerk Dashboard

### Works Locally But Not on Vercel
- Add domain to Clerk Dashboard → **Domains**
- Add env variable to Vercel → **Settings** → **Environment Variables**
- Redeploy

---

## 📚 Full Documentation

Read `CLERK_SETUP.md` for complete setup instructions with screenshots and troubleshooting.

---

## ✅ Done!

Your app now has professional OAuth authentication! 🎉

Test it: http://localhost:5173/auth
