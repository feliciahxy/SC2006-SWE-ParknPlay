import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Sidebar';
import styles from '../styles/SortFilterUI.module.css';
import logo from "../images/ParkNPlayLogo.png";

const townCoordinates = {
    "Ang Mo Kio": { lat: 1.3691, lng: 103.8454 },
    "Bedok": { lat: 1.3243, lng: 103.9271 },
    "Bishan": { lat: 1.3521, lng: 103.8491 },
    "Bukit Batok": { lat: 1.3496, lng: 103.7545 },
    "Bukit Merah": { lat: 1.2773, lng: 103.8198 },
    "Bukit Panjang": { lat: 1.3817, lng: 103.7625 },
    "Choa Chu Kang": { lat: 1.3853, lng: 103.7443 },
    "Clementi": { lat: 1.3151, lng: 103.7657 },
    "Geylang": { lat: 1.3189, lng: 103.8920 },
    "Hougang": { lat: 1.3711, lng: 103.8923 },
    "Jurong East": { lat: 1.3335, lng: 103.7414 },
    "Jurong West": { lat: 1.3404, lng: 103.7050 },
    "Kallang": { lat: 1.3083, lng: 103.8664 },
    "Marine Parade": { lat: 1.3015, lng: 103.8992 },
    "Pasir Ris": { lat: 1.3732, lng: 103.9496 },
    "Punggol": { lat: 1.4039, lng: 103.9090 },
    "Queenstown": { lat: 1.2940, lng: 103.8036 },
    "Sembawang": { lat: 1.4492, lng: 103.8184 },
    "Sengkang": { lat: 1.3917, lng: 103.8952 },
    "Serangoon": { lat: 1.3535, lng: 103.8692 },
    "Tampines": { lat: 1.3451, lng: 103.9444 },
    "Toa Payoh": { lat: 1.3347, lng: 103.8570 },
    "Woodlands": { lat: 1.4375, lng: 103.7865 },
    "Yishun": { lat: 1.4294, lng: 103.8363 },
};


const townRadius = {
    "Ang Mo Kio": 1500,
    "Bedok": 2000,
    "Bishan": 1800,
    "Bukit Batok": 1200,
    "Bukit Merah": 2000,
    "Bukit Panjang": 1500,
    "Choa Chu Kang": 2000,
    "Clementi": 1200,
    "Geylang": 2000,
    "Hougang": 1800,
    "Jurong East": 2000,
    "Jurong West": 2000,
    "Kallang": 1600,
    "Marine Parade": 2000,
    "Pasir Ris": 1800,
    "Punggol": 1500,
    "Queenstown": 1600,
    "Sembawang": 1800,
    "Sengkang": 2000,
    "Serangoon": 1600,
    "Tampines": 2000,
    "Toa Payoh": 1400,
    "Woodlands": 2000,
    "Yishun": 1500,
};

const SortFilterUI = ({ setSearchResults }) => {
    const [selectedTown, setSelectedTown] = useState('');
    const [placeType, setPlaceType] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [userLocation, setUserLocation] = useState(null);  
    const [isUsingLocation, setIsUsingLocation] = useState(false);  
    const navigate = useNavigate();

    const onSearch = async () => {
        const coordinates = isUsingLocation ? userLocation : townCoordinates[selectedTown];
        const radius = isUsingLocation ? 2000 : townRadius[selectedTown] || 2000;
        const nearbyParams = new URLSearchParams();
    
        if (coordinates) {
            nearbyParams.append('location', `${coordinates.lat},${coordinates.lng}`);
        }
        nearbyParams.append('radius', `${radius}`);
        if (placeType) nearbyParams.append('type', placeType);
        if (price) nearbyParams.append('keyword', price);
        if (rating) nearbyParams.append('min_rating', rating);
    
        try {
            const nearbyResponse = await fetch(`http://127.0.0.1:8000/api/nearby_search/?${nearbyParams.toString()}`);
            if (nearbyResponse.ok) {
                const nearbyData = await nearbyResponse.json();
                if (nearbyData.length === 0) { 
                    setSearchResults([{ message: "No results found" }]);
                } else {
                    setSearchResults(nearbyData);
                }
                navigate('/search-results');
            } else {
                console.error('Error fetching nearby places:', await nearbyResponse.json());
                setSearchResults([{ message: "No results found" }]);  
                navigate('/search-results');
            }
        } catch (error) {
            console.error('Error:', error);
            setSearchResults([{ message: "No results found" }]);  
            navigate('/search-results');
        }
    };
    

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    setIsUsingLocation(true);
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

    const cancelLocationUsage = () => {
        setIsUsingLocation(false);
        setUserLocation(null);
        setSelectedTown('');  
    };

    return (
        <div className={styles.backgroundContainer}>
            <Header />
            <h2/>
            <div className={styles.searchContainer}>
            <img className={styles.logo} src={logo} alt="Park N Play logo" />
            <div className={styles.filterOne}>
                <div className={styles.townDiv}>
                    <label>Town:</label>
                    <select 
                        onChange={(e) => setSelectedTown(e.target.value)} 
                        value={selectedTown} 
                        disabled={isUsingLocation}  
                        className={styles.input}
                    >
                        <option value="">Select Town</option>
                        {Object.keys(townCoordinates).map((town) => (
                            <option key={town} value={town}>{town}</option>
                        ))}
                    </select>
                </div>

                {!isUsingLocation ? (
                    <button
                        onClick={getUserLocation}
                        className={styles.locationButton}
                    >
                        Use My Location
                    </button>
                ) : (
                    <button
                        onClick={cancelLocationUsage}
                        className={styles.cancelLocation}
                    >
                        Cancel My Location
                    </button>
                )}
            </div>

            {/* Other search filters */}
            <div className={styles.filterTwo}>
                <label>Place Type: </label>
                <select className={styles.input} onChange={(e) => setPlaceType(e.target.value)} value={placeType}>
                    <option value="">Select Place Type: Any</option>
                    <option value="airport">Airport</option>
                    <option value="amusement_park">Amusement Park</option>
                    <option value="aquarium">Aquarium</option>
                    <option value="art_gallery">Art Gallery</option>
                    <option value="bakery">Bakery</option>
                    <option value="bar">Bar</option>
                    <option value="book_store">Book Store</option>
                    <option value="bowling_alley">Bowling Alley</option>
                    <option value="cafe">Cafe</option>
                    <option value="campground">Campground</option>
                    <option value="casino">Casino</option>
                    <option value="cemetery">Cemetery</option>
                    <option value="church">Church</option>
                    <option value="city_hall">City Hall</option>
                    <option value="clothing_store">Clothing Store</option>
                    <option value="convenience_store">Convenience Store</option>
                    <option value="department_store">Department Store</option>
                    <option value="embassy">Embassy</option>
                    <option value="hindu_temple">Hindu Temple</option>
                    <option value="library">Library</option>
                    <option value="mosque">Mosque</option>
                    <option value="movie_theater">Movie Theater</option>
                    <option value="museum">Museum</option>
                    <option value="night_club">Night Club</option>
                    <option value="park">Park</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="shopping_mall">Shopping Mall</option>
                    <option value="spa">Spa</option>
                    <option value="stadium">Stadium</option>
                    <option value="store">Store</option>
                    <option value="supermarket">Supermarket</option>
                    <option value="synagogue">Synagogue</option>
                    <option value="tourist_attraction">Tourist Attraction</option>
                    <option value="university">University</option>
                    <option value="veterinary_care">Veterinary Care</option>
                    <option value="zoo">Zoo</option>
                </select>
            </div>

            <div className={styles.filterThree}>
                <label>Price: </label>
                <select className={styles.input} onChange={(e) => setPrice(e.target.value)} value={price}>
                    <option value="">Select Price Range: Any</option>
                    <option value="cheap">Cheap</option>
                    <option value="moderate">Moderate</option>
                    <option value="expensive">Expensive</option>
                </select>
            </div>

            <div className={styles.filterFour}>
                <label>Minimum Rating: </label>
                <select className={styles.input} onChange={(e) => setRating(e.target.value)} value={rating}>
                    <option value="">Select Minimum Rating: Any</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">Above 4 Stars</option>
                </select>
            </div>

            <button 
                onClick={onSearch}
                className={styles.searchButton}
            >
                Search
            </button>
            </div>
        </div>
    );
};

export default SortFilterUI;
