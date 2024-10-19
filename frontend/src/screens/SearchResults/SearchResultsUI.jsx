import { useEffect, useState } from 'react';
import "../screens.css";

import MapComponent from "../../components/specific/Map/Map";
import PlacesList from "../../components/specific/PlacesList/PlacesList";
import SideBar from "../../components/specific/SideBar/SideBar";
import SortFilterComponent from "../../components/specific/SortFilter/SortFilterComponent";
import { getPlacesData } from '../../api/PlacesServices';


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
            <div class="screen-flex-container">
                <div class="screen-flex-child">
                    <SortFilterComponent setPlaces = {setPlaces}/>
                    {loading? (
                        <div>Loading places...</div>
                    ) : (
                        <PlacesList places = {places} placeClicked = {placeClicked} />
                    )}
                </div>
                <div class="screen-flex-child">
                    {loading? (
                        <div>Loading maps...</div>
                    ) : (
                        <MapComponent placesList = {places} placeClicked = {placeClicked} setPlaceClicked = {setPlaceClicked} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchResultsUI