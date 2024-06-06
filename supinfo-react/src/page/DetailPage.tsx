// src/components/DetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../style/DetailPage.css';

interface Detail {
    objectID: number;
    title: string;
    artistDisplayName: string;
    objectDate: string;
    medium: string;
    dimensions: string;
    department: string;
    accessionNumber: string;
    primaryImage: string;
    additionalImages: string[];
    artistDisplayBio: string;
    artistNationality: string;
    artistBeginDate: string;
    artistEndDate: string;
    objectName: string;
    culture: string;
    period: string;
    dynasty: string;
    reign: string;
    portfolio: string;
    objectWikidata_URL: string;
    objectURL: string;
    tags: Array<{ term: string }>;
    [key: string]: any; // Include other fields as needed
}

const DetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [detail, setDetail] = useState<Detail | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
                setDetail(response.data);
            } catch (error) {
                console.error('Error fetching detail:', error);
            }
        };

        fetchDetail();
    }, [id]);

    if (!detail) {
        return <div>Loading...</div>;
    }

    return (
        <div className="detail-page">
            <h2>{detail.title}</h2>
            <img src={detail.primaryImage} alt={detail.title} className="detail-image" />
            <div className="detail-info">
                <p><strong>Artist:</strong> {detail.artistDisplayName || 'Unknown'}</p>
                <p><strong>Bio:</strong> {detail.artistDisplayBio || 'N/A'}</p>
                <p><strong>Nationality:</strong> {detail.artistNationality || 'N/A'}</p>
                <p><strong>Birth - Death:</strong> {detail.artistBeginDate} - {detail.artistEndDate}</p>
                <p><strong>Date:</strong> {detail.objectDate || 'N/A'}</p>
                <p><strong>Medium:</strong> {detail.medium || 'N/A'}</p>
                <p><strong>Dimensions:</strong> {detail.dimensions || 'N/A'}</p>
                <p><strong>Department:</strong> {detail.department || 'N/A'}</p>
                <p><strong>Accession Number:</strong> {detail.accessionNumber || 'N/A'}</p>
                <p><strong>Object Name:</strong> {detail.objectName || 'N/A'}</p>
                <p><strong>Culture:</strong> {detail.culture || 'N/A'}</p>
                <p><strong>Period:</strong> {detail.period || 'N/A'}</p>
                <p><strong>Dynasty:</strong> {detail.dynasty || 'N/A'}</p>
                <p><strong>Reign:</strong> {detail.reign || 'N/A'}</p>
                <p><strong>Portfolio:</strong> {detail.portfolio || 'N/A'}</p>
                <p><strong>More Information:</strong> <a href={detail.objectURL} target="_blank" rel="noopener noreferrer">Link to the Met Museum</a></p>
                <p><strong>Wikidata:</strong> <a href={detail.objectWikidata_URL} target="_blank" rel="noopener noreferrer">Link to Wikidata</a></p>
                <p><strong>Tags:</strong> {detail.tags.map(tag => tag.term).join(', ')}</p>
            </div>
            <div className="additional-images">
                {detail.additionalImages.map((image, index) => (
                    <img key={index} src={image} alt={`${detail.title} - additional view`} className="additional-image" />
                ))}
            </div>
        </div>
    );
};

export default DetailPage;
