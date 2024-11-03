import { useState } from 'react';
import api from '../api';
import styles from "../styles/ForgetPasswordUI.module.css";
import logo from "../images/ParkNPlayLogo.png";

const ForgetPasswordUI = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/password_reset/', {
        email: email
    });
      if (response) {
        setMessage('Email sent. Please check your email!');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Extract password errors, if present
        setErrors(error.response.data.email || []);
      } else {
          setMessage('An unexpected error occurred.');
      }
      console.log('Error during password reset', error);
      }
  };

  return (
    <div className={styles.bigContainer}>
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
          <br/>
          <button className={styles.resetButton} type="submit">Send Email</button>
          {message && <p className={styles.successMessage}>{message}</p>}
          </form>
      </div>
    </div>
  );
};

export default ForgetPasswordUI;

