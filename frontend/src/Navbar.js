import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { FaBroadcastTower, FaSearch } from 'react-icons/fa';

const Navbar = () => {
    const user = useSelector(state => state.auth.user);

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
                {/* Safeguard against undefined user */}
                {user ? <span>{user.username}</span> : <NavLink to="/login" activeClassName="active">Login</NavLink>}
            </div>
        </div>
    );
};

export default Navbar;
