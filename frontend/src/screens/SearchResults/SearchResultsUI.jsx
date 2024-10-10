import { useEffect, useState } from 'react';
import "../screens.css";

import Map from "../../components/specific/Map/Map";
import PlacesList from "../../components/specific/PlacesList/PlacesList";
import SideBar from "../../components/specific/SideBar/SideBar";
import SortFilterUI from "../SortFilter/SortFilterUI";
//import { getPlacesData } from "../../../api/api";

import tempRestaurantsArray from "../../components/specific/PlacesList/temporaryRestaurants.json";

const SearchResultsUI = () => {
    const [places, setPlaces] = useState([]);
    const [placeClicked, setPlaceClicked] = useState(null);

    useEffect(() => {
        /* 
        getPlacesData()
            .then((data) => {
                console.log(data);
                setPlaces(data);
            })
         */

        //temporary array to reduce api calls
        //replace this temporary array with commented code to use real api
        setPlaces(tempRestaurantsArray);

        //get attractions from backend
        //setPlaces(attractions fetched from backend);

    }, []);

    return(
        <div class="page">
            <SideBar />
            <div>
                <SortFilterUI />
                <PlacesList places = {places} placeClicked = {placeClicked} />
            </div>
            <Map placesList = {places} setPlaceClicked = {setPlaceClicked} />
        </div>
    );
}

export default SearchResultsUI