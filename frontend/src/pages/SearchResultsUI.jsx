import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import Header from '../components/Sidebar';
import { ACCESS_TOKEN } from '../constants';

import "../styles/ListMapUI.module.css";

const API_KEY = 'AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM';

const SearchResultsUI = ({ results, setSelectedLocation, setLocationName }) => {
    const navigate = useNavigate();

    if (!results || results.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Header />
                <p>No results available.</p>
            </div>
        );
    }

    const [openStates, setOpenStates] = useState(results.map(() => false));

    const handleMarkerClick = (index) => { //when the marker on the google maps is clicked
        const newOpenStates = [...openStates];
        newOpenStates[index] = !newOpenStates[index];
        setOpenStates(newOpenStates);
    }

    // Set a default center for the map based on the first result
    const defaultCenter = {
        lat: results[0].coordinates.lat, 
        lng: results[0].coordinates.lng
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
                navigate('/login'); // Navigate to login page
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
        <div style={{ padding: '20px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <Header />
            <div className="screen-flex-container">
                <div className="screen-flex-child">
                    <h2 style={{ textAlign: 'center' }}>Search Results</h2>
                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                        {results.map((result, index) => (
                            <li 
                                key={index} 
                                style={{ 
                                    marginBottom: '15px', 
                                    borderBottom: '1px solid #ccc', 
                                    paddingBottom: '10px' 
                                }}
                            >
                                {result?.photo? (
                                    <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photo}&key=${API_KEY}`} alt="image cannot be displayed"></img>
                                ) : (
                                    <div>image not available</div>
                                )}
                                <h3>{result.name}</h3>
                                <p>{result.address}</p>
                                <p>Rating: {result.rating || 'N/A'}</p>
                                <button 
                                    onClick={() => handleLocationSelect(result.coordinates, result.name)} 
                                    style={{ 
                                        marginRight: '10px', 
                                        padding: '5px 10px', 
                                        backgroundColor: '#28a745', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '5px', 
                                        cursor: 'pointer' 
                                    }}
                                >
                                    View Nearby Carparks
                                </button>
                                <button 
                                    onClick={() => handleAddToFavourites(result)} 
                                    style={{ 
                                        padding: '5px 10px', 
                                        backgroundColor: '#007bff', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '5px', 
                                        cursor: 'pointer' 
                                    }}
                                >
                                    Add to Favourites
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="screen-flex-child">
                    <APIProvider apiKey = {API_KEY}>
                        <div style = {{height: "100vh", width : "100%"}}>
                            <Map
                                zoom = {13}
                                center = {defaultCenter}
                                mapId = '55d3df35a2143bdc'
                            >
                                {results.map((result, index) => (
                                    <AdvancedMarker
                                        key={index}
                                        position={result.coordinates}
                                        onClick={() => handleMarkerClick(index)}
                                    >
                                        <Pin />
                                        {openStates[index] &&
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
    );
};

export default SearchResultsUI;
