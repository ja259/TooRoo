import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inbox = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/messages', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(response.data);
        };
        fetchMessages();
    }, []);

    return (
        <div>
            <h2>Inbox</h2>
            {messages.map(message => (
                <div key={message.id}>
                    <h3>{message.senderName}</h3>
                    <p>{message.content}</p>
                </div>
            ))}
        </div>
    );
};

export default Inbox;
