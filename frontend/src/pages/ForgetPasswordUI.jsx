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
      <img className={styles.logo} src={logo} alt="Park N Play logo" />
        <div className={styles.container}>
          <h3 className={styles.header}>Enter your email and we will send you a link to reset it!</h3>
            <div className={styles.changeContainer}>
              <form 
                onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.inputContainer}
                />
                <br/>
                <button className={styles.resetButton} type="submit">Send Email</button>
              </form>
              </div>
          <p className={styles.header}>{message}</p>
        </div>
    </div>
  );
};

export default ForgetPasswordUI;

