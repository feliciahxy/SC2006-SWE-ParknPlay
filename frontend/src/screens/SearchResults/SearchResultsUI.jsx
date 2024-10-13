import { useEffect, useState } from 'react';
import "../screens.css";

import MapComponent from "../../components/specific/Map/Map";
import PlacesList from "../../components/specific/PlacesList/PlacesList";
import SideBar from "../../components/specific/SideBar/SideBar";
import SortFilterUI from "../SortFilter/SortFilterUI";
//import { getPlacesData } from "../../../api/api";


const SearchResultsUI = () => {
    const [places, setPlaces] = useState([]);
    const [placeClicked, setPlaceClicked] = useState(null);

    useEffect(() => {

        getPlacesData()
            .then((data) => {
                console.log(data);
                setPlaces(data);
            })

        //get attractions from backend
        //setPlaces(attractions fetched from backend);

    }, []);

    return(
        <div class="page">
            <SideBar />
            <div>
                <SortFilterUI />
                <PlacesList places = {places} placeClicked = {placeClicked} showAddFavouritesButton={true} showRemoveFavouritesButton={false} />
            </div>
            <MapComponent placesList = {places} setPlaceClicked = {setPlaceClicked} />
        </div>
    );
}

export default SearchResultsUI