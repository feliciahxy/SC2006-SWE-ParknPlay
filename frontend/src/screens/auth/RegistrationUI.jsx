import { useState } from 'react';
import validator from 'validator';

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
            <input value={formData.email} onChange = {(e) => {setFormData({ ...formData, email: e.target.value});}} />
            <input value={formData.password} onChange = {(e) => {setFormData({ ...formData, password: e.target.value});}} />
            <input value={formData.confirmPassword} onChange = {(e) => {setFormData({ ...formData, confirmPassword: e.target.value});}} />
            <button onClick={handleSubmit}>create account</button>
            {error && <div>{error}</div>}
        </div>
    );
}

export default RegistrationUI