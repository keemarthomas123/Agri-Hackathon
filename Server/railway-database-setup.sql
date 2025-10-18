-- Railway Database Setup Script
-- Run this in your Railway MySQL Query console or MySQL client

-- Note: Railway database is already created, so we don't need CREATE DATABASE
-- Just use the existing 'railway' database

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  harvest_date DATE NOT NULL,
  image_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_product_name ON products(product_name);
CREATE INDEX IF NOT EXISTS idx_created_at ON products(created_at);

-- Insert sample data (optional - you can remove this if you don't want sample data)
INSERT INTO products (product_name, category, quantity, unit, price, description, harvest_date) VALUES
('Fresh Tomatoes', 'vegetables', 50.00, 'kg', 3.50, 'Organic vine-ripened tomatoes', '2025-10-15'),
('Sweet Corn', 'vegetables', 100.00, 'units', 1.25, 'Fresh sweet corn from local farm', '2025-10-14'),
('Red Apples', 'fruits', 75.00, 'kg', 4.00, 'Crisp and juicy red apples', '2025-10-10'),
('Fresh Milk', 'dairy', 200.00, 'liters', 2.50, 'Fresh whole milk from grass-fed cows', '2025-10-16'),
('Brown Rice', 'grains', 500.00, 'kg', 2.00, 'Organic brown rice', '2025-09-30');
