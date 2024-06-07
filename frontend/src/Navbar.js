import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { FaBroadcastTower, FaSearch } from 'react-icons/fa';

const Navbar = ({ user }) => {
    return (
        <div className="navbar">
            <div className="navbar-left">
                <NavLink to="/live" activeClassName="active"><FaBroadcastTower /></NavLink>
                <NavLink to="/following" activeClassName="active">Following</NavLink>
                <NavLink to="/you-all" activeClassName="active">You All</NavLink>
                <NavLink to="/" activeClassName="active">Timeline</NavLink>
            </div>
            <div className="navbar-right">
                <NavLink to="/search" activeClassName="active"><FaSearch /></NavLink>
                <span>{user.username}</span>
            </div>
        </div>
    );
};

export default Navbar;
