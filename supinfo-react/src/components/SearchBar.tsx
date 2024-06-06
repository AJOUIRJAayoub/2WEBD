// src/components/SearchBar.tsx
import React, { useState } from 'react';
import { useSearchContext } from './SearchContext';
import '../style/SearchBar.css';

const SearchBar: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const { setQuery } = useSearchContext();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setQuery(inputValue);
    };

    return (
        <form onSubmit={handleSearch} className="search-form">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search the Met Museum collection..."
                className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
        </form>
    );
};

export default SearchBar;
