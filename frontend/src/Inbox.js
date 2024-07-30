import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPhoneAlt, FaVideo, FaUserLock, FaPaperPlane } from 'react-icons/fa';
import io from 'socket.io-client';
import './Inbox.css';

const socket = io('http://localhost:5000');

const Inbox = ({ user }) => {
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [blockedUsers, setBlockedUsers] = useState(user.blockedUsers || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/conversations', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setConversations(response.data);
            } catch (err) {
                setError('Failed to fetch conversations');
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        if (currentConversation) {
            socket.on('message', (message) => {
                if (message.conversationId === currentConversation._id) {
                    setMessages((prevMessages) => [...prevMessages, message]);
                }
            });

            return () => {
                socket.off('message');
            };
        }
    }, [currentConversation]);

    const handleConversationClick = async (conversation) => {
        setCurrentConversation(conversation);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/messages/${conversation._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(response.data);
        } catch (err) {
            setError('Failed to fetch messages');
        }
    };

    const sendMessage = () => {
        if (newMessage.trim()) {
            const messageData = {
                conversationId: currentConversation._id,
                senderId: user._id,
                content: newMessage,
            };
            socket.emit('message', messageData);
            setNewMessage('');
        }
    };

    const handleBlockUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/block`, { userId }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBlockedUsers([...blockedUsers, userId]);
        } catch (error) {
            console.error('Failed to block user', error);
        }
    };

    const isBlocked = (userId) => {
        return blockedUsers.includes(userId);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="inbox-container">
            <div className="inbox-sidebar">
                <h2>Inbox</h2>
                {conversations.map(conversation => (
                    <div key={conversation._id} className="conversation" onClick={() => handleConversationClick(conversation)}>
                        <img src={conversation.partnerAvatar} alt="Partner" className="partner-avatar" />
                        <h3>{conversation.partnerName}</h3>
                    </div>
                ))}
            </div>
            {currentConversation && (
                <div className="chat-container">
                    <div className="chat-header">
                        <img src={currentConversation.partnerAvatar} alt="Partner" className="partner-avatar" />
                        <h3>{currentConversation.partnerName}</h3>
                        <button disabled={isBlocked(currentConversation.partnerId)}><FaPhoneAlt /></button>
                        <button disabled={isBlocked(currentConversation.partnerId)}><FaVideo /></button>
                        <button onClick={() => handleBlockUser(currentConversation.partnerId)}><FaUserLock /> Block User</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className="chat-message">
                                {msg.content}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button onClick={sendMessage}><FaPaperPlane /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inbox;
