import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Welcome to TooRoo</h1>
                <nav className="dashboard-nav">
                    <Link to="/profile">Profile</Link>
                    <Link to="/feed">Feed</Link>
                    <Link to="/notifications">Notifications</Link>
                    <Link to="/search">Search</Link>
                    <Link to="/settings">Settings</Link>
                </nav>
            </header>
            <main className="dashboard-content">
                <section className="welcome-section">
                    <h2>Welcome back!</h2>
                    <p>Here’s what’s happening on TooRoo:</p>
                    {/* Include components like Feed, Notifications, etc. */}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
