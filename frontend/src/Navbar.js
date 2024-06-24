import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { FaBroadcastTower, FaSearch } from 'react-icons/fa';

const Navbar = ({ user }) => {
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
            </div>
            <div className="navbar-right">
                <span>{user?.username}</span>
            </div>
        </div>
    );
};

export default Navbar;

