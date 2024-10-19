import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Header from '../components/Sidebar';

// Import Leaflet marker icon
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// Set up a custom icon for the markers
const searchResultIcon = new L.Icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

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

    // Set a default center for the map based on the first result
    const defaultCenter = [results[0].coordinates.lat, results[0].coordinates.lng];

    const handleLocationSelect = (location, name) => {
        setSelectedLocation(location);
        setLocationName(name);
        navigate('/carparks');
    };

    const handleAddToFavourites = async (result) => {
        const accessToken = localStorage.getItem('access_token'); // Use your defined key for the token

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
                navigate('/'); // Redirect to login page
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
            <h2 style={{ textAlign: 'center' }}>Search Results</h2>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {results.map((result, index) => (
                    <li key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                        <h3>{result.name}</h3>
                        <p>{result.address}</p>
                        <p>Rating: {result.rating || 'N/A'}</p>
                        <button 
                            onClick={() => handleLocationSelect(result.coordinates, result.name)} 
                            style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            View Nearby Carparks
                        </button>
                        <button 
                            onClick={() => handleAddToFavourites(result)} 
                            style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Add to Favourites
                        </button>
                    </li>
                ))}
            </ul>

            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '500px', width: '100%' }} // Map container styling
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {results.map((result, index) => (
                    <Marker
                        key={index}
                        position={[result.coordinates.lat, result.coordinates.lng]}
                        icon={searchResultIcon}
                    >
                        <Popup>
                            <strong>{result.name}</strong><br />
                            {result.address}<br />
                            Rating: {result.rating || 'N/A'}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default SearchResultsUI;
