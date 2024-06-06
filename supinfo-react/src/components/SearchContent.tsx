// src/components/SearchContent.tsx
import React, { useState, useEffect } from 'react';
import { useSearchContext } from './SearchContext';
import { Link } from 'react-router-dom';
import '../style/SearchContent.css';
import NoImageAvailable from '../IMG/No_image_avalaible.png';

const SearchContent: React.FC = () => {
    const { results, totalResults, query, fetchResults } = useSearchContext();
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 20;

    useEffect(() => {
        if (query) {
            fetchResults(query, currentPage, resultsPerPage);
        }
    }, [query, currentPage, fetchResults]);

    const handleNext = () => {
        if (currentPage < Math.ceil(totalResults / resultsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="search-content">
            {totalResults > 0 && (
                <div className="results-info">Found {totalResults} results</div>
            )}
            <div className="search-results">
                {results.map((result) => (
                    <div key={result.objectID} className="search-result-item">
                        <h3>{result.title}</h3>
                        <Link to={`/detail/${result.objectID}`}>
                            <img
                                src={result.primaryImage || NoImageAvailable}
                                alt={result.title}
                                className="result-image"
                                onError={(e) => { (e.target as HTMLImageElement).src = NoImageAvailable; }}
                            />
                        </Link>
                        <p><strong>Artist:</strong> {result.artistDisplayName || 'Unknown'}</p>
                        <p><strong>Date:</strong> {result.objectDate || 'N/A'}</p>
                        <p><strong>Medium:</strong> {result.medium || 'N/A'}</p>
                        <p><strong>Dimensions:</strong> {result.dimensions || 'N/A'}</p>
                        <p><strong>Department:</strong> {result.department || 'N/A'}</p>
                        <p><strong>Accession Number:</strong> {result.accessionNumber || 'N/A'}</p>
                    </div>
                ))}
            </div>
            {totalResults > resultsPerPage && (
                <div className="pagination">
                    <button
                        onClick={handlePrev}
                        className="pagination-button"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className="pagination-button"
                        disabled={currentPage === Math.ceil(totalResults / resultsPerPage)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchContent;
