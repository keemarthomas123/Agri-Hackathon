# 🚂 Deploy Everything to Railway (Easiest Solution)

## Why Railway?
- ✅ Hosts your Node.js backend
- ✅ Provides MySQL database
- ✅ Auto-connects them together
- ✅ Free tier ($5 credit/month)
- ✅ Much easier than separate services

## Step-by-Step Deployment:

### **Step 1: Sign Up for Railway**
1. Go to https://railway.app
2. Click "Login" → Sign in with GitHub
3. Authorize Railway to access your repos

### **Step 2: Deploy Your Backend**
1. Click "**New Project**"
2. Select "**Deploy from GitHub repo**"
3. Choose `keemarthomas123/Agri-Hackathon`
4. Railway detects it's a Node.js project
5. Click on the deployed service
6. Go to "**Settings**" → "**Root Directory**"
7. Set to: `Server`
8. Click "**Update**"

### **Step 3: Add MySQL Database**
1. In the same project, click "**+ New**"
2. Select "**Database**" → "**Add MySQL**"
3. Railway creates the database and shows connection details
4. **Keep this tab open!** You'll need these values:

### **Step 4: Configure Environment Variables**
1. Click on your backend service (not the database)
2. Go to "**Variables**" tab
3. Click "**+ New Variable**" and add each:

```
DB_HOST = <from Railway MySQL connection info>
DB_USER = <from Railway MySQL connection info>
DB_PASSWORD = <from Railway MySQL connection info>
DB_NAME = railway
PORT = 5000
```

**Pro Tip:** Railway provides these as `MYSQL_HOST`, `MYSQL_USER`, etc. You can copy them!

### **Step 5: Set Up Your Database Schema**
1. Click on the **MySQL database** service
2. Go to "**Data**" tab
3. Click "**Query**" 
4. Copy-paste your database.sql content:

```sql
CREATE DATABASE IF NOT EXISTS railway;
USE railway;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    harvest_date DATE NOT NULL,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_product_name (product_name),
    INDEX idx_created_at (created_at)
);

-- Sample data (optional)
INSERT INTO products (product_name, category, quantity, unit, price, description, harvest_date) VALUES
('Fresh Tomatoes', 'vegetables', 50.00, 'kg', 3.50, 'Organic farm-fresh tomatoes', '2024-01-15'),
('Sweet Corn', 'vegetables', 100.00, 'units', 1.20, 'Sweet corn from local farms', '2024-01-10'),
('Red Apples', 'fruits', 75.00, 'kg', 4.00, 'Crisp red apples', '2024-01-12'),
('Fresh Milk', 'dairy', 30.00, 'liters', 2.50, 'Fresh farm milk', '2024-01-16'),
('Brown Rice', 'grains', 200.00, 'kg', 2.00, 'Organic brown rice', '2024-01-05');
```

5. Click "**Run**"

### **Step 6: Get Your Backend URL**
1. Click on your backend service
2. Go to "**Settings**" tab
3. Scroll to "**Domains**"
4. Click "**Generate Domain**"
5. **Copy this URL!** (e.g., `https://agri-hackathon-production.up.railway.app`)

### **Step 7: Update Frontend on Vercel**
1. Go to https://vercel.com/dashboard
2. Click on your deployed frontend project
3. Go to "**Settings**" → "**Environment Variables**"
4. Add new variable:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://your-railway-backend-url.up.railway.app` (paste from Step 6)
5. Click "**Save**"
6. Go to "**Deployments**" tab
7. Click "**...**" on latest deployment → "**Redeploy**"

### **Step 8: Test Your App!** 🎉
1. Open your Vercel URL
2. Try logging in as Farmer or Consumer
3. Try adding a product
4. Everything should work now!

## Troubleshooting:

### Backend not starting?
- Check "**Deployments**" tab in Railway
- Click on latest deployment to see logs
- Make sure Root Directory is set to `Server`
- Verify all environment variables are set

### Database connection error?
- Check if database variables match in your backend service
- Make sure you're using `railway` as the database name (or whatever Railway created)
- Check Railway MySQL service is running (green dot)

### CORS error?
- Update your `Server/server.js` to include your Vercel URL:
```javascript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:3000']
}));
```

### Images not showing?
- Railway serves static files automatically
- Make sure `uploads/` folder exists in Server directory
- Images are stored in Railway's filesystem (ephemeral - resets on redeploy)
- For production, consider using Cloudinary or AWS S3 for images

## Cost:
- **Free tier:** $5 credit/month
- **Your app usage:** Probably $2-3/month
- **Should be covered by free tier!**

## Alternative: Keep Frontend on Vercel, Backend on Railway
This is actually a good setup:
- ✅ Fast frontend (Vercel CDN)
- ✅ Reliable backend + database (Railway)
- ✅ Separation of concerns

## Need Help?
Railway Discord: https://discord.gg/railway
Railway Docs: https://docs.railway.app
