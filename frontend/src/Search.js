import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    // Add logic to perform search
    alert(`Searching for: ${query}`);
    navigate('/');
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
