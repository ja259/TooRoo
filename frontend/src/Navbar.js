import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="navbar">
            <div className="nav-options">
                <span onClick={() => navigate('/live')}>Live</span>
                <span onClick={() => navigate('/following')}>Following</span>
                <span onClick={() => navigate('/you-all')}>You All</span>
                <span onClick={() => navigate('/')}>Timeline</span>
            </div>
            <div className="nav-search">
                <i className="fas fa-search" onClick={() => navigate('/search')}></i>
            </div>
        </div>
    );
};

export default Navbar;
