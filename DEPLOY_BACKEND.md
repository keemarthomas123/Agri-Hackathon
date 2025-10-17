# How to Deploy Backend to Fix Fetch Errors

## The Problem
Your frontend is on Vercel, but your backend is still on `localhost:5000`. Other users can't access your local machine, so they get fetch errors.

## Solution Options

### **Option 1: Deploy Backend to Vercel (Recommended for Quick Fix)**

1. **Navigate to Server folder:**
   ```bash
   cd Server
   ```

2. **Initialize Git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial backend commit"
   ```

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository OR drag & drop the Server folder
   - Set Root Directory to `Server`
   - Add Environment Variables:
     - `DB_HOST` = your-mysql-host (e.g., from PlanetScale, Railway, or Aiven)
     - `DB_USER` = your-mysql-username
     - `DB_PASSWORD` = your-mysql-password
     - `DB_NAME` = agri_store
   - Click Deploy

4. **Update Frontend Environment Variable:**
   - In your main project on Vercel, go to Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend.vercel.app`
   - Redeploy frontend

### **Option 2: Use Render.com (Better for Backend with Database)**

1. **Create account at [render.com](https://render.com)**

2. **Deploy Backend:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Select the Server folder
   - Configure:
     - Name: `agri-store-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `node server.js`
   - Add Environment Variables (same as above)
   - Click "Create Web Service"

3. **Deploy MySQL Database on Render:**
   - Click "New +" → "MySQL"
   - Note the connection details
   - Update your backend env variables

4. **Update Frontend:**
   - Set `REACT_APP_API_URL` to your Render backend URL
   - Redeploy

### **Option 3: Railway.app (Easiest for Backend + Database)**

1. **Go to [railway.app](https://railway.app)**

2. **Create New Project:**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js

3. **Add MySQL Database:**
   - In same project, click "+ New" → "Database" → "MySQL"
   - Railway provides connection details automatically

4. **Configure Environment Variables:**
   - Click your backend service → Variables
   - Add DB connection details from Railway MySQL

5. **Get Backend URL:**
   - Click "Settings" → Copy the public URL
   - Update frontend `REACT_APP_API_URL`

## Quick Database Options (If you need hosted MySQL)

### **PlanetScale (Free Tier):**
- Go to [planetscale.com](https://planetscale.com)
- Create database
- Copy connection string
- Use in your backend env variables

### **Railway MySQL:**
- Add MySQL to your Railway project
- Automatic connection setup

### **Aiven (Free Trial):**
- Go to [aiven.io](https://aiven.io)
- Create MySQL service
- Get connection details

## After Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend-url.com/api/products
   ```

2. **Update Frontend on Vercel:**
   - Go to your frontend project on Vercel
   - Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.com`
   - Go to Deployments → Click "..." → Redeploy

3. **Verify:**
   - Open your Vercel frontend URL
   - Try logging in
   - Check browser console for errors

## Environment Variables Summary

### Backend (.env):
```
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=agri_store
PORT=5000
```

### Frontend (Vercel Environment Variables):
```
REACT_APP_API_URL=https://your-backend-url.com
```

## Troubleshooting

### CORS Errors:
Make sure your backend `server.js` has:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000']
}));
```

### Database Connection Errors:
- Check if your hosting platform allows external DB connections
- Verify DB credentials in environment variables
- Check if your MySQL service is running

### 404 Errors:
- Verify `vercel.json` is in Server folder
- Check route paths match in frontend and backend

## Need Help?
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
