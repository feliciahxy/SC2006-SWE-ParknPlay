import { useNavigate } from "react-router-dom";
import styles from './SideBarStyles.module.css';

const SideBarButton = ({ name, path }) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        if (name == "Logout") {
            localStorage.clear(); //delete token from local storage
        }
        navigate(path);
    }
    return(
        <div>
            <button className={styles.sidebarButtons} onClick={handleClick}>{name}</button>
        </div>
    );
}

export default SideBarButton;