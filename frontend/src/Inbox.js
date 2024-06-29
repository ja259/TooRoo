import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPhoneAlt, FaVideo } from 'react-icons/fa';
import './Inbox.css';

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/messages', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setMessages(response.data);
            } catch (err) {
                setError('Failed to fetch messages');
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Inbox</h2>
            {messages.map(message => (
                <div key={message._id}>
                    <h3>{message.senderName}</h3>
                    <p>{message.content}</p>
                    <div className="message-actions">
                        <button><FaPhoneAlt /></button>
                        <button><FaVideo /></button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Inbox;
