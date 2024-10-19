import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Header from '../components/Sidebar';

// Import Leaflet marker icons
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import greenMarkerIconPng from '../images/greenMarkerIconPng.png'; // Update the path accordingly

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
    iconUrl: greenMarkerIconPng, // Use the local green marker icon
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
            <MapContainer center={[selectedLocation.lat, selectedLocation.lng]} zoom={15} style={{ height: '500px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={locationIcon}>
                    <Popup>
                        <strong>{locationName}</strong><br />
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
