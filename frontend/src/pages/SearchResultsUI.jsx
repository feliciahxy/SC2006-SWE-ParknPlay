import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import Header from '../components/Sidebar';
import { ACCESS_TOKEN } from '../constants';
import styles from '../styles/SearchResultsUI.module.css';
import logo from "../images/ParkNPlayLogo.png";

const API_KEY = 'AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM';

const SearchResultsUI = ({ results, setSelectedLocation, setLocationName }) => {
    const navigate = useNavigate();
    console.log("Results prop:", results); // Add this line to check the data
    if (results.length === 1 && results[0].message === "No results found") {
        return (
            <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
                No results found
            </div>
        );
    }

    const [openIndex, setOpenIndex] = useState(null);
    
    const handleMarkerClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const defaultCenter = results[0]?.coordinates || { lat: 0, lng: 0 };

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
            <img className={styles.logo} src={logo} alt="Park N Play logo" />
            <div className={styles.container}>
                <div className={styles.searchResultsContainer}>
                    <Header />
                    <div className={styles.screenFlexContainer}>
                        <div className={styles.screenFlexChild}>
                            <h2></h2>
                            <ul className={styles.listContainer}>
                                {results.map((result, index) => (
                                    <li 
                                        key={index} 
                                        className={styles.listItems}
                                    >
                                        {result?.photo ? (
                                            <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photo}&key=${API_KEY}`} alt="image cannot be displayed"></img>
                                        ) : (
                                            <div>Image not available</div>
                                        )}
                                        <h3>{result.name}</h3>
                                        <p>{result.address}</p>
                                        <p>Rating: {result.rating || 'N/A'}</p>
                                        <button 
                                            onClick={() => handleLocationSelect(result.coordinates, result.name)} 
                                            className={styles.nearbyCarparksButton}
                                        >
                                            View Nearby Carparks
                                        </button>
                                        <button 
                                            onClick={() => handleAddToFavourites(result)} 
                                            className={styles.favouritesButton}
                                        >
                                            Add to Favourites
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.mapContainer}>
                            <APIProvider apiKey={API_KEY}>
                                <div style={{ height: "100vh", width: "100%" }}>
                                    <Map
                                        defaultZoom={13}
                                        defaultCenter={defaultCenter}
                                        mapId='55d3df35a2143bdc'
                                    >
                                        {results.map((result, index) => (
                                            <AdvancedMarker
                                                key={index}
                                                position={result.coordinates}
                                                onClick={() => handleMarkerClick(index)}
                                            >
                                                <Pin />
                                                {openIndex === index &&
                                                (<InfoWindow position={result.coordinates}>
                                                    <div>
                                                        <strong>{result.name}</strong><br />
                                                        {result.address}<br />
                                                        Rating: {result.rating || 'N/A'}
                                                        <br />
                                                        <button 
                                                            onClick={() => handleLocationSelect(result.coordinates, result.name)} 
                                                            style={{ 
                                                                marginTop: '10px', 
                                                                padding: '5px 10px', 
                                                                backgroundColor: '#28a745', 
                                                                color: 'white', 
                                                                border: 'none', 
                                                                borderRadius: '5px', 
                                                                cursor: 'pointer' 
                                                            }}
                                                        >
                                                            View Carparks
                                                        </button>
                                                    </div>
                                                </InfoWindow>)}
                                            </AdvancedMarker>
                                        ))}
                                    </Map>
                                </div>
                            </APIProvider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResultsUI;
