import { useEffect, useState } from 'react';

import { sendPlaceToFavourites } from "../../../api/FavouritesServices";

const AddFavouritesButton = ({ place }) => {

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const handleAddFavourites = () => {
        sendPlaceToFavourites(place, "add")
            .then((data) => {
                console.log(data);
                //if successfully added to favourites, display the "successfully added to favourites"
                setIsVisible(true);
            })
            .catch((error) => {
                console.error('Error posting place to FavouritesMgr: ', error);
            });
    }
    return(
        <div>
            <button onClick = {handleAddFavourites} >+ Add To Favourites</button>
            {isVisible && <div>Successfully added to favourites</div>}
        </div>
    );
}

export default AddFavouritesButton;