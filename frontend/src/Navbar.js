import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { FaBroadcastTower, FaSearch, FaHome } from 'react-icons/fa';

const Navbar = ({ user }) => {
    // Helper function to determine active link
    const getActiveLinkClass = ({ isActive }) => isActive ? 'active' : '';

    return (
        <div className="navbar">
            <div className="navbar-left">
                <NavLink to="/" className={getActiveLinkClass}><FaHome /></NavLink>
                <NavLink to="/live" className={getActiveLinkClass}><FaBroadcastTower /></NavLink>
                <NavLink to="/following" className={getActiveLinkClass}>Following</NavLink>
                <NavLink to="/you-all" className={getActiveLinkClass}>You All</NavLink>
                <NavLink to="/timeline" className={getActiveLinkClass}>Timeline</NavLink>
                <NavLink to="/search" className={getActiveLinkClass}><FaSearch className="fa-search" /></NavLink>
            </div>
            <div className="navbar-right">
                <span>{user?.username}</span> {/* Safeguarding against undefined user */}
            </div>
        </div>
    );
};

export default Navbar;
