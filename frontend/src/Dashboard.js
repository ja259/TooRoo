import React from 'react';
import { Link } from 'react-router-dom';
import Live from './Live'; // Ensure this is the correct path to your Live component
import './Dashboard.css';

const Dashboard = ({ user }) => {
    // Check if user prop is passed and has _id
    if (!user || !user._id) {
        console.error("User is not defined or missing _id in Dashboard component.");
        return <div>User data is missing or incomplete. Please log in again.</div>;
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Welcome to TooRoo, {user.username}!</h1>
                <nav className="dashboard-nav">
                    <Link to="/profile">Profile</Link>
                    <Link to="/feed">Feed</Link>
                    <Link to="/live">Go Live</Link>
                    <Link to="/notifications">Notifications</Link>
                    <Link to="/search">Search</Link>
                    <Link to="/settings">Settings</Link>
                </nav>
            </header>
            <main className="dashboard-content">
                <section className="welcome-section">
                    <h2>Welcome back, {user.username}!</h2>
                    <p>Here’s what’s happening on TooRoo:</p>
                    <div className="dashboard-widgets">
                        <div className="dashboard-widget">
                            <h3>Your Feed</h3>
                            <p>Stay updated with the latest posts from people you follow.</p>
                            <Link to="/feed" className="widget-link">Go to Feed</Link>
                        </div>
                        <div className="dashboard-widget">
                            <h3>Live Stream</h3>
                            <p>Catch up on live streams or start your own.</p>
                            <Live user={user} />
                        </div>
                        <div className="dashboard-widget">
                            <h3>Notifications</h3>
                            <p>Check out your latest notifications.</p>
                            <Link to="/notifications" className="widget-link">View Notifications</Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
