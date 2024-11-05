import { useState, useEffect } from 'react';
"use client";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import styles from "../../styles/CarparkUI.module.css";

const API_KEY = 'AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM';

const MapComponent = ({ locationData, handleLocationMarkerClick, openIndex, locationTitle, carparks, handleMarkerClick, getUserLocation, isUsingLocation, selectedCarpark, showRoute, userLocation }) => {
    return(
        <>
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
                            {isUsingLocation && selectedCarpark && showRoute ? (
                                <Directions
                                    origin={userLocation}
                                    destination={selectedCarpark}
                                />
                            ) : (
                                <p className={styles.placeHolder}>Click on 'Show Directions' for Navigation</p>
                            )}
                        </div>
                    </Map>
                </div>
            </APIProvider>
        </>
    )
}

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

            return () => {
                renderer.setMap(null); // Clean up on component unmount
            };
        }
    }, [routesLibrary, map]);

    useEffect(() => {
        const fetchDirections = async (attempt = 0) => {
            if (directionsService && directionsRenderer && origin && destination) {
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
                        } else if (status === google.maps.DirectionsStatus.UNKNOWN_ERROR && attempt < 3) {
                            setTimeout(() => fetchDirections(attempt + 1), 1000);
                        } else {
                            console.error("Error fetching directions:", status);
                        }
                    }
                );
            }
        };

        if (origin && destination) {
            fetchDirections();
        }
    }, [directionsService, directionsRenderer, origin, destination]);

    useEffect(() => {
        if (directionsRenderer && routes.length > 0) {
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

export default MapComponent
