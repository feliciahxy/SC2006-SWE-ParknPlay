import React, {useState} from 'react';
import styles from './RegistrationUI/RegistrationUI.module.css'
import { Route } from 'react-router-dom';
import ForgetPasswordUI from "./ForgetPasswordUI";
import { useNavigate } from 'react-router-dom';


function LoginUI(){

    const [formData,setFormData] = useState({
        email: "",
        password: "",
    })

    const [error, setError] = useState("");

    const validateForm = (formData) => {
        if(!formData.email){
            setError("Email required");
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

    const handleSubmit = () => {
        setError(""); //reset to no error
        if(!validateForm(formData)){
            return;
        }
        console.log(formData.email);
        console.log(formData.password);      
        }

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/auth/forget-password');
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
        </div>
    );
}

export default LoginUI