import { useNavigate } from "react-router-dom";

const SideBarButton = ({name, path}) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(path);
    }
    return(
        <div>
            <button onClick={handleClick}>{name}</button>
        </div>
    );
}

export default SideBarButton;