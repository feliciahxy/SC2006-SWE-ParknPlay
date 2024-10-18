import { useState, useEffect } from 'react';
import api from '../../../api'; // Import your custom api instance
import styles from './RegistrationUI.module.css';
<<<<<<< Updated upstream

const RegistrationUI = () => {
=======
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants"; // Import tokens

const RegistrationUI = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
    }, []);

>>>>>>> Stashed changes
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validateForm = (formData) => {
<<<<<<< Updated upstream
        if(!formData.email){
            setError("Email required");
=======
        if (!formData.username) {
            setError("Username required");
>>>>>>> Stashed changes
            return false;
        } else if (!formData.password) {
            setError("Password required");
            return false;
        } else if (!formData.confirmPassword) {
            setError("Confirm password required");
            return false;
        } else if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }else if(validator.isEmail(formData.email)){
            setError("Invalid email")
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Reset to no error

        if (!validateForm(formData)) {
            setLoading(false);
            return;
        }
<<<<<<< Updated upstream
        //TODO: check account already exists in backend java

        //TODO: create new account in backend java
    }
    return(
=======

        try {
            // Use your custom api instance to send the registration request
            const res = await api.post('http://localhost:8000/api/user/register/', {
                username: formData.username,
                password: formData.password
            });
            console.log('User saved successfully:', res.data);
            // Navigate only after successful registration
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data.detail === "Username already exists") {
                setError("This username is already taken. Please choose another one.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
>>>>>>> Stashed changes
        <div>
            <img className = {styles.logo} src="/ParkNPlayLogo-removebg-preview.png" alt="profile picture"></img>
                < div className={styles.UIContainer}>
                    <input 
                        className={styles.textContainer}
<<<<<<< Updated upstream
                        type= "email"
                        value={formData.email} 
                        onChange = {(e) => {setFormData({ ...formData, email: e.target.value});}} 
                        placeholder='Email'
=======
                        type= "text"
                        value={formData.username} 
                        onChange = {(e) => {setFormData({ ...formData, username: e.target.value});}} 
                        placeholder='Username'
>>>>>>> Stashed changes
                        /> <br/> <br/>
                    <input 
                        className={styles.textContainer}
                        type = "password"
                        value={formData.password} 
                        onChange = {(e) => {setFormData({ ...formData, password: e.target.value});}} 
                        placeholder='Enter your password'
                        /> <br/> <br/>
                    <input
                        className={styles.textContainer}
                        type = "password"
                        value={formData.confirmPassword} 
                        onChange = {(e) => {setFormData({ ...formData, confirmPassword: e.target.value});}} 
                        placeholder='Confirm your password'
                        /><br/><br/><br/>
                    <button className = {styles.imageButton} onClick={handleSubmit}></button>
                    <div className = {styles.space}></div>
                    {error && <div>{error}</div>}
                </div> 
         </div>
    );
}

<<<<<<< Updated upstream
export default RegistrationUI
=======
export default RegistrationUI;
>>>>>>> Stashed changes
