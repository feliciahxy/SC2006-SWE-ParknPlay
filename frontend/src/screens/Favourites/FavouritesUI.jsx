import { useEffect, useState } from 'react';

import { getFavouritesData } from '../../api/FavouritesServices';

import "../screens.css";

import MapComponent from '../../components/specific/Map/Map';
import PlacesList from '../../components/specific/PlacesList/PlacesList';
import SideBar from "../../components/specific/SideBar/SideBar";

const FavouritesUI = () => {
    const [favourites, setFavourites] = useState([]);
    const [placeClicked, setPlaceClicked] = useState(null);
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const token = localStorage.getItem(token);
        if (!token || token == 'undefined') {
            alert('You must be logged in to view your favourites');
            setLoading(false);
            return;
        }

        getFavouritesData(token)
            .then((data) => {
                console.log(data);
                setFavourites(data);
            })
            .catch((error) => {
                console.error("Unable to load favourites from backend: ", error);
            });

        setLoading(false);
    }, []);

    return(
        <div class="page">
            <SideBar />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div class="screen-flex-container">
                    <div class="screen-flex-child">
                        <PlacesList places = {favourites} placeClicked = {placeClicked} />
                    </div>
                    <div class="screen-flex-child">
                        <MapComponent placesList = {favourites} setPlaceClicked = {setPlaceClicked} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default FavouritesUI