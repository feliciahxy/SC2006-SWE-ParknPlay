import PlaceDetails from "../PlaceDetails/PlaceDetails";

const PlacesList = ({ places, placeClicked }) => {
    if (!places) {
        return(
            <div>No places available</div>
        );
    }
    return(
        <div>
            {placeClicked ? (
                <div>
                    <h2>Selected Place</h2>
                    <div>
                        <PlaceDetails place = {placeClicked} />
                    </div>
                </div>
            ) : (
                <div>
                    {places?.map((place) => (
                        <div>
                            <PlaceDetails place = {place} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PlacesList;