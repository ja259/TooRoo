import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Login from './Login';
import Register from './Register';
import Feed from './Feed';
import Profile from './Profile';
import Search from './Search';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Navbar from './Navbar';
import logo from './logo.png';

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/user/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogin = async (emailOrPhone, password) => {
        try {
            const response = await axios.post('http://localhost:5000/login', { emailOrPhone, password });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
        } catch (error) {
            console.error(error);
            alert('Login failed. Please check your credentials.');
        }
    };

    const handleRegister = async (username, email, password) => {
        try {
            await axios.post('http://localhost:5000/register', { username, email, password });
            handleLogin(email, password);
        } catch (error) {
            console.error(error);
            alert('Registration failed. Please try again.');
        }
    };

    const handlePost = async (content, videoUrl) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:5000/post', { content, authorId: user._id, videoUrl }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser({ ...user, posts: [response.data, ...user.posts] });
        } catch (error) {
            console.error(error);
            alert('Failed to create post. Please try again.');
        }
    };

    const handleLike = async (postId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`http://localhost:5000/post/${postId}/like`, { userId: user._id }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const updatedPosts = user.posts.map(post => post._id === postId ? response.data : post);
            setUser({ ...user, posts: updatedPosts });
        } catch (error) {
            console.error(error);
            alert('Failed to like post. Please try again.');
        }
    };

    const handleComment = async (postId, content) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`http://localhost:5000/post/${postId}/comment`, { userId: user._id, content }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const updatedPosts = user.posts.map(post => post._id === postId ? response.data : post);
            setUser({ ...user, posts: updatedPosts });
        } catch (error) {
            console.error(error);
            alert('Failed to comment. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className="App">
                <Navbar user={user} />
                {!user ? (
                    <Routes>
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/register" element={<Register onRegister={handleRegister} />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                ) : (
                    <Routes>
                        <Route path="/" element={<Feed user={user} onPost={handlePost} onLike={handleLike} onComment={handleComment} />} />
                        <Route path="/profile/:id" element={<Profile />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                )}
            </div>
        </Router>
    );
};

export default App;
