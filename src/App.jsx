import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import AddProduct from './components/products';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

function App() {
    const [currentView, setCurrentView] = useState('add'); // 'add' or 'list'
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showCart, setShowCart] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);

    // Load cart count from localStorage
    useEffect(() => {
        if (user) {
            const savedCart = localStorage.getItem(`cart_${user.email}`);
            if (savedCart) {
                const items = JSON.parse(savedCart);
                setCartItemCount(items.length);
            }
        }
    }, [user]);

    const handleAddToCart = (product) => {
        if (!user) return;

        const savedCart = localStorage.getItem(`cart_${user.email}`);
        const currentCart = savedCart ? JSON.parse(savedCart) : [];
        
        // Check if product already in cart
        const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
            // Increase quantity
            currentCart[existingItemIndex].quantity += 1;
            alert(`📦 Increased quantity of ${product.product_name} in cart!`);
        } else {
            // Add new item
            currentCart.push({ ...product, quantity: 1 });
            alert(`✅ ${product.product_name} added to cart!`);
        }
        
        localStorage.setItem(`cart_${user.email}`, JSON.stringify(currentCart));
        setCartItemCount(currentCart.length);
    };

    const handleLogin = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setCurrentView('add');
    };

    // Show login page if not logged in
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="App">
            {/* Navigation */}
            <nav className="nav-bar">
                <div className="nav-left">
                    {user?.role === 'farmer' && (
                        <button 
                            className={currentView === 'add' ? 'active' : ''}
                            onClick={() => setCurrentView('add')}
                        >
                            ➕ Add Product
                        </button>
                    )}
                    <button 
                        className={currentView === 'list' ? 'active' : ''}
                        onClick={() => setCurrentView('list')}
                    >
                        {user?.role === 'farmer' ? '📋 My Products' : '🛒 Browse Products'}
                    </button>
                </div>
                <div className="nav-right">
                    {user?.role === 'consumer' && (
                        <button 
                            className="btn-cart"
                            onClick={() => setShowCart(true)}
                        >
                            🛒 Cart {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                        </button>
                    )}
                    <span className="user-badge">
                        {user?.role === 'farmer' ? '🌾 Farmer' : '🛒 Consumer'}
                    </span>
                    <span className="user-name">👤 {user?.name || user?.email}</span>
                    <button className="btn-logout" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </nav>

            {/* Content */}
            {user?.role === 'farmer' ? (
                currentView === 'add' ? <AddProduct /> : <ProductList userRole="farmer" user={user} />
            ) : (
                <ProductList userRole="consumer" user={user} onAddToCart={handleAddToCart} />
            )}

            {/* Cart Modal */}
            {showCart && user?.role === 'consumer' && (
                <Cart 
                    user={user} 
                    onClose={() => {
                        setShowCart(false);
                        // Update cart count after closing
                        const savedCart = localStorage.getItem(`cart_${user.email}`);
                        if (savedCart) {
                            setCartItemCount(JSON.parse(savedCart).length);
                        } else {
                            setCartItemCount(0);
                        }
                    }} 
                />
            )}
        </div>
    );
}

export default App;