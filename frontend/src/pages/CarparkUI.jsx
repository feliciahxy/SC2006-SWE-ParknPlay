import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Sidebar';
import styles from "../styles/CarparkUI.module.css";
import logo from "../images/ParkNPlayLogo.png";

import List from '../components/CarparkUIComponents/List';
import MapComponent from '../components/CarparkUIComponents/MapComponent';

const CarparkUI = ({ selectedLocation, locationName }) => {
    const location = useLocation();
    const [carparks, setCarparks] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [isDirectionClicked, setIsDirectionClicked] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [isUsingLocation, setIsUsingLocation] = useState(false);
    const [selectedCarpark, setSelectedCarpark] = useState(null);
    const [showRoute, setShowRoute] = useState(false);

    const locationData = location.state?.selectedLocation || selectedLocation;
    const locationTitle = location.state?.locationName || locationName;

    const handleMarkerClick = (index) => {
        if (!isDirectionClicked) {
            setOpenIndex(index === openIndex ? null : index);
            setHighlightedIndex(index); // Highlight the selected carpark
            setSelectedCarpark({
                lat: carparks[index].location.latitude,
                lng: carparks[index].location.longitude
            });
            setShowRoute(false); // Reset route rendering on new selection
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

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    setIsUsingLocation(true);
                    setIsDirectionClicked(true);
                    setShowRoute(true); // Enable route rendering
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

    if (!locationData) {
        return (
            <div>
                <Header />
                <p>Please select a location first.</p>
            </div>
        );
    }

    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.container}>
                <Header />
                <div className={styles.searchResultsContainer}>
                    <div className={styles.screenFlexContainer}>
                        <div className={styles.screenFlexChild}>
                            <List carparks={carparks} highlightedIndex={highlightedIndex} />
                        </div>
                        <div className={styles.mapContainer}>
                            <MapComponent locationData={locationData} handleLocationMarkerClick={handleLocationMarkerClick} openIndex={openIndex} locationTitle={locationTitle} carparks={carparks} handleMarkerClick={handleMarkerClick} getUserLocation={getUserLocation} isUsingLocation={isUsingLocation} selectedCarpark={selectedCarpark} showRoute={showRoute} userLocation={userLocation} selectedCarpark={selectedCarpark} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarparkUI;
