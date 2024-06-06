import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { FaSearch } from 'react-icons/fa';

const Navbar = ({ user }) => {
    return (
        <div className="navbar">
            <div className="navbar-left">
                <span>LIVE</span>
                <NavLink to="/following" activeclassname="active">Following</NavLink>
                <NavLink to="/you-all" activeclassname="active">You All</NavLink>
                <NavLink to="/timeline" activeclassname="active">Timeline</NavLink>
            </div>
            <div className="navbar-right">
                <NavLink to="/search" activeclassname="active"><FaSearch /></NavLink>
                <span>{user.username}</span>
            </div>
        </div>
    );
};

export default Navbar;

