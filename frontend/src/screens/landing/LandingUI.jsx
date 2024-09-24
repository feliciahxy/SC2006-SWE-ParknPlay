import { useNavigate } from "react-router-dom";

import LandingButtonsContent from "./LandingButtons.json";

const LandingUI = () => {
    const navigate = useNavigate();

    return(
        <div>
            {LandingButtonsContent.map((landingButton) => (
                <button onClick={
                    () => navigate(landingButton.path)
                }>
                    {landingButton.name}
                </button>
            ))}
        </div>
    );
}

export default LandingUI;