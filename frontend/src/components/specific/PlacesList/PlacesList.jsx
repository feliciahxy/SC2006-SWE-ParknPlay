import PlaceDetails from "../PlaceDetails/PlaceDetails";

const PlacesList = ({ places, placeClicked }) => {
    return(
        <div>
            {places?.map((place) => (
                <PlaceDetails place = {place} />
            ))}

            {placeClicked ? (
                <div>
                <h2>Selected Place</h2>
                <p>{placeClicked.popup}</p>
                </div>
            ) : (
                <p>No place selected</p>
            )}
        </div>
    );
}

export default PlacesList;