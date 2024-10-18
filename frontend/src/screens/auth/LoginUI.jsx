<<<<<<< Updated upstream
import React, {useState} from 'react';
import styles from './RegistrationUI/RegistrationUI.module.css'


function LoginUI(){

    const [formData,setFormData] = useState({
        email: "",
=======
import React, { useState } from 'react';
import styles from './RegistrationUI/RegistrationUI.module.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // Import your custom API instance
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants"; // Import tokens

function LoginUI() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
>>>>>>> Stashed changes
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
        }
<<<<<<< Updated upstream
        else if(formData.password != formData.confirmPassword){
                setError("Passwords do not match");
                return false;
            }
            return true;
        }

    const handleSubmit = () => {
        setError(""); //reset to no error
        if(!validateForm(formData)){
            return;
        }
        console.log(formData.email);
        console.log(formData.password);      
=======
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!validateForm(formData)) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('http://localhost:8000/api/token/', { // Use the correct API endpoint
                username: formData.username,
                password: formData.password,
            });

            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

                console.log("Navigating to sort-filter");
                navigate("/sort-filter");
                console.log("Navigated to sort-filter");
                
            } else {
                setError("Invalid login credentials");
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError("Invalid login credentials. Please try again."); // Changed error message for clarity
        } finally {
            setLoading(false);
>>>>>>> Stashed changes
        }

    const handleClick = (e) => {
        const buttonText = e.target.textContent;

        if (buttonText === "Forget Password") {
            navigate('/auth/forget-password');
        } else if (buttonText === "Sign up") {
            navigate('/auth/register');
        }
    };

    return (
        <div>
<<<<<<< Updated upstream
            <img className = {styles.logo} src="/ParkNPlayLogo-removebg-preview.png" alt="profile picture"></img>
        <div className={styles.UIContainer}>
            <input 
                className={styles.textContainer}
                type = "email"
                value={formData.email} 
                onChange = {(e) => {setFormData({ ...formData, email: e.target.value});}}
                placeholder='Email'
                /> <br/><br/>
            <input 
                className={styles.textContainer}
                type = "password"
                value={formData.password} 
                onChange = {(e) => {setFormData({ ...formData, password: e.target.value});}}
                placeholder='Enter your password'
                /><br/><br/><br/>
            <button className = {styles.imageButton} onClick={handleSubmit}></button>
            {error && <div>{error}</div>}
            </div>
=======
            <img className={styles.logo} src="/ParkNPlayLogo-removebg-preview.png" alt="profile" />
            <div className={styles.UIContainer}>
                <input
                    className={styles.textContainer}
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder='Username'
                /><br /><br />
                <input
                    className={styles.textContainer}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder='Enter your password'
                /><br /><br />
                <button className={styles.ForgetPassword} onClick={handleClick}><u>Forget Password</u></button>
                <br /><br />
                <button className={styles.imageButton} onClick={handleSubmit} aria-label="Login" /> {/* Removed text and added aria-label for accessibility */}
                {loading && <p>Loading...</p>}
                <div className={styles.space}></div>
                {error && <div>{error}</div>}
            </div>
            <div className={styles.signUpContainer}>
                <p>Do not have an account? <button className={styles.SignUp} onClick={handleClick}><u>Sign up</u></button> here!</p>
            </div>
>>>>>>> Stashed changes
        </div>
    );
}

export default LoginUI;
