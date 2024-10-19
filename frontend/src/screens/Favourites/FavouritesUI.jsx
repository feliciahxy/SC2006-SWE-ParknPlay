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

        getFavouritesData()
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
                <div>
                    <PlacesList places = {favourites} placeClicked = {placeClicked} />
                    <MapComponent placesList = {favourites} setPlaceClicked = {setPlaceClicked} />
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default FavouritesUI