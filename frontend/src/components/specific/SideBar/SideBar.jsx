import SideBarButton from "./SideBarButton";
import React, {useState} from 'react';
import styles from "./SideBarStyles.module.css";

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () =>{
        setIsOpen(!isOpen);
    };

    return(
        <>
        <div className={styles.hamburger} onClick={toggleSidebar}>
        &#9776;
      </div>

        <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <button className={styles.closeBtn} onClick={toggleSidebar}>
          &times;
        <br/>
        </button>
            <SideBarButton name="Search" path="/search-results" />
            <SideBarButton name="Favourites" path="/favourites" />
            <SideBarButton name="Logout" path="/" />
        </div>
        </>
    );
}

export default SideBar;