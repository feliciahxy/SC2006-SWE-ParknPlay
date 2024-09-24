import SideBarButton from "./SideBarButton";
import "./SideBarStyles.css";

const SideBar = () => {
    return(
        <div class="sidebar">
            <SideBarButton name="attractions" path="/attractions" />
            <SideBarButton name="favourites" path="/favourites" />
            <SideBarButton name="carparks" path="/carparks" />
        </div>
    );
}

export default SideBar;