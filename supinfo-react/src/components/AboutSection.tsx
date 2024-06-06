import React from 'react';
import '../style/AboutSection.css';

const AboutSection: React.FC = () => {
    return (
        <section className="about-section">
            <h2>About the Museum</h2>
            <p>
                The Metropolitan Museum of Art presents over 5,000 years of art from around the world for everyone to experience and enjoy. The Museum lives in two iconic sites in New York City—The Met Fifth Avenue and The Met Cloisters. Millions of people also take part in The Met experience online.
            </p>
            <p>
                Since it was founded in 1870, The Met has always aspired to be more than a treasury of rare and beautiful objects. Every day, art comes alive in the Museum’s galleries and through its exhibitions and events, revealing both new ideas and unexpected connections across time and across cultures.
            </p>
        </section>
    );
};

export default AboutSection;
