import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FaUser, FaComments, FaBell, FaCog, FaSearch, FaSignOutAlt, FaShieldAlt, 
    FaBook, FaLanguage, FaBookOpen, FaHome, FaStore, FaChartLine, 
    FaLocationArrow, FaQrcode, FaCommentAlt, FaCut, FaWallet 
} from 'react-icons/fa';
import Logout from './Logout';
import './Menu.css';

const Menu = ({ user, onLogout, menuOpen }) => {
    const [confirmLogout, setConfirmLogout] = useState(false);

    if (!user) return null;

    const handleLogoutClick = () => {
        setConfirmLogout(true);
    };

    const handleCancelLogout = () => {
        setConfirmLogout(false);
    };

    return (
        <div className={`menu ${menuOpen ? 'open' : ''}`}>
            <div className="menu-profile">
                <img src={user.profilePicture} alt="Profile" className="profile-picture" />
                <span>{user.username}</span>
            </div>
            <NavLink to="/profile" className="menu-item"><FaUser /> Profile</NavLink>
            <NavLink to="/chat" className="menu-item"><FaCommentAlt /> Chat</NavLink>
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
            <NavLink to="/salon" className="menu-item"><FaCut /> Salon & Barber Shop</NavLink>
            <NavLink to="/wallet" className="menu-item"><FaWallet /> Wallet</NavLink>
            <button onClick={handleLogoutClick} className="menu-item logout-button">
                <FaSignOutAlt /> Logout
            </button>
            {confirmLogout && (
                <Logout 
                    onLogout={onLogout} 
                    onCancel={handleCancelLogout} 
                />
            )}
        </div>
    );
};

export default Menu;
