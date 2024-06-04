import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(response.data);
        };
        fetchNotifications();
    }, []);

    return (
        <div>
            <h2>Notifications</h2>
            {notifications.map(notification => (
                <div key={notification.id}>
                    <p>{notification.message}</p>
                </div>
            ))}
        </div>
    );
};

export default Notifications;
