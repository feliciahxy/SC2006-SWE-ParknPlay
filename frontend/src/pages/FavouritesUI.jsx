import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ACCESS_TOKEN } from '../constants';
import api from '../api';
import Header from '../components/Sidebar'; // Import the Header component
import styles from '../styles/FavouritesUI.module.css';

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
                    navigate('/login');
                } else {
                    setError("An error occurred while fetching favourites.");
                }
            }
        };

        fetchFavourites(); // Call the function to fetch favourites when component mounts
    }, [navigate]); // Empty dependency array means this effect runs once on mount

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
                navigate('/login');
            } else {
                setError("An error occurred while deleting the favourite.");
            }
        }
    };

    const handleViewCarparks = (fav) => {
        // Navigate with state, passing selectedLocation and locationName
        navigate('/carparks', { state: { selectedLocation: { lat: fav.latitude, lng: fav.longitude }, locationName: fav.name } });
    };

    return (
        <div className={styles.favouritesContainer}>
            <Header /> {/* Include the Header component */}
            <h2 className={styles.title}>My Favourites</h2>
            {error && (
                <div className={styles.errorContainer}>
                    {error}
                </div>
            )} {/* Display error message */}
            <ul className={styles.unorderedList}>
                {favourites.length > 0 ? (
                    favourites.map(fav => (
                        <li className={styles.listItem} key={fav.id}>
                            {fav.name}
                            <div>
                                <button className={styles.viewCarparksButton} onClick={() => handleViewCarparks(fav)}>
                                    View Nearby Carparks
                                </button>
                                <button className={styles.deleteButton} onClick={() => handleDelete(fav.id)}>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className={styles.noFavouritesPara}>No favourites found.</p>
                )}
            </ul>
        </div>
    );
};

export default FavouritesUI;
