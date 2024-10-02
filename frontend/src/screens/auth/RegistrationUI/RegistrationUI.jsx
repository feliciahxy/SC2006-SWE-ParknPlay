import { useState } from 'react';
//import validator from 'validator';
import styles from './RegistrationUI.module.css';
import Header from '../../../components/common/Header/Header.jsx';

const RegistrationUI = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");

    const validateForm = (formData) => {
        if(!formData.email){
            setError("Email required");
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
        }else if(validator.isEmail(formData.email)){
            setError("Invalid email")
        }
        return true;
    }
    const handleSubmit = () => {
        setError(""); //reset to no error
        if(!validateForm(formData)){
            return;
        }
        //TODO: check account already exists in backend java

        //TODO: create new account in backend java
    }
    return(
        <div>
            <Header />
                < div className={styles.UIContainer}>
                    <input 
                        className={styles.textContainer}
                        type= "email"
                        value={formData.email} 
                        onChange = {(e) => {setFormData({ ...formData, email: e.target.value});}} 
                        placeholder='Email'
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
                        /><br/><br/>
                    <button onClick={handleSubmit}>Create account</button>
                    {error && <div>{error}</div>}
                </div> 
         </div>
    );
}

export default RegistrationUI