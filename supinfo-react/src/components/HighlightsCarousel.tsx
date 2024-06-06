import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../style/HighlightsCarousel.css';
import NoImageAvailable from '../IMG/No_image_avalaible.png';
import { useNavigate } from 'react-router-dom';

const HighlightsCarousel: React.FC = () => {
    const [highlights, setHighlights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHighlights = async () => {
            try {
                const response = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&q=sunflower');
                if (response.data && response.data.objectIDs) {
                    const resultDetails = await fetchResults(response.data.objectIDs.slice(0, 10));
                    setHighlights(resultDetails);
                }
            } catch (error) {
                console.error('Error fetching highlights:', error);
            } finally {
                setLoading(false);
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

        fetchHighlights();
    }, []);

    if (loading) {
        return <div>Loading highlights...</div>;
    }

    const handleImageClick = (objectID: number) => {
        navigate(`/detail/${objectID}`);
    };

    return (
        <Carousel showThumbs={false} autoPlay interval={3000} infiniteLoop>
            {highlights.map((highlight) => (
                <div key={highlight.objectID} onClick={() => handleImageClick(highlight.objectID)}>
                    <img src={highlight.primaryImage || NoImageAvailable} alt={highlight.title} />
                    <div className="legend">
                        <h3>{highlight.title}</h3>
                        <p>{highlight.artistDisplayName || 'Unknown Artist'}</p>
                    </div>
                </div>
            ))}
        </Carousel>
    );
};

export default HighlightsCarousel;
