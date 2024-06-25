import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBroadcastTower, FaSearch, FaMoon, FaSun, FaPhoneAlt, FaVideo, FaComments, FaHistory } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
    const getActiveLinkClass = ({ isActive }) => isActive ? 'active' : '';

    return (
        <div className="navbar">
            <div className="navbar-left">
                <NavLink to="/live" className={getActiveLinkClass}><FaBroadcastTower /></NavLink>
                <NavLink to="/following" className={getActiveLinkClass}>Following</NavLink>
                <NavLink to="/you-all" className={getActiveLinkClass}>You All</NavLink>
                <NavLink to="/" className={getActiveLinkClass}>Timeline</NavLink>
                <NavLink to="/search" className={getActiveLinkClass}><FaSearch className="fa-search" /></NavLink>
                <NavLink to="/dashboard" className={getActiveLinkClass}>Dashboard</NavLink>
                <NavLink to="/chat" className={getActiveLinkClass}><FaComments /></NavLink>
                <NavLink to="/call" className={getActiveLinkClass}><FaPhoneAlt /></NavLink>
                <NavLink to="/video-call" className={getActiveLinkClass}><FaVideo /></NavLink>
                <NavLink to="/stories" className={getActiveLinkClass}><FaHistory /></NavLink>
            </div>
            <div className="navbar-right">
                <span>{user?.username}</span>
                <button onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Navbar;

