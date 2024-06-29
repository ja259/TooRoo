import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaComments, FaBell, FaMoon, FaCog, FaSearch, FaSignOutAlt, FaShieldAlt, FaBook, FaLanguage, FaBookOpen } from 'react-icons/fa';
import './Menu.css';

const Menu = ({ user, onLogout }) => {
    return (
        <div className="menu">
            <div className="menu-profile">
                <img src={user.profilePicture} alt="Profile" className="profile-picture" />
                <span>{user.username}</span>
            </div>
            <NavLink to="/profile" className="menu-item"><FaUser /> Profile</NavLink>
            <NavLink to="/chat" className="menu-item"><FaComments /> Chat</NavLink>
            <NavLink to="/dashboard" className="menu-item"><FaHome /> Dashboard</NavLink>
            <div className="menu-item"><FaMoon /> Dark Mode Toggle</div>
            <NavLink to="/feed" className="menu-item"><FaBookOpen /> Feed</NavLink>
            <NavLink to="/notifications" className="menu-item"><FaBell /> Notifications</NavLink>
            <NavLink to="/search" className="menu-item"><FaSearch /> Search</NavLink>
            <NavLink to="/settings" className="menu-item"><FaCog /> Settings</NavLink>
            <NavLink to="/stories" className="menu-item"><FaBook /> Stories</NavLink>
            <NavLink to="/privacy" className="menu-item"><FaShieldAlt /> Privacy</NavLink>
            <NavLink to="/language" className="menu-item"><FaLanguage /> Language</NavLink>
            <button onClick={onLogout} className="menu-item"><FaSignOutAlt /> Logout</button>
        </div>
    );
};

export default Menu;
