import "../screens.css";

import Map from "../../components/specific/Map/Map";
import PlacesList from "../../components/specific/PlacesList/PlacesList";
import SideBar from "../../components/specific/SideBar/SideBar";
import SortFilterUI from "../SortFilter/SortFilterUI";

const SearchResultsUI = () => {
    return(
        <div class="page">
            <SideBar />
            <div>
                <SortFilterUI />
                <PlacesList />
            </div>
            <Map />
        </div>
    );
}

export default SearchResultsUI