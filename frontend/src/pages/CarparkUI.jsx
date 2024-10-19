import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Header from '../components/Header'; // Import the Header component

// Import Leaflet marker icons
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// Set up a custom icon for carparks (default blue icon)
const carparkIcon = new L.Icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Set up a custom icon for the selected location (green marker for better visibility)
const locationIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-green.png', // Green marker
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const CarparkUI = ({ selectedLocation, locationName }) => {
    const [carparks, setCarparks] = useState([]);

    useEffect(() => {
        if (selectedLocation) {
            const fetchCarparks = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/find_nearest_carparks/?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lng}`);
                    if (response.ok) {
                        const data = await response.json();
                        setCarparks(data);
                    } else {
                        console.error('Error fetching carparks:', await response.json());
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            };
            fetchCarparks();
        }
    }, [selectedLocation]);

    if (!selectedLocation) {
        return (
            <div>
                <Header /> {/* Include the Header component */}
                <p>Please select a location first.</p>
            </div>
        );
    }

    return (
        <div>
            <Header /> {/* Include the Header component */}
            <h2>Nearby Carparks</h2>
            {/* Display the list of carparks above the map */}
            {carparks.length === 0 ? (
                <p>No carparks available.</p>
            ) : (
                <ul>
                    {carparks.map((carpark, index) => (
                        <li key={index}>
                            <h4>{carpark.carpark_name}</h4>
                            <p>Distance: {carpark.distance.toFixed(2)} meters</p>
                            <p>Available Lots: {carpark.available_lots}</p>
                        </li>
                    ))}
                </ul>
            )}
            {/* Map is displayed below the list of carparks */}
            <MapContainer center={[selectedLocation.lat, selectedLocation.lng]} zoom={15} style={{ height: '500px', width: '100%', marginTop: '20px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* Marker for the selected location with a green marker */}
                <Marker
                    position={[selectedLocation.lat, selectedLocation.lng]}
                    icon={locationIcon}
                >
                    <Popup>
                        <strong>{locationName}</strong><br />
                    </Popup>
                </Marker>
                {/* Markers for nearby carparks */}
                {carparks.map((carpark, index) => (
                    <Marker
                        key={index}
                        position={[carpark.location.latitude, carpark.location.longitude]}
                        icon={carparkIcon}
                    >
                        <Popup>
                            <strong>{carpark.carpark_name}</strong><br />
                            Distance: {carpark.distance.toFixed(2)} meters<br />
                            Available Lots: {carpark.available_lots}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default CarparkUI;
