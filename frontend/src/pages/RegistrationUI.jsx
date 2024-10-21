import { useState, useEffect } from 'react';
import api from '../api'; // Import your custom api instance
import styles from '../styles/RegistrationUI.module.css';
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"; // Import tokens
import logo from "../images/ParkNPlayLogo.png";

const RegistrationUI = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
    }, []);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validateForm = (formData) => {
        if (!formData.username) {
            setError("Username required");
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

        try {
            // Use your custom api instance to send the registration request
            const res = await api.post('/api/register/', {
                username: formData.username,
                password: formData.password
            });
            console.log('User saved successfully:', res.data);
            // Navigate only after successful registration
            alert("Registration successful! You can now log in.");
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
        <div>
            <img className={styles.logo} src={logo} alt="Park N Play logo" />
            <div className={styles.UIContainer}>
                <input 
                    className={styles.textContainer}
                    type="text"
                    value={formData.username} 
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder='Username'
                /> 
                <br /><br />
                <input 
                    className={styles.textContainer}
                    type="password"
                    value={formData.password} 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder='Enter your password'
                /> 
                <br /><br />
                <input
                    className={styles.textContainer}
                    type="password"
                    value={formData.confirmPassword} 
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder='Confirm your password'
                />
                <br /><br />
                <button 
                    className={styles.imageButton} 
                    onClick={handleSubmit} 
                    disabled={loading}
                >
                </button>
                <div className={styles.space}></div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div> 
        </div>
    );
};

export default RegistrationUI;
