import SideBarButton from "./SideBarButton";

import "./SideBarStyles.css";

const SideBar = () => {
    return(
        <div className="sidebar">
            <SideBarButton name="search" path="/sort-filter" />
            <SideBarButton name="favourites" path="/favourites" />
            <SideBarButton name="logout" path="/" />
        </div>
    );
}

export default SideBar;