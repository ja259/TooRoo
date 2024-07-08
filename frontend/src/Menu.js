import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaComments, FaBell, FaCog, FaSearch, FaSignOutAlt, FaShieldAlt, FaBook, FaLanguage, FaBookOpen, FaHome, FaStore, FaChartLine, FaLocationArrow, FaQrcode } from 'react-icons/fa';
import './Menu.css';

const Menu = ({ user, onLogout, menuOpen }) => {
    if (!user) return null;

    return (
        <div className={`menu ${menuOpen ? 'open' : ''}`}>
            <div className="menu-profile">
                <img src={user.profilePicture} alt="Profile" className="profile-picture" />
                <span>{user.username}</span>
            </div>
            <NavLink to="/profile" className="menu-item"><FaUser /> Profile</NavLink>
            <NavLink to="/inbox" className="menu-item"><FaComments /> Inbox</NavLink>
            <NavLink to="/dashboard" className="menu-item"><FaHome /> Dashboard</NavLink>
            <NavLink to="/feed" className="menu-item"><FaBookOpen /> Feed</NavLink>
            <NavLink to="/notifications" className="menu-item"><FaBell /> Notifications</NavLink>
            <NavLink to="/search" className="menu-item"><FaSearch /> Search</NavLink>
            <NavLink to="/settings" className="menu-item"><FaCog /> Settings</NavLink>
            <NavLink to="/stories" className="menu-item"><FaBook /> Stories</NavLink>
            <NavLink to="/privacy" className="menu-item"><FaShieldAlt /> Privacy</NavLink>
            <NavLink to="/language" className="menu-item"><FaLanguage /> Language</NavLink>
            <NavLink to="/explore" className="menu-item"><FaSearch /> Explore</NavLink>
            <NavLink to="/marketplace" className="menu-item"><FaStore /> Marketplace</NavLink>
            <NavLink to="/analytics" className="menu-item"><FaChartLine /> Analytics</NavLink>
            <NavLink to="/location-sharing" className="menu-item"><FaLocationArrow /> Location Sharing</NavLink>
            <NavLink to="/qr-code-scanner" className="menu-item"><FaQrcode /> QR Code Scanner</NavLink>
            <NavLink to="/translation" className="menu-item"><FaLanguage /> Translation</NavLink>
            <button onClick={onLogout} className="menu-item"><FaSignOutAlt /> Logout</button>
        </div>
    );
};

export default Menu;

