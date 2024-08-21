import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBroadcastTower, FaSearch, FaBars } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';
import './Navbar.css';

const Navbar = ({ user, onLogout, onMenuToggle, notifications = {} }) => {
    const navigate = useNavigate();

    // Define an array of routes in the order you want them to be swiped
    const routes = ['/live', '/following', '/you-all', '/', '/search'];

    // Determine the current active route
    const currentIndex = routes.findIndex(route => route === window.location.pathname);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            // Navigate to the next route on swipe left
            if (currentIndex < routes.length - 1) {
                navigate(routes[currentIndex + 1]);
            }
        },
        onSwipedRight: () => {
            // Navigate to the previous route on swipe right
            if (currentIndex > 0) {
                navigate(routes[currentIndex - 1]);
            }
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    const getActiveLinkClass = ({ isActive }) => (isActive ? 'active' : '');

    return (
        <div className="navbar" {...handlers}>
            <div className="navbar-scroll">
                <NavLink to="/live" className={getActiveLinkClass}>
                    <FaBroadcastTower />
                </NavLink>
                <NavLink to="/following" className={getActiveLinkClass}>
                    Following
                    {notifications.following && <span className="notification-dot">{notifications.following}</span>}
                </NavLink>
                <NavLink to="/you-all" className={getActiveLinkClass}>
                    You All
                    {notifications.youAll && <span className="notification-dot">{notifications.youAll}</span>}
                </NavLink>
                <NavLink to="/" className={getActiveLinkClass}>
                    Timeline
                    {notifications.timeline && <span className="notification-dot">{notifications.timeline}</span>}
                </NavLink>
                <NavLink to="/search" className={getActiveLinkClass}><FaSearch className="fa-search" /></NavLink>
            </div>
            <button onClick={onMenuToggle}><FaBars /></button>
        </div>
    );
};

export default Navbar;

