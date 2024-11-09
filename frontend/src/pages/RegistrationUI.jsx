import { useState, useEffect } from 'react';
import api from '../api'; 
import styles from '../styles/RegistrationUI.module.css';
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"; 
import logo from "../images/ParkNPlayLogo.png";

const RegistrationUI = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
    }, []);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validateForm = (formData) => {
        const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const emailCriteria = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!formData.username) {
            setError("Username required");
            return false;
        } else if (!formData.email) {
            setError("Email required");
            return false;
        } else if (!emailCriteria.test(formData.email)) {
            setError("Invalid email format");
            return false;
        } else if (!formData.password) {
            setError("Password required");
            return false;
        } else if (!passwordCriteria.test(formData.password)) {
            setError("Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.");
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
        setError(""); 

        if (!validateForm(formData)) {
            setLoading(false);
            return;
        }

        try {

            const res = await api.post('/api/register/', {
                username: formData.username,
                password: formData.password,
                email: formData.email
            });
            console.log('User saved successfully:', res.data);

            alert("Registration successful! You can now log in.");
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data.detail === "Username already exists") {
                setError("This username is already taken. Please choose another one.");
            } 
            else if (error.response.data.detail === "Email already registered") {
                setError("This email is already registered. Please use another email."); 
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.UIContainer}>
                <img className={styles.logo} src={logo} alt="Park N Play logo" />
                <form className={styles.form} onSubmit={handleSubmit}>
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
                    type="text"
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder='Email'
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
                {error && <div className={styles.errorMessage2}>{error}</div>}
                </form>
            </div> 
        </div>
    );
};

export default RegistrationUI;
