import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSearchContext } from './SearchContext';
import '../style/NavBar.css';
import Logo from '../IMG/Logo-Met-Museum.png';

const NavBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const { setResults, setTotalResults } = useSearchContext();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() === '') return;

        try {
            const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`);
            if (response.data && response.data.objectIDs) {
                setTotalResults(response.data.objectIDs.length);
                const resultDetails = await fetchResults(response.data.objectIDs.slice(0, 20));
                setResults(resultDetails);
            } else {
                setResults([]);
                setTotalResults(0);
            }
        } catch (error) {
            console.error('Error searching the API:', error);
            setResults([]);
            setTotalResults(0);
        }
    };

    const fetchResults = async (objectIDs: number[]) => {
        const resultDetails = await Promise.all(
            objectIDs.map(async (id: number) => {
                try {
                    const objectResponse = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
                    return objectResponse.data;
                } catch (error) {
                    console.error(`Error fetching object ID ${id}:`, error);
                    return null;
                }
            })
        );
        return resultDetails.filter(result => result !== null);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src={Logo} alt="Met Museum Logo" className="navbar-logo-img" />
                </Link>
                <div className="navbar-search">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search the Met Museum collection..."
                            className="search-input"
                        />
                        <button type="submit" className="search-button">Search</button>
                    </form>
                </div>
                <div className="navbar-links-container">
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <Link to="/" className="nav-links">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/about" className="nav-links">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/contact" className="nav-links">Contact</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/advanced-search" className="nav-links">Advanced Search</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
