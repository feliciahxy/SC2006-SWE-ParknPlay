import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { sendChangedPassword } from '../../../api/api';

const ChangePasswordUI = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const initialData = location.state?.formData || {};
    const [formData, setFormData] = useState(initialData);

    const [error, setError] = useState("");

    const handleSubmit = () => {
        setError("");

        try {
            sendChangedPassword(formData)
                .then((data) => {
                    console.log(data);
                    navigate("/auth/login");
                });
        } catch (error) {
            console.error("Error: account with this username does not exist: ", error);
            setError("Unable to change password: Account with this username does not exist")
        }
    };

    return(
        <div>
            <img className = {styles.logo} src="/ParkNPlayLogo-removebg-preview.png" alt="profile picture"></img>
        <div className={styles.UIContainer}>
            <input 
                className={styles.textContainer}
                type = "password"
                value={formData.password} 
                onChange = {(e) => {setFormData({ ...formData, password: e.target.value});}}
                placeholder='new password'
                /> <br/><br/><br/>
            <button className = {styles.imageButton} onClick={handleSubmit}></button>
            {error && <div>{error}</div>}
            </div>
        </div>
    );
}

export default ChangePasswordUI;