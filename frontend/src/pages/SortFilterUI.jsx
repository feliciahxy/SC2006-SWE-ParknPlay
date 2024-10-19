import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Import the Header component

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
    "Yishun": { lat: 1.4294, lng: 103.8363 }
};

const SortFilterUI = ({ setSearchResults }) => {
    const [selectedTown, setSelectedTown] = useState('');
    const [placeType, setPlacetype] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const navigate = useNavigate();

    const onSearch = async () => {
        // Get the coordinates of the selected town
        const coordinates = townCoordinates[selectedTown];

        // Construct the query string based on user inputs
        const nearbyParams = new URLSearchParams();
        if (coordinates) {
            nearbyParams.append('location', `${coordinates.lat},${coordinates.lng}`);
        }
        nearbyParams.append('radius', '2000'); // Example radius in meters
        if (placeType) nearbyParams.append('type', placeType);
        if (price) nearbyParams.append('keyword', price);
        if (rating) nearbyParams.append('min_rating', rating);

        try {
            // API call to the Django backend to get nearby places
            const nearbyResponse = await fetch(`http://127.0.0.1:8000/nearby_search/?${nearbyParams.toString()}`);
            if (nearbyResponse.ok) {
                const nearbyData = await nearbyResponse.json();
                console.log('Nearby Places:', nearbyData);

                // Save data and navigate to the results page
                setSearchResults(nearbyData);
                navigate('/search-results');
            } else {
                console.error('Error fetching nearby places:', await nearbyResponse.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Header /> {/* Include the Header component */}
            <h2>Search Places</h2>

            <div>
                <label>Town: </label>
                <select onChange={(e) => setSelectedTown(e.target.value)} value={selectedTown}>
                    <option value="">Select Town</option>
                    {Object.keys(townCoordinates).map((town) => (
                        <option key={town} value={town}>{town}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Place Type: </label>
                <select onChange={(e) => setPlacetype(e.target.value)} value={placeType}>
                    <option value="">Select Place Type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="park">Park</option>
                    <option value="museum">Museum</option>
                    <option value="shopping_mall">Shopping Mall</option>
                </select>
            </div>

            <div>
                <label>Price: </label>
                <select onChange={(e) => setPrice(e.target.value)} value={price}>
                    <option value="">Select Price Range</option>
                    <option value="cheap">Cheap</option>
                    <option value="moderate">Moderate</option>
                    <option value="expensive">Expensive</option>
                </select>
            </div>

            <div>
                <label>Minimum Rating: </label>
                <select onChange={(e) => setRating(e.target.value)} value={rating}>
                    <option value="">Select Minimum Rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </select>
            </div>

            <button onClick={onSearch}>Search</button>
        </div>
    );
};

export default SortFilterUI;
