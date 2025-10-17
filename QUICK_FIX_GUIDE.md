# 🚀 Quick Fix for Fetch Error

## What I Fixed:
✅ Created `src/config.js` to manage API URLs
✅ Updated all fetch calls to use environment variables
✅ Created deployment guide for backend
✅ Added `vercel.json` for backend deployment

## 📋 Steps to Fix Your Deployed App:

### **Step 1: Deploy Your Backend** (Choose ONE option)

#### **Option A - Railway (Easiest):**
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `Agri-Hackathon` repository
5. Railway will deploy automatically
6. Click "+ New" → "Database" → "MySQL"
7. Railway connects them automatically!
8. **Copy your backend URL** (e.g., `https://agri-hackathon-production.up.railway.app`)

#### **Option B - Render:**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub → Select your repo
4. Root Directory: `Server`
5. Build: `npm install`
6. Start: `node server.js`
7. Add Environment Variables (DB credentials)
8. **Copy your backend URL**

### **Step 2: Update Vercel Frontend**

1. Go to https://vercel.com/dashboard
2. Select your deployed project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend-url-from-step1.com` (NO trailing slash)
6. Click **Save**
7. Go to **Deployments** tab
8. Click the **"..."** menu on latest deployment
9. Click **"Redeploy"**
10. Wait for deployment to complete

### **Step 3: Test Your App**

1. Open your Vercel URL
2. Try to login
3. Should work now! 🎉

## 🔍 Common Issues:

### "Still getting fetch error?"
- Check browser console (F12)
- Verify `REACT_APP_API_URL` is set in Vercel
- Make sure you **redeployed** after adding the variable
- Backend URL should NOT have trailing slash

### "CORS error?"
Your backend already has CORS enabled, but if needed:
```javascript
// In Server/server.js
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:3000']
}));
```

### "Database connection error?"
- Make sure your backend has these environment variables:
  - `DB_HOST`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME` (should be `agri_store`)

## 📱 For Local Development:

Everything still works locally! The code automatically uses:
- **Production:** `REACT_APP_API_URL` from Vercel
- **Local:** `http://localhost:5000`

No changes needed for local development.

## Need More Help?

See `DEPLOY_BACKEND.md` for detailed deployment instructions.
