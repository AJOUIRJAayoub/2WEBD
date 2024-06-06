// src/index.tsx
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SearchProvider } from './components/SearchContext';
import './style/index.css';

const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('./Footer'));
const AdvancedSearch = lazy(() => import('./page/AdvancedSearch'));
const SearchPage = lazy(() => import('./page/SearchPage'));
const SearchContent = lazy(() => import('./components/SearchContent'));
const DetailPage = lazy(() => import('./page/DetailPage'));
const HighlightsCarousel = lazy(() => import('./components/HighlightsCarousel'));
const AboutSection = lazy(() => import('./components/AboutSection'));


const App: React.FC = () => {
    return (
        <Router>
            <SearchProvider>
                <div className="app-container">
                    <Suspense fallback={<div>Loading...</div>}>
                        <Header />
                        <main className="main-content">
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <>
                                            <HighlightsCarousel />
                                            <SearchContent />
                                        </>
                                    }
                                />
                                <Route
                                    path="/advanced-search"
                                    element={
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <AdvancedSearch />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/search"
                                    element={
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <SearchPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/detail/:id"
                                    element={
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <DetailPage />
                                        </Suspense>
                                    }
                                />
                            </Routes>
                        </main>
                        <Suspense fallback={<div>Loading...</div>}>
                            <AboutSection />
                        </Suspense>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Footer />
                        </Suspense>
                    </Suspense>
                </div>
            </SearchProvider>
        </Router>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
