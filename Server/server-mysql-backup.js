const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agri_store'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database successfully!');
});

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// ============== API ROUTES ==============

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Get all products
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(results);
  });
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
  const query = 'SELECT * FROM products WHERE id = ?';
  
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(results[0]);
  });
});

// Add new product with image upload
app.post('/api/products', upload.single('image'), (req, res) => {
  const { productName, category, quantity, unit, price, description, harvestDate } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  
  const query = `
    INSERT INTO products 
    (product_name, category, quantity, unit, price, description, harvest_date, image_path) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [productName, category, quantity, unit, price, description, harvestDate, imagePath];
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({ error: 'Failed to add product' });
    }
    
    res.status(201).json({
      message: 'Product added successfully!',
      productId: result.insertId,
      imagePath: imagePath
    });
  });
});

// Update product
app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const { productName, category, quantity, unit, price, description, harvestDate } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  
  let query = `
    UPDATE products 
    SET product_name = ?, category = ?, quantity = ?, unit = ?, price = ?, 
        description = ?, harvest_date = ?
  `;
  
  let values = [productName, category, quantity, unit, price, description, harvestDate];
  
  if (imagePath) {
    query += ', image_path = ?';
    values.push(imagePath);
  }
  
  query += ' WHERE id = ?';
  values.push(req.params.id);
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ error: 'Failed to update product' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product updated successfully!' });
  });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  // First, get the product to delete its image
  const selectQuery = 'SELECT image_path FROM products WHERE id = ?';
  
  db.query(selectQuery, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Delete the image file if it exists
    if (results[0].image_path) {
      const imagePath = path.join(__dirname, results[0].image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete from database
    const deleteQuery = 'DELETE FROM products WHERE id = ?';
    db.query(deleteQuery, [req.params.id], (err, result) => {
      if (err) {
        console.error('Error deleting product:', err);
        return res.status(500).json({ error: 'Failed to delete product' });
      }
      
      res.json({ message: 'Product deleted successfully!' });
    });
  });
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
  const query = 'SELECT * FROM products WHERE category = ? ORDER BY created_at DESC';
  
  db.query(query, [req.params.category], (err, results) => {
    if (err) {
      console.error('Error fetching products by category:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(results);
  });
});

// Search products
app.get('/api/products/search/:keyword', (req, res) => {
  const keyword = `%${req.params.keyword}%`;
  const query = `
    SELECT * FROM products 
    WHERE product_name LIKE ? OR description LIKE ? OR category LIKE ?
    ORDER BY created_at DESC
  `;
  
  db.query(query, [keyword, keyword, keyword], (err, results) => {
    if (err) {
      console.error('Error searching products:', err);
      return res.status(500).json({ error: 'Failed to search products' });
    }
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  db.end((err) => {
    if (err) {
      console.error('Error closing database connection:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
