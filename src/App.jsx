import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import AddProduct from './components/products';
import ProductList from './components/ProductList';

function App() {
    const [currentView, setCurrentView] = useState('add'); // 'add' or 'list'
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

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
                currentView === 'add' ? <AddProduct /> : <ProductList />
            ) : (
                <ProductList userRole="consumer" />
            )}
        </div>
    );
}

export default App;