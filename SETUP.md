# 🚀 Quick Setup Guide

## Step 1: Setup MySQL Database

### Create the database in MySQL:
1. Open MySQL Workbench, phpMyAdmin, or MySQL command line
2. Run this command:
```sql
CREATE DATABASE agri_store;
```

3. Then run the SQL from `Server/database.sql` to create the tables

**OR** run this in command line:
```bash
mysql -u root -p < Server/database.sql
```

## Step 2: Configure Database Credentials

Edit `Server/.env` file and add your MySQL password:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=agri_store
```

## Step 3: Start the Backend Server

```bash
cd Server
node server.js
```

You should see:
```
Connected to MySQL database successfully!
Server is running on http://localhost:5000
```

## Step 4: Start the Frontend (React)

In a NEW terminal:
```bash
npm start
```

Your app will open at `http://localhost:3000`

## 🎉 Features Available:

1. **Add Product** - Upload products with images
2. **View Products** - See all products in a grid
3. **Search & Filter** - Search by name or filter by category
4. **Delete Products** - Remove products from the store

## API Endpoints:

- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/category/:category` - Filter by category
- `GET /api/products/search/:keyword` - Search products

## Troubleshooting:

**Can't connect to database?**
- Make sure MySQL is running
- Check your password in `.env` file
- Make sure database `agri_store` exists

**Port 5000 already in use?**
- Change PORT in `.env` file

**React can't reach API?**
- Make sure server is running on port 5000
- Check browser console for errors
