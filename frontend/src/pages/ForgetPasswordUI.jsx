import { useState } from 'react';
import api from '../api';
import styles from "../styles/ForgetPasswordUI.module.css";
import logo from "../images/ParkNPlayLogo.png";

const ForgetPasswordUI = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors('');

    if(!email.trim()) {
      setErrors("Email required");
      return;
    }

    try {
      const response = await api.post('/api/password_reset/', { email });
      if (response) {
        setMessage('Email sent. Please check your email!');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        
        const emailErrors = error.response.data.email;
        if (emailErrors && emailErrors.length > 0) {
          setErrors(emailErrors[0]);
        } else {
          setMessage('An unexpected error occurred.');
        }
      } else {
        setMessage('An unexpected error occurred.');
      }
      console.log('Error during password reset', error);
    }
  };

  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.container}>
        <img className={styles.logo} src={logo} alt="Park N Play logo" />
        <h3 className={styles.header}>Enter your email and we will send you a link to reset it!</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          {errors && <p className={styles.errorMessage}>{errors}</p>}
          <br/>
          <button className={styles.resetButton} type="submit">Send Email</button>
          {message && <p className={styles.successMessage}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgetPasswordUI;