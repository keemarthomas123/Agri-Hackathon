import React, { useState, useEffect } from 'react';
import './ProductList.css';

const ProductList = ({ userRole = 'farmer' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        fetchProducts(); // Refresh list
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={fetchProducts} className="btn-retry">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>{userRole === 'farmer' ? '🌾 My Products' : '🛒 Browse Fresh Products'}</h1>
        
        {/* Search and Filter */}
        <div className="filters">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
            <option value="livestock">Livestock</option>
            <option value="other">Other</option>
          </select>

          <button onClick={fetchProducts} className="btn-refresh">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image_path ? (
                  <img 
                    src={`http://localhost:5000${product.image_path}`} 
                    alt={product.product_name}
                  />
                ) : (
                  <div className="no-image">📷</div>
                )}
              </div>
              
              <div className="product-info">
                <h3>{product.product_name}</h3>
                <span className="category-badge">{product.category}</span>
                
                <div className="product-details">
                  <p><strong>Quantity:</strong> {product.quantity} {product.unit}</p>
                  <p><strong>Price:</strong> ${product.price} per {product.unit}</p>
                  <p><strong>Harvest Date:</strong> {new Date(product.harvest_date).toLocaleDateString()}</p>
                </div>
                
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
                
                <div className="product-actions">
                  {userRole === 'farmer' ? (
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      🗑️ Delete
                    </button>
                  ) : (
                    <button 
                      className="btn-buy"
                      onClick={() => alert('Purchase feature coming soon! 🛒')}
                    >
                      🛒 Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
