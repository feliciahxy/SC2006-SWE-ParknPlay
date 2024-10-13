import PlaceDetails from "../PlaceDetails/PlaceDetails";

const PlacesList = ({ places, placeClicked, showAddFavouritesButton, showRemoveFavouritesButton }) => {
    return(
        <div>
            {placeClicked ? (
                <div>
                    <h2>Selected Place</h2>
                    <div>
                        <PlaceDetails place = {placeClicked} showAddFavouritesButton = {showAddFavouritesButton} showRemoveFavouritesButton = {showRemoveFavouritesButton} />
                    </div>
                </div>
            ) : (
                <div>
                    {places?.map((place) => (
                        <div>
                            <PlaceDetails place = {place} showAddFavouritesButton = {showAddFavouritesButton} showRemoveFavouritesButton = {showRemoveFavouritesButton}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PlacesList;