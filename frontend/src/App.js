import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './actions/authActions';
import './App.css';

// Component Imports
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

const App = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <Navbar onLogout={handleLogout} />
      <div className="App">
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Timeline />} />
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
            </>
          )}
        </Routes>
        {isAuthenticated && <BottomNav />}
      </div>
    </Router>
  );
};

export default App;
