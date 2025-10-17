import React, { useState } from 'react';
import './AddProduct.css';
import API_URL from '../config';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    quantity: '',
    unit: 'kg',
    price: '',
    description: '',
    harvestDate: '',
    image: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('harvestDate', formData.harvestDate);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Send POST request to server
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        alert('Product added successfully! 🎉');
        
        // Reset form
        setFormData({
          productName: '',
          category: '',
          quantity: '',
          unit: 'kg',
          price: '',
          description: '',
          harvestDate: '',
          image: null
        });
      } else {
        throw new Error(data.error || 'Failed to add product');
      }
    } catch (err) {
      setError(err.message);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          
          {/* Product Image Upload */}
          <div className="form-group image-upload">
            <label>Product Image</label>
            <div className="image-preview">
              {formData.image ? (
                <img src={URL.createObjectURL(formData.image)} alt="Preview" />
              ) : (
                <div className="placeholder">
                  <span>📷</span>
                  <p>Click to upload image</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                required
              />
            </div>
          </div>

          {/* Product Name */}
          <div className="form-group">
            <label>Product Name *</label>
            <input 
              type="text" 
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="e.g., Fresh Tomatoes"
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category *</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="grains">Grains</option>
              <option value="dairy">Dairy</option>
              <option value="livestock">Livestock</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Quantity and Unit */}
          <div className="form-row">
            <div className="form-group">
              <label>Quantity *</label>
              <input 
                type="number" 
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Unit *</label>
              <select 
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="units">Units</option>
                <option value="bunches">Bunches</option>
                <option value="liters">Liters</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price per Unit ($) *</label>
            <input 
              type="number" 
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Harvest Date */}
          <div className="form-group">
            <label>Harvest Date *</label>
            <input 
              type="date" 
              name="harvestDate"
              value={formData.harvestDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add product description, growing method, etc."
              rows="4"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="success-message">
              <p>✅ Product added successfully!</p>
            </div>
          )}

          {/* Buttons */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => {
                setFormData({
                  productName: '',
                  category: '',
                  quantity: '',
                  unit: 'kg',
                  price: '',
                  description: '',
                  harvestDate: '',
                  image: null
                });
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;