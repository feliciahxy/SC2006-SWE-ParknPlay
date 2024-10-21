import { useState } from 'react';
import "../screens.css";

import MapComponent from "../../components/specific/Map/Map";
import PlacesList from "../../components/specific/PlacesList/PlacesList";
import SideBar from "../../components/specific/SideBar/SideBar";
import SortFilterComponent from "../../components/specific/SortFilter/SortFilterComponent";


const SearchResultsUI = () => {
    const [places, setPlaces] = useState([]);
    const [placeClicked, setPlaceClicked] = useState(null);

    return(
        <div class="page">
            <SideBar />
            <div class="screen-flex-container">
                <div class="screen-flex-child">
                    <SortFilterComponent setPlaces = {setPlaces}/>
                    <PlacesList places = {places} placeClicked = {placeClicked} />
                </div>
                <div class="screen-flex-child">
                    <MapComponent placesList = {places} placeClicked = {placeClicked} setPlaceClicked = {setPlaceClicked} />
                </div>
            </div>
        </div>
    );
}

export default SearchResultsUI