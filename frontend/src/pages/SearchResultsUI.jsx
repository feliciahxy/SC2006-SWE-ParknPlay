import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import Leaflet marker icon
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// Set up a custom icon for the markers
const icon = new L.Icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const SearchResultsUI = ({ results, setSelectedLocation }) => {
    const navigate = useNavigate();

    if (!results || results.length === 0) {
        return <p>No results available.</p>;
    }

    // Set a default center for the map
    const defaultCenter = [results[0].coordinates.lat, results[0].coordinates.lng];

    const handleLocationSelect = (location) => {
        // Set the selected location and navigate to the carpark page
        setSelectedLocation(location);
        navigate('/carparks');
    };

    return (
        <div>
            <h2>Search Results</h2>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>
                        <h3>{result.name}</h3>
                        <p>{result.address}</p>
                        <p>Rating: {result.rating || 'N/A'}</p>
                        <button onClick={() => handleLocationSelect(result.coordinates)}>
                            View Nearby Carparks
                        </button>
                    </li>
                ))}
            </ul>

            <MapContainer center={defaultCenter} zoom={13} style={{ height: '500px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {results.map((result, index) => (
                    <Marker
                        key={index}
                        position={[result.coordinates.lat, result.coordinates.lng]}
                        icon={icon}
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
