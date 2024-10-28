import React, { useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import Sidebar from '../components/Sidebar';
import styles from '../styles/ChangePasswordUI.module.css';
import logo from "../images/ParkNPlayLogo.png";

const ChangePasswordUI = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const response = await api.post(
        '/api/change-password/',
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword, // Include confirm_password here
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || 'An error occurred');
      } else {
        setError('Network error. Please try again.');
      }
      setMessage('');
    }
  };

  return (
    <div className={styles.mainContainer}>
      <Sidebar />
      <div className={styles.changePasswordContainer}>
        <img className={styles.logo} src={logo} alt="Park N Play logo" />
        <h2 className={styles.changePasswordTitle}>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className={styles.oldPasswordDiv}>
            <label className={styles.oldPasswordLabel} htmlFor="oldPassword">Old Password:</label>
            <input className={styles.oldPasswordInput}
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.newPasswordDiv}>
            <label className={styles.newPasswordLabel} htmlFor="newPassword">New Password:</label>
            <input className={styles.newPasswordInput}
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.confirmPasswordDiv}>
            <label className={styles.confirmPasswordLabel} htmlFor="confirmPassword">Confirm New Password:</label>
            <input className={styles.confirmPasswordInput}
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className={styles.changePasswordButton} type="submit">Change Password</button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ChangePasswordUI;
