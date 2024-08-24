import React, { useState } from 'react';
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
import Chat from './Chat';
import Call from './Call';
import Stories from './Stories';
import VideoCall from './VideoCall';
import TwoFactorAuth from './TwoFactorAuth';
import Privacy from './Privacy';
import Language from './Language';
import Settings from './Settings';
import Marketplace from './Marketplace';
import Explore from './Explore';
import UserAnalytics from './UserAnalytics';
import Menu from './Menu';
import TermsAndPolicies from './TermsAndPolicies';
import LocationSharing from './LocationSharing';
import QRCodeScanner from './QRCodeScanner';
import Translation from './Translation';
import Salon from './Salon';
import Wallet from './Wallet';
import AddProfilePicture from './AddProfilePicture';

const App = () => {
    const user = useSelector(state => state.auth.user);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

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
        <div className={darkMode ? 'App dark-mode' : 'App'}>
            <Router>
                {isAuthenticated && <Navbar user={user} onLogout={handleLogout} onMenuToggle={() => setMenuOpen(!menuOpen)} />}
                {isAuthenticated && <Menu user={user} onLogout={handleLogout} menuOpen={menuOpen} />}
                <div className="content">
                    <Routes>
                        {!isAuthenticated ? (
                            <>
                                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                                <Route path="/register" element={<Register onRegister={handleRegister} />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password/:token" element={<ResetPassword />} />
                                <Route path="/terms-and-policies" element={<TermsAndPolicies />} />
                                <Route path="/two-factor-auth" element={<TwoFactorAuth />} />
                                <Route path="/add-profile-picture" element={<AddProfilePicture />} />
                                <Route path="*" element={<Navigate to="/login" />} />
                            </>
                        ) : (
                            <>
                                <Route path="/" element={<Dashboard user={user} />} />
                                <Route path="/profile/:id" element={<Profile />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/live" element={<Live user={user} />} />
                                <Route path="/ar-filters" element={<ARFilters />} />
                                <Route path="/virtual-events" element={<VirtualEvents />} />
                                <Route path="/you-all" element={<YouAll />} />
                                <Route path="/following" element={<Following />} />
                                <Route path="/inbox" element={<Inbox />} />
                                <Route path="/create-video" element={<CreateVideo />} />
                                <Route path="/notifications" element={<Notifications />} />
                                <Route path="/timeline" element={<Timeline />} />
                                <Route path="/chat" element={<Chat />} />
                                <Route path="/call" element={<Call />} />
                                <Route path="/video-call" element={<VideoCall />} />
                                <Route path="/stories" element={<Stories />} />
                                <Route path="/settings" element={<Settings setDarkMode={setDarkMode} />} />
                                <Route path="/privacy" element={<Privacy />} />
                                <Route path="/language" element={<Language />} />
                                <Route path="/marketplace" element={<Marketplace />} />
                                <Route path="/explore" element={<Explore />} />
                                <Route path="/analytics" element={<UserAnalytics />} />
                                <Route path="/location-sharing" element={<LocationSharing />} />
                                <Route path="/qr-code-scanner" element={<QRCodeScanner />} />
                                <Route path="/translation" element={<Translation />} />
                                <Route path="/salon" element={<Salon />} />
                                <Route path="/wallet" element={<Wallet />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </>
                        )}
                    </Routes>
                    {isAuthenticated && <BottomNav />}
                </div>
            </Router>
        </div>
    );
};

export default App;
