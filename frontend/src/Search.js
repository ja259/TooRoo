import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import Axios

const Search = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/search?query=${query}`);
            console.log('Search results:', response.data);
            navigate('/');  // Navigate or handle search results accordingly
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search"
                    required
                />
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

export default Search;
