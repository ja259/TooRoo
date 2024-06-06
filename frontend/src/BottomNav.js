import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaInbox, FaBell, FaUser, FaVideo } from 'react-icons/fa';
import './BottomNav.css';

const BottomNav = () => {
    return (
        <div className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                <FaHome /><span>Home</span>
            </NavLink>
            <NavLink to="/inbox" className={({ isActive }) => isActive ? "active" : ""}>
                <FaInbox /><span>Inbox</span>
            </NavLink>
            <NavLink to="/create-video" className={({ isActive }) => isActive ? "active" : ""}>
                <FaVideo />
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => isActive ? "active" : ""}>
                <FaBell /><span>Notifications</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
                <FaUser /><span>Profile</span>
            </NavLink>
        </div>
    );
};

export default BottomNav;
