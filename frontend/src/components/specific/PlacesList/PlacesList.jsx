import { useEffect, useState } from 'react';

//import { getPlacesData } from "../../../api/api";
import PlaceDetails from "../PlaceDetails/PlaceDetails";
import tempRestaurantsArray from "./temporaryRestaurants.json";

const PlacesList = () => {
    const [places, setPlaces] = useState([]);
    
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

    }, []);

    return(
        <div>
            {places.map((place) => (
                <PlaceDetails place = {place} />
            ))}
        </div>
    );
}

export default PlacesList;