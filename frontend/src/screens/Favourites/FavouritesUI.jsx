import { useEffect, useState } from 'react';

import { getFavouritesData } from '../../api/api';

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
            });

        setLoading(false);
    }, []);

    return(
        <div class="page">
            <SideBar />
            {loading ? (
                <div>
                    <PlacesList places = {favourites} placeClicked = {placeClicked} showAddFavouritesButton={false} showRemoveFavouritesButton={true} />
                    <MapComponent placesList = {favourites} setPlaceClicked = {setPlaceClicked} />
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default FavouritesUI