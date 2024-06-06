import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface SearchContextProps {
    results: any[];
    totalResults: number;
    query: string;
    fetchResults: (query: string, page: number, resultsPerPage: number) => void;
    setQuery: (query: string) => void;
    setResults: (results: any[]) => void;
    setTotalResults: (total: number) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
};

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [results, setResults] = useState<any[]>([]);
    const [totalResults, setTotalResults] = useState(0);
    const [query, setQuery] = useState('');

    const fetchResults = async (query: string, page: number, resultsPerPage: number) => {
        try {
            const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`);
            if (response.data && response.data.objectIDs) {
                const objectIDs = response.data.objectIDs.slice((page - 1) * resultsPerPage, page * resultsPerPage);
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
                setResults(resultDetails.filter(result => result !== null));
                setTotalResults(response.data.total);
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

    return (
        <SearchContext.Provider value={{ results, totalResults, query, fetchResults, setQuery, setResults, setTotalResults }}>
            {children}
        </SearchContext.Provider>
    );
};
