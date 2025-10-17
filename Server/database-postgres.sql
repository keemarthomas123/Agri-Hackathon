-- PostgreSQL Schema for Agricultural Store
-- Use this in Neon SQL Editor

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    harvest_date DATE NOT NULL,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_product_name ON products(product_name);
CREATE INDEX IF NOT EXISTS idx_created_at ON products(created_at);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO products (product_name, category, quantity, unit, price, description, harvest_date) VALUES
('Fresh Tomatoes', 'vegetables', 50.00, 'kg', 3.50, 'Organic farm-fresh tomatoes', '2024-01-15'),
('Sweet Corn', 'vegetables', 100.00, 'units', 1.20, 'Sweet corn from local farms', '2024-01-10'),
('Red Apples', 'fruits', 75.00, 'kg', 4.00, 'Crisp red apples', '2024-01-12'),
('Fresh Milk', 'dairy', 30.00, 'liters', 2.50, 'Fresh farm milk', '2024-01-16'),
('Brown Rice', 'grains', 200.00, 'kg', 2.00, 'Organic brown rice', '2024-01-05')
ON CONFLICT DO NOTHING;
