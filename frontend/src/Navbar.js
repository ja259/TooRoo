import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ user }) => {
    return (
        <nav className="navbar">
            <Link to="/"><img src="logo.png" alt="TooRoo" className="logo" /></Link>
            <div className="nav-links">
                <Link to="/live">LIVE</Link>
                <Link to="/following">Following</Link>
                <Link to="/you-all">You All</Link>
                <Link to="/timeline">Timeline</Link>
                <Link to="/search"><FaSearch /></Link>
                <span>{user ? <Link to="/profile">{user.username}</Link> : <Link to="/login">Login</Link>}</span>
            </div>
        </nav>
    );
};

export default Navbar;
