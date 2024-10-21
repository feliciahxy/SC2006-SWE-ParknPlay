import { useNavigate } from "react-router-dom";
import styles from './LandingUI.module.css';

import LandingButtonsContent from "./LandingButtons.json";

const LandingUI = () => {
    const navigate = useNavigate();

    return(
        <div>
            <img className = {styles.logo} src="/ParkNPlayLogo-removebg-preview.png" alt="profile picture"></img>
            <div>Welcome to ParknPlay</div>
            <div className = {styles.LandingButtonsContent}>
            {LandingButtonsContent.map((landingButton, index) => (
                <button 
                    key = {index}
                    className = {styles.LandingButtons}
                    onClick={() => navigate(landingButton.path)
                }>
                    {landingButton.name}
                </button>
            ))}
            </div>
        </div>
    );
}

export default LandingUI;