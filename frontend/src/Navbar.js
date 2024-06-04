import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from './logo.png'; // Adjust the path according to your actual file structure

const Navbar = ({ user }) => {
    return (
        <div className="navbar">
            <img src={logo} alt="TooRoo Logo" className="navbar-logo" />
            <nav>
                <NavLink to="/live" className="nav-item">LIVE</NavLink>
                <NavLink to="/following" className="nav-item">Following</NavLink>
                <NavLink to="/you-all" className="nav-item">You All</NavLink>
                <NavLink to="/timeline" className="nav-item">Timeline</NavLink>
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
