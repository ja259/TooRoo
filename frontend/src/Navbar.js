import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user }) => {
    return (
        <nav className="navbar">
            <Link to="/">
                <img src="/path-to-logo.png" alt="TooRoo Logo" className="navbar-logo" />
            </Link>
            {user ? (
                <div className="navbar-links">
                    <Link to="/profile">Profile</Link>
                    <Link to="/search">Search</Link>
                    <button onClick={() => localStorage.removeItem('token') && window.location.reload()}>Logout</button>
                </div>
            ) : (
                <div className="navbar-links">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
