import { useEffect, useState } from 'react';

import { sendPlaceToFavourites } from "../../../api/api";

const RemoveFavouritesButton = ({ place }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000); //isVisible will be set to false in 3 seconds

            return () => clearTimeout(timer); //cleanup the timer on component unmount
        }
    }, [isVisible]);

    const handleRemoveFavourites = () => {
        try {
            sendPlaceToFavourites(place, "remove")
                .then((data) => {
                    console.log(data);
                });
            setIsVisible(true);
        } catch (error) {
            console.error("Error posting place to FavouritesMgr: ", error);
        }
    };
    return(
        <div>
            <button onClick = {handleRemoveFavourites}>- Remove From Favourites</button>
            {isVisible && <div>Successfully removed from favourites</div>}
        </div>
    );
}

export default RemoveFavouritesButton;