import React, {useState} from 'react';
import styles from './RegistrationUI/RegistrationUI.module.css'
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import ForgetPasswordUI from "./ForgetPasswordUI";


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
        };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post('http://127.0.0.1:8000/parknplay/login', {
            username: formData.username,
            password: formData.password,
        })
            .then(response => {
                console.log('Logged in successfully:', response.data);
            })
            .catch(error => {
                console.error('Error logging in user:', error);
            });
            let path = `/search-results`;
            navigate(path);
      };

    const handleClick = (e) => {
        const buttonText = e.target.textContent

        if(buttonText === "Forget Password"){
            navigate('/auth/forget-password');
        }
        else if (buttonText === "Sign up" ){
            navigate('/auth/register')
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
                /><br/><br/>
                <button className = {styles.ForgetPassword} onClick={handleClick}><u>Forget Password</u></button>
                <br/><br/>
            <button className = {styles.imageButton} onClick={handleSubmit}></button>
            {error && <div>{error}</div>}
            </div>
            <div className={styles.signUpContainer}>
            <p>Do not have an account? <button className= {styles.SignUp} onClick={handleClick}><u>Sign up</u></button> here!</p>
            </div>
        </div>
    );
}

export default LoginUI