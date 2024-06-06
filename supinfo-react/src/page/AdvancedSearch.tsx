import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style/AdvancedSearch.css';
import NoImageAvailable from '../IMG/No_image_avalaible.png';

const AdvancedSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [artistOrCulture, setArtistOrCulture] = useState('');
    const [medium, setMedium] = useState('');
    const [geoLocation, setGeoLocation] = useState('');
    const [dateBegin, setDateBegin] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [department, setDepartment] = useState('');
    const [departments, setDepartments] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage] = useState(20);
    const [objectIDs, setObjectIDs] = useState<number[]>([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/departments');
                setDepartments(response.data.departments);
            } catch (error) {
                console.error('Erreur lors de la récupération des départements:', error);
            }
        };

        fetchDepartments();
    }, []);

    useEffect(() => {
        if (objectIDs.length > 0) {
            fetchPaginatedResults();
        }
    }, [currentPage, objectIDs]);

    const fetchResults = async (objectIDs: number[], page: number) => {
        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const paginatedIDs = objectIDs.slice(startIndex, endIndex);

        const resultDetails = await Promise.all(
            paginatedIDs.map(async (id: number) => {
                try {
                    const objectResponse = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
                    return objectResponse.data;
                } catch (error) {
                    console.error(`Erreur lors de la récupération de l'objet ID ${id}:`, error);
                    return null;
                }
            })
        );
        return resultDetails.filter(result => result !== null);
    };

    const fetchPaginatedResults = async () => {
        setLoading(true);
        try {
            const resultDetails = await fetchResults(objectIDs, currentPage);
            setResults(resultDetails);
        } catch (error) {
            console.error('Erreur lors de la récupération des résultats paginés:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        const params: any = {};
        if (query) params.q = query;
        if (artistOrCulture) params.artistOrCulture = artistOrCulture;
        if (medium) params.medium = medium;
        if (geoLocation) params.geoLocation = geoLocation;
        if (dateBegin && dateEnd) {
            params.dateBegin = parseInt(dateBegin);
            params.dateEnd = parseInt(dateEnd);
        }
        if (department) params.departmentId = parseInt(department, 10);

        setLoading(true);
        setResults([]);
        setCurrentPage(1);

        try {
            const response = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search', { params });
            if (response.data && response.data.objectIDs) {
                setObjectIDs(response.data.objectIDs);
                setTotalResults(response.data.total);
                const resultDetails = await fetchResults(response.data.objectIDs, 1);
                setResults(resultDetails);
            } else {
                setResults([]);
                setTotalResults(0);
                setObjectIDs([]);
            }
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            setResults([]);
            setTotalResults(0);
            setObjectIDs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        if (currentPage * resultsPerPage < totalResults) {
            setCurrentPage(prevPage => prevPage + 1);
            window.scrollTo(0, 0); // Scroll to the top of the page
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
            window.scrollTo(0, 0); // Scroll to the top of the page
        }
    };

    return (
        <div className="advanced-search-container">
            <form onSubmit={handleSearch} className="advanced-search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Requête de recherche..."
                    className="advanced-search-input"
                />
                <input
                    type="text"
                    value={artistOrCulture}
                    onChange={(e) => setArtistOrCulture(e.target.value)}
                    placeholder="Artiste ou Culture..."
                    className="advanced-search-input"
                />
                <input
                    type="text"
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    placeholder="Médium..."
                    className="advanced-search-input"
                />
                <input
                    type="text"
                    value={geoLocation}
                    onChange={(e) => setGeoLocation(e.target.value)}
                    placeholder="Localisation géographique..."
                    className="advanced-search-input"
                />
                <input
                    type="text"
                    value={dateBegin}
                    onChange={(e) => setDateBegin(e.target.value)}
                    placeholder="Date de début (AAAA)..."
                    className="advanced-search-input"
                />
                <input
                    type="text"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    placeholder="Date de fin (AAAA)..."
                    className="advanced-search-input"
                />
                <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="advanced-search-select"
                >
                    <option value="">Sélectionner un département</option>
                    {departments.map(dept => (
                        <option key={dept.departmentId} value={dept.departmentId.toString()}>
                            {dept.displayName}
                        </option>
                    ))}
                </select>
                <button type="submit" className="advanced-search-button">Rechercher</button>
            </form>
            {loading && <div className="loading">Chargement...</div>}
            <div className="results-info">Total des résultats : {totalResults}</div>
            <div className="search-results">
                {results.map((result) => (
                    <div key={result.objectID} className="search-result-item">
                        <Link to={`/detail/${result.objectID}`}>
                            <h3>{result.title}</h3>
                            <img
                                src={result.primaryImageSmall || NoImageAvailable}
                                alt={result.title}
                                className="result-image"
                                onError={(e) => { (e.target as HTMLImageElement).src = NoImageAvailable; }}
                            />
                        </Link>
                        <p><strong>Artiste :</strong> {result.artistDisplayName || 'Inconnu'}</p>
                        <p><strong>Date :</strong> {result.objectDate || 'N/A'}</p>
                    </div>
                ))}
            </div>
            {totalResults > resultsPerPage && (
                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>Précédent</button>
                    <button onClick={handleNextPage} disabled={currentPage * resultsPerPage >= totalResults}>Suivant</button>
                </div>
            )}
        </div>
    );
};

export default AdvancedSearch;
