import React, {useState} from 'react';
import styles from './RegistrationUI/RegistrationUI.module.css'

const ForgetPasswordUI = () => {


    const [formData,setFormData] = useState({
        email: "",
    })

    const [error, setError] = useState("");

    const validateForm = (formData) => {
        if(!formData.email){
            setError("Email required");
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
        console.log(formData.email);   
        }

    return(
        <div>
            <img className = {styles.logo} src="/ParkNPlayLogo-removebg-preview.png" alt="profile picture"></img>
        <div className={styles.UIContainer}>
            <input 
                className={styles.textContainer}
                type = "email"
                value={formData.email} 
                onChange = {(e) => {setFormData({ ...formData, email: e.target.value});}}
                placeholder='Email'
                /> <br/><br/><br/>
            <button className = {styles.imageButton} onClick={handleSubmit}></button>
            {error && <div>{error}</div>}
            </div>
        </div>
    );
}

export default ForgetPasswordUI