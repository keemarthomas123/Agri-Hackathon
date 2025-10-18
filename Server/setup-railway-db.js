// Script to set up Railway database
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

const setupSQL = `
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_product_name (product_name),
  INDEX idx_created_at (created_at)
);

INSERT INTO products (product_name, category, quantity, unit, price, description, harvest_date) VALUES
('Fresh Tomatoes', 'vegetables', 50.00, 'kg', 3.50, 'Organic vine-ripened tomatoes', '2025-10-15'),
('Sweet Corn', 'vegetables', 100.00, 'units', 1.25, 'Fresh sweet corn from local farm', '2025-10-14'),
('Red Apples', 'fruits', 75.00, 'kg', 4.00, 'Crisp and juicy red apples', '2025-10-10'),
('Fresh Milk', 'dairy', 200.00, 'liters', 2.50, 'Fresh whole milk from grass-fed cows', '2025-10-16'),
('Brown Rice', 'grains', 500.00, 'kg', 2.00, 'Organic brown rice', '2025-09-30');
`;

console.log('Connecting to Railway MySQL database...');

db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err);
    process.exit(1);
  }
  
  console.log('✅ Connected to Railway MySQL database!');
  console.log('Setting up database tables...');
  
  db.query(setupSQL, (err, results) => {
    if (err) {
      console.error('❌ Error setting up database:', err);
      db.end();
      process.exit(1);
    }
    
    console.log('✅ Database setup completed successfully!');
    console.log('✅ Products table created');
    console.log('✅ Sample data inserted');
    
    db.end((err) => {
      if (err) {
        console.error('Error closing connection:', err);
      }
      console.log('\n🎉 Railway database is ready to use!');
      process.exit(0);
    });
  });
});
