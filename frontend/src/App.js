import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, register } from './actions/authActions';
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
import Timeline from './Timeline';
import Dashboard from './Dashboard';

const App = () => {
    const user = useSelector(state => state.auth.user);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    const handleLogin = (emailOrPhone, password) => {
        dispatch(login({ emailOrPhone, password }));
    };

    const handleRegister = (username, email, password) => {
        dispatch(register({ username, email, password }));
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <Router>
            <Navbar user={user} onLogout={handleLogout} />
            <div className="App">
                <Routes>
                    {!isAuthenticated ? (
                        <>
                            <Route path="/login" element={<Login onLogin={handleLogin} />} />
                            <Route path="/register" element={<Register onRegister={handleRegister} />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password/:token" element={<ResetPassword />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<Dashboard />} />
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
                            <Route path="/timeline" element={<Timeline />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    )}
                </Routes>
                {isAuthenticated && <BottomNav />}
            </div>
        </Router>
    );
};

export default App;
