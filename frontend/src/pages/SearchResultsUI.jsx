import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Header from '../components/Header'; // Import the Header component

// Import Leaflet marker icon
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// Set up a custom icon for the markers (default blue icon for search results)
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
            <div>
                <Header />
                <p>No results available.</p>
            </div>
        );
    }

    // Set a default center for the map based on the first result
    const defaultCenter = [results[0].coordinates.lat, results[0].coordinates.lng];

    const handleLocationSelect = (location, name) => {
        // Set the selected location and its name
        setSelectedLocation(location);
        setLocationName(name);
        // Navigate to the carpark page
        navigate('/carparks');
    };

    return (
        <div>
            <Header /> {/* Include the Header component */}
            <h2>Search Results</h2>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>
                        <h3>{result.name}</h3>
                        <p>{result.address}</p>
                        <p>Rating: {result.rating || 'N/A'}</p>
                        <button onClick={() => handleLocationSelect(result.coordinates, result.name)}>
                            View Nearby Carparks
                        </button>
                    </li>
                ))}
            </ul>

            <MapContainer center={defaultCenter} zoom={13} style={{ height: '500px', width: '100%', marginTop: '20px' }}>
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
