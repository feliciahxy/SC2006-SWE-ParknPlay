import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ACCESS_TOKEN } from '../constants';
import api from '../api';
import Header from '../components/Sidebar'; // Import the Header component

const FavouritesUI = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [favourites, setFavourites] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFavourites = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN); // Retrieve the access token

            if (!token) {
                setError("You must be logged in to view favourites."); // Handle case when token is not available
                return;
            }

            try {
                const response = await api.get('/api/favourites/', {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Correctly format the Authorization header
                    },
                });

                if (response.status === 200) {
                    setFavourites(response.data); // Store favourites in state
                } else {
                    setError("Failed to fetch favourites.");
                }
            } catch (error) {
                console.error('Error fetching favourites:', error);
                if (error.response && error.response.status === 401) {
                    setError("Session expired. Please log in again."); // Handle unauthorized access
                    localStorage.clear(); // Clear local storage on unauthorized access
                } else {
                    setError("An error occurred while fetching favourites.");
                }
            }
        };

        fetchFavourites(); // Call the function to fetch favourites when component mounts
    }, []); // Empty dependency array means this effect runs once on mount

    const handleDelete = async (id) => {
        const token = localStorage.getItem(ACCESS_TOKEN); // Retrieve the access token
        if (!token) {
            setError("You must be logged in to delete favourites.");
            return;
        }

        try {
            const response = await api.delete(`/api/favourites/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the access token
                },
            });

            if (response.status === 204) {
                setFavourites(favourites.filter(fav => fav.id !== id)); // Remove the deleted favourite from state
                setError(""); // Clear any previous errors
            } else {
                setError("Failed to delete favourite.");
            }
        } catch (error) {
            console.error('Error deleting favourite:', error);
            if (error.response && error.response.status === 401) {
                setError("Session expired. Please log in again.");
                localStorage.clear();
            } else {
                setError("An error occurred while deleting the favourite.");
            }
        }
    };

    const handleViewCarparks = (fav) => {
        navigate('/carparks', { state: { selectedLocation: { lat: fav.latitude, lng: fav.longitude }, locationName: fav.name } });
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <Header /> {/* Include the Header component */}
            <h2 style={{ textAlign: 'center' }}>My Favourites</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>} {/* Display error message */}
            <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                {favourites.map(fav => (
                    <li key={fav.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {fav.name}
                        <div>
                            <button 
                                style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} 
                                onClick={() => handleViewCarparks(fav)}
                            >
                                View Nearby Carparks
                            </button>
                            <button 
                                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} 
                                onClick={() => handleDelete(fav.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li> // Render the list of favourites
                ))}
            </ul>
        </div>
    );
};

export default FavouritesUI;
