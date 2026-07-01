# 🔄 Switch Vercel to New Repository

## Quick Steps (2 Minutes)

### Option 1: Update Git Repository in Vercel (Easiest)

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Find your project** (tnr-tracker)
   - Click on it

3. **Go to Settings**
   - Click "Settings" tab at the top

4. **Go to Git**
   - Click "Git" in the left sidebar

5. **Disconnect old repo**
   - Click "Disconnect" button
   - Confirm

6. **Connect new repo**
   - Click "Connect Git Repository"
   - Select: `kishansaaai/ohmahkitty`
   - Click "Connect"

7. **Trigger redeploy**
   - Go to "Deployments" tab
   - Click "Redeploy" on latest deployment
   - Or push a new commit to trigger auto-deploy

✅ **Done!** Vercel now watches `ohmahkitty` repo

---

### Option 2: Create New Project (Fresh Start)

If Option 1 doesn't work, create a new project:

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Add New Project**
   - Click "Add New" → "Project"

3. **Import from GitHub**
   - Find: `kishansaaai/ohmahkitty`
   - Click "Import"

4. **Configure Project**
   - Project Name: `ohmahkitty` (or keep auto-generated)
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variables**
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

6. **Deploy**
   - Click "Deploy"
   - Wait 2 minutes
   - Your new URL will be ready!

7. **Delete old project** (optional)
   - Go back to dashboard
   - Find old `tnr-tracker` project
   - Settings → Advanced → Delete Project

✅ **Done!** Fresh deployment with new repo

---

## After Switching

Your app will now:
- ✅ Auto-deploy on every push to `kishansaaai/ohmahkitty`
- ✅ Have the latest OAuth changes
- ✅ Use the hackathon-safe commit history

---

## Verify It Worked

1. **Check Vercel dashboard**
   - Should show: `Connected to kishansaaai/ohmahkitty`

2. **Push a test commit**
   ```bash
   git commit --allow-empty -m "test: trigger Vercel deploy"
   git push origin main
   ```

3. **Watch deployment**
   - Go to Vercel dashboard
   - You'll see a new deployment building
   - Takes ~2 minutes

4. **Visit your URL**
   - e.g., https://ohmahkitty.vercel.app
   - Should show latest changes with OAuth buttons

---

## 🎯 Quick Checklist

- [ ] Go to Vercel Settings → Git
- [ ] Disconnect old repo (kishansaaai/tnr-tracker)
- [ ] Connect new repo (kishansaaai/ohmahkitty)
- [ ] Verify connection shows correct repo
- [ ] Trigger redeploy
- [ ] Check live URL has OAuth buttons

**Time: 2 minutes**

---

## 🆘 Troubleshooting

**"Can't find ohmahkitty repo"**
- Make sure it's public on GitHub
- Refresh the Vercel page

**"Environment variables missing"**
- Re-add them in Settings → Environment Variables
- Must start with `VITE_` prefix

**"Build failing"**
- Check build logs in Vercel
- Usually missing environment variables

---

**Your new repo:** https://github.com/kishansaaai/ohmahkitty  
**Will deploy to:** https://ohmahkitty.vercel.app (or similar)

Good luck! 🚀
