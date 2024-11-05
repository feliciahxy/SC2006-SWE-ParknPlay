import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Sidebar';
import { ACCESS_TOKEN } from '../constants';
import styles from '../styles/SearchResultsUI.module.css';
import logo from "../images/ParkNPlayLogo.png";

import List from '../components/SearchResultsUIComponents/List';
import MapComponent from '../components/SearchResultsUIComponents/MapComponent';

const SearchResultsUI = ({ results, setSelectedLocation, setLocationName }) => {
    const navigate = useNavigate();
    console.log("Results prop:", results);

    if (results.length === 1 && results[0].message === "No results found") {
        return (
            <div className={styles.backgroundContainer}>
                <Header />
                <div style={{ textAlign: 'center', padding: '50px', fontSize: '32px', color: 'red', fontWeight: 'bold' }}>
                    No results found
                </div>
            </div>
        );
    }

    const [openIndex, setOpenIndex] = useState(null);
    const itemRefs = useRef([]);

    const handleMarkerClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
        itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleLocationSelect = (location, name) => {
        setSelectedLocation(location);
        setLocationName(name);
        navigate('/carparks');
    };

    const handleAddToFavourites = async (result) => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            alert('You must be logged in to add to favourites.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/favourites/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    name: result.name,
                    latitude: result.coordinates.lat,
                    longitude: result.coordinates.lng,
                    type: result.type || 'place',
                }),
            });

            if (response.ok) {
                alert(`${result.name} has been added to your favourites!`);
            } else if (response.status === 401) {
                alert('Session expired. Please log in again.');
                navigate('/login');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.detail || 'Could not add to favourites'}`);
            }
        } catch (error) {
            console.error('Error adding to favourites:', error);
            alert('An error occurred while adding to favourites. Please try again.');
        }
    };

    return (
        <div className={styles.backgroundContainer}>
            <Header />
            <div className={styles.searchResultsContainer}>
                <div className={styles.screenFlexContainer}>
                    <div className={styles.screenFlexChild}>
                        <List results={results} itemRefs={itemRefs} handleMarkerClick={handleMarkerClick} handleLocationSelect={handleLocationSelect} handleAddToFavourites={handleAddToFavourites} />
                    </div>

                    <div className={styles.mapContainer}>
                        <MapComponent results={results} handleMarkerClick={handleMarkerClick} openIndex={openIndex} handleLocationSelect={handleLocationSelect} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResultsUI;
