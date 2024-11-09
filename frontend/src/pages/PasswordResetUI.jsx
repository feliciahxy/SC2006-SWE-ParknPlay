import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import api from '../api';
import styles from '../styles/PasswordResetUI.module.css';
import logo from "../images/ParkNPlayLogo.png";

const PasswordResetUI = () => {
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState('');
  const {token} = useParams()
  const navigate = useNavigate();

  const isPasswordMatch = newPassword === newConfirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordMatch) {
      setMessage("Passwords do not match");
      return;
    } 
    try {
      const response = await api.post('/api/password_reset/confirm/', {
        password: newPassword,
        token: token
    });
      if (response.status == 200) {
        setMessage('Success! Redirecting you...');
        navigate('/');
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {

        setErrors(error.response.data.password || []);
      } else {
          setErrors(error.response.data.detail || []);
      }
      console.log('Error during password reset', error);
      }
  };

  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.mainContainer}>
        <div className={styles.resetPasswordContainer}>
        <img className={styles.logo} src={logo} alt="Park N Play logo" />
          <h2 className={styles.resetPasswordTitle}>Reset Password</h2>
          <h3 className={styles.criteriaContainer}>Password must be at least 8 characters long, and cannot be too common.</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.newPasswordDiv}>
              <label className={styles.newPasswordLabel} htmlFor='newPassword'>New Password:</label>
            <input
              className={styles.newPasswordInput}
              type="Password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            
            />
            </div>
            <div className={styles.confirmPasswordDiv}>
            <label className={styles.confirmPasswordLabel} htmlFor='confirmPassword'>Confirm New Password:</label>
            <input
              className={styles.confirmPasswordInput}
              type="Password"
              placeholder="Confirm your new password again"
              value={newConfirmPassword}
              onChange={(e) => {
                setNewConfirmPassword(e.target.value);
              }}
            />
            </div>
            <br/>
            <button className={styles.resetPasswordButton}>Submit</button>
          </form>
          <p className={styles.errorMessage}>{message}</p>
          <p className={styles.errorMessage}>{errors}</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetUI;