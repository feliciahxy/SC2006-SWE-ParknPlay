import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Header from '../components/Sidebar';

// Import custom marker icons if needed
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import greenMarkerIconPng from '../images/greenMarkerIconPng.png'; // Update the path accordingly

// Set up icons
const carparkIcon = new L.Icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const locationIcon = new L.Icon({
    iconUrl: greenMarkerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const CarparkUI = ({ selectedLocation, locationName }) => {
    const location = useLocation();
    const [carparks, setCarparks] = useState([]);
    
    // Use the location state if available
    const locationData = location.state?.selectedLocation || selectedLocation;
    const locationTitle = location.state?.locationName || locationName;

    useEffect(() => {
        if (locationData) {
            const fetchCarparks = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/find_nearest_carparks/?latitude=${locationData.lat}&longitude=${locationData.lng}`);
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
    }, [locationData]);

    // Check if location data is missing
    if (!locationData) {
        return (
            <div>
                <Header />
                <p>Please select a location first.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <Header />
            <h2 style={{ textAlign: 'center' }}>Nearby Carparks</h2>
            {carparks.length === 0 ? (
                <p>No carparks available.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                    {carparks.map((carpark, index) => (
                        <li key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                            <h4>{carpark.carpark_name}</h4>
                            <p>Distance: {carpark.distance.toFixed(2)} meters</p>
                            <p>Available Lots: {carpark.available_lots}</p>
                        </li>
                    ))}
                </ul>
            )}
            <MapContainer
                center={[locationData.lat, locationData.lng]}
                zoom={15}
                style={{ height: '500px', width: '100%' }}
                whenCreated={(map) => map.invalidateSize()} // Ensure the map resizes correctly
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[locationData.lat, locationData.lng]} icon={locationIcon}>
                    <Popup>
                        <strong>{locationTitle}</strong><br />
                    </Popup>
                </Marker>
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
