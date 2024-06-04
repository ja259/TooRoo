import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user }) => {
    return (
        <div className="navbar">
            <img src="/path-to-logo.png" alt="TooRoo Logo" className="navbar-logo" />
            <nav className="nav-options">
                <NavLink to="/live" className={({ isActive }) => isActive ? "active" : ""}>LIVE</NavLink>
                <NavLink to="/following" className={({ isActive }) => isActive ? "active" : ""}>Following</NavLink>
                <NavLink to="/you-all" className={({ isActive }) => isActive ? "active" : ""}>You All</NavLink>
                <NavLink to="/timeline" className={({ isActive }) => isActive ? "active" : ""}>Timeline</NavLink>
                <Link to="/search" className="nav-item">Search</Link>
            </nav>
            <div className="profile-actions">
                {user ? (
                    <Link to="/profile" className="nav-item">{user.username}</Link>
                ) : (
                    <Link to="/login" className="nav-item">Login</Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
