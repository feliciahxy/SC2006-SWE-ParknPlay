import { useEffect, useState } from 'react';
import "../screens.css";

import MapComponent from "../../components/specific/Map/Map";
import PlacesList from "../../components/specific/PlacesList/PlacesList";
import SideBar from "../../components/specific/SideBar/SideBar";
import SortFilterUI from "../SortFilter/SortFilterUI";
import { getPlacesData } from "../../../api/api";


const SearchResultsUI = () => {
    const [places, setPlaces] = useState([]);
    const [placeClicked, setPlaceClicked] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        getPlacesData()
            .then((data) => {
                console.log(data);
                setPlaces(data);
            });

        //get attractions from backend
        //setPlaces(attractions fetched from backend);

        setLoading(false);
    }, []);

    return(
        <div class="page">
            <SideBar />
            <div>
                <SortFilterUI />
                {loading? (
                    <PlacesList places = {places} placeClicked = {placeClicked} showAddFavouritesButton={true} showRemoveFavouritesButton={false} />
                ) : (
                    <div>Loading...</div>
                )}
            </div>
            {loading? (
                <MapComponent placesList = {places} placeClicked = {placeClicked} setPlaceClicked = {setPlaceClicked} />
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default SearchResultsUI