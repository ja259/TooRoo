import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
    return (
        <div className="bottom-nav">
            <NavLink to="/" activeClassName="active">Home</NavLink>
            <NavLink to="/inbox" activeClassName="active">Inbox</NavLink>
            <NavLink to="/create-video" activeClassName="active">Create Video</NavLink>
            <NavLink to="/notifications" activeClassName="active">Notifications</NavLink>
            <NavLink to="/profile" activeClassName="active">Profile</NavLink>
        </div>
    );
};

export default BottomNav;
