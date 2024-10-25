import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
"use client";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import Header from '../components/Sidebar';

import "../styles/ListMapUI.module.css";

const API_KEY = 'AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM';

const CarparkUI = ({ selectedLocation, locationName }) => {
    const location = useLocation();
    const [carparks, setCarparks] = useState([]);
    
    const [openStates, setOpenStates] = useState([]);

    // Use the location state if available
    const locationData = location.state?.selectedLocation || selectedLocation;
    const locationTitle = location.state?.locationName || locationName;

    const handleMarkerClick = (index) => { //when the marker on the google maps is clicked
        const newOpenStates = [...openStates];
        newOpenStates[index] = !newOpenStates[index];
        setOpenStates(newOpenStates);
    };

    useEffect(() => {
        if (locationData) {
            const fetchCarparks = async () => {
                try {
                    // Update the endpoint to match your Django API URL configuration
                    const response = await fetch(`http://127.0.0.1:8000/api/carparks/?latitude=${locationData.lat}&longitude=${locationData.lng}`);
                    if (response.ok) {
                        const data = await response.json();
                        setCarparks(data);
                        setOpenStates(carparks.map(() => false));
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
            <div className="screen-flex-container">
                <div className="screen-flex-child">
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
                </div>
                <div className="screen-flex-child">
                    <APIProvider apiKey = {API_KEY} >
                        <div style={{height: "100vh", width : "100%"}}>
                            <Map zoom = {14} center = {locationData} mapId = '55d3df35a2143bdc'>
                                <AdvancedMarker position={locationData}>
                                    <Pin />
                                    <InfoWindow position={locationData}>
                                        <div>
                                            <strong>{locationTitle}</strong><br />
                                        </div>
                                    </InfoWindow>
                                </AdvancedMarker>

                                {carparks.map((carpark, index) => (
                                        <AdvancedMarker
                                            key={index}
                                            position={{ lat: carpark.location.latitude, lng: carpark.location.longitude}}
                                            onClick = {() => handleMarkerClick(index)}
                                        >
                                            <Pin background={"blue"} glyphColor={"darkblue"} />
                                            {openStates[index] &&
                                            (<InfoWindow position={{ lat: carpark.location.latitude, lng: carpark.location.longitude}}>
                                                <div>
                                                    <strong>{carpark.carpark_name}</strong><br />
                                                    Distance: {carpark.distance.toFixed(2)} meters<br />
                                                    Available Lots: {carpark.available_lots}
                                                </div>
                                            </InfoWindow>)}
                                        </AdvancedMarker>
                                ))}
                            </Map>
                        </div>
                    </APIProvider>
                </div>
            </div>
            {/* <GoogleMapReact
                bootstrapURLKeys = {{
                    key: 'AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM'
                }}    
                defaultCenter = {locationData}
                center = {locationData}
                defaultZoom = {15}
                margin = {[50, 50, 50, 50]}
            >
                <AdvancedMarker position={locationData}>
                    <InfoWindow position={locationData}>
                        <div>
                            <strong>{locationTitle}</strong><br />
                        </div>
                    </InfoWindow>
                </AdvancedMarker>

                {carparks.map((carpark, index) => (
                        <AdvancedMarker
                            key={index}
                            position={carpark.location}
                            onClick = {handleMarkerClick}
                        >
                            <Pin />
                            {open[index] &&
                            <InfoWindow position={carpark.location}>
                                <div>
                                    <strong>{carpark.carpark_name}</strong><br />
                                    Distance: {carpark.distance.toFixed(2)} meters<br />
                                    Available Lots: {carpark.available_lots}
                                </div>
                            </InfoWindow>}
                        </AdvancedMarker>
                ))}
            </GoogleMapReact> */}
        </div>
    );
};

export default CarparkUI;
