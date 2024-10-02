import React, {useState} from 'react';
import styles from './RegistrationUI/RegistrationUI.module.css'


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

    return(
        <div className={styles.LoginUIContainer}>
            <p>Email:</p>
            <input 
                className={styles.textContainer}
                type = "email"
                value={formData.email} 
                onChange = {(e) => {setFormData({ ...formData, email: e.target.value});}}
                placeholder='example@gmail.com'
                /> <br/>
            <p>Password:</p>
            <input 
                className={styles.textContainer}
                type = "password"
                value={formData.password} 
                onChange = {(e) => {setFormData({ ...formData, password: e.target.value});}}
                placeholder='Enter your password'
                /><br/><br/>
            <button onClick={handleSubmit}>Login</button>
            {error && <div>{error}</div>}
            </div>
    );
}

export default LoginUI