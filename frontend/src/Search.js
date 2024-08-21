import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ users: [], posts: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Please enter a search query.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`http://localhost:5000/api/search`, {
                params: { query }
            });
            if (response.data) {
                setResults(response.data);
            } else {
                setError('No results found.');
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('No results found for your query.');
            } else {
                setError('Error fetching search results. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setQuery(e.target.value);
        setError('');  // Clear error when user starts typing
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="text"
                    placeholder="Search for users or posts..."
                    value={query}
                    onChange={handleChange}
                    className="search-input"
                />
                <button type="submit" className="search-button">Search</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <div className="search-results">
                {results.users.length > 0 && (
                    <div className="search-users">
                        <h3>Users</h3>
                        <ul>
                            {results.users.map((user) => (
                                <li key={user._id}>
                                    <img src={user.avatar} alt={user.username} className="avatar" />
                                    <span>{user.username}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {results.posts.length > 0 && (
                    <div className="search-posts">
                        <h3>Posts</h3>
                        <ul>
                            {results.posts.map((post) => (
                                <li key={post._id}>
                                    <div className="post-author">
                                        <img src={post.author.avatar} alt={post.author.username} className="avatar" />
                                        <span>{post.author.username}</span>
                                    </div>
                                    <div className="post-content">{post.content}</div>
                                    {post.videoUrl && <video src={post.videoUrl} controls className="post-video"></video>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {results.users.length === 0 && results.posts.length === 0 && !loading && !error && (
                    <p>No results found.</p>
                )}
            </div>
        </div>
    );
};

export default Search;
