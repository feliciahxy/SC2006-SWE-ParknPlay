import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Your Axios instance or fetch wrapper
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"; // Token constants
import styles from '../styles/RegistrationUI.module.css';
import logo from "../images/ParkNPlayLogo.png";
import greenArrowIcon from '../images/GreenArrow.png'; // Update the import to GreenArrow.png

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

    // Handle form submission
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
                // Save tokens to local storage
                localStorage.setItem(ACCESS_TOKEN, access);
                localStorage.setItem(REFRESH_TOKEN, refresh);
                
                // Navigate to the protected route after successful login
                navigate("/sort-filter");
            } else {
                setError("Invalid login credentials");
            }
        } catch (error) {
            console.error('Error logging in:', error);
            if (error.response && error.response.status === 401) {
                setError("Invalid login credentials. Please try again.");
            } else {
                setError("An error occurred. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle button clicks for navigation
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
            <img className={styles.logo} src={logo} alt="Park N Play logo" />
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
                <button 
                    className={styles.imageButton} 
                    onClick={handleSubmit} 
                    aria-label="Login"
                    style={{
                        backgroundImage: `url(${greenArrowIcon})`, // Change to use GreenArrow.png
                        backgroundSize: '20px 20px',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'left center',
                        paddingLeft: '30px', // Adjust padding to avoid overlap with text
                    }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                {error && <div>{error}</div>} {/* Display error message */}
            </div>
            <div className={styles.signUpContainer}>
                <p>Do not have an account? <button className={styles.SignUp} onClick={handleClick}><u>Sign up</u></button> here!</p>
            </div>
        </div>
    );
}

export default LoginUI;
