import "../screens.css";

import SideBar from "../../components/SideBar/SideBar";

const FavouritesUI = () => {
    const favourites = [{
        attractionName: "attraction1",
        rating: 5,
        attractionType: "cinema",
        region: "North",
        openingHours: "8am-8pm"
    }]
    return(
        <div class="page">
            <SideBar />
           {favourites.map((favourite) => (
            <div>
                <div>{favourite.attractionName}</div>
                <div>{favourite.rating}</div>
                <div>{favourite.attractionType}</div>
                <div>{favourite.region}</div>
                <div>{favourite.openingHours}</div>
            </div>
           ))}
        </div>
    );
}

export default FavouritesUI