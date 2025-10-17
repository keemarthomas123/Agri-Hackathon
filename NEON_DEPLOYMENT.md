# 🚀 Deploy with Neon PostgreSQL + Vercel

## ✅ Why This Setup is Perfect:

- ✅ **Neon** - Serverless PostgreSQL (Free tier)
- ✅ **Vercel** - Frontend + Backend hosting (Free)
- ✅ **Official integration** - Neon works great with Vercel
- ✅ **No credit card** required for either

---

## 📋 Step-by-Step Setup:

### **Step 1: Set Up Neon Database**

1. **Sign up for Neon:**
   - Go to https://neon.tech
   - Click "Sign Up" (use GitHub for easy login)

2. **Create a Database:**
   - Click "Create a project"
   - Name: `agri-store` or any name you like
   - Region: Choose closest to your users
   - Click "Create project"

3. **Get Connection String:**
   - You'll see a connection string like:
     ```
     postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
     ```
   - **Copy this entire string!** You'll need it.

4. **Run Database Schema:**
   - In Neon dashboard, click "SQL Editor"
   - Copy the contents of `Server/database-postgres.sql`
   - Paste into SQL Editor
   - Click "Run" ▶️
   - You should see "Success" and sample products created

---

### **Step 2: Update Your Server Code**

**Option A - Use the New PostgreSQL Server (Recommended):**

1. Rename your current server:
   ```powershell
   cd Server
   mv server.js server-mysql.js
   mv server-postgres.js server.js
   ```

2. Install PostgreSQL driver:
   ```powershell
   npm install pg
   ```

**Option B - Keep Both (for flexibility):**
- Keep `server.js` (MySQL) for local development
- Use `server-postgres.js` for Vercel deployment
- Update `vercel.json` to point to `server-postgres.js`

---

### **Step 3: Deploy Backend to Vercel**

1. **Update vercel.json:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

2. **Deploy from GitHub:**
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import your `Agri-Hackathon` repository
   - Configure:
     - **Framework Preset:** Other
     - **Root Directory:** `Server`
     - **Build Command:** Leave empty or `npm install`
     - **Output Directory:** Leave empty
     - **Install Command:** `npm install`

3. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add:
     - **Name:** `DATABASE_URL`
     - **Value:** [Paste your Neon connection string from Step 1]
   - Click "Add"

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment (1-2 minutes)
   - Copy your backend URL (e.g., `https://your-backend.vercel.app`)

---

### **Step 4: Update Frontend on Vercel**

1. **Go to your frontend project** (if it's separate):
   - If frontend and backend are in same repo, create a NEW project
   - Click "Add New..." → "Project"
   - Import same repo
   - **Root Directory:** Leave as root (not `Server`)

2. **Add Environment Variable:**
   - Settings → Environment Variables
   - Add:
     - **Name:** `REACT_APP_API_URL`
     - **Value:** `https://your-backend.vercel.app` (from Step 3)

3. **Redeploy:**
   - Deployments tab → "..." → "Redeploy"

---

### **Step 5: Test Everything**

1. **Test Backend:**
   - Visit: `https://your-backend.vercel.app/`
   - Should see: API welcome message

2. **Test Products Endpoint:**
   - Visit: `https://your-backend.vercel.app/api/products`
   - Should see: JSON array of products

3. **Test Frontend:**
   - Visit your frontend Vercel URL
   - Try logging in as Farmer
   - Try viewing products
   - Try adding a product
   - Everything should work! 🎉

---

## 🔧 Environment Variables Summary:

### **Backend (Vercel - Server project):**
```
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### **Frontend (Vercel - Main project):**
```
REACT_APP_API_URL=https://your-backend.vercel.app
```

---

## ⚠️ Important Notes:

### **About File Uploads:**
Your image uploads will work on Vercel, but:
- ⚠️ Files are **ephemeral** (deleted on each deployment)
- ✅ **For production**, use Cloudinary or AWS S3:

**Quick Cloudinary Setup:**
```bash
npm install cloudinary multer-storage-cloudinary
```

### **About Serverless Functions:**
- Vercel serverless has 10-second execution limit on free tier
- Your API should work fine for simple CRUD operations
- For long-running tasks, consider Railway or Render

---

## 🎯 Alternative: Vercel + Neon (Marketplace Integration)

Vercel has a Neon integration in their marketplace:

1. **Go to Vercel Dashboard**
2. **Storage** → "Create Database"
3. **Select "Neon Postgres"**
4. **Follow prompts** (it auto-configures everything!)
5. Environment variables are added automatically

This is even easier but requires connecting through Vercel's UI.

---

## 💡 Neon Free Tier Limits:

- ✅ **Storage:** 0.5 GB (more than enough for your app)
- ✅ **Compute:** 100 hours/month
- ✅ **Projects:** 1 project
- ✅ **Databases:** Multiple per project

Your hackathon demo will easily fit within these limits!

---

## 🐛 Troubleshooting:

### **"Cannot connect to database"**
- Check `DATABASE_URL` is set in Vercel environment variables
- Make sure connection string includes `?sslmode=require`
- Verify Neon database is running (check Neon dashboard)

### **"CORS error"**
- Add your Vercel frontend URL to CORS in `server.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000']
}));
```

### **"Images not showing"**
- Vercel serverless file uploads work but are temporary
- For production, integrate Cloudinary (see guide below)

### **"Database table not found"**
- Run `database-postgres.sql` in Neon SQL Editor
- Check table was created: `SELECT * FROM products;`

---

## 🚀 Optional: Add Cloudinary for Image Storage

Since Vercel serverless is ephemeral, use Cloudinary for images:

1. **Sign up:** https://cloudinary.com (free tier)
2. **Install:**
   ```bash
   npm install cloudinary multer-storage-cloudinary
   ```
3. **Update server.js** to use Cloudinary storage instead of local disk

(I can help you set this up if needed!)

---

## 📊 Cost Summary:

| Service | Cost | What You Get |
|---------|------|--------------|
| **Neon** | Free | 0.5GB PostgreSQL |
| **Vercel Frontend** | Free | Unlimited bandwidth |
| **Vercel Backend** | Free | 100GB bandwidth, serverless functions |
| **Total** | **$0/month** | Full production app! |

---

## ✅ Success Checklist:

- [ ] Neon database created
- [ ] `database-postgres.sql` executed in Neon
- [ ] `server-postgres.js` deployed to Vercel
- [ ] `DATABASE_URL` set in Vercel backend
- [ ] Frontend deployed to Vercel
- [ ] `REACT_APP_API_URL` set in Vercel frontend
- [ ] Tested login, view products, add product
- [ ] Everything works! 🎉

---

## 📚 Resources:

- Neon Docs: https://neon.tech/docs
- Vercel Docs: https://vercel.com/docs
- PostgreSQL vs MySQL differences: https://www.postgresqltutorial.com

Need help? Let me know! 🚀
