import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from './actions/authActions';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

const Logout = ({ onLogout }) => {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    onLogout();
    navigate('/login');
  };

  return (
    <div className="logout-container">
      {confirmLogout ? (
        <div className="logout-confirmation">
          <p>Are you sure you want to logout?</p>
          <button onClick={handleLogout} className="confirm-logout-button">Yes, Logout</button>
          <button onClick={() => setConfirmLogout(false)} className="cancel-logout-button">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setConfirmLogout(true)} className="menu-item logout-button">
          Logout
        </button>
      )}
    </div>
  );
};

export default Logout;
