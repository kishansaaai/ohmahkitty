# 🔑 How to Get Your Supabase API Keys

## Step-by-Step Guide (3 Minutes)

### Step 1: Go to Supabase Dashboard
👉 **Open:** https://supabase.com/dashboard

### Step 2: Find or Create Your Project

**If you already have a TNR project:**
- Click on it

**If you need to create a new project:**
1. Click "New Project"
2. Fill in:
   - **Name:** tnr-tracker
   - **Database Password:** (create a strong password - save it!)
   - **Region:** Choose closest to you (e.g., US East, Europe West)
3. Click "Create new project"
4. **Wait 2 minutes** for project to initialize (grab a coffee ☕)

### Step 3: Get Your API Keys

1. In your project dashboard, look at the left sidebar
2. Click the **Settings** icon (⚙️ gear icon at bottom)
3. Click **"API"** in the left menu
4. You'll see:

```
Project URL
https://xxxxxxxxxxxxx.supabase.co
```

```
Project API keys

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc5NjcyMDAsImV4cCI6MjAwMzU0MzIwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Copy to Your .env File

1. Open the `.env` file in your project
2. Replace with your actual values:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
```

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc5NjcyMDAsImV4cCI6MjAwMzU0MzIwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 5: Save the File

✅ Your `.env` file should look like:
```env
# TNR Tracker Environment Variables

# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Edge Functions (these go in Supabase Edge Functions, not here)
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.5-flash
CAT_API_KEY=your-cat-api-key
```

---

## ⚠️ Important Notes

1. **NEVER commit .env to Git!**
   - It's already in `.gitignore` ✅
   - The anon key is safe to use in frontend (protected by RLS)

2. **The anon key is LONG**
   - Usually 200+ characters
   - Copy the ENTIRE thing

3. **Must start with `VITE_`**
   - This tells Vite to include them in the build
   - `VITE_SUPABASE_URL` ✅
   - `SUPABASE_URL` ❌ (won't work!)

---

## 🚀 After Setting Keys

### For Local Development:

```bash
# Restart your dev server
npm run dev
```

Visit: http://localhost:5173

### For Vercel Deployment:

1. Go to: https://vercel.com/dashboard
2. Click your project (ohmahkitty)
3. Go to: **Settings** → **Environment Variables**
4. Add both variables:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://xxxxxxxxxxxxx.supabase.co`
   - Click "Add"
   
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Click "Add"

5. Go to **Deployments** tab
6. Click **"Redeploy"** on latest deployment

---

## ✅ Verify It Works

### Local Test:
```bash
npm run dev
```

1. Open http://localhost:5173/auth
2. Try to sign up with email/password
3. If it works = SUCCESS! ✅

### Vercel Test:
1. Open your Vercel URL (e.g., https://ohmahkitty.vercel.app/auth)
2. Try to sign up
3. If it works = SUCCESS! ✅

---

## 🆘 Troubleshooting

### "Supabase credentials missing" Error
- Check `.env` file exists
- Check variable names start with `VITE_`
- Restart dev server (`npm run dev`)

### "Invalid API key" Error
- Copy the FULL anon key (all 200+ characters)
- Make sure no extra spaces or line breaks
- Copy from Supabase → API page, not somewhere else

### Can't Find Project URL
- Go to: Project Settings (⚙️) → API
- It's labeled "Project URL" at the top

---

## 📋 Quick Checklist

- [ ] Created/found Supabase project
- [ ] Copied Project URL
- [ ] Copied anon public key
- [ ] Pasted into `.env` file
- [ ] Saved `.env` file
- [ ] Restarted dev server
- [ ] Added to Vercel environment variables
- [ ] Redeployed on Vercel
- [ ] Tested authentication works

---

**Need help?** Check `SUPABASE_SETUP.md` for full setup including database!
