import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
"use client";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import Header from '../components/Sidebar';
import styles from "../styles/CarparkUI.module.css";
import logo from "../images/ParkNPlayLogo.png";

const API_KEY = 'AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM';

const CarparkUI = ({ selectedLocation, locationName }) => {
    const location = useLocation();
    const [carparks, setCarparks] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [isDirectionClicked, setIsDirectionClicked] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [isUsingLocation, setIsUsingLocation] = useState(false);
    const [selectedCarpark, setSelectedCarpark] = useState(null);

    const locationData = location.state?.selectedLocation || selectedLocation;
    const locationTitle = location.state?.locationName || locationName;

    const handleMarkerClick = (index) => {
        if (!isDirectionClicked) {
            setOpenIndex(index === openIndex ? null : index);
            setHighlightedIndex(index);
        }
    };

    const handleLocationMarkerClick = () => {
        setOpenIndex(openIndex === 'main' ? null : 'main');
        setHighlightedIndex(null);
    };

    useEffect(() => {
        if (locationData) {
            const fetchCarparks = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/api/carparks/?latitude=${locationData.lat}&longitude=${locationData.lng}`);
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

    if (!locationData) {
        return (
            <div>
                <Header />
                <p>Please select a location first.</p>
            </div>
        );
    }

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    setIsUsingLocation(true);
                    setIsDirectionClicked(true);
                },
                (error) => {
                    console.error("Error fetching location: ", error);
                    alert("Failed to get location. Please try again.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        if (isDirectionClicked) {
            const timer = setTimeout(() => setIsDirectionClicked(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isDirectionClicked]);

    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.container}>
                <Header />
                <div className={styles.searchResultsContainer}>
                    <div className={styles.screenFlexContainer}>
                        <div className={styles.screenFlexChild}>
                            {carparks.length === 0 ? (
                                <p>No carparks available.</p>
                            ) : (
                                <ul className={styles.listContainer}>
                                    {carparks.map((carpark, index) => (
                                        <li key={index} className={styles.listItems}>
                                            <h4 className={styles.carparkName}
                                                onClick={() => handleMarkerClick(index)}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: highlightedIndex === index ? 'red' : 'blue',
                                                    textDecoration: highlightedIndex === index ? 'none' : 'underline'
                                                }}
                                            >
                                                {carpark.carpark_name}
                                            </h4>
                                            <p>Distance: {carpark.distance.toFixed(2)} meters</p>
                                            <p>Available Lots: {carpark.available_lots}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className={styles.mapContainer}>
                            <APIProvider apiKey={API_KEY}>
                                <div className={styles.mapDisplay}>
                                    <Map defaultZoom={14} defaultCenter={locationData} mapId='55d3df35a2143bdc'>
                                        {/* Main location marker */}
                                        <AdvancedMarker position={locationData} onClick={handleLocationMarkerClick}>
                                            <Pin />
                                            {openIndex === 'main' && (
                                                <InfoWindow position={locationData}>
                                                    <div>
                                                        <strong>{locationTitle}</strong><br />
                                                    </div>
                                                </InfoWindow>
                                            )}
                                        </AdvancedMarker>

                                        {carparks.map((carpark, index) => (
                                            <AdvancedMarker
                                                key={index}
                                                position={{ lat: carpark.location.latitude, lng: carpark.location.longitude }}
                                                onClick={() => {
                                                    handleMarkerClick(index);
                                                    setSelectedCarpark({ lat: carpark.location.latitude, lng: carpark.location.longitude });
                                                }}
                                            >
                                                <Pin background={"blue"} glyphColor={"darkblue"} />
                                                {openIndex === index && (
                                                    <InfoWindow position={{ lat: carpark.location.latitude, lng: carpark.location.longitude }}>
                                                        <div>
                                                            <strong>{carpark.carpark_name}</strong><br />
                                                            Distance: {carpark.distance.toFixed(2)} meters<br />
                                                            Available Lots: {carpark.available_lots}
                                                            <button className={styles.showDirectionButton} onClick={getUserLocation}>Show directions</button>
                                                        </div>
                                                    </InfoWindow>
                                                )}
                                            </AdvancedMarker>
                                        ))}
                                        <div className={styles.alternativeContainer}>
                                            {isUsingLocation && selectedCarpark && (
                                                <Directions
                                                    origin={userLocation}
                                                    destination={selectedCarpark}
                                                />
                                            )}
                                            <p className={styles.placeHolder}>Click on 'Show Directions' for Navigation</p>
                                        </div>
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

export default CarparkUI;

const Directions = ({ origin, destination }) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    useEffect(() => {
        if (routesLibrary && map) {
            const renderer = new routesLibrary.DirectionsRenderer({
                map: map,
            });
            setDirectionsService(new routesLibrary.DirectionsService());
            setDirectionsRenderer(renderer);
        }
    }, [routesLibrary, map]);

    useEffect(() => {
        const fetchDirections = async (attempt = 0) => {
            if (directionsService && directionsRenderer && origin && destination) {
                console.log("Origin:", origin);
                console.log("Destination:", destination);

                directionsService.route(
                    {
                        origin: origin,
                        destination: destination,
                        travelMode: google.maps.TravelMode.DRIVING,
                        provideRouteAlternatives: true,
                    },
                    (result, status) => {
                        if (status === google.maps.DirectionsStatus.OK) {
                            directionsRenderer.setDirections(result);
                            setRoutes(result.routes);
                            console.log("Directions fetched successfully:", result.routes);
                        } else if (status === google.maps.DirectionsStatus.UNKNOWN_ERROR && attempt < 3) {
                            console.warn(`Retry attempt ${attempt + 1} due to UNKNOWN_ERROR`);
                            setTimeout(() => fetchDirections(attempt + 1), 1000);
                        } else {
                            console.error("Error fetching directions:", status);
                        }
                    }
                );
            }
        };

        fetchDirections();
    }, [directionsService, directionsRenderer, origin, destination]);

    useEffect(() => {
        if (directionsRenderer) {
            directionsRenderer.setRouteIndex(routeIndex);
        }
    }, [routeIndex, directionsRenderer]);

    if (!leg) return null;

    return (
        <div>
            <h2 className={styles.summaryTitle}>{selected.summary}</h2>
            <p>{leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}</p>
            <p>Distance: {leg.distance?.text}</p>
            <p>Duration: {leg.duration?.text}</p>
            <h2 className={styles.routesTitle}>All Possible Routes</h2>
            <ul className={styles.routeList}>
                {routes.map((route, index) => (
                    <li key={route.summary}>
                        <button className={styles.routeButton} onClick={() => setRouteIndex(index)}>
                            {route.summary}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
