import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../RegistrationUI/RegistrationUI.module.css'

const ForgetPasswordUI = () => {
    const navigate = useNavigate();

    const [formData,setFormData] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    const validateForm = (formData) => {
        if(!formData.username){
            setError("Username required");
            return false;
        }
        else{
            return true;
        }
    }

    const handleSubmit = () => {
        setError(""); //reset to no error
        if(!validateForm(formData)){
            return;
        }
        console.log(formData.username);
        
        navigate("/auth/change-password", { state: { formData } });
    }

    return(
        <div>
            <img className = {styles.logo} src="/ParkNPlayLogo-removebg-preview.png" alt="profile picture"></img>
        <div className={styles.UIContainer}>
            <input 
                className={styles.textContainer}
                type = "username"
                value={formData.username} 
                onChange = {(e) => {setFormData({ ...formData, username: e.target.value});}}
                placeholder='Username'
                /> <br/><br/><br/>
            <button className = {styles.imageButton} onClick={handleSubmit}></button>
            {error && <div>{error}</div>}
            </div>
        </div>
    );
}

export default ForgetPasswordUI