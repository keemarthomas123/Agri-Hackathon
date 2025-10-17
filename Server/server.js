const express = require('express');
const { Pool } = require('pg');
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

// PostgreSQL Database Connection (Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
    return;
  }
  console.log('Connected to PostgreSQL database successfully!');
  console.log('Current time:', res.rows[0].now);
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
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// ==================== API ROUTES ====================

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Agricultural Store API is running!',
    database: 'PostgreSQL (Neon)',
    endpoints: {
      products: '/api/products',
      addProduct: 'POST /api/products',
      getProduct: '/api/products/:id',
      deleteProduct: 'DELETE /api/products/:id'
    }
  });
});

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST - Add new product (with image upload)
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { productName, category, quantity, unit, price, description, harvestDate } = req.body;
    
    // Validation
    if (!productName || !category || !quantity || !unit || !price || !harvestDate) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    // Get image path if uploaded
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Insert into database
    const result = await pool.query(
      `INSERT INTO products (product_name, category, quantity, unit, price, description, harvest_date, image_path)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [productName, category, parseFloat(quantity), unit, parseFloat(price), description, harvestDate, imagePath]
    );

    res.status(201).json({
      message: 'Product added successfully!',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// PUT - Update product
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, category, quantity, unit, price, description, harvestDate } = req.body;
    
    // Check if product exists
    const checkResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get image path if new image uploaded, otherwise keep old one
    const imagePath = req.file ? `/uploads/${req.file.filename}` : checkResult.rows[0].image_path;

    // Delete old image if new one uploaded
    if (req.file && checkResult.rows[0].image_path) {
      const oldImagePath = path.join(__dirname, checkResult.rows[0].image_path);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update product
    const result = await pool.query(
      `UPDATE products 
       SET product_name = $1, category = $2, quantity = $3, unit = $4, 
           price = $5, description = $6, harvest_date = $7, image_path = $8, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [productName, category, parseFloat(quantity), unit, parseFloat(price), description, harvestDate, imagePath, id]
    );

    res.json({
      message: 'Product updated successfully!',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get product to find image path
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = result.rows[0];

    // Delete image file if exists
    if (product.image_path) {
      const imagePath = path.join(__dirname, product.image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete from database
    await pool.query('DELETE FROM products WHERE id = $1', [id]);

    res.json({ message: 'Product deleted successfully!' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// GET products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const result = await pool.query(
      'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC',
      [category]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET products by search keyword
app.get('/api/products/search/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await pool.query(
      `SELECT * FROM products 
       WHERE product_name ILIKE $1 OR description ILIKE $1 
       ORDER BY created_at DESC`,
      [`%${keyword}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Using PostgreSQL (Neon) database`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});
