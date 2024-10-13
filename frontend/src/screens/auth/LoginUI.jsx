import React, {useState} from 'react';
import styles from './RegistrationUI/RegistrationUI.module.css'
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

function LoginUI(){
    let navigate = useNavigate();
    const [formData,setFormData] = useState({
        username: "",
        password: "",
    })

    const [error, setError] = useState("");

    const validateForm = (formData) => {
        if(!formData.username){
            setError("Username required");
            return false;
        }else if(!formData.password){
            setError("Password required");
            return false;
        }
        else if(formData.password != formData.confirmPassword){
                setError("Passwords do not match");
                return false;
            }
            return true;
        }

    // const handleSubmit = () => {
    //     setError(""); //reset to no error
    //     if(!validateForm(formData)){
    //         return;
    //     }
    //     console.log(formData.email);
    //     console.log(formData.password);      
    //     }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axios.post('http://127.0.0.1:8000/parknplay/login', {
            username: formData.username,
            password: formData.password,
        });
    
        if (response.data.status === 200) {
            let path = `/search-results`;
            navigate(path);
        } else {
            console.error('Error logging in:', error);
        }
      };

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
        </div>
    );
}

export default LoginUI