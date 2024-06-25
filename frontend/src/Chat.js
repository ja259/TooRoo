import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FaPaperPlane } from 'react-icons/fa';
import './Chat.css';

const socket = io('http://localhost:5000');

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

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

    return (
        <div className="chat">
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
        </div>
    );
};

export default Chat;
