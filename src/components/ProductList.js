import React, { useState, useEffect } from 'react';
import './ProductList.css';
import API_URL from '../config';

const ProductList = ({ userRole = 'farmer', user, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high', 'name'
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    if (user && userRole === 'consumer') {
      const savedFavorites = localStorage.getItem(`favorites_${user.email}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [user, userRole]);

  // Save favorites to localStorage
  useEffect(() => {
    if (user && userRole === 'consumer') {
      localStorage.setItem(`favorites_${user.email}`, JSON.stringify(favorites));
    }
  }, [favorites, user, userRole]);

  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
      alert('💖 Added to favorites!');
    }
  };

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/products`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products. Make sure the server is running on port 5000.');
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server is not responding correctly. Please restart the backend server.');
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
      const response = await fetch(`${API_URL}/api/products/${id}`, {
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
    
    // Price range filter
    const price = parseFloat(product.price);
    const matchesMinPrice = priceRange.min === '' || price >= parseFloat(priceRange.min);
    const matchesMaxPrice = priceRange.max === '' || price <= parseFloat(priceRange.max);
    
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'name':
        return a.product_name.localeCompare(b.product_name);
      case 'newest':
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
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

          <div className="price-filter">
            <input
              type="number"
              placeholder="Min $"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="price-input"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max $"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="price-input"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>

          <button onClick={fetchProducts} className="btn-refresh">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found</p>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image_path ? (
                  <img 
                    src={`${API_URL}${product.image_path}`} 
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
                      onClick={() => onAddToCart(product)}
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
