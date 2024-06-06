import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Search from './Search';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Navbar from './Navbar';
import Live from './Live';
import ARFilters from './ARFilters';
import VirtualEvents from './VirtualEvents';
import YouAll from './YouAll';
import Following from './Following';
import BottomNav from './BottomNav';
import Inbox from './Inbox';
import CreateVideo from './CreateVideo';
import Notifications from './Notifications';
import Timeline from './Timeline';  // Import Timeline component

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/user/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogin = async (emailOrPhone, password) => {
        try {
            const response = await axios.post('http://localhost:5000/login', { emailOrPhone, password });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
        } catch (error) {
            console.error(error);
            alert('Login failed. Please check your credentials.');
        }
    };

    const handleRegister = async (username, email, password) => {
        try {
            await axios.post('http://localhost:5000/register', { username, email, password });
            handleLogin(email, password);
        } catch (error) {
            console.error(error);
            alert('Registration failed. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            {user && <Navbar user={user} />}
            <div className="App">
                {!user ? (
                    <Routes>
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/register" element={<Register onRegister={handleRegister} />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                ) : (
                    <>
                        <Routes>
                            <Route path="/" element={<Timeline />} />  {/* Set Timeline as the default home page */}
                            <Route path="/profile/:id" element={<Profile />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/live" element={<Live />} />
                            <Route path="/ar-filters" element={<ARFilters />} />
                            <Route path="/virtual-events" element={<VirtualEvents />} />
                            <Route path="/you-all" element={<YouAll />} />
                            <Route path="/following" element={<Following />} />
                            <Route path="/inbox" element={<Inbox />} />
                            <Route path="/create-video" element={<CreateVideo />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                        <BottomNav />
                    </>
                )}
            </div>
        </Router>
    );
};

export default App;

