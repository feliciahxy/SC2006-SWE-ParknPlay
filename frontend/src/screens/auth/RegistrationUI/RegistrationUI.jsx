import { useState } from 'react';
import { sendNewlyCreatedUser } from '../../../api/AuthServices';
import styles from './RegistrationUI.module.css';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

const RegistrationUI = () => {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");

    const validateForm = (formData) => {
        if(!formData.username){
            setError("Username required");
            return false;
        }else if(!formData.password){
            setError("Password required");
            return false;
        }else if(!formData.confirmPassword){
            setError("Confirm password required");
            return false;
        }else if(formData.password != formData.confirmPassword){
            setError("Passwords do not match");
            return false;
        }
        // else if(validator.isEmail(formData.email)){
        //     setError("Invalid email")
        // }
        return true;
    }
    const handleSubmit = () => {
        setError(""); //reset to no error
        if(!validateForm(formData)){
            return;
        }

        sendNewlyCreatedUser(formData)
            .then((token) => {
                console.log('User saved successfully');
                localStorage.setItem('token', token);
                navigate("/search-results");
            })
            .catch ((error) => {
                console.error('Error saving user: ', error);
            });
    };
        
    return(
        <div>
            <img className = {styles.logo} src="/ParkNPlayLogo-removebg-preview.png" alt="profile picture"></img>
                < div className={styles.UIContainer}>
                    <input 
                        className={styles.textContainer}
                        type= "username"
                        value={formData.username} 
                        onChange = {(e) => {setFormData({ ...formData, username: e.target.value});}} 
                        placeholder='Username'
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
                    {error && <div>{error}</div>}
                </div> 
         </div>
    );
};

export default RegistrationUI;