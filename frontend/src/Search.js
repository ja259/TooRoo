import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      // Add logic to perform search
      const response = await axios.get('http://localhost:5000/search', { params: { query } });
      console.log(response.data); // Display search results
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Search failed. Please try again.');
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
