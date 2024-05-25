import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ users: [], posts: [] });

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/search?query=${query}`);
            setResults(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
                <button type="submit">Search</button>
            </form>
            <div>
                <h3>Users</h3>
                {results.users.map(user => (
                    <div key={user._id}>
                        <p>{user.username}</p>
                    </div>
                ))}
            </div>
            <div>
                <h3>Posts</h3>
                {results.posts.map(post => (
                    <div key={post._id}>
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;
