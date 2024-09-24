import { useState } from 'react';

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
        console.log(formData.confirmPassword);
        
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