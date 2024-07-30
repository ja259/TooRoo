import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBroadcastTower, FaSearch, FaBars } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ user, onLogout, onMenuToggle }) => {
    const getActiveLinkClass = ({ isActive }) => isActive ? 'active' : '';

    return (
        <div className="navbar">
            <NavLink to="/live" className={getActiveLinkClass}><FaBroadcastTower /></NavLink>
            <NavLink to="/following" className={getActiveLinkClass}>Following</NavLink>
            <NavLink to="/you-all" className={getActiveLinkClass}>You All</NavLink>
            <NavLink to="/" className={getActiveLinkClass}>Timeline</NavLink>
            <NavLink to="/search" className={getActiveLinkClass}><FaSearch className="fa-search" /></NavLink>
            <button onClick={onMenuToggle}><FaBars /></button>
        </div>
    );
};

export default Navbar;



