# Agricultural Store Backend Server

## Setup Instructions

### 1. Install Dependencies
```bash
cd Server
npm install
```

### 2. Configure MySQL Database

**Option A: Using MySQL Workbench or phpMyAdmin**
- Open MySQL Workbench or phpMyAdmin
- Run the SQL script from `database.sql` file

**Option B: Using Command Line**
```bash
mysql -u root -p < database.sql
```

### 3. Update Database Configuration

Edit the `.env` file with your MySQL credentials:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=agri_store
```

Or directly edit `server.js` (lines 26-30):
```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // Your MySQL username
  password: '',           // Your MySQL password
  database: 'agri_store'  // Your database name
});
```

### 4. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Products

- **GET** `/api/test` - Test if server is running
- **GET** `/api/products` - Get all products
- **GET** `/api/products/:id` - Get single product by ID
- **POST** `/api/products` - Add new product (with image upload)
- **PUT** `/api/products/:id` - Update product
- **DELETE** `/api/products/:id` - Delete product
- **GET** `/api/products/category/:category` - Get products by category
- **GET** `/api/products/search/:keyword` - Search products

### Request Example (Add Product)

**Endpoint:** `POST /api/products`

**Form Data:**
```
productName: Fresh Tomatoes
category: vegetables
quantity: 50
unit: kg
price: 3.50
description: Organic tomatoes
harvestDate: 2025-10-15
image: [file upload]
```

## Project Structure

```
Server/
├── server.js          # Main server file
├── package.json       # Dependencies
├── .env              # Environment variables
├── database.sql      # Database schema
├── uploads/          # Uploaded images (auto-created)
└── README.md         # This file
```

## Testing the API

You can test the API using:
- **Postman**
- **Thunder Client** (VS Code extension)
- **curl** commands
- Your React frontend

### Example curl command:
```bash
# Test server
curl http://localhost:5000/api/test

# Get all products
curl http://localhost:5000/api/products
```

## Troubleshooting

**Error: Cannot connect to database**
- Make sure MySQL server is running
- Verify database credentials in `.env` or `server.js`
- Check if database `agri_store` exists

**Error: Port 5000 already in use**
- Change PORT in `.env` file to another port (e.g., 5001)

**Error: Module not found**
- Run `npm install` in the Server directory
