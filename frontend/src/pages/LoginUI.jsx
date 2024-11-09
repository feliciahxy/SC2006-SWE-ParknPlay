import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"; 
import styles from '../styles/LoginUI.module.css';
import logo from "../images/ParkNPlayLogo.png";
import greenArrowIcon from '../images/GreenArrow.png'; 

function LoginUI() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Validate form fields
    const validateForm = () => {
        if (!formData.username) {
            setError("Username required");
            return false;
        } else if (!formData.password) {
            setError("Password required");
            return false;
        }
        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/api/token/', {
                username: formData.username,
                password: formData.password,
            });

            if (response.status === 200) {
                const { access, refresh } = response.data;
                

                console.log("Access Token:", access);
                console.log("Refresh Token:", refresh);
                localStorage.setItem(ACCESS_TOKEN, access);
                localStorage.setItem(REFRESH_TOKEN, refresh);


                console.log("Stored Access Token:", localStorage.getItem(ACCESS_TOKEN));
                console.log("Stored Refresh Token:", localStorage.getItem(REFRESH_TOKEN));
                

                navigate("/sort-filter");
            } else {
                setError("Invalid login credentials");
                console.error("Unexpected response status:", response.status);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            if (error.response && error.response.status === 401) {
                setError("Invalid login credentials.");
            } else {
                setError("An error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };


    const handleClick = (e) => {
        const buttonText = e.target.textContent;
        if (buttonText === "Forget Password") {
            navigate('/auth/forget-password');
        } else if (buttonText === "Sign up") {
            navigate('/auth/register');
        }
    };

    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.loginContainer}>
            <img className={styles.logo} src={logo} alt="Park N Play logo" />
            <div className={styles.UIContainer}>
                <form onSubmit ={handleSubmit}>
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
                <button type = "button" className={styles.ForgetPassword} onClick={handleClick}><u>Forget Password</u></button>
                <br /><br />
                <button 
                    className={styles.imageButton} 
                    onClick={handleSubmit} 
                    type = "submit"
                    disabled={loading}
                >
                </button>
                {error && <div className={styles.errorMessage} >{error}</div>}
                </form>
            </div>
            <div className={styles.signUpContainer}>
                <p>Do not have an account? <button className={styles.SignUp} onClick={handleClick}><u>Sign up</u></button> here!</p>
            </div>
            </div>
        </div>
    );
}

export default LoginUI;
