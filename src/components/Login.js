import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'consumer' // 'farmer' or 'consumer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      if (isSignUp) {
        // Sign Up validation
        if (!formData.fullName) {
          throw new Error('Please enter your full name');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        // TODO: Add API call for sign up
        console.log('Sign Up Data:', formData);
        alert(`${formData.role === 'farmer' ? 'Farmer' : 'Consumer'} account created successfully! 🎉`);
        setIsSignUp(false);
        setFormData({ email: '', password: '', confirmPassword: '', fullName: '', role: 'consumer' });
      } else {
        // Login validation
        // TODO: Add API call for login
        console.log('Login Data:', { email: formData.email, password: formData.password });
        
        // Simulate successful login
        setTimeout(() => {
          alert(`${formData.role === 'farmer' ? 'Farmer' : 'Consumer'} login successful! 🎉`);
          if (onLogin) {
            onLogin({ 
              email: formData.email, 
              name: formData.fullName || formData.email.split('@')[0],
              role: formData.role
            });
          }
        }, 500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ email: '', password: '', confirmPassword: '', fullName: '', role: 'consumer' });
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">🌾</div>
          <h1>Agricultural Store</h1>
          <p>{isSignUp ? 'Create your account' : 'Welcome back, Farmer!'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-banner">
              ❌ {error}
            </div>
          )}

          {/* Role Selection - Show for both Login and Sign Up */}
          <div className="form-group">
            <label>I am a...</label>
            <div className="role-selector">
              <label className={`role-option ${formData.role === 'farmer' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  checked={formData.role === 'farmer'}
                  onChange={handleChange}
                  disabled={loading}
                />
                <div className="role-content">
                  <span className="role-icon">🌾</span>
                  <div>
                    <strong>Farmer</strong>
                    <p>Sell products</p>
                  </div>
                </div>
              </label>

              <label className={`role-option ${formData.role === 'consumer' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="consumer"
                  checked={formData.role === 'consumer'}
                  onChange={handleChange}
                  disabled={loading}
                />
                <div className="role-content">
                  <span className="role-icon">🛒</span>
                  <div>
                    <strong>Consumer</strong>
                    <p>Buy products</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {isSignUp && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>
          )}

          {!isSignUp && (
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button type="button" className="btn-google">
            <span>🔍</span> Continue with Google
          </button>

          <div className="toggle-mode">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button type="button" onClick={toggleMode}>
                  Login here
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button type="button" onClick={toggleMode}>
                  Sign up here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>

      <div className="login-footer">
        <p>© 2025 Agricultural Store. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
