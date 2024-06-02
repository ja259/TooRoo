import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user }) => {
    return (
        <div className="navbar">
            <img src="logo.png" alt="TooRoo Logo" className="logo" />
            <div className="navbar-links">
                <Link to="/">Timeline</Link>
                <Link to="/live">LIVE</Link>
                <Link to="/following">Following</Link>
                <Link to="/youall">You All</Link>
                <Link to="/search">Search</Link>
            </div>
            <div className="navbar-user">
                {user && (
                    <>
                        <Link to={`/profile/${user._id}`}>{user.username}</Link>
                        <button onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Logout</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;

