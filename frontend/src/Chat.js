import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FaPaperPlane, FaUserLock, FaVideo, FaPhoneAlt } from 'react-icons/fa';
import './Chat.css';

const socket = io('http://localhost:5000');

const Chat = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [blockedUsers, setBlockedUsers] = useState(user.blockedUsers || []);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('message', message);
            setMessage('');
        }
    };

    const blockUser = (username) => {
        setBlockedUsers([...blockedUsers, username]);
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat</h2>
                <button onClick={() => blockUser('exampleUser')}><FaUserLock /> Block User</button>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        {msg}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}><FaPaperPlane /></button>
            </div>
            <div className="chat-actions">
                <button><FaPhoneAlt /></button>
                <button><FaVideo /></button>
            </div>
        </div>
    );
};

export default Chat;
