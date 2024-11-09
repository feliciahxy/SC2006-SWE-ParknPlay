import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ACCESS_TOKEN } from '../constants';
import api from '../api';
import Header from '../components/Sidebar'; 
import styles from '../styles/FavouritesUI.module.css';
import logo from "../images/ParkNPlayLogo.png";

const FavouritesUI = () => {
    const navigate = useNavigate(); 
    const [favourites, setFavourites] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFavourites = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN); 

            if (!token) {
                setError("You must be logged in to view favourites."); 
                return;
            }

            try {
                const response = await api.get('/api/favourites/', {
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    },
                });

                if (response.status === 200) {
                    setFavourites(response.data); 
                } else {
                    setError("Failed to fetch favourites.");
                }
            } catch (error) {
                console.error('Error fetching favourites:', error);
                if (error.response && error.response.status === 401) {
                    setError("Session expired. Please log in again."); 
                    localStorage.clear(); 
                    navigate('/');
                } else {
                    setError("An error occurred while fetching favourites.");
                }
            }
        };

        fetchFavourites(); 
    }, [navigate]); 

    const handleDelete = async (id) => {
        const token = localStorage.getItem(ACCESS_TOKEN); 
        if (!token) {
            setError("You must be logged in to delete favourites.");
            return;
        }

        try {
            const response = await api.delete(`/api/favourites/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
            });

            if (response.status === 204) {
                setFavourites(favourites.filter(fav => fav.id !== id)); 
                setError("");
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

        navigate('/carparks', { state: { selectedLocation: { lat: fav.latitude, lng: fav.longitude }, locationName: fav.name } });
    };

    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.favouritesContainer}>
            <Header /> {/* Include the Header component */}
            <img className={styles.logo} src={logo} alt="Park N Play logo" />
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
                            <div className={styles.eachFavouriteNameDiv}>{fav.name}</div>
                            <div className={styles.eachFavouriteButtonsDiv}>
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
        </div>
    );
};

export default FavouritesUI;
