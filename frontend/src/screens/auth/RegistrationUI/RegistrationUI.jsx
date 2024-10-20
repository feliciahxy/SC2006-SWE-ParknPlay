import { useState } from 'react';
import { sendNewlyCreatedUser } from '../../../api/AuthServices';
import styles from './RegistrationUI.module.css';
import { useNavigate, Link } from "react-router-dom";
import RegistrationOptions from './RegistrationOptions.json'

const RegistrationUI = () => {
    let navigate = useNavigate();
    const [formData, setFormData] = useState(() => {
        const initialRegistrationOptions = {};
        RegistrationOptions.forEach(RegistrationOption => {
            initialRegistrationOptions[RegistrationOption.field] = '';
        });
        return initialRegistrationOptions;
    });

    const [error, setError] = useState("");

    const validateForm = (formData) => {
        if(!formData['username']){
            setError("Username required");
            return false;
        }else if(!formData['password']){
            setError("Password required");
            return false;
        }else if(!formData['confirmPassword']){
            setError("Confirm password required");
            return false;
        }else if(formData['password'] != formData['confirmPassword']){
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
                console.log('Token:', token); //check error
                localStorage.setItem('token', token);
                navigate("/search-results");
            })
            .catch ((error) => {
                console.error('Error saving user: ', error);
            });
    };
    
    const handleValueChange = (e, registrationField) => {
        setFormData((prevFields) => ({
            ...prevFields,
            [registrationField]: e.target.value
        }));
    };

    return(
        <div>
            <img className = {styles.logo} src="/ParkNPlayLogo-removebg-preview.png" alt="profile picture"></img>
                < div className={styles.UIContainer}>
                    {RegistrationOptions.map((RegistrationOption) => (
                        <>
                            <input 
                                className={styles.textContainer}
                                type= {RegistrationOption.type}
                                value={formData[RegistrationOption.field]} 
                                onChange = {(e) => handleValueChange(e, RegistrationOption.field)} 
                                placeholder={RegistrationOption.placeholder}
                                /> <br/> <br/>
                        </>
                    ))}
                    <button className = {styles.imageButton} onClick={handleSubmit}></button>
                    {error && <div>{error}</div>}
                </div> 
         </div>
    );
};

export default RegistrationUI;